import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal
from app.models.catalog import Category, Product, ProductStatus
from app.models.profile import SupplierProfile
from app.models.user import User
from app.security.auth import get_password_hash


def seed_extra_products():
    db = SessionLocal()

    # 1. Ensure supplier exists
    supplier_email = "premiumtextiles@example.com"
    supplier = db.query(User).filter(User.email == supplier_email).first()
    if not supplier:
        supplier = User(
            email=supplier_email,
            hashed_password=get_password_hash("password123"),
            role="supplier",
        )
        db.add(supplier)
        db.commit()
        db.refresh(supplier)

        profile = SupplierProfile(
            user_id=supplier.id,
            company_name="Premium Global Textiles",
            description="Leading supplier of premium and sustainable fabrics.",
            capabilities={"location": "Milan, Italy"},
        )
        db.add(profile)
        db.commit()

    # 2. Get or create Categories
    cat_names = ["Silk", "Linen", "Denim", "Polyester", "Organic Cotton", "Cotton"]
    categories = {}
    for cn in cat_names:
        slug = cn.lower().replace(" ", "-")
        cat = db.query(Category).filter(Category.slug == slug).first()
        if not cat:
            cat = Category(name=cn, slug=slug, description=f"Premium {cn}")
            db.add(cat)
            db.commit()
            db.refresh(cat)
        categories[cn] = cat

    # 3. Product definitions
    products_data = [
        # Silk
        {
            "name": "Mulberry Silk Charmeuse 19mm",
            "desc": "100% pure Mulberry silk charmeuse with a luxurious drape and glossy finish. Ideal for evening wear, lingerie, and premium bedding. 19 momme weight provides excellent durability while maintaining a soft, buttery feel.",
            "price": 45.0,
            "stock": 1200,
            "category": "Silk",
            "img": "/cloth/slik.png",
            "specs": {
                "moq_quantity": 50,
                "moq_unit": "yard",
                "price_unit": "yard",
                "fabric_type": "Charmeuse",
            },
        },
        {
            "name": "Raw Silk Noil Fabric",
            "desc": "Textured raw silk noil with a matte finish and slightly nubby texture. Often called 'vegetarian silk'. Excellent for casual suiting, dresses, and light jackets. Breathable and comfortable for year-round wear.",
            "price": 28.5,
            "stock": 800,
            "category": "Silk",
            "img": "/cloth/slik.png",
            "specs": {"moq_quantity": 100, "moq_unit": "yard", "price_unit": "yard"},
        },
        # Linen
        {
            "name": "Belgian Masters Pure Linen",
            "desc": "Medium-weight 100% Belgian flax linen. Pre-washed for extra softness and minimal shrinkage. Highly breathable and naturally antimicrobial, making it perfect for summer apparel, suiting, and luxury home textiles.",
            "price": 22.0,
            "stock": 2500,
            "category": "Linen",
            "img": "/cloth/linen.png",
            "specs": {"moq_quantity": 100, "moq_unit": "meter", "price_unit": "meter"},
        },
        {
            "name": "French Washed Linen Blend",
            "desc": "A premium blend of 55% French linen and 45% organic cotton, offering the crisp, breathable feel of linen with the wrinkle-resistance of cotton. Excellent drape for curtains, bedding, and apparel.",
            "price": 18.5,
            "stock": 1500,
            "category": "Linen",
            "img": "/cloth/linen.png",
            "specs": {"moq_quantity": 200, "moq_unit": "meter", "price_unit": "meter"},
        },
        # Denim
        {
            "name": "Japanese Selvedge Raw Denim 14oz",
            "desc": "Authentic 14oz raw selvedge denim woven on vintage shuttle looms in Okayama, Japan. Features a deep indigo rope-dyed finish that will fade beautifully over time. Features a classic redline selvedge ID.",
            "price": 35.0,
            "stock": 900,
            "category": "Denim",
            "img": "/cloth/denim.png",
            "specs": {
                "moq_quantity": 300,
                "moq_unit": "yard",
                "price_unit": "yard",
                "weight": "14oz",
            },
        },
        {
            "name": "Stretch Denim Indigo Wash 11oz",
            "desc": "Comfort stretch denim (98% cotton, 2% elastane) weighing 11oz. Pre-shrunk and heavily dyed in a rich indigo wash. Provides excellent recovery and flexibility, perfect for modern skinny and slim-fit jeans.",
            "price": 14.0,
            "stock": 5000,
            "category": "Denim",
            "img": "/cloth/denim.png",
            "specs": {
                "moq_quantity": 500,
                "moq_unit": "meter",
                "price_unit": "meter",
                "weight": "11oz",
            },
        },
        # Polyester
        {
            "name": "Recycled PET Activewear Spandex Blend",
            "desc": "High-performance moisture-wicking fabric made from 88% recycled PET bottles and 12% spandex. Four-way stretch, anti-odor treatment, and UV protection (UPF 50+). Ideal for athletic leggings, sports bras, and activewear.",
            "price": 12.5,
            "stock": 8000,
            "category": "Polyester",
            "img": "/cloth/polyester.png",
            "specs": {"moq_quantity": 1000, "moq_unit": "yard", "price_unit": "yard"},
        },
        {
            "name": "Microfiber Polyester Twill",
            "desc": "Soft, durable microfiber twill woven from 100% polyester. Water-resistant and highly resistant to wrinkles and shrinking. Commonly used for outerwear, jackets, board shorts, and light upholstery.",
            "price": 8.0,
            "stock": 10000,
            "category": "Polyester",
            "img": "/cloth/polyester.png",
            "specs": {"moq_quantity": 2000, "moq_unit": "meter", "price_unit": "meter"},
        },
        # Organic Cotton
        {
            "name": "GOTS Certified Organic Cotton Jersey",
            "desc": "Ultra-soft, medium-weight knit jersey made from 100% GOTS-certified organic cotton. Grown without synthetic pesticides or fertilizers. Perfect for premium t-shirts, baby clothing, and sustainable basics.",
            "price": 15.0,
            "stock": 3500,
            "category": "Cotton",
            "img": "/cloth/organic.png",
            "specs": {
                "moq_quantity": 250,
                "moq_unit": "kg",
                "price_unit": "kg",
                "certification": "GOTS",
            },
        },
        {
            "name": "Organic Cotton French Terry 400 GSM",
            "desc": "Heavyweight French Terry (400 GSM) made exclusively from unbleached organic cotton loops. Highly absorbent, breathable, and exceptionally cozy. The absolute best choice for sustainable luxury hoodies and loungewear.",
            "price": 24.0,
            "stock": 1200,
            "category": "Cotton",
            "img": "/cloth/organic.png",
            "specs": {
                "moq_quantity": 150,
                "moq_unit": "yard",
                "price_unit": "yard",
                "weight": "400 GSM",
            },
        },
    ]

    for data in products_data:
        existing = db.query(Product).filter(Product.name == data["name"]).first()
        if not existing:
            product = Product(
                name=data["name"],
                short_description=data["desc"][:100] + "...",
                description=data["desc"],
                price=data["price"],
                currency="USD",
                stock_quantity=data["stock"],
                status=ProductStatus.PUBLISHED.value,
                category_id=categories[data["category"]].id,
                supplier_id=supplier.id,
                specifications=data["specs"],
                primary_image_url=data["img"],
            )
            db.add(product)

    db.commit()
    print("Extra products seeded successfully!")


if __name__ == "__main__":
    seed_extra_products()
