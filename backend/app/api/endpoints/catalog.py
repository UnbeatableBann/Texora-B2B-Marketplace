from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.api.deps import get_current_user, get_optional_current_user
from app.models.user import User
from app.schemas.catalog import CategoryRead, CategoryCreate, ProductRead, ProductCreate, ProductUpdate
from app.repositories import catalog_repo

router = APIRouter()

@router.get("/categories", response_model=List[CategoryRead])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return catalog_repo.get_categories(db, skip=skip, limit=limit)

@router.post("/categories", response_model=CategoryRead)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return catalog_repo.create_category(db, category)

@router.get("/products", response_model=List[ProductRead])
def read_products(
    category_id: Optional[int] = None,
    supplier_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    include_drafts = False
    # Only allow viewing drafts if it's the supplier viewing their own products
    if current_user and current_user.role == "supplier" and current_user.id == supplier_id:
        include_drafts = True
    return catalog_repo.get_products(db, category_id=category_id, supplier_id=supplier_id, skip=skip, limit=limit, include_drafts=include_drafts)

@router.get("/products/{product_id}", response_model=ProductRead)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = catalog_repo.get_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.get("/products/{product_id}/similar", response_model=List[ProductRead])
def get_similar_products(product_id: int, limit: int = 4, db: Session = Depends(get_db)):
    db_product = catalog_repo.get_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    similar = db.query(catalog_repo.Product).filter(
        catalog_repo.Product.category_id == db_product.category_id,
        catalog_repo.Product.id != product_id,
        catalog_repo.Product.status == "PUBLISHED"
    ).limit(limit).all()
    return similar

@router.post("/products", response_model=ProductRead)
def create_product(product: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "supplier":
        raise HTTPException(status_code=403, detail="Only suppliers can create products")
    return catalog_repo.create_product(db, product, supplier_id=current_user.id)

@router.patch("/products/{product_id}", response_model=ProductRead)
def update_product(product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "supplier":
        raise HTTPException(status_code=403, detail="Only suppliers can update products")
    db_product = catalog_repo.get_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    if db_product.supplier_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only update your own products")
    return catalog_repo.update_product(db, db_product, product_update)

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "supplier":
        raise HTTPException(status_code=403, detail="Only suppliers can delete products")
    db_product = catalog_repo.get_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    if db_product.supplier_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own products")
    # Instead of hard delete, maybe just archive? The spec says soft delete
    # but the catalog repo uses hard delete for now.
    # Let's archive it instead.
    from app.schemas.catalog import ProductStatus
    db_product.status = ProductStatus.ARCHIVED.value
    db.commit()
    return {"message": "Product archived successfully"}
