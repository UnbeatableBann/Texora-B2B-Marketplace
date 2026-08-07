# System Architecture

# Purpose

This document defines the overall system architecture for the Textile Marketplace prototype.

The architecture is designed to:

* Deliver all hackathon requirements.
* Keep the implementation simple and maintainable.
* Follow production-ready engineering practices.
* Support future scaling without requiring significant redesign.
* Separate concerns between frontend, backend, AI, and data layers.

The project follows a **Modular Monolith Architecture**. While deployed as a single backend application, each business capability is isolated into independent modules with clear boundaries.

---

# Architectural Principles

The system should follow these principles:

* Modular by domain
* API-first development
* Separation of concerns
* Feature-based organization
* Stateless backend services
* Strong typing
* Single source of truth
* Scalable folder structure
* Production-ready coding practices

---

# High-Level Architecture

```text
                        Internet
                            │
                            ▼
                    React Frontend (Vite)
                            │
                HTTPS / REST API (JSON)
                            │
                            ▼
                    FastAPI Backend
                            │
        ┌──────────────┬───────────────┬───────────────┐
        │              │               │               │
        ▼              ▼               ▼               ▼
 Authentication   Marketplace      AI Module      Order Module
        │              │               │               │
        └──────────────┴───────────────┴───────────────┘
                            │
                            ▼
                      PostgreSQL Database
```

---

# Architecture Style

The project uses a **Modular Monolith**.

Every business capability is implemented as an independent module while sharing:

* Database
* API Application
* Authentication
* Configuration

Each module owns:

* Routes
* Business Logic
* Database Access
* Schemas
* Validation

This architecture provides:

* Simple deployment
* High maintainability
* Easy testing
* Straightforward migration to microservices if required later

---

# System Layers

```text
Presentation Layer
        │
        ▼
API Layer
        │
        ▼
Business Layer
        │
        ▼
Data Access Layer
        │
        ▼
Database
```

Each layer has a single responsibility.

---

# Frontend Architecture

The frontend is responsible for:

* User Interface
* Routing
* State Management
* Form Validation
* API Communication
* Responsive Layouts

It should never contain business logic.

---

## Frontend Modules

```text
Frontend

├── Authentication
├── Marketplace
├── Buyer
├── Supplier
├── Products
├── Cart
├── Checkout
├── Orders
├── AI Assistant
├── Shared Components
└── Layouts
```

---

# Backend Architecture

The backend contains all business logic.

Responsibilities include:

* Authentication
* Authorization
* Marketplace
* Inventory
* Orders
* AI
* Personalization

---

## Backend Modules

```text
Backend

app/

├── auth/
├── users/
├── onboarding/
├── marketplace/
├── products/
├── inventory/
├── cart/
├── checkout/
├── orders/
├── buyers/
├── suppliers/
├── ai/
├── common/
└── core/
```

Each module is independent.

Modules communicate only through well-defined services.

---

# Module Responsibilities

## Authentication

Responsible for:

* Register
* Login
* JWT
* Role Authorization
* Session Validation

---

## Onboarding

Responsible for:

* Buyer Onboarding
* Supplier Onboarding
* Preference Collection
* Business Profile Creation

---

## Marketplace

Responsible for:

* Product Discovery
* Categories
* Search
* Filters
* Recommendations

---

## Products

Responsible for:

* Product Details
* Images
* Specifications
* Stock Information

---

## Inventory

Responsible for:

* Product Creation
* Inventory Updates
* Product Availability

---

## Cart

Responsible for:

* Cart Items
* Quantity Updates
* Cart Summary

---

## Checkout

Responsible for:

* Shipping Information
* Order Review
* Order Creation

---

## Orders

Responsible for:

* Buyer Orders
* Supplier Orders
* Order Status
* Order Timeline

---

## AI

Responsible for:

* Product Search
* Recommendations
* Product Comparison
* Product Q&A
* Similar Products

The AI module should remain isolated from business logic.

---

# Request Lifecycle

```text
Browser
    │
    ▼
React
    │
    ▼
REST API
    │
    ▼
FastAPI Router
    │
    ▼
Service Layer
    │
    ▼
Repository Layer
    │
    ▼
PostgreSQL
```

