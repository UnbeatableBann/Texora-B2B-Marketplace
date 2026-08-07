# API Specification

# Purpose

This document defines the REST API contract for the Textile Marketplace.

The API is the communication layer between the React frontend and the FastAPI backend.

It follows REST principles and is organized by business domains rather than technical layers.

The API should be:

* RESTful
* Versioned
* Secure
* Predictable
* Well documented
* Consistent
* Easy to extend

FastAPI will automatically generate OpenAPI documentation from the implementation.

---

# API Design Principles

The API should follow these principles:

* Resource-oriented endpoints
* Consistent naming
* Stateless requests
* JSON request/response format
* Proper HTTP status codes
* Standard error responses
* JWT authentication
* Versioned endpoints

---

# Base URL

Development

```text
http://localhost:8000/api/v1
```

Production

```text
https://api.<domain>/api/v1
```

---

# Authentication

Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

Authentication middleware should validate:

* Token validity
* Token expiration
* User existence
* User role

---

# Standard Response Format

## Success

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

---

# HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# API Modules

```text
Authentication

Users

Buyer

Supplier

Marketplace

Categories

Products

Inventory

Cart

Checkout

Orders

AI

Dashboard

Profile
```

---

# Authentication APIs

## Register

```http
POST /auth/register
```

Creates a Buyer or Supplier account.

---

## Login

```http
POST /auth/login
```

Returns

* JWT Token
* User
* Role
* Onboarding Status

---

## Logout

```http
POST /auth/logout
```

---

## Current User

```http
GET /auth/me
```

Returns authenticated user information.

---

# Buyer APIs

## Complete Buyer Onboarding

```http
POST /buyers/onboarding
```

Creates buyer profile.

---

## Update Buyer Profile

```http
PATCH /buyers/profile
```

---

## Get Buyer Profile

```http
GET /buyers/profile
```

---

# Supplier APIs

## Complete Supplier Onboarding

```http
POST /suppliers/onboarding
```

---

## Get Supplier Profile

```http
GET /suppliers/profile
```

---

## Update Supplier Profile

```http
PATCH /suppliers/profile
```

---

# Marketplace APIs

## Get Featured Products

```http
GET /marketplace/featured
```

---

## Get Categories

```http
GET /marketplace/categories
```

---

## Get Product Listing

```http
GET /marketplace/products
```

Supports

* Pagination
* Filtering
* Sorting

---

## Search Products

```http
GET /marketplace/search
```

Query Parameters

```
q

category

price_min

price_max

supplier

color
```

---

# Categories APIs

## List Categories

```http
GET /categories
```

---

## Category Details

```http
GET /categories/{category_id}
```

---

# Product APIs

## Product Details

```http
GET /products/{product_id}
```

---

## Similar Products

```http
GET /products/{product_id}/similar
```

---

## Product Comparison

```http
POST /products/compare
```

Request

```json
{
  "product_ids": [
    "...",
    "..."
  ]
}
```

---

# Inventory APIs

Supplier Only

---

## Create Product

```http
POST /inventory/products
```

---

## Update Product

```http
PATCH /inventory/products/{product_id}
```

---

## Delete Product

```http
DELETE /inventory/products/{product_id}
```

Soft delete preferred.

---

## Upload Product Images

```http
POST /inventory/products/{product_id}/images
```

---

## Update Inventory

```http
PATCH /inventory/products/{product_id}/stock
```

---

## Inventory List

```http
GET /inventory/products
```

Returns supplier inventory.

---

# Shopping Cart APIs

## Get Cart

```http
GET /cart
```

---

## Add Item

```http
POST /cart/items
```

---

## Update Quantity

```http
PATCH /cart/items/{cart_item_id}
```

---

## Remove Item

```http
DELETE /cart/items/{cart_item_id}
```

---

## Clear Cart

```http
DELETE /cart
```

---

# Checkout APIs

## Checkout Summary

```http
GET /checkout
```

---

## Place Order

```http
POST /checkout
```

Creates:

