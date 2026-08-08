from enum import Enum
from typing import Any

from pydantic import BaseModel


class ProductStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    OUT_OF_STOCK = "OUT_OF_STOCK"
    ARCHIVED = "ARCHIVED"


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    description: str | None = None
    short_description: str | None = None
    price: float
    currency: str = "USD"
    stock_quantity: int = 0
    status: ProductStatus = ProductStatus.DRAFT
    category_id: int
    specifications: dict[str, Any] | None = None
    primary_image_url: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductRead(ProductBase):
    id: int
    supplier_id: int
    category: CategoryRead | None = None

    class Config:
        from_attributes = True


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    short_description: str | None = None
    price: float | None = None
    currency: str | None = None
    stock_quantity: int | None = None
    status: ProductStatus | None = None
    category_id: int | None = None
    specifications: dict[str, Any] | None = None
    primary_image_url: str | None = None


class RecommendationItem(BaseModel):
    product: ProductRead
    reason: str


class RecommendationResponse(BaseModel):
    items: list[RecommendationItem]
