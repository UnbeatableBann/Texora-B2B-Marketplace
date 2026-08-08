from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_optional_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.profile import BuyerProfile
from app.services.ai_service import ai_provider

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    response: str
    products: Optional[List[Dict[str, Any]]] = None
    actions: List[Dict[str, str]] = Field(default_factory=list)


@router.post("/chat", response_model=ChatResponse)
def ai_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user)
):
    msg = request.message
    user_context = ""
    
    if current_user and current_user.role == "buyer":
        buyer_profile = (
            db.query(BuyerProfile)
            .filter(BuyerProfile.user_id == current_user.id)
            .first()
        )
        if buyer_profile and buyer_profile.preferences:
            user_context = f"The user is an authenticated buyer. Their preferences are: {buyer_profile.preferences}"

    # 1. Extract Intent
    intent_data = ai_provider.extract_intent(msg)

    # 2. Handle based on intent
    products = None
    actions = []

    if intent_data.intent == "PRODUCT_SEARCH" and intent_data.criteria:
        products = ai_provider.search_products(db, intent_data.criteria)

    elif intent_data.intent == "GENERAL_MARKETPLACE_HELP":
        # Check for simple dashboard/order intents as a fallback
        lower_msg = msg.lower()
        if "order" in lower_msg:
            actions.append({"type": "navigate", "target": "/orders"})
        elif "dashboard" in lower_msg or "inventory" in lower_msg:
            if current_user and current_user.role == "supplier":
                actions.append({"type": "navigate", "target": "/dashboard/supplier"})

    # 3. Generate natural language response
    response_text = ai_provider.generate_response(
        msg, intent_data, products or [], user_context
    )

    return ChatResponse(response=response_text, products=products, actions=actions)
