from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON, Boolean, Float, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base
import enum

class ProductStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    OUT_OF_STOCK = "OUT_OF_STOCK"
    ARCHIVED = "ARCHIVED"

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text)
    short_description = Column(String)
    price = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    stock_quantity = Column(Integer, default=0)
    status = Column(String, default=ProductStatus.DRAFT.value)
    
    category_id = Column(Integer, ForeignKey("categories.id"))
    supplier_id = Column(Integer, ForeignKey("users.id"))
    
    specifications = Column(JSON)
    primary_image_url = Column(String)

    category = relationship("Category", back_populates="products")
    supplier = relationship("User", backref="products")
