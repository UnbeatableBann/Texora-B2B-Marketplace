# Navigation

# Purpose

This document defines the navigation architecture of the Textile Marketplace.

It specifies:

* Application routes
* Navigation hierarchy
* Role-based navigation
* Public and protected routes
* Navigation behavior
* User transitions
* Route accessibility

The objective is to create a simple, intuitive navigation system that supports both Buyers and Suppliers while keeping the application scalable.

---

# Navigation Principles

The navigation should follow these principles:

* Simple and predictable
* Role-aware
* Mobile-first
* Consistent across the application
* Minimal clicks to complete tasks
* Clear visual hierarchy
* Persistent navigation where appropriate
* Fast access to frequently used actions

---

# Navigation Architecture

```text
                    Landing Page
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
 Marketplace                    Login / Register
        │                                   │
        ▼                                   ▼
 Product Details                    Authentication
                                            │
                                            ▼
                              Check Onboarding Status
                                            │
                       ┌────────────────────┴────────────────────┐
                       ▼                                         ▼
               Buyer Dashboard                        Supplier Dashboard
```

---

# Route Groups

The application contains four route groups.

* Public
* Authentication
* Buyer
* Supplier

---

# Public Routes

These routes are accessible without authentication.

| Route         | Description        |
| ------------- | ------------------ |
| /             | Landing Page       |
| /marketplace  | Marketplace        |
| /products     | Product Listing    |
| /products/:id | Product Details    |
| /categories   | Product Categories |

Users may browse products without logging in.

Actions such as adding to cart or placing orders require authentication.

---

# Authentication Routes

| Route     | Description  |
| --------- | ------------ |
| /login    | Login        |
| /register | Registration |
| /logout   | Logout       |

After successful authentication:

* Check onboarding status.
* Redirect accordingly.

---

# Buyer Routes

Accessible only to authenticated Buyers.

## Dashboard

```text
/buyer
```

---

## Marketplace

```text
/marketplace
```

---

## Product Details

```text
/products/:productId
```

---

## Cart

```text
/cart
```

---

## Checkout

```text
/checkout
```

---

## Orders

```text
/orders
```

---

## Buyer Profile

```text
/profile
```

---

# Supplier Routes

Accessible only to authenticated Suppliers.

## Dashboard

```text
/supplier
```

---

## Inventory

```text
/inventory
```

---

## Add Product

```text
/inventory/new
```

---

## Edit Product

```text
/inventory/:productId/edit
```

---

## Orders

```text
/supplier/orders
```

---

## Supplier Profile

```text
/supplier/profile
```

---

# Onboarding Routes

Users who have not completed onboarding should only have access to onboarding.

## Buyer

```text
/onboarding/buyer
```

---

## Supplier

```text
/onboarding/supplier
```

Attempting to access dashboards before onboarding completion should automatically redirect the user to the appropriate onboarding route.

---

# Public Navigation

Visible to every visitor.

## Desktop Navigation

* Logo
* Marketplace
* Categories
* Search
* Login
* Register

---

## Mobile Navigation

* Logo
* Menu
* Search
* Login
* Register

---

# Buyer Navigation

Primary navigation after login.

## Desktop

* Marketplace
* Categories
* AI Assistant
* Cart
* Orders
* Profile

---

## Mobile

Bottom Navigation

* Home
* Search
* AI
* Cart
* Profile

---

# Supplier Navigation

Primary navigation after login.

## Desktop

* Dashboard
* Inventory
* Orders
* Profile

---

## Mobile

Bottom Navigation

* Dashboard
* Inventory
* Orders
* Profile

---

# Dashboard Navigation

## Buyer Dashboard

Sections

* Overview
* Orders
* Profile

---

## Supplier Dashboard

Sections

* Overview
* Products
* Inventory
* Orders
* Profile

---

# Breadcrumbs

Use breadcrumbs on deeper pages.

Example

```text
Marketplace

↓

Cotton

↓

Premium Cotton

↓

Product Details
```

---

# Navigation Behavior

## Authentication Required

If an unauthenticated user attempts to access:

* Cart
* Checkout
* Dashboard
* Orders
* Inventory

The application should:

```text
Redirect to Login

↓

Authenticate

↓

Return to Requested Page
```

---

# Role Protection

Buyers cannot access supplier routes.

Suppliers cannot access buyer-only routes.

Unauthorized access should redirect to the appropriate dashboard.

---

# Navigation After Login

## Buyer

```text
Login

↓

Check Onboarding

↓

Incomplete

↓

Buyer Onboarding

↓

Marketplace
```

OR

```text
Login

↓

Check Onboarding

↓

Completed

↓

Buyer Dashboard
```

---

## Supplier

```text
Login

↓

Check Onboarding

↓

Incomplete

↓

Supplier Onboarding

↓

Supplier Dashboard
```

OR

```text
Login

↓

Check Onboarding

↓

Completed

↓

Supplier Dashboard
```

---

# Product Navigation

```text
Marketplace

↓

Search

↓

Filters

↓

Product Details

↓

Add to Cart
```

---

# Shopping Navigation

```text
Cart

↓

Checkout

↓

Confirmation

↓

Orders
```

---

# Supplier Product Navigation

```text
Dashboard

↓

Inventory

↓

Product Details

↓

Edit Product
```

---

# AI Navigation

The AI Assistant should be globally accessible throughout the buyer experience.

Entry points include:

* Marketplace
* Product Listing
* Product Details
* Cart

The assistant should open as a floating side panel or modal without forcing users to leave their current page.

---

# Empty State Navigation

When no data exists, provide clear navigation to the next action.

Examples

## No Products

→ Browse Marketplace

---

## Empty Cart

→ Continue Shopping

---

## No Orders

→ Explore Products

---

## No Inventory

→ Add Your First Product

---

# Error Navigation

If a requested resource cannot be found:

* Display a friendly error page.
* Provide navigation back to:

  * Marketplace
  * Dashboard
  * Home

Users should never reach a dead end.

---

# Responsive Navigation

## Desktop

* Horizontal top navigation
* Sidebar for dashboards
* Breadcrumbs
* User menu

---

## Tablet

* Collapsible sidebar
* Responsive header

---

## Mobile

* Bottom navigation
* Slide-out menu
* Floating AI Assistant
* Sticky search bar

---

# Route Guards

The application should implement three route guard types.

## Public Guard

Accessible to everyone.

---

## Auth Guard

Requires authentication.

---

## Role Guard

Requires:

* Buyer role

or

* Supplier role

---

# Future Navigation Expansion

The navigation architecture should support additional modules without structural changes.

Examples

* Wishlist
* Notifications
* Messages
* Reviews
* Analytics
* Settings
* Help Center
* Admin Panel

These can be added as new route groups while preserving the existing navigation hierarchy.
