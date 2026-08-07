from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON, Boolean, Float, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.base import Base

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PREPARING = "PREPARING"
    READY_FOR_DISPATCH = "READY_FOR_DISPATCH"
    COMPLETED = "COMPLETED"

class ShoppingCart(Base):
    __tablename__ = "shopping_carts"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    buyer = relationship("User", backref="shopping_cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("shopping_carts.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)

    cart = relationship("ShoppingCart", back_populates="items")
    product = relationship("Product")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float, nullable=False)
    shipping_address = Column(JSON, nullable=False)
    status = Column(String, default=OrderStatus.PENDING.value)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    buyer = relationship("User", backref="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    supplier_id = Column(Integer, ForeignKey("users.id"))
    quantity = Column(Integer, nullable=False)
    purchase_price = Column(Float, nullable=False)
    
    # Store snapshot details
    product_name = Column(String, nullable=False)
    primary_image_url = Column(String)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
    supplier = relationship("User", backref="supplier_order_items")
