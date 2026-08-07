# Database Design Specification 

# Purpose

This document defines the database architecture for the Textile Marketplace.

The goal is to create a normalized, scalable, and production-ready relational database that supports every feature required by the marketplace while remaining simple enough for the hackathon prototype.

The database serves as the single source of truth for:

* Authentication
* User Profiles
* Buyer Preferences
* Supplier Information
* Marketplace
* Products
* Inventory
* Shopping Cart
* Orders
* AI Personalization

---

# Database Goals

The database should:

* Store structured business data
* Support fast product discovery
* Support buyer and supplier workflows
* Maintain data integrity
* Prevent duplicate information
* Scale with future features
* Support AI personalization
* Support secure authentication

---

# Database Technology

## Database Engine

PostgreSQL 17+

---

## ORM

SQLAlchemy 2.0

---

## Migration Tool

Alembic

---

## Database Hosting

Prototype

Neon PostgreSQL

Production Upgrade

* Self-hosted PostgreSQL
* AWS RDS
* Google Cloud SQL

---

# Database Architecture

```text
React

↓

FastAPI

↓

SQLAlchemy

↓

PostgreSQL
```

The frontend never communicates directly with the database.

All database operations must pass through the backend.

---

# Database Access

Only the backend application may communicate with PostgreSQL.

```text
React
    ✗

FastAPI
    ✓

Database
```

---

# Database Responsibilities

The database is responsible for storing:

* Users
* Buyer Profiles
* Supplier Profiles
* Categories
* Products
* Product Images
* Inventory
* Cart
* Orders
* AI Metadata

The database is NOT responsible for:

* Business Logic
* Authentication Logic
* AI Processing
* Recommendation Algorithms

These belong in the application layer.

---

# Database Design Principles

* Third Normal Form (3NF)
* UUID Primary Keys
* Foreign Key Constraints
* Soft Deletes where appropriate
* Created/Updated timestamps
* Audit-friendly design
* Clear ownership between entities

---

# Naming Convention

## Tables

Plural snake_case

Example

```text
users

products

orders
```

---

## Columns

snake_case

Example

```text
business_name

created_at

updated_at
```

---

## Primary Keys

```text
id UUID
```

---

## Foreign Keys

```text
user_id

buyer_id

supplier_id

product_id
```

---

# Common Fields

Every major table should include:

| Field      | Type      | Purpose         |
| ---------- | --------- | --------------- |
| id         | UUID      | Primary Key     |
| created_at | Timestamp | Record creation |
| updated_at | Timestamp | Last update     |

Soft-deletable tables should also include:

| Field      | Type                 |
| ---------- | -------------------- |
| deleted_at | Timestamp (Nullable) |

---

# Entity Relationship Overview

```text
Users
│
├── Buyer Profile
│
├── Supplier Profile
│
├── Cart
│
├── Orders
│
└── AI Conversations

Supplier
│
├── Products
│
└── Orders

Products
│
├── Category
├── Images
├── Cart Items
└── Order Items
```

---

# Table 1 — Users

## Purpose

Stores authentication information.

Every person using the marketplace has exactly one User record.

---

## Used By

* Authentication
* Authorization
* Profile
* Buyer
* Supplier

---

## Fields

| Field                | Type      | Required | Description               |
| -------------------- | --------- | -------- | ------------------------- |
| id                   | UUID      | Yes      | Primary Key               |
| full_name            | VARCHAR   | Yes      | User's full name          |
| email                | VARCHAR   | Yes      | Unique email              |
| password_hash        | TEXT      | Yes      | Hashed password           |
| role                 | ENUM      | Yes      | BUYER / SUPPLIER          |
| onboarding_completed | BOOLEAN   | Yes      | Profile completion status |
| last_login_at        | TIMESTAMP | No       | Last successful login     |
| created_at           | TIMESTAMP | Yes      | Creation time             |
| updated_at           | TIMESTAMP | Yes      | Last update               |

---

## Constraints

* Email must be unique.
* Password stored only as hash.
* One role per account.

---

## Access

Buyer

Own account only.

Supplier

Own account only.

Admin

Future feature.

---

# Table 2 — Buyer Profiles

## Purpose

Stores buyer business information collected during onboarding.

---

## Relationship

```text
Users

1

↓

1

Buyer Profile
```

---

## Fields

