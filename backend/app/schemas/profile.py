from pydantic import BaseModel
from typing import Dict, Any, Optional

class BuyerProfileBase(BaseModel):
    company_name: str
    industry: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class BuyerProfileCreate(BuyerProfileBase):
    pass

class BuyerProfileRead(BuyerProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class SupplierProfileBase(BaseModel):
    company_name: str
    description: Optional[str] = None
    capabilities: Optional[Dict[str, Any]] = None

class SupplierProfileCreate(SupplierProfileBase):
    pass

class SupplierProfileRead(SupplierProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
