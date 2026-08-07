# Supplier Dashboard Feature Specification

# Purpose

The Supplier Dashboard serves as the central workspace for suppliers to manage their business on the Textile Marketplace.

It provides a consolidated view of business performance, inventory, products, incoming orders, and operational insights, allowing suppliers to efficiently manage day-to-day marketplace activities from a single location.

Unlike the Buyer Dashboard, which focuses on shopping, the Supplier Dashboard focuses on business operations.

---

# Goals

The Supplier Dashboard should:

* Provide a complete business overview.
* Surface actionable information.
* Simplify inventory management.
* Simplify order management.
* Highlight operational issues.
* Reduce navigation between supplier features.
* Scale as supplier capabilities grow.

---

# Scope

## Included

* Business Overview
* Product Summary
* Inventory Summary
* Incoming Orders
* Recent Orders
* Low Stock Alerts
* Quick Actions
* Business Profile Summary

---

## Excluded

* Product Creation
* Inventory Editing
* Order Processing
* Buyer Marketplace
* AI Recommendation Generation

---

# Primary Users

## Supplier

Authenticated suppliers who have completed onboarding can:

* Monitor business
* Access inventory
* Manage products
* View orders
* Update order status

---

## Buyer

Cannot access the Supplier Dashboard.

---

## Guest

Cannot access the Supplier Dashboard.

---

# Dependencies

Supplier Dashboard depends on:

* Authentication
* Supplier Onboarding
* Products
* Inventory
* Orders
* Supplier Profile

Supplier Dashboard interacts with:

* Product Management
* Inventory Management
* Orders
* Supplier Profile
* AI Assistant

---

# Feature Overview

The Supplier Dashboard is the supplier's landing page after login.

It should provide immediate visibility into business operations, enabling suppliers to quickly identify pending work and navigate to relevant management features.

The dashboard should prioritize operational efficiency over analytics.

---

# Dashboard Layout

```text
Supplier Dashboard

│

├── Welcome Banner

├── Quick Actions

├── Business Summary

├── Product Summary

├── Inventory Summary

├── Incoming Orders

├── Recent Orders

├── Low Stock Alerts

├── Business Profile

└── AI Assistant
```

---

# User Journey

```text
Supplier Login

↓

Authentication

↓

Supplier Dashboard

↓

Review Pending Orders

↓

Update Inventory

↓

Manage Products

↓

Process Orders

↓

Return Dashboard
```

---

# Functional Requirements

## Welcome Section

Display:

* Supplier Name
* Business Name
* Greeting

Example

```text
Welcome back, ABC Textiles.

You have 5 pending orders awaiting action.
```

---

## Quick Actions

Provide shortcuts to:

* Add Product
* Manage Products
* Inventory
* Orders
* Business Profile
* AI Assistant

These actions should always be accessible.

---

## Business Summary

Display key business metrics.

Prototype metrics:

* Total Products
* Published Products
* Active Orders
* Low Stock Products

Future metrics:

* Revenue
* Sales
* Conversion Rate

---

## Product Summary

Display:

* Total Products
* Draft Products
* Published Products
* Archived Products

Provide shortcut to Product Management.

---

## Inventory Summary

Display:

* In Stock Products
* Low Stock Products
* Out of Stock Products

Selecting a metric opens Inventory Management.

---

## Incoming Orders

Display:

* Order Number
* Buyer
* Status
* Total
* Order Date

Orders should be sorted by newest first.

Selecting an order opens Order Details.

---

## Recent Orders

Display recently completed orders.

Purpose:

Allow suppliers to review recent business activity.

---

## Low Stock Alerts

Display products approaching stock depletion.

Each alert includes:

* Product Name
* Current Stock
* Recommended Action

Provide shortcut to update inventory.

---

## Business Profile Summary

Display:

* Business Name
* Business Type
* Categories
* Location

Provide shortcut to edit Supplier Profile.

---

# Dashboard States

## New Supplier

Display:

* Welcome message
* Complete onboarding prompt (if applicable)
* Add First Product shortcut

---

## Active Supplier

Display:

* Pending Orders
* Inventory Summary
* Product Summary
* Low Stock Alerts

---

## Established Supplier

Prioritize:

* Orders
* Inventory
* Operational insights

---

# Feature Interactions

## Authentication

Authentication controls dashboard access.

Only authenticated suppliers may access this feature.

---

## Supplier Onboarding

Supplier onboarding provides:

* Business Information
* Categories
* Profile Data

Incomplete onboarding redirects the supplier to onboarding.

---

## Product Management

Dashboard displays product statistics.

Quick actions navigate directly to Product Management.

---

## Inventory Management

Dashboard displays:

* Inventory Summary
* Low Stock Alerts

Selecting inventory widgets opens Inventory Management.

---

## Orders

Dashboard displays:

* Incoming Orders
* Active Orders
* Recent Orders

Status updates are reflected automatically.

---

## Supplier Profile

Profile information displayed on the dashboard should update immediately after profile edits.

---

## AI Assistant