| Field                  | Type      |
| ---------------------- | --------- |
| id                     | UUID      |
| user_id                | UUID      |
| business_type          | VARCHAR   |
| industry               | VARCHAR   |
| preferred_budget       | VARCHAR   |
| typical_order_quantity | VARCHAR   |
| additional_preferences | TEXT      |
| created_at             | TIMESTAMP |
| updated_at             | TIMESTAMP |

---

## Used For

* Homepage personalization
* AI context
* Recommendations
* Search ranking

---

## Access

Buyer

Own profile.

Backend

Full access.

---

# Table 3 — Buyer Preferred Categories

## Purpose

Stores multiple product category interests.

One buyer can select multiple categories.

---

## Relationship

```text
Buyer

↓

Buyer Preferred Categories

↓

Category
```

---

## Fields

| Field            | Type |
| ---------------- | ---- |
| id               | UUID |
| buyer_profile_id | UUID |
| category_id      | UUID |

---

## Used For

* Homepage
* Recommendations
* Search

---

# Table 4 — Buyer Preferred Fabrics

## Purpose

Stores buyer fabric interests.

Examples

* Cotton

* Linen

* Denim

* Silk

---

## Fields

| Field            | Type    |
| ---------------- | ------- |
| id               | UUID    |
| buyer_profile_id | UUID    |
| fabric_name      | VARCHAR |

---

## Used For

* AI
* Recommendations
* Homepage

---

# Table 5 — Supplier Profiles

## Purpose

Stores supplier business information.

---

## Relationship

```text
Users

↓

Supplier Profile
```

---

## Fields

| Field                  | Type      |
| ---------------------- | --------- |
| id                     | UUID      |
| user_id                | UUID      |
| business_name          | VARCHAR   |
| business_type          | VARCHAR   |
| phone                  | VARCHAR   |
| email                  | VARCHAR   |
| address                | TEXT      |
| city                   | VARCHAR   |
| state                  | VARCHAR   |
| country                | VARCHAR   |
| operating_hours        | VARCHAR   |
| minimum_order_quantity | INTEGER   |
| additional_information | TEXT      |
| created_at             | TIMESTAMP |
| updated_at             | TIMESTAMP |

---

## Used For

* Supplier Profile
* Product Ownership
* Buyer Discovery

---

# Table 6 — Supplier Categories

## Purpose

Stores categories a supplier specializes in.

---

## Fields

| Field               | Type |
| ------------------- | ---- |
| id                  | UUID |
| supplier_profile_id | UUID |
| category_id         | UUID |

---

# Table 7 — Categories

## Purpose

Master list of marketplace product categories.

Examples

* Cotton

* Linen

* Denim

* Silk

* Polyester

---

## Fields

| Field       | Type      |
| ----------- | --------- |
| id          | UUID      |
| name        | VARCHAR   |
| slug        | VARCHAR   |
| description | TEXT      |
| created_at  | TIMESTAMP |
| updated_at  | TIMESTAMP |

---

## Used By

* Products
* Search
* Filters
* Navigation
* Recommendations

---

# Table 8 — Products

## Purpose

Stores all marketplace products.

This is the central business table.

---

## Relationship

```text
Supplier

↓

Products

↓

Orders

↓

Cart
```

---

## Fields

| Field             | Type      |
| ----------------- | --------- |
| id                | UUID      |
| supplier_id       | UUID      |
| category_id       | UUID      |
| name              | VARCHAR   |
| slug              | VARCHAR   |
| short_description | TEXT      |
| description       | TEXT      |
| price             | DECIMAL   |
| available_stock   | INTEGER   |
| available_colors  | JSON      |
| specifications    | JSON      |
| status            | ENUM      |
| created_at        | TIMESTAMP |
| updated_at        | TIMESTAMP |

---

## Status

* ACTIVE

* OUT_OF_STOCK

* DRAFT

* ARCHIVED

---

## Used For

* Marketplace
* Search
* AI
* Recommendations
* Cart
* Orders

---

# Table 9 — Product Images

## Purpose

Stores product image metadata.

Images themselves remain in local storage (prototype) or object storage (future).

---

## Fields

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| product_id    | UUID      |
| image_url     | TEXT      |
| display_order | INTEGER   |
| is_primary    | BOOLEAN   |
| created_at    | TIMESTAMP |

---

## Relationship

```text
Product

↓

Multiple Images
```

---

