# Shopping Cart Feature Specification

# Purpose

The Shopping Cart feature allows buyers to collect products they intend to purchase before proceeding to checkout.

It acts as a temporary workspace where buyers can review products, modify quantities, validate availability, estimate order totals, and prepare their purchase.

The Shopping Cart is the bridge between product discovery and order creation.

---

# Goals

The Shopping Cart should:

* Allow buyers to collect products.
* Support quantity management.
* Display accurate pricing.
* Validate product availability.
* Prepare buyers for checkout.
* Minimize purchasing friction.
* Keep cart data synchronized across devices (future).

---

# Scope

## Included

* Cart Creation
* Add to Cart
* Update Quantity
* Remove Items
* Cart Summary
* Stock Validation
* Price Calculation
* Checkout Entry Point

---

## Excluded

* Product Search
* Product Management
* Payment Processing
* Order Processing
* Shipping Calculation
* Discounts & Coupons (Future)

---

# Primary Users

## Buyer

Authenticated buyers can:

* Add products
* Update quantities
* Remove products
* Review cart
* Proceed to checkout

---

## Guest

Guests may browse products.

Attempting to add a product to the cart should redirect them to authentication.

---

## Supplier

Suppliers cannot access Shopping Cart functionality.

---

# Dependencies

Shopping Cart depends on:

* Authentication
* Products
* Inventory
* Buyer Profile

Shopping Cart is used by:

* Product Details
* Marketplace
* Checkout
* Orders

---

# Feature Overview

Each buyer owns exactly one active shopping cart.

The cart temporarily stores selected products until:

* Checkout is completed.
* Cart is cleared.
* Cart becomes abandoned (future).

The cart should always display current product information before checkout.

---

# User Journey

```text id="wmt7tb"
Browse Marketplace

↓

View Product

↓

Add To Cart

↓

Shopping Cart

↓

Update Quantity

↓

Review Order

↓

Checkout
```

---

# Cart Workflow

```text id="kwt6m8"
Buyer

↓

Select Product

↓

Validate Product

↓

Validate Stock

↓

Create / Load Cart

↓

Add Cart Item

↓

Update Totals

↓

Return Updated Cart
```

---

# Functional Requirements

## Cart Creation

A cart should be created automatically when the buyer adds their first product.

A buyer may only have one active cart.

---

## Add Product

Buyers should be able to add products from:

* Marketplace
* Search
* Product Details
* AI Recommendations
* Similar Products

If the product already exists in the cart:

Increase its quantity instead of creating a duplicate item.

---

## Update Quantity

Buyers should be able to:

* Increase quantity
* Decrease quantity
* Remove quantity to zero (removes item)

Every update should immediately recalculate totals.

---

## Remove Product

Buyers may remove products individually.

Removing the final item leaves an empty active cart.

---

## Clear Cart

Buyers may remove all items from the cart.

The cart remains active but empty.

---

## Cart Summary

Display:

* Total Items
* Subtotal
* Estimated Total

Future:

* Shipping
* Taxes
* Discounts

---

## Availability Validation

Every cart load should verify:

* Product still exists.
* Product is published.
* Product remains in stock.
* Quantity does not exceed stock.

Warnings should be displayed if validation fails.

---

# Cart Structure

```text id="ix0qlu"
Shopping Cart

│

├── Cart Items

├── Quantity

├── Product Price

├── Subtotal

└── Estimated Total
```

---

# Cart Item Structure

Each cart item contains:

* Product
* Quantity
* Unit Price
* Subtotal

The cart should always display the latest product price.

Final validation occurs during checkout.

---

# Cart Calculations

For each item:

```text id="j1ydzk"
Subtotal

=

Price

×

Quantity
```

Cart Total

```text id="myd8x8"
Total

=

Sum of Item Subtotals
```

Future totals may include:

* Shipping
* Taxes
* Coupons

---

# Product Validation

Before adding:

Verify:

* Product exists.
* Product published.
* Product active.
* Stock available.

Reject invalid products.

---

# Stock Validation

When quantity changes:

Verify:

Requested Quantity

≤

Available Stock

If exceeded:

Display validation message.

---

# Cart Persistence

Prototype

Cart persists in the database.

Future

Cart synchronization across:

* Multiple devices
* Browser sessions

---

# Feature Interactions

## Authentication

Only authenticated buyers may create carts.

Guests attempting to add products should authenticate first.

---

## Marketplace

Marketplace products can be added directly to the cart.

---

## Search

Search results support Add to Cart.

---

## Product Details

Product Details provides:

* Quantity Selector
* Add to Cart

---

## Inventory

Inventory determines:

* Product availability
* Maximum quantity

Cart never modifies inventory.

---

## Checkout

Checkout consumes the active cart.

Successful checkout:

* Creates an order.
* Marks cart as checked out.
* Creates a new empty active cart for future shopping.

---

## Orders

