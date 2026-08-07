from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.schemas.catalog import ProductRead

# Cart Schemas
class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemRead(CartItemBase):
    id: int
    cart_id: int
    product: ProductRead

    class Config:
        from_attributes = True

class ShoppingCartRead(BaseModel):
    id: int
    buyer_id: int
    items: List[CartItemRead] = []

    class Config:
        from_attributes = True

# Order Schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    purchase_price: float
    product_name: str
    primary_image_url: Optional[str] = None

class OrderItemRead(OrderItemBase):
    id: int
    order_id: int
    supplier_id: int

    class Config:
        from_attributes = True

class ShippingAddressBase(BaseModel):
    recipient_name: str
    phone: str
    address_line: str
    city: str
    state: str
    postal_code: str
    country: str

class OrderBase(BaseModel):
    shipping_address: ShippingAddressBase
    total_amount: float
    status: str

class OrderCreate(BaseModel):
    shipping_address: ShippingAddressBase

class OrderRead(OrderBase):
    id: int
    order_number: str
    buyer_id: int
    created_at: datetime
    items: List[OrderItemRead] = []

    class Config:
        from_attributes = True

class OrderUpdate(BaseModel):
    status: str
