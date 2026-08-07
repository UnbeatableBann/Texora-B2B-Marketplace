# Profiles Feature Specification

# Purpose

The Profiles feature manages all user profile information within the Textile Marketplace.

It provides a centralized location where Buyers and Suppliers can view, update, and maintain their personal or business information after completing onboarding.

Unlike the Authentication feature, which manages identity and access, the Profiles feature manages editable user information that personalizes the marketplace experience.

---

# Goals

The Profiles feature should:

* Provide a single profile management experience.
* Allow Buyers and Suppliers to update their information.
* Keep profile data synchronized across the platform.
* Support personalization.
* Maintain profile completeness.
* Enable future profile verification.
* Preserve data integrity.

---

# Scope

## Included

* Buyer Profile
* Supplier Profile
* Profile Editing
* Profile Viewing
* Business Information
* Marketplace Preferences
* Profile Completion
* Profile Settings

---

## Excluded

* Authentication
* Registration
* Password Management
* Product Management
* Orders
* Inventory
* Notifications

---

# Primary Users

## Buyer

Can:

* View profile
* Edit profile
* Update preferences
* Update business information

---

## Supplier

Can:

* View business profile
* Update business information
* Update contact details
* Update operating information

---

## Guest

Guests cannot access profile management.

---

# Dependencies

Profiles depends on:

* Authentication
* Buyer Onboarding
* Supplier Onboarding

Profiles is used by:

* Buyer Dashboard
* Supplier Dashboard
* Marketplace
* Search
* Recommendation Engine
* AI Assistant
* Orders

---

# Feature Overview

Every authenticated user owns exactly one profile.

The profile extends the user account with information collected during onboarding and allows users to modify that information over time.

Profile updates should immediately influence personalization and marketplace behavior where applicable.

---

# Profile Types

## Buyer Profile

Contains:

* Personal Information
* Business Information
* Marketplace Preferences
* Shopping Preferences

---

## Supplier Profile

Contains:

* Business Information
* Contact Information
* Business Categories
* Business Description
* Operating Hours

---

# User Journey

## Buyer

```text
Login

↓

Buyer Dashboard

↓

Profile

↓

Edit Information

↓

Save

↓

Marketplace Updated
```

---

## Supplier

```text
Login

↓

Supplier Dashboard

↓

Profile

↓

Update Business Information

↓

Save

↓

Supplier Dashboard Updated
```

---

# Functional Requirements

## View Profile

Users should be able to view:

### Buyer

* Name
* Email
* Business Type
* Industry
* Preferred Categories
* Preferred Fabrics
* Budget Range
* Typical Order Quantity

---

### Supplier

* Business Name
* Business Type
* Contact Information
* Address
* Categories
* MOQ
* Operating Hours
* Business Description

---

## Edit Profile

Users should be able to update editable profile information.

Authentication-related information is not editable here.

---

## Profile Completion

Display profile completion percentage.

Example

```text
Profile Completion

90%
```

Missing required information should be highlighted.

---

## Marketplace Preferences

Buyers can update:

* Preferred Categories
* Preferred Fabrics
* Budget Range
* Order Quantity

Changes should immediately improve personalization.

---

## Business Information

Suppliers can update:

* Business Description
* Contact Information
* Address
* Operating Hours
* Business Categories

These updates should automatically appear on supplier profiles throughout the marketplace.

---

## Read-Only Information

The following should not be editable through Profiles:

* Account Role
* Registration Email (prototype)
* User ID
* Account Creation Date

Future versions may support email changes through a dedicated verification flow.

---

# Profile Workflow

```text
Open Profile

↓

Load Current Information

↓

Edit Fields

↓

Validate Input

↓

Save Changes

↓

Update Database

↓

Refresh Marketplace Context
```

---

# Buyer Profile Structure

```text
Buyer Profile

│

├── Personal Information

├── Business Information

├── Marketplace Preferences

├── Shopping Preferences

└── Profile Completion
```

---

# Supplier Profile Structure

```text
Supplier Profile

│

├── Business Information

├── Contact Information

├── Address

├── Categories

├── Operating Hours

└── Business Description
```

---

# Feature Interactions

## Authentication

Authentication identifies the current user.

Profiles never manage authentication credentials.

---

## Buyer Onboarding

Buyer Onboarding creates the initial Buyer Profile.

Profiles allow buyers to modify it later.

---

## Supplier Onboarding

Supplier Onboarding creates the Supplier Profile.

Profiles maintain and update that information.

---

## Buyer Dashboard

Dashboard displays buyer profile summary.

Profile updates should immediately appear.

---

## Supplier Dashboard

Dashboard displays supplier business summary.

Changes refresh automatically.

---

## Marketplace

Buyer profile updates influence:

* Recommendations
* Search ranking
* Homepage personalization

Supplier profile updates influence:

* Supplier cards
* Product pages
* Marketplace business information

