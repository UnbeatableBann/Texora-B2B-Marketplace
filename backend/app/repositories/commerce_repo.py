import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.catalog import Product
from app.models.commerce import CartItem, Order, OrderItem, OrderStatus, ShoppingCart
from app.schemas.commerce import CartItemCreate, CartItemUpdate, OrderCreate


def get_or_create_cart(db: Session, buyer_id: int) -> ShoppingCart:
    cart = db.query(ShoppingCart).filter(ShoppingCart.buyer_id == buyer_id).first()
    if not cart:
        cart = ShoppingCart(buyer_id=buyer_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def add_item_to_cart(db: Session, buyer_id: int, item_in: CartItemCreate):
    cart = get_or_create_cart(db, buyer_id)

    product = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not product or product.status != "PUBLISHED":
        raise HTTPException(status_code=400, detail="Product not available")

    if item_in.quantity > product.stock_quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")

    cart_item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == item_in.product_id)
        .first()
    )
    if cart_item:
        cart_item.quantity += item_in.quantity
        if cart_item.quantity > product.stock_quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")
    else:
        cart_item = CartItem(
            cart_id=cart.id, product_id=item_in.product_id, quantity=item_in.quantity
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart)
    return cart


def update_cart_item(
    db: Session, buyer_id: int, item_id: int, update_in: CartItemUpdate
):
    cart = get_or_create_cart(db, buyer_id)
    cart_item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if update_in.quantity == 0:
        db.delete(cart_item)
    else:
        product = db.query(Product).filter(Product.id == cart_item.product_id).first()
        if update_in.quantity > product.stock_quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")
        cart_item.quantity = update_in.quantity

    db.commit()
    db.refresh(cart)
    return cart


def remove_cart_item(db: Session, buyer_id: int, item_id: int):
    cart = get_or_create_cart(db, buyer_id)
    cart_item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
        .first()
    )
    if cart_item:
        db.delete(cart_item)
        db.commit()
    db.refresh(cart)
    return cart


def clear_cart(db: Session, buyer_id: int):
    cart = get_or_create_cart(db, buyer_id)
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(cart)
    return cart


def create_order_from_cart(db: Session, buyer_id: int, order_in: OrderCreate):
    cart = get_or_create_cart(db, buyer_id)
    if not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_amount = 0
    order_items_data = []

    # Validation and prep
    for item in cart.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if (
            not product
            or product.status != "PUBLISHED"
            or product.stock_quantity < item.quantity
        ):
            raise HTTPException(
                status_code=400,
                detail=f"Product {product.name if product else item.product_id} is unavailable or out of stock",
            )

        total_amount += product.price * item.quantity
        order_items_data.append(
            {
                "product_id": product.id,
                "supplier_id": product.supplier_id,
                "quantity": item.quantity,
                "purchase_price": product.price,
                "product_name": product.name,
                "primary_image_url": product.primary_image_url,
            }
        )

        # Deduct stock
        product.stock_quantity -= item.quantity

    order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"

    order = Order(
        order_number=order_number,
        buyer_id=buyer_id,
        total_amount=total_amount,
        shipping_address=order_in.shipping_address.model_dump(),
        status=OrderStatus.PENDING.value,
    )
    db.add(order)
    db.flush()  # get order id

    for item_data in order_items_data:
        oi = OrderItem(order_id=order.id, **item_data)
        db.add(oi)

    # Clear cart
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(order)
    return order


def get_buyer_orders(db: Session, buyer_id: int):
    return (
        db.query(Order)
        .filter(Order.buyer_id == buyer_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def get_order(db: Session, order_id: int, user_id: int, role: str):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if role == "buyer" and order.buyer_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if role == "supplier":
        has_item = any(item.supplier_id == user_id for item in order.items)
        if not has_item:
            raise HTTPException(status_code=403, detail="Not authorized")

    return order


def get_supplier_orders(db: Session, supplier_id: int):
    orders = (
        db.query(Order)
        .join(OrderItem)
        .filter(OrderItem.supplier_id == supplier_id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


def update_order_status(db: Session, order_id: int, supplier_id: int, status: str):
    order = (
        db.query(Order)
        .join(OrderItem)
        .filter(Order.id == order_id, OrderItem.supplier_id == supplier_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    db.refresh(order)
    return order