# Table 10 — Inventory History

## Purpose

Tracks inventory changes.

Useful for future analytics and auditing.

---

## Fields

| Field             | Type      |
| ----------------- | --------- |
| id                | UUID      |
| product_id        | UUID      |
| previous_quantity | INTEGER   |
| new_quantity      | INTEGER   |
| reason            | VARCHAR   |
| updated_by        | UUID      |
| created_at        | TIMESTAMP |

---

## Example Reasons

* Product Added

* Stock Updated

* Order Placed

* Manual Adjustment

---

# Database Access Rules

## Buyer

Can access:

* Own Profile
* Own Cart
* Own Orders

Cannot access:

* Supplier Inventory
* Other Buyers
* Internal AI Metadata

---

## Supplier

Can access:

* Own Products
* Own Orders
* Own Inventory

Cannot access:

* Buyer Profiles
* Other Supplier Data

---

## Backend

Has complete read/write access through the application layer.

No client application should ever receive unrestricted database access.

---

# Database Flow

```text
React

↓

API Request

↓

Authentication

↓

Service Layer

↓

Repository

↓

PostgreSQL

↓

Repository

↓

Service

↓

API Response

↓

React
```

---

# Common Database Operations

## Buyer Registration

```text
Create User

↓

Create Buyer Profile

↓

Save Preferences

↓

Complete Onboarding
```

---

## Supplier Registration

```text
Create User

↓

Create Supplier Profile

↓

Save Categories

↓

Marketplace Ready
```

---

## Product Creation

```text
Supplier

↓

Create Product

↓

Save Images

↓

Publish Product
```

---

## Product Purchase

```text
Buyer

↓

Cart

↓

Checkout

↓

Order

↓

Reduce Inventory
```

---

# Edge Cases

The database design should safely handle:

* Duplicate email registration.
* Deleting a product that exists in previous orders (archive instead of hard delete).
* Supplier updating inventory while a buyer is checking out.
* Buyer refreshing the page during checkout.
* Product becoming out of stock before order confirmation.
* Multiple buyers attempting to purchase the last available inventory simultaneously.
* Category deletion when products are still assigned.
* Supplier account deactivation while products remain in historical orders.

These scenarios should preserve referential integrity and prevent data corruption.

---

# Table 11 — Shopping Carts

## Purpose

Stores the active shopping cart for each buyer.

A buyer can only have one active cart at a time.

---

## Relationship

```text
Buyer
    │
    ▼
Shopping Cart
```

---

## Fields

| Field      | Type      | Description                    |
| ---------- | --------- | ------------------------------ |
| id         | UUID      | Primary Key                    |
| buyer_id   | UUID      | Buyer Profile                  |
| status     | ENUM      | ACTIVE, CHECKED_OUT, ABANDONED |
| created_at | TIMESTAMP | Creation Time                  |
| updated_at | TIMESTAMP | Last Updated                   |

---

## Business Rules

* One active cart per buyer.
* Cart cannot exist without a buyer.
* Cart is converted into an Order during checkout.
* Checked-out carts become read-only.

---

# Table 12 — Cart Items

## Purpose

Stores products inside a shopping cart.

---

## Relationship

```text
Cart

↓

Cart Items

↓

Product
```

---

## Fields

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| cart_id    | UUID      |
| product_id | UUID      |
| quantity   | INTEGER   |
| unit_price | DECIMAL   |
| subtotal   | DECIMAL   |
| created_at | TIMESTAMP |

---

## Business Rules

* Quantity must be greater than zero.
* Product must exist.
* Product must be active.
* Quantity cannot exceed available stock.

---

# Table 13 — Orders

## Purpose

Represents a completed checkout.

An order is immutable except for its status.

---

## Relationship

```text
Buyer

↓

Orders

↓

Supplier
```

---

## Fields

| Field            | Type      |
| ---------------- | --------- |
| id               | UUID      |
| buyer_id         | UUID      |
| supplier_id      | UUID      |
| order_number     | VARCHAR   |
| subtotal         | DECIMAL   |
| total            | DECIMAL   |
| status           | ENUM      |
| shipping_address | TEXT      |
| notes            | TEXT      |
| placed_at        | TIMESTAMP |
| updated_at       | TIMESTAMP |

---

## Order Status

* Pending
* Accepted
* Preparing
* Ready for Dispatch
* Completed

---

## Used By

