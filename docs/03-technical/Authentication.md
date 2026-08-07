# Authentication

## Purpose

This document defines the authentication and authorization system for the Textile Marketplace.

The marketplace supports two independent user roles:

* Buyer
* Supplier

Authentication is responsible for:

* User registration
* User login
* Secure session management
* Role-based authorization
* Account verification
* Linking newly registered users to their respective onboarding flow

Business-specific information is intentionally **not collected during authentication**. After successful registration, users are redirected to their role-specific onboarding experience.

---

# Authentication Goals

The authentication system should:

* Keep registration simple
* Minimize friction during sign-up
* Secure user accounts
* Support multiple user roles
* Be easily extendable for future authentication providers
* Separate authentication from profile and business information

---

# User Roles

The marketplace supports two primary roles.

## Buyer

A buyer can:

* Browse marketplace
* Search products
* Add products to cart
* Place orders
* View orders
* Manage buyer profile

---

## Supplier

A supplier can:

* Manage inventory
* Add products
* Update products
* Receive orders
* Update order status
* Manage supplier profile

---

# Authentication Flow

## Registration

The registration process only creates the user account.

Required information:

* Full Name
* Email Address
* Password
* User Role

  * Buyer
  * Supplier

After successful registration:

* User account is created.
* A JWT session is established.
* The user is redirected to the onboarding process based on the selected role.

Authentication **does not** collect business information, preferences, or marketplace-specific details.

---

## Login

Users log in using:

* Email Address
* Password

After successful authentication:

* JWT Access Token is issued.
* User information is returned.
* User role is identified.
* Onboarding completion status is checked.
* The application determines the next destination.

Routing logic:

* If onboarding is incomplete → Redirect to role-specific onboarding.
* If onboarding is complete → Redirect to the appropriate dashboard or marketplace.

---

## Logout

Logging out should:

* Remove authentication token.
* Clear authenticated user state.
* Redirect user to the landing page.

---

# Authentication Lifecycle

```text
Landing Page
      │
      ▼
Register
      │
      ▼
Create Account
      │
      ▼
Authenticate User
      │
      ▼
Check User Role
      │
      ▼
Redirect to Role Onboarding
      │
      ▼
Complete Onboarding
      │
      ▼
Marketplace Access
```

---

# Onboarding Integration

Authentication is responsible only for creating the user account.

Once registration succeeds, the application delegates profile completion to the onboarding module.

Role-specific onboarding includes:

## Buyer

Buyer onboarding collects marketplace preferences and purchasing information.

Refer to:

`docs/onboarding.md`

---

## Supplier

Supplier onboarding collects business information and inventory-related details.

Refer to:

`docs/onboarding.md`

Authentication should only determine whether onboarding has been completed.

It must never manage onboarding data directly.

---

# Authorization

The marketplace uses Role-Based Access Control (RBAC).

Every authenticated user belongs to exactly one role.

```text
User
 ├── Buyer
 └── Supplier
```

Authorization is enforced on every protected API endpoint.

---

# Protected Routes

## Public Routes

* Landing Page
* Login
* Register
* Marketplace Browsing
* Product Listing
* Product Details

---

## Buyer Protected Routes

* Buyer Dashboard
* Cart
* Checkout
* Orders
* Buyer Profile

---

## Supplier Protected Routes

* Supplier Dashboard
* Inventory
* Product Management
* Order Management
* Supplier Profile

Unauthorized users must be denied access to protected resources.

---

# JWT Authentication

Authentication uses JSON Web Tokens (JWT).

JWT contains:

* User ID
* User Role
* Token Expiration

Sensitive information must never be stored inside the token.

---

# Password Security

Passwords must:

* Be hashed using bcrypt.
* Never be stored in plain text.
* Never be returned through any API.

---

# User Session

After authentication, the frontend maintains:

* Authentication token
* Authenticated user
* User role
* Onboarding status

Application state should be restored on page refresh when the session is still valid.

---

# Authentication API

## Register

```http
POST /api/v1/auth/register
```

---

## Login

```http
POST /api/v1/auth/login
```

---

## Logout

```http
POST /api/v1/auth/logout
```

---

## Current User

```http
GET /api/v1/auth/me
```

Returns:

* User information
* Assigned role
* Onboarding completion status

---

# Account Status

Each account should maintain a simple lifecycle.

```text
Registered
        │
        ▼
Onboarding Pending
        │
        ▼
Active
```

Only users with an **Active** account (completed onboarding) should access role-specific functionality.

---

# Security Considerations

The authentication system should include:

* Password hashing
* JWT authentication
* Protected API endpoints
* Role-based authorization
* Request validation
* Secure environment variables
* CORS configuration

Future enhancements may include:

* Email verification
* Password reset
* Refresh tokens
* OAuth providers (Google, Microsoft)
* Multi-factor authentication (MFA)

These enhancements are outside the scope of the prototype.

---

# Responsibilities

## Authentication Module

Responsible for:

* Registering users
* Authenticating users
* Managing sessions
* Authorization
* Determining onboarding status
* Redirecting users to the appropriate onboarding flow

Not responsible for:

* Business information
* Buyer preferences
* Supplier business setup
* Product management
* Profile completion

These responsibilities belong to the onboarding and profile modules.