Orders are generated from cart contents.

Order data becomes immutable after creation.

---

## AI Assistant

AI may recommend products.

The Shopping Cart handles the actual purchase intent.

---

# Database Interaction

Primary Tables

* shopping_carts
* cart_items
* products

Reads

* Products
* Inventory

Writes

* Shopping Cart
* Cart Items

Checkout converts cart contents into:

* Orders
* Order Items

---

# API Endpoints

## Get Cart

```http id="v4wr53"
GET /api/v1/cart
```

---

## Add Item

```http id="j22thg"
POST /api/v1/cart/items
```

---

## Update Item

```http id="n62pj0"
PATCH /api/v1/cart/items/{cart_item_id}
```

---

## Remove Item

```http id="wvwtye"
DELETE /api/v1/cart/items/{cart_item_id}
```

---

## Clear Cart

```http id="yw0zpr"
DELETE /api/v1/cart
```

---

# UI Components

Shopping Cart includes:

* Cart Item List
* Product Thumbnail
* Quantity Stepper
* Remove Button
* Cart Summary Card
* Checkout Button
* Empty Cart View
* Validation Messages

---

# States

## Empty

Display:

"No items in your cart."

Provide:

Continue Shopping button.

---

## Active

Display:

Products

Totals

Checkout

---

## Updating

Disable controls while updates are processed.

---

## Validation Warning

Display stock or availability warnings.

---

## Error

Display retry option.

---

# Validation Rules

Products

* Must exist.
* Must be published.

Quantity

* Greater than zero.
* Cannot exceed available stock.

Cart

* One active cart per buyer.

---

# Error Handling

Handle:

* Product removed from marketplace.
* Product archived.
* Product out of stock.
* Quantity exceeds inventory.
* Network interruption.
* Cart retrieval failure.
* Duplicate requests.

The cart should recover gracefully without losing valid items.

---

# Edge Cases

* Buyer adds the same product multiple times.
* Product price changes after being added.
* Product becomes unavailable while in cart.
* Product archived before checkout.
* Stock reduced below requested quantity.
* Buyer clears cart while another update request is in progress.
* Buyer refreshes during cart update.
* Cart contains products from multiple suppliers (future business decision).
* Cart is empty when checkout is initiated.

---

# Security Considerations

* Buyers may only access their own cart.
* Suppliers cannot access buyer carts.
* Product ownership must be validated.
* Cart endpoints require authentication.
* Product prices must always be calculated on the server.
* Clients must never be trusted for totals or pricing.

---

# Responsive Behaviour

Desktop

* Two-column layout
* Sticky order summary

Tablet

* Responsive summary
* Vertical item layout

Mobile

* Single-column layout
* Sticky Checkout button
* Collapsible order summary
* Touch-friendly quantity controls

---

# Performance Requirements

* Cart loads within 1 second under normal conditions.
* Quantity updates should complete within 500 ms where possible.
* Totals should update immediately after successful responses.
* Product thumbnails should be optimized.
* Server should batch cart calculations efficiently.

---

# Acceptance Criteria

## Cart Creation

* Buyer receives an active cart after adding the first product.
* Only one active cart exists per buyer.

---

## Add To Cart

* Products can be added from Marketplace.
* Products can be added from Product Details.
* Adding an existing product increases quantity.
* Invalid products cannot be added.

---

## Quantity Management

* Quantity can be increased.
* Quantity can be decreased.
* Quantity cannot exceed available stock.
* Quantity reaching zero removes the item.

---

## Cart Summary

* Item totals are calculated correctly.
* Cart total is calculated correctly.
* Summary updates after every modification.

---

## Validation

* Out-of-stock products display warnings.
* Archived products cannot remain purchasable.
* Invalid products are removed or flagged.

---

## Checkout Integration

* Checkout uses the active cart.
* Successful checkout clears the active cart.
* Historical cart information is preserved through the generated order.

---

## Security

* Buyers can access only their own carts.
* Product pricing is validated on the server.
* Cart manipulation through client-side modifications is prevented.

---

# Future Enhancements

The Shopping Cart architecture should support:

* Saved Carts
* Wishlist Integration
* Bulk Quantity Editing
* Coupon Codes
* Shipping Estimates
* Tax Calculation
* Multi-Currency
* Cart Sharing
* Cross-Sell Recommendations
* Frequently Bought Together
* Cart Abandonment Recovery
* Persistent Multi-Device Synchronization
* Supplier-Specific Cart Grouping
* Estimated Delivery Dates

These enhancements should integrate without changing the existing cart architecture.

---

# Out of Scope

The Shopping Cart feature intentionally does not manage:

* Authentication
* Product management
* Inventory updates
* Payment processing
* Order fulfillment
* Recommendation generation
* Shipping logistics
* Tax calculation

Its responsibility is limited to collecting purchase intent, validating product availability, calculating order summaries, and preparing buyers for a successful checkout.
