from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from enum import Enum

class ProductStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    OUT_OF_STOCK = "OUT_OF_STOCK"
    ARCHIVED = "ARCHIVED"

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class CategoryRead(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: float
    currency: str = "USD"
    stock_quantity: int = 0
    status: ProductStatus = ProductStatus.DRAFT
    category_id: int
    specifications: Optional[Dict[str, Any]] = None
    primary_image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductRead(ProductBase):
    id: int
    supplier_id: int
    category: Optional[CategoryRead] = None

    class Config:
        from_attributes = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    stock_quantity: Optional[int] = None
    status: Optional[ProductStatus] = None
    category_id: Optional[int] = None
    specifications: Optional[Dict[str, Any]] = None
    primary_image_url: Optional[str] = None

class RecommendationItem(BaseModel):
    product: ProductRead
    reason: str

class RecommendationResponse(BaseModel):
    items: List[RecommendationItem]