The response returns through the same path.

---

# Backend Layering

```text
Router
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Database
```

## Router

Responsible for:

* HTTP Requests
* Validation
* Authentication
* Response Codes

No business logic.

---

## Service

Responsible for:

* Business Rules
* Validation
* Marketplace Logic
* AI Orchestration

---

## Repository

Responsible for:

* Database Queries
* Persistence
* Data Retrieval

No business logic.

---

# Database Architecture

The application uses a relational database.

Primary entities include:

```text
Users
│
├── Buyer Profile
├── Supplier Profile
├── Products
├── Categories
├── Cart
├── Orders
├── Order Items
└── AI Conversations
```

The database remains the single source of truth.

---

# Authentication Architecture

```text
Client
    │
Login
    │
    ▼
FastAPI
    │
Authenticate
    │
    ▼
Generate JWT
    │
    ▼
Client Stores Token
```

Every protected request validates the JWT before accessing business modules.

---

# Authorization Flow

```text
Request
    │
    ▼
JWT Validation
    │
    ▼
Extract User Role
    │
    ▼
Role Permission Check
    │
    ▼
Business Module
```

Only authorized roles may access protected resources.

---

# AI Architecture

The AI module is treated as a supporting service rather than the core application.

```text
User Question
       │
       ▼
AI Service
       │
       ├── Marketplace Context
       ├── Product Data
       ├── Buyer Preferences
       └── Prompt Construction
              │
              ▼
      Hugging Face Model
              │
              ▼
      Structured Response
```

AI should never directly access the database.

All required data should be supplied by application services.

---

# Personalization Architecture

```text
Authentication
        │
        ▼
Onboarding
        │
        ▼
Preference Profile
        │
        ▼
Marketplace
        │
        ├── Homepage
        ├── Search
        ├── AI
        └── Recommendations
```

Personalization begins after onboarding and evolves based on user activity.

---

# Component Communication

```text
Frontend

↓

REST API

↓

Authentication

↓

Business Module

↓

Repository

↓

Database
```

Modules should communicate through services rather than directly querying each other's data.

---

# Error Handling

Errors should propagate in a consistent manner.

```text
Database Error
       │
       ▼
Repository
       │
       ▼
Service
       │
       ▼
API
       │
       ▼
Standard Error Response
```

The frontend should always receive predictable error structures.

---

# Configuration

Application configuration should be centralized.

Configuration includes:

* Database
* Authentication
* AI
* Environment
* Security
* Logging

Modules should never contain hardcoded configuration values.

---

# Security Architecture

The system should implement:

* JWT Authentication
* Password Hashing
* Role-Based Authorization
* Request Validation
* Input Sanitization
* Environment-based Secrets
* HTTPS in Production
* CORS Protection

---

# Deployment Architecture

```text
React (Vercel)
        │
        ▼
FastAPI (Railway)
        │
        ▼
PostgreSQL (Neon)
```

This deployment architecture supports the prototype while remaining suitable for future scaling.

---

# Future Scalability

The modular architecture allows future extraction of independent services without significant refactoring.

Potential future services include:

```text
Marketplace Service

Authentication Service

Order Service

Inventory Service

AI Service

Notification Service

Analytics Service
```

Each module already has clear boundaries, making future service decomposition straightforward.

---

# Architecture Summary

```text
                           React Frontend
                                  │
                           REST API (HTTPS)
                                  │
                            FastAPI Backend
                                  │
      ┌──────────────────────────────────────────────────┐
      │                                                  │
      │  Authentication                                  │
      │  Onboarding                                      │
      │  Marketplace                                     │
      │  Products                                        │
      │  Inventory                                       │
      │  Cart                                            │
      │  Checkout                                        │
      │  Orders                                          │
      │  Buyers                                          │
      │  Suppliers                                       │
      │  AI                                              │
      │                                                  │
      └──────────────────────────────────────────────────┘
                                  │
                           PostgreSQL Database
```

The resulting architecture satisfies the hackathon requirements while providing a clean, modular foundation that can evolve into a production-ready B2B marketplace with minimal structural changes.