* Order
* Order Items
* Shipping Information

---

# Order APIs

## Buyer Orders

```http
GET /orders
```

---

## Order Details

```http
GET /orders/{order_id}
```

---

## Supplier Orders

```http
GET /supplier/orders
```

---

## Update Status

```http
PATCH /supplier/orders/{order_id}
```

Allowed Status

* Pending
* Accepted
* Preparing
* Ready for Dispatch
* Completed

---

# AI APIs

## AI Chat

```http
POST /ai/chat
```

Supports

* Product Questions
* Shopping Help

---

## AI Search

```http
POST /ai/search
```

Natural language search.

---

## AI Recommendation

```http
POST /ai/recommendations
```

---

## Product Comparison

```http
POST /ai/compare
```

---

## Similar Products

```http
POST /ai/similar
```

---

# Dashboard APIs

## Buyer Dashboard

```http
GET /dashboard/buyer
```

Returns

* Active Orders
* Previous Orders
* Recommendations

---

## Supplier Dashboard

```http
GET /dashboard/supplier
```

Returns

* Products
* Pending Orders
* Inventory Alerts
* Recent Orders

---

# Pagination

Every listing endpoint should support

```http
?page=1

&page_size=20
```

Response

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_items": 100,
    "total_pages": 5
  }
}
```

---

# Filtering

Supported where applicable.

Example

```
category

supplier

price

stock

status
```

---

# Sorting

```
price

name

created_at

updated_at
```

Ascending or descending.

---

# Validation

Every endpoint must validate

* Required fields
* Data types
* UUIDs
* Business rules

Validation failures return

```
422 Unprocessable Entity
```

---

# Authorization

## Public

* Marketplace
* Categories
* Product Listing
* Product Details

---

## Buyer

* Cart
* Checkout
* Orders
* Buyer Dashboard

---

## Supplier

* Inventory
* Product Management
* Supplier Dashboard
* Supplier Orders

---

# Rate Limiting

Future enhancement.

Sensitive endpoints should support rate limiting.

Examples

* Login
* Register
* AI Chat

---

# Error Handling

Every endpoint should return consistent error responses.

Example

```json
{
  "success": false,
  "message": "Product not found.",
  "errors": []
}
```

---

# API Versioning

Current version

```
/api/v1
```

Future versions

```
/api/v2

/api/v3
```

Existing clients should continue functioning after new API versions are introduced.

---

# API Documentation

FastAPI automatically generates

```
/docs
```

Swagger UI.

and

```
/redoc
```

ReDoc documentation.

These should remain enabled during development and may be disabled or protected in production.

---

# Future APIs

The API architecture should support future modules without breaking existing clients.

Potential additions include:

* Wishlist
* Reviews
* Notifications
* Messaging
* Analytics
* Admin
* Coupons
* Shipments
* Payments
* AI Insights

These should be introduced as independent modules under the existing versioned API structure.

---

# API Module Overview

```text
/api/v1
│
├── auth
├── buyers
├── suppliers
├── marketplace
├── categories
├── products
├── inventory
├── cart
├── checkout
├── orders
├── ai
├── dashboard
└── profile
```

---

# API Request Flow

```text
Client
    │
    ▼
Authentication Middleware
    │
    ▼
Router
    │
    ▼
Request Validation
    │
    ▼
Service Layer
    │
    ▼
Repository Layer
    │
    ▼
Database
    │
    ▼
Repository
    │
    ▼
Service
    │
    ▼
Response Serialization
    │
    ▼
JSON Response
```

---

# API Design Standards

Every endpoint should:

* Follow REST conventions.
* Use plural resource names where appropriate.
* Return consistent JSON responses.
* Enforce authentication and authorization where required.
* Validate request payloads using Pydantic models.
* Avoid exposing internal implementation details.
* Remain backward compatible within the same API version.
* Be fully documented through the generated OpenAPI specification.

This API structure provides a clear contract between the frontend and backend while remaining modular, maintainable, and extensible for future marketplace capabilities.
