from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.BUYER

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    is_active: bool | None = True
    onboarding_completed: bool | None = False
    full_name: str | None = None
    profile_image: str | None = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str | None = None
    token_type: str

class RefreshRequest(BaseModel):
    refresh_token: str

class TokenData(BaseModel):
    email: str | None = None
