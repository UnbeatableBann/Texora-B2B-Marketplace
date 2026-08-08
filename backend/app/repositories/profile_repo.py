from sqlalchemy.orm import Session

from app.models.profile import BuyerProfile, SupplierProfile
from app.schemas.profile import BuyerProfileCreate, SupplierProfileCreate


def create_buyer_profile(db: Session, user_id: int, profile_in: BuyerProfileCreate):
    db_profile = BuyerProfile(**profile_in.model_dump(), user_id=user_id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def create_supplier_profile(
    db: Session, user_id: int, profile_in: SupplierProfileCreate
):
    db_profile = SupplierProfile(**profile_in.model_dump(), user_id=user_id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def get_buyer_profile(db: Session, user_id: int):
    return db.query(BuyerProfile).filter(BuyerProfile.user_id == user_id).first()


def get_supplier_profile(db: Session, user_id: int):
    return db.query(SupplierProfile).filter(SupplierProfile.user_id == user_id).first()
