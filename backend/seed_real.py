import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal
from app.models.catalog import Category, Product, ProductStatus
from app.models.profile import SupplierProfile
from app.models.user import User
from app.security.auth import get_password_hash


def seed_real_products():
    db = SessionLocal()
    print("Populating real products...")

    # Get or create supplier
    supplier = db.query(User).filter(User.email == "supplier@example.com").first()
    if not supplier:
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
        db.commit()

    # Define real categories
    categories_data = [
        {
            "name": "Organic Cotton",
            "slug": "organic-cotton",
            "description": "GOTS certified organic cotton",
        },
        {
            "name": "Linen",
            "slug": "linen",
            "description": "Premium European flax linen",
        },
        {
            "name": "Performance",
            "slug": "performance",
            "description": "Technical and activewear fabrics",
        },
        {
            "name": "Wool",
            "slug": "wool",
            "description": "Merino and blended wool fabrics",
        },
        {
            "name": "Blends",
            "slug": "blends",
            "description": "Versatile poly-cotton and other blends",
        },
    ]

    cats = {}
    for cd in categories_data:
        c = db.query(Category).filter(Category.slug == cd["slug"]).first()
        if not c:
            c = Category(**cd)
            db.add(c)
            db.commit()
            db.refresh(c)
        cats[cd["slug"]] = c

    # Define real products
    products_data = [
        {
            "name": "French Terry Organic Cotton",
            "short_description": "Heavyweight 400gsm French Terry knit.",
            "description": "Premium loop-back French Terry knit from 100% GOTS certified organic cotton. Ideal for luxury hoodies and loungewear. Minimum Order Quantity (MOQ): 100 meters.",
            "price": 14.50,
            "currency": "USD",
            "stock_quantity": 5000,
            "status": ProductStatus.PUBLISHED.value,
            "category_id": cats["organic-cotton"].id,
            "supplier_id": supplier.id,
            "specifications": {
                "gsm": 400,
                "width": "1.8m",
                "knit": "French Terry",
                "certification": "GOTS",
            },
            "primary_image_url": "https://images.unsplash.com/photo-1601051515284-9df21f7dbbe4?q=80&w=800&auto=format&fit=crop",
        },
        {
            "name": "Belgian Washed Linen",
            "short_description": "Soft, pre-washed medium weight European linen.",
            "description": "High-quality European flax linen, pre-washed for softness and draped elegantly. Perfect for summer apparel and home textiles. MOQ: 50 meters.",
            "price": 22.00,
            "currency": "USD",
            "stock_quantity": 1200,
            "status": ProductStatus.PUBLISHED.value,
            "category_id": cats["linen"].id,
            "supplier_id": supplier.id,
            "specifications": {
                "gsm": 180,
                "width": "1.4m",
                "weave": "Plain",
                "origin": "Belgium",
            },
            "primary_image_url": "https://images.unsplash.com/photo-1598463959954-5264b3014e7a?q=80&w=800&auto=format&fit=crop",
        },
        {
            "name": "Moisture-Wicking Spandex Blend",
            "short_description": "4-way stretch activewear fabric with UPF 50+.",
            "description": "Technical performance fabric featuring advanced moisture-wicking properties, UPF 50+ protection, and superior shape retention. Ideal for activewear and leggings. MOQ: 200 meters.",
            "price": 9.75,
            "currency": "USD",
            "stock_quantity": 10000,
            "status": ProductStatus.PUBLISHED.value,
            "category_id": cats["performance"].id,
            "supplier_id": supplier.id,
            "specifications": {
                "gsm": 220,
                "width": "1.5m",
                "composition": "80% Nylon, 20% Spandex",
                "features": "Moisture-wicking, UPF 50+",
            },
            "primary_image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
        },
        {
            "name": "Super 120s Merino Wool Suiting",
            "short_description": "Fine worsted wool for bespoke tailoring.",
            "description": "Luxurious Super 120s worsted Merino wool. Features natural crease resistance and a beautiful drape. Designed for high-end bespoke suits and formal wear. MOQ: 20 meters.",
            "price": 65.00,
            "currency": "USD",
            "stock_quantity": 300,
            "status": ProductStatus.PUBLISHED.value,
            "category_id": cats["wool"].id,
            "supplier_id": supplier.id,
            "specifications": {
                "gsm": 250,
                "width": "1.5m",
                "composition": "100% Merino Wool",
                "grade": "Super 120s",
            },
            "primary_image_url": "https://images.unsplash.com/photo-1549444355-680f49635e69?q=80&w=800&auto=format&fit=crop",
        },
        {
            "name": "Recycled Poly-Cotton Twill",
            "short_description": "Durable workwear fabric made from recycled materials.",
            "description": "Heavy-duty twill fabric blending recycled polyester and sustainable cotton. Highly resistant to abrasion and tearing. Perfect for uniforms and workwear. MOQ: 500 meters.",
            "price": 8.50,
            "currency": "USD",
            "stock_quantity": 25000,
            "status": ProductStatus.PUBLISHED.value,
            "category_id": cats["blends"].id,
            "supplier_id": supplier.id,
            "specifications": {
                "gsm": 300,
                "width": "1.6m",
                "composition": "65% Recycled Poly, 35% Cotton",
                "weave": "Twill",
            },
            "primary_image_url": "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop",
        },
    ]

    count = 0
    for pd in products_data:
        exists = db.query(Product).filter(Product.name == pd["name"]).first()
        if not exists:
            p = Product(**pd)
            db.add(p)
            count += 1

    db.commit()
    print(f"Seeding complete. Added {count} new real products.")


if __name__ == "__main__":
    seed_real_products()