---

## Product Details

Supplier business information displayed on Product Details is retrieved from the Supplier Profile.

---

## Recommendation Engine

Buyer preference updates immediately influence recommendation ranking.

---

## AI Assistant

The AI Assistant uses profile information to personalize conversations.

Examples

Buyer

* Business Type
* Preferred Categories
* Budget

Supplier

* Business Type
* Product Categories
* Business Description

---

## Orders

Shipping addresses used during checkout remain snapshots inside completed orders.

Updating a profile does not modify historical orders.

---

# Database Interaction

Primary Tables

* users
* buyer_profiles
* supplier_profiles
* buyer_preferred_categories
* buyer_preferred_fabrics

Reads

* User
* Buyer Profile
* Supplier Profile

Writes

* Buyer Profile
* Supplier Profile
* Preference Tables

---

# API Endpoints

## Current Profile

```http
GET /api/v1/profile
```

Returns the appropriate profile based on the authenticated user's role.

---

## Buyer Profile

```http
GET /api/v1/buyers/profile
```

---

```http
PATCH /api/v1/buyers/profile
```

---

## Supplier Profile

```http
GET /api/v1/suppliers/profile
```

---

```http
PATCH /api/v1/suppliers/profile
```

---

# UI Components

Profiles includes:

* Profile Header
* Profile Completion Indicator
* Information Sections
* Edit Forms
* Preference Selector
* Address Form
* Business Information Card
* Save Button
* Cancel Button

---

# States

## Loading

Display profile skeletons.

---

## View Mode

Display current information.

---

## Edit Mode

Enable editable fields.

---

## Saving

Disable repeated submissions.

Display loading indicator.

---

## Success

Display confirmation message.

---

## Error

Display validation errors.

Allow retry.

---

# Validation Rules

Buyer

Required

* Business Type
* Industry
* Preferred Category

---

Supplier

Required

* Business Name
* Business Type
* Contact Information
* Address

Validation

* Email format
* Phone number format
* Required fields
* Valid categories

---

# Error Handling

Handle:

* Invalid profile.
* Validation failure.
* Network interruption.
* Database save failure.
* Concurrent profile updates.

Previously saved information should never be lost.

---

# Edge Cases

* Buyer changes preferred categories.
* Supplier changes business type.
* Supplier removes all categories.
* Buyer refreshes while editing.
* Multiple browser tabs edit the same profile.
* Session expires while editing.
* Marketplace personalization refreshes after profile updates.
* Historical orders continue displaying original shipping information.

---

# Security Considerations

* Users may access only their own profile.
* Buyers cannot access supplier profiles for editing.
* Suppliers cannot access buyer profiles for editing.
* Sensitive information should never be exposed publicly.
* All profile updates require authentication.
* Input should be validated and sanitized before persistence.

---

# Responsive Behaviour

Desktop

* Multi-section profile layout.
* Side-by-side information cards.

Tablet

* Responsive forms.
* Collapsible sections.

Mobile

* Single-column layout.
* Full-width forms.
* Sticky Save button.
* Touch-friendly inputs.

---

# Performance Requirements

* Profile loads within 2 seconds.
* Profile updates complete within 2 seconds.
* Personalization updates should become effective immediately after a successful save.
* Profile completion should be calculated efficiently.

---

# Acceptance Criteria

## Profile Access

* Only authenticated users can access profiles.
* Buyers receive Buyer Profile.
* Suppliers receive Supplier Profile.

---

## Viewing

* Current information displays correctly.
* Profile completion percentage is accurate.
* Dashboard summaries match profile data.

---

## Editing

* Editable fields can be updated.
* Read-only fields cannot be modified.
* Validation prevents invalid data.
* Changes persist after refresh.

---

## Marketplace Integration

* Buyer preference changes affect recommendations.
* Supplier profile updates appear on Product Details.
* Marketplace reflects profile changes without requiring re-onboarding.

---

## Security

* Users cannot edit another user's profile.
* Unauthorized requests are rejected.
* Historical order information remains unchanged after profile updates.

---

# Future Enhancements

The Profiles architecture should support:

* Profile Pictures
* Company Logos
* Business Verification
* GST/VAT Information
* Social Links
* Public Supplier Profiles
* Multiple Business Locations
* Team Member Management
* Saved Shipping Addresses
* Notification Preferences
* Privacy Settings
* Account Deletion
* Email Change Verification
* Activity History

These enhancements should integrate without changing the existing profile architecture.

---

# Out of Scope

The Profiles feature intentionally does not manage:

* Authentication
* Password management
* Product management
* Inventory operations
* Shopping cart
* Checkout
* Order processing
* Recommendation algorithms

Its responsibility is limited to managing buyer and supplier profile information, enabling profile updates, maintaining personalization data, and serving as the authoritative source of user-specific information throughout the marketplace.
