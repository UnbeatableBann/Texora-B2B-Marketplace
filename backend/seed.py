import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal
from app.models.catalog import Category, Product, ProductStatus
from app.models.profile import SupplierProfile
from app.models.user import User
from app.security.auth import get_password_hash


def seed_data():
    db = SessionLocal()

    if db.query(Category).first():
        print("Database already seeded")
        return

    print("Seeding database...")

    supplier = User(
        email="supplier@example.com",
        hashed_password=get_password_hash("password123"),
        role="supplier",
    )
    db.add(supplier)
    db.commit()
    db.refresh(supplier)

    supplier_profile = SupplierProfile(
        user_id=supplier.id,
        company_name="Global Textiles Ltd",
        description="Premium fabric manufacturer.",
        capabilities={"capacity": "1000m/day"},
    )
    db.add(supplier_profile)

    categories_data = [
        {"name": "Cotton", "slug": "cotton", "description": "Natural cotton fabrics"},
        {"name": "Silk", "slug": "silk", "description": "Premium silk materials"},
        {"name": "Denim", "slug": "denim", "description": "Durable denim for apparel"},
    ]

    cats = []
    for cd in categories_data:
        c = Category(**cd)
        db.add(c)
        cats.append(c)
    db.commit()

    for c in cats:
        db.refresh(c)

    products_data = [
        {
            "name": "Organic White Cotton",
            "short_description": "100% organic cotton, perfect for shirts.",
            "description": "High quality organic white cotton. Breathable and soft.",
            "price": 12.50,
            "currency": "USD",
            "stock_quantity": 500,
            "status": ProductStatus.PUBLISHED.value,
            "category_id": cats[0].id,
            "supplier_id": supplier.id,
            "specifications": {"gsm": 150, "width": "1.5m", "weave": "plain"},
            "primary_image_url": "https://images.unsplash.com/photo-1596489379899-72f5bc2f2118?q=80&w=600&auto=format&fit=crop",
        },
        {
            "name": "Raw Blue Denim",
            "short_description": "Heavyweight raw denim.",
            "description": "Classic blue raw denim for jeans and jackets.",
            "price": 18.00,
            "currency": "USD",
            "stock_quantity": 250,
            "status": ProductStatus.PUBLISHED.value,
            "category_id": cats[2].id,
            "supplier_id": supplier.id,
            "specifications": {"weight": "14oz", "width": "1.6m"},
            "primary_image_url": "https://images.unsplash.com/photo-1542272454-3860bb4f72db?q=80&w=600&auto=format&fit=crop",
        },
        {
            "name": "Mulberry Silk",
            "short_description": "Luxurious mulberry silk.",
            "description": "Premium silk, smooth texture.",
            "price": 45.00,
            "currency": "USD",
            "stock_quantity": 50,
            "status": ProductStatus.PUBLISHED.value,
            "category_id": cats[1].id,
            "supplier_id": supplier.id,
            "specifications": {"momme": 19, "width": "1.1m"},
            "primary_image_url": "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?q=80&w=600&auto=format&fit=crop",
        },
    ]

    for pd in products_data:
        p = Product(**pd)
        db.add(p)

    db.commit()
    print("Seeding complete.")


if __name__ == "__main__":
    seed_data()
