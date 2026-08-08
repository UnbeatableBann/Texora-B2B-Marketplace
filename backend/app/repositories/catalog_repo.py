from sqlalchemy.orm import Session

from app.models.catalog import Category, Product
from app.schemas.catalog import CategoryCreate, ProductCreate, ProductUpdate


def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(Category)
        .filter(Category.is_active == True)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_category(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()


def create_category(db: Session, category: CategoryCreate):
    db_category = Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_products(
    db: Session,
    category_id: int | None = None,
    supplier_id: int | None = None,
    skip: int = 0,
    limit: int = 100,
    include_drafts: bool = False,
):
    query = db.query(Product)
    if not include_drafts:
        query = query.filter(Product.status.in_(["PUBLISHED", "OUT_OF_STOCK"]))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if supplier_id:
        query = query.filter(Product.supplier_id == supplier_id)
    return query.offset(skip).limit(limit).all()


def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()


def create_product(db: Session, product: ProductCreate, supplier_id: int):
    db_product = Product(**product.model_dump(), supplier_id=supplier_id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, db_product: Product, product_update: ProductUpdate):
    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, db_product: Product):
    db_product.status = "ARCHIVED"
    db.commit()
