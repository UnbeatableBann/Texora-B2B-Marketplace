from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.repositories import commerce_repo
from app.schemas.commerce import (
    CartItemCreate,
    CartItemUpdate,
    OrderCreate,
    OrderRead,
    OrderUpdate,
    ShoppingCartRead,
)

router = APIRouter()

# --- Shopping Cart ---


@router.get("/cart", response_model=ShoppingCartRead)
def get_cart(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if current_user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers have a shopping cart")
    return commerce_repo.get_or_create_cart(db, current_user.id)


@router.post("/cart/items", response_model=ShoppingCartRead)
def add_to_cart(
    item_in: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can add to cart")
    return commerce_repo.add_item_to_cart(db, current_user.id, item_in)


@router.patch("/cart/items/{item_id}", response_model=ShoppingCartRead)
def update_cart_item(
    item_id: int,
    update_in: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can update cart")
    return commerce_repo.update_cart_item(db, current_user.id, item_id, update_in)


@router.delete("/cart/items/{item_id}", response_model=ShoppingCartRead)
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can remove from cart")
    return commerce_repo.remove_cart_item(db, current_user.id, item_id)


@router.delete("/cart", response_model=ShoppingCartRead)
def clear_cart(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if current_user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can clear cart")
    return commerce_repo.clear_cart(db, current_user.id)


# --- Checkout ---


@router.post("/checkout", response_model=OrderRead)
def checkout(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can checkout")
    return commerce_repo.create_order_from_cart(db, current_user.id, order_in)


# --- Orders ---


@router.get("/orders", response_model=list[OrderRead])
def get_orders(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if current_user.role == "buyer":
        return commerce_repo.get_buyer_orders(db, current_user.id)
    elif current_user.role == "supplier":
        return commerce_repo.get_supplier_orders(db, current_user.id)
    else:
        raise HTTPException(status_code=403, detail="Not authorized")


@router.get("/orders/{order_id}", response_model=OrderRead)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return commerce_repo.get_order(db, order_id, current_user.id, current_user.role)


@router.patch("/orders/{order_id}", response_model=OrderRead)
def update_order(
    order_id: int,
    order_update: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "supplier":
        raise HTTPException(
            status_code=403, detail="Only suppliers can update order status"
        )
    return commerce_repo.update_order_status(
        db, order_id, current_user.id, order_update.status
    )
