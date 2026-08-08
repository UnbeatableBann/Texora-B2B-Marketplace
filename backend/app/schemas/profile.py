from typing import Any

from pydantic import BaseModel


class BuyerProfileBase(BaseModel):
    company_name: str
    industry: str | None = None
    preferences: dict[str, Any] | None = None


class BuyerProfileCreate(BuyerProfileBase):
    pass


class BuyerProfileRead(BuyerProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class SupplierProfileBase(BaseModel):
    company_name: str
    description: str | None = None
    capabilities: dict[str, Any] | None = None


class SupplierProfileCreate(SupplierProfileBase):
    pass


class SupplierProfileRead(SupplierProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
