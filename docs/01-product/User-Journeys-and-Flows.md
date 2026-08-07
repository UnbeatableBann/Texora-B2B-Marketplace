# User Flows & User Journey

# Purpose

This document defines the complete user journeys for every major workflow in the Textile Marketplace.

It serves as the primary reference for:

* UX Design
* Frontend Implementation
* Backend APIs
* Navigation
* Authentication
* AI Integration
* Marketplace Personalization

Every feature should fit into one of the journeys defined in this document.

---

# Marketplace User Types

The marketplace supports two primary personas:

* Buyer
* Supplier

Although both share the same backend, their journeys diverge immediately after authentication.

---

# Marketplace Entry Flow

```text
                    Landing Page
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
 Browse Marketplace                  Login/Register
        │                                 │
        │                                 ▼
        │                      Select Buyer/Supplier
        │                                 │
        │                                 ▼
        │                      Complete Authentication
        │                                 │
        │                                 ▼
        │                     Check Onboarding Status
        │                                 │
        └──────────────┬──────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
 Buyer Onboarding             Supplier Onboarding
        │                             │
        ▼                             ▼
 Buyer Dashboard              Supplier Dashboard
```

---

# Buyer Journey

## Goal

Help buyers discover, evaluate, and purchase fabrics with minimal effort.

---

## Complete Buyer Journey

```text
Landing Page
      │
      ▼
Browse Marketplace
      │
      ▼
Search / Filter Products
      │
      ▼
View Product Details
      │
      ▼
Register / Login
      │
      ▼
Buyer Onboarding
      │
      ▼
Personalized Marketplace
      │
      ▼
Search Products
      │
      ▼
(Optional) AI Assistant
      │
      ▼
View Product
      │
      ▼
Add to Cart
      │
      ▼
Checkout
      │
      ▼
Order Confirmation
      │
      ▼
Buyer Dashboard
      │
      ▼
Track Order
```

---

# Buyer Flow 1 — Browse Marketplace

## Objective

Allow visitors and buyers to explore available products.

### Journey

```text
Landing Page
      │
      ▼
Marketplace
      │
      ▼
Browse Categories
      │
      ▼
Browse Products
      │
      ▼
View Product
```

---

# Buyer Flow 2 — Search Products

Users can search using:

* Keyword Search
* Category Search
* Filters
* AI Search

### Journey

```text
Marketplace
      │
      ▼
Enter Search Query
      │
      ▼
Apply Filters
      │
      ▼
View Results
      │
      ▼
Open Product
```

---

# Buyer Flow 3 — AI Search

Natural language search.

Example

> Show premium cotton fabrics suitable for school uniforms under ₹200.

### Journey

```text
Open AI Assistant
      │
      ▼
Describe Requirement
      │
      ▼
AI Understands Intent
      │
      ▼
Marketplace Search
      │
      ▼
Relevant Products
      │
      ▼
Product Details
```

---

# Buyer Flow 4 — Product Discovery

```text
Product Listing
      │
      ▼
Product Details
      │
      ▼
Compare Products
      │
      ▼
View Similar Products
      │
      ▼
AI Product Questions
      │
      ▼
Decision
```

---

# Buyer Flow 5 — Shopping Cart

```text
Product Page
      │
      ▼
Add to Cart
      │
      ▼
Cart
      │
      ▼
Update Quantity
      │
      ▼
Review Order
```

---

# Buyer Flow 6 — Checkout

```text
Cart
      │
      ▼
Shipping Information
      │
      ▼
Order Summary
      │
      ▼
Review Order
      │
      ▼
Place Order
      │
      ▼
Order Confirmation
```

---

# Buyer Flow 7 — Order Tracking

```text
Buyer Dashboard
      │
      ▼
Orders
      │
      ▼
Order Details
      │
      ▼
Track Status
```

Supported statuses:

* Pending
* Accepted
* Preparing
* Ready for Dispatch
* Completed

---

# Buyer Flow 8 — Profile Management

```text
Buyer Dashboard
      │
      ▼
Profile
      │
      ▼
Edit Information
      │
      ▼
Save Changes
```

---

# Buyer Decision Journey

```text
Need Fabric
      │
      ▼
Search
      │
      ▼
Filter
      │
      ▼
Compare
      │
      ▼
Ask AI
      │
      ▼
Choose Product
      │
      ▼
Purchase
```

---

# Supplier Journey

## Goal

