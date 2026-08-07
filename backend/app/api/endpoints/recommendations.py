from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.api.deps import get_optional_current_user
from app.models.user import User
from app.schemas.catalog import ProductRead
from app.models.catalog import Product
import random

router = APIRouter()

@router.get("", response_model=List[ProductRead])
def get_recommendations(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user)
):
    # Basic rule-based recommendation
    products = db.query(Product).filter(Product.status == "PUBLISHED").all()
    # Shuffle for randomness to simulate recommendations
    random.shuffle(products)
    return products[:limit]

@router.get("/personalized", response_model=List[ProductRead])
def get_personalized_recommendations(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user)
):
    products = db.query(Product).filter(Product.status == "PUBLISHED").all()
    random.shuffle(products)
    return products[:limit]

@router.get("/recently-viewed", response_model=List[ProductRead])
def get_recently_viewed(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user)
):
    # Mock recently viewed
    products = db.query(Product).filter(Product.status == "PUBLISHED").all()
    random.shuffle(products)
    return products[:limit]
