from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Dict, Any, Tuple
import re

from app.db.database import get_db
from app.api.deps import get_optional_current_user
from app.models.user import User
from app.models.catalog import Product, Category
from app.models.profile import BuyerProfile
from app.schemas.catalog import RecommendationResponse, RecommendationItem, ProductRead

router = APIRouter()

RECOMMENDATION_WEIGHTS = {
    "category": 35,
    "fabric_type": 25,
    "moq": 15,
    "budget": 15,
    "availability": 10
}

def extract_range(text: str) -> Tuple[float, float]:
    if not text:
        return 0.0, float('inf')
    numbers = [float(re.sub(r'[^0-9]', '', n)) for n in re.findall(r'\d[\d,]*', text)]
    if not numbers:
        return 0.0, float('inf')
    if "under" in text.lower() or "<" in text:
        return 0.0, numbers[0]
    if "+" in text or ">" in text:
        return numbers[0], float('inf')
    if len(numbers) >= 2:
        return numbers[0], numbers[1]
    return numbers[0], numbers[0]

def score_product(product: Product, preferences: Dict[str, Any]) -> Tuple[float, str]:
    score = 0.0
    reasons = []

    # Category Match
    preferred_categories = [c.lower() for c in preferences.get("product_categories", [])]
    product_category = product.category.name.lower() if product.category else ""
    if product_category and any(c in product_category or product_category in c for c in preferred_categories):
        score += RECOMMENDATION_WEIGHTS["category"]
        reasons.append(f"Matches your interest in {product.category.name}")
    elif product_category:
        # Partial match if similar
        pass

    # Fabric Type Match (stored in specs usually or description)
    preferred_fabrics = [f.lower() for f in preferences.get("fabric_types", [])]
    specs = product.specifications or {}
    product_desc = (product.description or "").lower() + " " + (product.name or "").lower()
    
    fabric_matched = False
    for fab in preferred_fabrics:
        if fab in product_desc or any(fab in str(v).lower() for v in specs.values()):
            fabric_matched = True
            score += RECOMMENDATION_WEIGHTS["fabric_type"]
            reasons.append(f"Contains preferred fabric: {fab.capitalize()}")
            break

    # Availability
    if product.stock_quantity > 0:
        score += RECOMMENDATION_WEIGHTS["availability"]
    
    # MOQ Compatibility
    try:
        product_moq = float(specs.get("moq_quantity", 1))
    except (ValueError, TypeError):
        product_moq = 1.0

    qty_min, qty_max = extract_range(preferences.get("order_quantity", ""))
    
    if product_moq <= qty_max:
        score += RECOMMENDATION_WEIGHTS["moq"]
        if product_moq <= qty_min or qty_min == 0.0:
            reasons.append("Low MOQ fits your business")
        else:
            reasons.append("MOQ within your typical order range")
            
    # Budget Matching
    budget_min, budget_max = extract_range(preferences.get("budget", ""))
    avg_qty = (qty_min + (qty_max if qty_max != float('inf') else qty_min * 2)) / 2
    if avg_qty == 0: avg_qty = 100 # fallback
    
    estimated_cost = product.price * avg_qty
    if budget_min <= estimated_cost <= budget_max:
        score += RECOMMENDATION_WEIGHTS["budget"]
        reasons.append("Within your typical sourcing budget")
    elif estimated_cost < budget_min:
        score += RECOMMENDATION_WEIGHTS["budget"] * 0.8
        reasons.append("Great value for your budget")
    
    # Top Reason Selection
    primary_reason = reasons[0] if reasons else "Popular in the marketplace"
    
    return score, primary_reason

@router.get("", response_model=RecommendationResponse)
def get_recommendations(
    limit: int = 8,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user)
):
    # 1 & 4. Candidate Retrieval - Only published products
    candidates = db.query(Product).options(joinedload(Product.category)).filter(Product.status == "PUBLISHED").all()
    
    # If not authenticated, or not a buyer, or no preferences -> Return Fallback
    if not current_user or current_user.role != "buyer":
        # Fallback Strategy: Popular/Trending
        sorted_candidates = sorted(candidates, key=lambda p: p.price, reverse=True) # Mock trending
        items = []
        for p in sorted_candidates[:limit]:
            items.append(RecommendationItem(
                product=ProductRead.model_validate(p),
                reason="Popular in the marketplace"
            ))
        return RecommendationResponse(items=items)

    buyer_profile = db.query(BuyerProfile).filter(BuyerProfile.user_id == current_user.id).first()
    if not buyer_profile or not buyer_profile.preferences:
        # User has no preferences yet
        sorted_candidates = sorted(candidates, key=lambda p: p.price, reverse=True)
        items = []
        for p in sorted_candidates[:limit]:
            items.append(RecommendationItem(
                product=ProductRead.model_validate(p),
                reason="Trending in your industry"
            ))
        return RecommendationResponse(items=items)

    preferences = buyer_profile.preferences

    # 5. Score Products
    scored_products = []
    for product in candidates:
        score, reason = score_product(product, preferences)
        if score > 0:
            scored_products.append({"product": product, "score": score, "reason": reason})
    
    # 6. Rank Candidates
    scored_products.sort(key=lambda x: x["score"], reverse=True)

    # 7 & 8. Diversity and Deduplication
    final_recommendations = []
    seen_categories = set()
    seen_suppliers = set()
    
    for item in scored_products:
        if len(final_recommendations) >= limit:
            break
            
        prod = item["product"]
        cat_id = prod.category_id
        sup_id = prod.supplier_id
        
        # Penalize if we already have too many from this category or supplier
        if list(seen_categories).count(cat_id) >= 3 or list(seen_suppliers).count(sup_id) >= 3:
            continue
            
        final_recommendations.append(item)
        seen_categories.add(cat_id)
        seen_suppliers.add(sup_id)
        
    # No matches fallback handling
    if not final_recommendations:
        for product in candidates[:limit]:
            final_recommendations.append({
                "product": product,
                "score": 0,
                "reason": "Explore popular fabrics"
            })
            
    # If still not enough, fill with next best regardless of diversity
    if len(final_recommendations) < limit:
        already_added = {item["product"].id for item in final_recommendations}
        for item in scored_products:
            if item["product"].id not in already_added:
                final_recommendations.append(item)
                if len(final_recommendations) >= limit:
                    break

    # Build response
    response_items = []
    for item in final_recommendations:
        response_items.append(RecommendationItem(
            product=ProductRead.model_validate(item["product"]),
            reason=item["reason"]
        ))

    return RecommendationResponse(items=response_items)