Help suppliers manage products and fulfill orders efficiently.

---

# Complete Supplier Journey

```text
Register
      │
      ▼
Supplier Onboarding
      │
      ▼
Supplier Dashboard
      │
      ▼
Complete Business Profile
      │
      ▼
Add Products
      │
      ▼
Manage Inventory
      │
      ▼
Receive Orders
      │
      ▼
Update Order Status
      │
      ▼
Maintain Catalog
```

---

# Supplier Flow 1 — Product Setup

```text
Supplier Dashboard
      │
      ▼
Inventory
      │
      ▼
Add Product
      │
      ▼
Upload Images
      │
      ▼
Publish Product
```

---

# Supplier Flow 2 — Inventory Management

```text
Inventory
      │
      ▼
View Products
      │
      ▼
Update Product
      │
      ▼
Update Inventory
      │
      ▼
Save
```

---

# Supplier Flow 3 — Order Processing

```text
Supplier Dashboard
      │
      ▼
Incoming Orders
      │
      ▼
View Order
      │
      ▼
Accept Order
      │
      ▼
Preparing
      │
      ▼
Ready for Dispatch
      │
      ▼
Completed
```

Buyer order status updates automatically after every supplier action.

---

# Supplier Flow 4 — Supplier Profile

```text
Supplier Dashboard
      │
      ▼
Business Profile
      │
      ▼
Edit Information
      │
      ▼
Save Changes
```

---

# Supplier Operational Journey

```text
Start Day
      │
      ▼
View Dashboard
      │
      ▼
Review Orders
      │
      ▼
Update Inventory
      │
      ▼
Add New Products
      │
      ▼
Complete Pending Orders
```

---

# Authentication Journey

```text
Landing Page
      │
      ▼
Login / Register
      │
      ▼
Select Role
      │
      ▼
Create Account
      │
      ▼
Authenticate
      │
      ▼
Check Onboarding Status
      │
      ▼
Redirect
```

---

# Buyer Onboarding Journey

```text
Create Account
      │
      ▼
Business Type
      │
      ▼
Industry
      │
      ▼
Preferred Categories
      │
      ▼
Preferred Fabrics
      │
      ▼
Budget
      │
      ▼
Typical Order Quantity
      │
      ▼
Generate Personalization Profile
      │
      ▼
Buyer Dashboard
```

---

# Supplier Onboarding Journey

```text
Create Account
      │
      ▼
Business Name
      │
      ▼
Business Type
      │
      ▼
Contact Information
      │
      ▼
Address
      │
      ▼
Product Categories
      │
      ▼
MOQ
      │
      ▼
Supplier Dashboard
```

---

# AI Assistant Journey

The AI assistant should be accessible throughout the buyer experience.

```text
User Needs Help
      │
      ▼
Open AI Assistant
      │
      ▼
Ask Question
      │
      ▼
AI Understands Context
      │
      ▼
Marketplace Search
      │
      ▼
Generate Response
      │
      ▼
Recommended Products
```

The AI should maintain context using:

* Buyer onboarding preferences
* Current conversation
* Marketplace data
* Product catalog

---

# Personalization Journey

```text
User Completes Onboarding
            │
            ▼
Generate Preference Profile
            │
            ▼
Personalize Homepage
            │
            ▼
Personalize Search
            │
            ▼
Personalize AI
            │
            ▼
Recommend Products
```

As the user continues using the marketplace, behavioral signals (searches, viewed products, and orders) gradually refine personalization.

---

# Cross-Module Journey

The marketplace modules are connected as follows:

```text
Authentication
        │
        ▼
Onboarding
        │
        ▼
Marketplace
        │
        ▼
Product Discovery
        │
        ▼
AI Assistant
        │
        ▼
Shopping Cart
        │
        ▼
Checkout
        │
        ▼
Order Management
        │
        ▼
Buyer Dashboard
        │
        ▼
Supplier Dashboard
```

Every module contributes to a single continuous marketplace experience rather than operating as isolated features.

---

# User Journey Principles

All user journeys should follow these principles:

* Minimize the number of steps required to complete a task.
* Provide clear feedback after every user action.
* Keep navigation consistent across the application.
* Preserve user context when moving between pages.
* Ensure AI enhances workflows without replacing traditional navigation.
* Make every major workflow accessible on desktop, tablet, and mobile devices.
* Design every journey so it can evolve into a production-ready marketplace without requiring significant structural changes.