* Buyer Dashboard
* Supplier Dashboard
* Order Tracking
* Analytics

---

## Business Rules

* Order numbers must be unique.
* Orders cannot be deleted.
* Order totals remain unchanged after creation.

---

# Table 14 — Order Items

## Purpose

Stores every product purchased within an order.

---

## Relationship

```text
Order

↓

Order Items

↓

Product
```

---

## Fields

| Field        | Type    |
| ------------ | ------- |
| id           | UUID    |
| order_id     | UUID    |
| product_id   | UUID    |
| product_name | VARCHAR |
| quantity     | INTEGER |
| unit_price   | DECIMAL |
| subtotal     | DECIMAL |

---

## Business Rules

Product information should be copied at purchase time.

Future product edits must never modify historical orders.

---

# Table 15 — Shipping Information

## Purpose

Stores shipping details captured during checkout.

Separated from Orders to support future logistics expansion.

---

## Fields

| Field          | Type    |
| -------------- | ------- |
| id             | UUID    |
| order_id       | UUID    |
| recipient_name | VARCHAR |
| phone          | VARCHAR |
| address_line_1 | VARCHAR |
| address_line_2 | VARCHAR |
| city           | VARCHAR |
| state          | VARCHAR |
| postal_code    | VARCHAR |
| country        | VARCHAR |

---

## Used By

* Checkout
* Order Details

---

# Table 16 — AI Conversations

## Purpose

Stores AI conversation history for contextual assistance.

---

## Fields

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| user_id    | UUID      |
| session_id | UUID      |
| role       | ENUM      |
| message    | TEXT      |
| created_at | TIMESTAMP |

---

## Roles

* User
* Assistant

---

## Used By

* AI Assistant
* Conversation History

---

# Table 17 — AI Recommendations

## Purpose

Stores AI-generated recommendations for future analysis and personalization.

---

## Fields

| Field                  | Type      |
| ---------------------- | --------- |
| id                     | UUID      |
| user_id                | UUID      |
| recommendation_type    | VARCHAR   |
| recommended_product_id | UUID      |
| confidence_score       | DECIMAL   |
| created_at             | TIMESTAMP |

---

## Recommendation Types

* Homepage
* Similar Product
* AI Search
* Product Recommendation

---

# Table 18 — Search History

## Purpose

Stores marketplace search activity.

---

## Fields

| Field       | Type      |
| ----------- | --------- |
| id          | UUID      |
| user_id     | UUID      |
| search_type | ENUM      |
| query       | TEXT      |
| created_at  | TIMESTAMP |

---

## Search Types

* Keyword
* AI
* Filter

---

## Used For

* Personalization
* Search Suggestions
* Future Analytics

---

# Table 19 — Activity Logs

## Purpose

Tracks important user activities.

---

## Fields

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| user_id       | UUID      |
| activity_type | VARCHAR   |
| metadata      | JSONB     |
| created_at    | TIMESTAMP |

---

## Example Activities

* Login
* Product Viewed
* Product Added to Cart
* Checkout Started
* Order Placed
* Product Created
* Inventory Updated

---

# Database Transactions

The following operations must execute within a database transaction.

## Buyer Registration

```text
Create User

↓

Create Buyer Profile

↓

Save Preferences

↓

Commit
```

---

## Supplier Registration

```text
Create User

↓

Create Supplier Profile

↓

Save Categories

↓

Commit
```

---

## Checkout

```text
Validate Stock

↓

Create Order

↓

Create Order Items

↓

Create Shipping

↓

Reduce Inventory

↓

Update Cart

↓

Commit
```

If any step fails:

```text
Rollback Transaction
```

---

# Database Constraints

## Unique Constraints

Users

* Email

Orders

* Order Number

Categories

* Slug

Products

* Slug

---

## Foreign Keys

Users

↓

Buyer Profile

Users

↓

Supplier Profile

Supplier

↓

Products

Products

↓

Images

Buyer

↓

Cart

Cart

↓

Cart Items

Orders

↓

Order Items

Orders

↓

Shipping

---

## Check Constraints

Price

```text
Price >= 0
```

Stock

```text
Stock >= 0
```

Quantity

```text
Quantity > 0
```

MOQ

```text
MOQ > 0
```

---

# Indexing Strategy

Indexes should be created for frequently queried columns.

## Users

* email
* role

---

## Products