The AI Assistant may help suppliers by answering operational questions such as:

* Which products are running low?
* Show my pending orders.
* Which products should I restock first?

The AI receives dashboard context but cannot modify supplier data.

---

# Database Interaction

Reads:

* supplier_profiles
* products
* inventory
* orders
* order_items

Writes:

* Dashboard activity logs (future)

The Supplier Dashboard should primarily perform read operations.

---

# API Endpoints

## Supplier Dashboard

```http
GET /api/v1/dashboard/supplier
```

Returns:

* Business Summary
* Product Summary
* Inventory Summary
* Incoming Orders
* Recent Orders
* Low Stock Alerts

---

## Supplier Profile

```http
GET /api/v1/suppliers/profile
```

---

## Inventory Summary

```http
GET /api/v1/inventory/products
```

---

## Supplier Orders

```http
GET /api/v1/supplier/orders
```

---

# UI Components

Supplier Dashboard consists of:

* Welcome Banner
* Quick Action Cards
* Business Metrics Cards
* Product Summary Cards
* Inventory Summary Cards
* Incoming Orders Table
* Recent Orders Table
* Low Stock Alert Cards
* Business Profile Card
* Floating AI Assistant

---

# States

## Loading

Display skeleton placeholders.

---

## Empty

If the supplier has:

No Products

Display:

"Create your first product."

No Orders

Display:

"No orders yet."

No Inventory Alerts

Display:

"Everything looks good."

---

## Error

Display friendly error message.

Allow retry.

---

# Validation Rules

Dashboard should:

* Display only supplier-owned information.
* Hide buyer-specific features.
* Gracefully handle missing operational data.

---

# Error Handling

Handle:

* Orders unavailable.
* Inventory unavailable.
* Profile unavailable.
* Network interruption.
* Partial API failures.

The dashboard should continue functioning even if one section fails.

---

# Edge Cases

* Supplier has no products.
* Supplier has no inventory.
* Supplier has no orders.
* Product archived while dashboard is open.
* Inventory changes during dashboard session.
* Order status updated from another session.
* Supplier refreshes during dashboard loading.
* Large product catalogs requiring pagination in linked modules.

---

# Security Considerations

* Suppliers may access only their own dashboard.
* Buyers and guests must never access supplier dashboards.
* Business information must belong to the authenticated supplier.
* Dashboard APIs must validate ownership before returning data.
* Sensitive operational information should never be exposed publicly.

---

# Responsive Behaviour

Desktop

* Multi-column dashboard
* Summary cards
* Side-by-side tables

Tablet

* Responsive cards
* Two-column sections

Mobile

* Single-column layout
* Horizontal metric cards
* Expandable order list
* Sticky quick actions
* Floating AI Assistant

---

# Performance Requirements

* Dashboard loads within 2 seconds under normal conditions.
* Dashboard API should aggregate required data into a single response.
* Inventory alerts should load with the dashboard.
* Images and non-critical assets should be lazy-loaded.
* Frequently requested dashboard summaries may be cached.

---

# Acceptance Criteria

## Dashboard

* Supplier Dashboard loads successfully after login.
* Only authenticated suppliers can access it.
* Buyers cannot access Supplier Dashboard.

---

## Business Summary

* Product totals are displayed correctly.
* Inventory totals are displayed correctly.
* Active order count is accurate.

---

## Quick Actions

* Add Product navigation works.
* Manage Products navigation works.
* Inventory navigation works.
* Orders navigation works.
* Profile navigation works.
* AI Assistant shortcut works.

---

## Orders

* Incoming orders are displayed.
* Recent orders are displayed.
* Selecting an order opens Order Details.
* Order status updates are reflected automatically.

---

## Inventory

* Low stock alerts are displayed correctly.
* Inventory summaries match actual inventory.
* Selecting an inventory alert opens Inventory Management.

---

## Product Summary

* Product statistics are accurate.
* Published, Draft, and Archived products are counted correctly.

---

## Profile Summary

* Supplier business information is displayed.
* Edit Profile navigation works.

---

## Reliability

* Dashboard remains functional if one section fails.
* Empty states provide meaningful guidance.
* Operational data reflects current marketplace state.

---

# Future Enhancements

The Supplier Dashboard architecture should support:

* Revenue Analytics
* Sales Trends
* Product Performance Analytics
* Customer Insights
* Export Reports
* Inventory Forecasting
* Restock Suggestions
* AI Business Assistant
* Notification Center
* Warehouse Overview
* Team Activity
* Multi-Store Management
* Business Health Score
* Custom Dashboard Widgets

These enhancements should integrate without changing the existing dashboard architecture.

---

# Out of Scope

The Supplier Dashboard feature intentionally does not manage:

* Authentication
* Supplier onboarding
* Product creation
* Inventory editing
* Order processing
* Payment management
* Recommendation algorithms
* Marketplace browsing

Its responsibility is limited to providing suppliers with a centralized operational workspace that summarizes business activity, surfaces actionable information, and offers efficient access to the core supplier management features.
