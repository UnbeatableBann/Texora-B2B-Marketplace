from sqlalchemy import Column, Integer, String, Boolean, Enum
import enum
from app.db.base import Base

class UserRole(str, enum.Enum):
    BUYER = "buyer"
    SUPPLIER = "supplier"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    hashed_password = Column(String, nullable=True)
    auth_provider = Column(String, default="email", nullable=False)
    google_subject = Column(String, unique=True, index=True, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.BUYER, nullable=False)
    is_active = Column(Boolean, default=True)
    onboarding_completed = Column(Boolean, default=False)