* category_id
* supplier_id
* status
* price

---

## Orders

* buyer_id
* supplier_id
* status
* placed_at

---

## Search

* product_name
* slug
* category

---

# Database Access Matrix

| Table             | Buyer | Supplier   | Backend |
| ----------------- | ----- | ---------- | ------- |
| Users             | Own   | Own        | Full    |
| Buyer Profiles    | Own   | No         | Full    |
| Supplier Profiles | Read  | Own        | Full    |
| Products          | Read  | Own        | Full    |
| Product Images    | Read  | Own        | Full    |
| Cart              | Own   | No         | Full    |
| Cart Items        | Own   | No         | Full    |
| Orders            | Own   | Own Orders | Full    |
| Shipping          | Own   | Own Orders | Full    |
| AI Conversations  | Own   | Own        | Full    |

---

# Data Lifecycle

## User

```text
Register

↓

Onboarding

↓

Marketplace Activity

↓

Inactive

↓

Archived (Future)
```

---

## Product

```text
Draft

↓

Active

↓

Out Of Stock

↓

Archived
```

---

## Order

```text
Pending

↓

Accepted

↓

Preparing

↓

Ready For Dispatch

↓

Completed
```

Orders should never be deleted.

---

# Security

Sensitive data includes:

* Password Hash
* JWT Secrets
* Personal Information

Passwords must never be stored in plain text.

Only backend services may access database credentials.

Parameterized queries (via SQLAlchemy ORM) must be used to prevent SQL injection.

---

# Backup Strategy

Prototype

* Managed by Neon PostgreSQL.

Production

* Daily automated backups.
* Point-in-time recovery.
* Multi-region backup.
* Backup validation.

---

# Performance Guidelines

The database should support:

* Efficient pagination.
* Indexed search.
* Lazy loading where appropriate.
* Optimized joins.
* Batch inserts for images.
* Query optimization through indexes.

Avoid unnecessary full-table scans.

---

# Edge Cases

The database must safely handle:

## Authentication

* Duplicate registration.
* Invalid role assignment.

---

## Marketplace

* Category deletion while products exist.
* Supplier deletion with active products.

---

## Inventory

* Stock reduced below zero.
* Concurrent inventory updates.

---

## Shopping Cart

* Duplicate products added.
* Product removed after being added to cart.
* Product price changes while in cart.

---

## Checkout

* Product becomes unavailable during checkout.
* Stock changes before order confirmation.
* Partial order creation.
* Payment step omitted (prototype).

---

## Orders

* Supplier updates completed order.
* Buyer attempts to modify an order.
* Historical product changes affecting past orders.

---

# Database Scalability

The schema is designed to support future modules without major restructuring.

Future additions may include:

* Wishlist
* Notifications
* Reviews
* Supplier Ratings
* Messaging
* Coupons
* Bulk Orders
* Multi-Warehouse Inventory
* Shipment Tracking
* Admin Dashboard
* Audit Logs
* Analytics
* AI Embeddings
* Vector Search
* Multi-language Content

These can be introduced through additional tables while preserving existing relationships.

---

# Complete Entity Relationship Overview

```text
Users
│
├── Buyer Profile
│      ├── Preferred Categories
│      ├── Preferred Fabrics
│      ├── Shopping Cart
│      │      └── Cart Items
│      ├── Orders
│      │      ├── Order Items
│      │      └── Shipping Information
│      ├── Search History
│      ├── AI Conversations
│      ├── AI Recommendations
│      └── Activity Logs
│
└── Supplier Profile
       ├── Categories
       ├── Products
       │      ├── Product Images
       │      └── Inventory History
       └── Orders

Products
│
├── Categories
├── Product Images
├── Cart Items
└── Order Items
```

---

# Database Summary

The database consists of the following core entities:

### User Management

* Users
* Buyer Profiles
* Supplier Profiles
* Buyer Preferred Categories
* Buyer Preferred Fabrics
* Supplier Categories

### Marketplace

* Categories
* Products
* Product Images
* Inventory History

### Commerce

* Shopping Carts
* Cart Items
* Orders
* Order Items
* Shipping Information

### AI & Personalization

* AI Conversations
* AI Recommendations
* Search History
* Activity Logs

The schema is normalized, role-aware, transaction-safe, and structured to support the complete marketplace workflow while providing a clear upgrade path to a production-scale application.
