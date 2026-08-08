from typing import Union

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.repositories.profile_repo import (
    create_buyer_profile,
    create_supplier_profile,
    get_buyer_profile,
    get_supplier_profile,
)
from app.schemas.profile import (
    BuyerProfileCreate,
    BuyerProfileRead,
    SupplierProfileCreate,
    SupplierProfileRead,
)

router = APIRouter()


@router.post("/buyer", response_model=BuyerProfileRead)
def onboard_buyer(
    profile_in: BuyerProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "buyer":
        raise HTTPException(status_code=403, detail="Not authorized as buyer")
    if get_buyer_profile(db, current_user.id):
        raise HTTPException(status_code=400, detail="Profile already exists")
    profile = create_buyer_profile(db, current_user.id, profile_in)
    current_user.onboarding_completed = True
    db.commit()
    return profile


@router.post("/supplier", response_model=SupplierProfileRead)
def onboard_supplier(
    profile_in: SupplierProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "supplier":
        raise HTTPException(status_code=403, detail="Not authorized as supplier")
    if get_supplier_profile(db, current_user.id):
        raise HTTPException(status_code=400, detail="Profile already exists")
    profile = create_supplier_profile(db, current_user.id, profile_in)
    current_user.onboarding_completed = True
    db.commit()
    return profile


@router.get("/me", response_model=Union[BuyerProfileRead, SupplierProfileRead])
def get_my_profile(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if current_user.role == "buyer":
        profile = get_buyer_profile(db, current_user.id)
    elif current_user.role == "supplier":
        profile = get_supplier_profile(db, current_user.id)
    else:
        raise HTTPException(status_code=400, detail="Unknown role")

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
