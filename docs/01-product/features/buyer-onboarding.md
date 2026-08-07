# Buyer Onboarding Feature Specification

# Purpose

The Buyer Onboarding feature is responsible for collecting business information and purchasing preferences after account creation.

Its purpose is to understand the buyer's business so the marketplace can immediately provide a personalized shopping experience without requiring extensive manual searching.

Unlike Authentication, Buyer Onboarding does **not** create user accounts. It enriches the buyer profile after successful registration.

---

# Goals

The Buyer Onboarding feature should:

* Understand the buyer's business.
* Capture purchasing preferences.
* Create a buyer profile.
* Generate an initial personalization profile.
* Improve marketplace discovery.
* Improve AI recommendations.
* Reduce search effort.
* Prepare buyers for their first purchase.

---

# Scope

## Included

* Buyer onboarding flow
* Buyer profile creation
* Preference collection
* Marketplace personalization
* AI context generation
* Onboarding progress tracking

---

## Excluded

* Authentication
* Product browsing
* Cart
* Checkout
* Orders
* Supplier onboarding

---

# Primary Users

## Buyer

Every newly registered Buyer must complete onboarding before accessing buyer-specific marketplace features.

---

# Dependencies

Buyer Onboarding depends on:

* Authentication
* Users Table
* Buyer Profiles Table
* Buyer Preferred Categories
* Buyer Preferred Fabrics

Buyer Onboarding is required by:

* Marketplace
* Product Recommendations
* Search Personalization
* AI Assistant
* Buyer Dashboard

---

# Feature Overview

Buyer onboarding transforms a newly registered account into a personalized marketplace profile.

Rather than presenting a long form, onboarding should feel like a guided conversation that gradually collects business information.

The collected information is converted into structured data used throughout the application.

---

# User Journey

```text id="x8pn2w"
Registration

↓

Buyer Onboarding

↓

Business Information

↓

Preference Collection

↓

Generate Buyer Profile

↓

Generate Personalization Profile

↓

Buyer Dashboard

↓

Marketplace
```

---

# Functional Requirements

## Start Onboarding

Onboarding automatically begins after successful Buyer registration.

If onboarding is incomplete, the buyer should always be redirected back to onboarding until completion.

---

## Business Information

Collect:

* Business Type
* Industry

Purpose:

Understand what kind of organization the buyer represents.

---

## Product Interests

Collect:

* Product Categories
* Preferred Fabric Types

Multiple selections should be supported.

---

## Purchasing Behaviour

Collect:

* Typical Order Quantity
* Budget Range

Purpose:

Improve product recommendations and supplier matching.

---

## Additional Preferences

Allow buyers to optionally describe their needs in natural language.

Example

> "We mainly purchase fabrics for school uniforms."

This information becomes part of the AI context.

---

# Conversational Experience

The onboarding experience should feel like a conversation rather than a traditional registration form.

The assistant should:

* Ask one question at a time.
* Explain why information is requested when necessary.
* Accept conversational responses.
* Confirm extracted information.
* Allow users to edit previous answers.

Example

```text id="vhl1wr"
AI

What type of business do you operate?

↓

Buyer

We manufacture school uniforms.

↓

AI

Business Type:
Garment Manufacturer

Industry:
Uniforms

Is that correct?
```

---

# Workflow

```text id="bj0cbe"
Registration

↓

Check Buyer Role

↓

Start Onboarding

↓

Collect Information

↓

Validate Data

↓

Save Buyer Profile

↓

Generate Personalization Profile

↓

Mark Onboarding Complete

↓

Redirect to Marketplace
```

---

# Business Rules

* Buyer onboarding must only be available to Buyer accounts.
* Every Buyer account must have exactly one Buyer Profile.
* Required fields must be completed before onboarding finishes.
* Buyer onboarding may be edited later through the Buyer Profile.
* Personalization should begin immediately after completion.

---

# Collected Information

## Business Type

Examples

* Garment Manufacturer
* Boutique
* Fashion Brand
* Textile Trader
* Exporter
* Retailer
* Interior Designer
* Hospital
* Hotel
* School

---

### Used For

* Homepage personalization
* AI context
* Product recommendations
* Search ranking

---

## Industry

Examples

* Apparel
* Hospitality
* Healthcare
* Retail
* Manufacturing

---

### Used For

* Marketplace collections
* AI responses
* Recommendation ranking

---

## Product Categories

Examples

* Cotton
* Linen
* Silk
* Polyester
* Denim

---

### Used For

* Featured Products
* Recommendations
* Search

---

## Preferred Fabric Types

Examples

* Organic Cotton
* Waterproof
* Stretchable
* Lightweight
* Heavy GSM

---

### Used For

* Similar Products
* AI Suggestions
* Search Ranking

---

## Typical Order Quantity

Examples

* Under 100 m
* 100–500 m
* 500–1000 m
* 1000+ m

---

### Used For

* MOQ Matching
* Supplier Recommendations

---

## Budget Range

Examples

* Economy
* Mid Range
* Premium

---

### Used For

* Default Product Sorting
* Search Personalization
* AI Recommendations

---

## Additional Preferences

Optional.

Used to provide additional context for AI-assisted recommendations.

---

# Personalization

After onboarding, the system generates an initial Buyer Personalization Profile.

This profile influences:

* Homepage
* Featured Products
* Product Listing
* Search Results
* AI Responses
* Similar Products
* Product Recommendations

Behavioral data collected later (search history, viewed products, purchases) should gradually become more influential than onboarding responses.

---

# Feature Interactions

## Authentication

Authentication creates the Buyer account.

Buyer Onboarding enriches that account.

```text id="4w8av8"
Authentication

↓

Buyer Onboarding
```

---

## Marketplace

Marketplace uses onboarding preferences to personalize:

* Featured Products
* Categories
* Recommendations

---

## AI Assistant

AI receives:

* Business Type
* Industry
* Categories
* Fabric Preferences
* Budget

This enables context-aware conversations.

---

## Search

Search ranking prioritizes products matching onboarding preferences.

Traditional search remains fully functional.

---

## Product Recommendations

Recommendation engine uses onboarding data to generate an initial recommendation list.

---

## Buyer Dashboard

Dashboard displays profile completion status and buyer information.

---

## Orders

Future purchasing behavior refines personalization established during onboarding.

---

# Database Interaction

Primary Tables

* users
* buyer_profiles
* buyer_preferred_categories
* buyer_preferred_fabrics

Writes

* Buyer Profile
* Buyer Preferences
* Onboarding Status

Reads

* User Information
* Existing Profile

---

# API Endpoints

## Complete Buyer Onboarding

```http id="e2e2iq"
POST /api/v1/buyers/onboarding
```

---

## Get Buyer Profile

```http id="jqzysq"
GET /api/v1/buyers/profile
```

---

## Update Buyer Profile

```http id="gr4vme"
PATCH /api/v1/buyers/profile
```

---

# UI Components

Buyer Onboarding includes:

* Welcome Screen
* Progress Indicator
* Conversational Chat Interface (or guided stepper)
* Category Selector
* Fabric Selector
* Budget Selector
* Quantity Selector
* Confirmation Screen

---

# States

## Not Started

Buyer registered but onboarding not initiated.

---

## In Progress

Buyer is actively completing onboarding.

---

## Completed

Buyer profile successfully created.

---

## Edited

Buyer updated onboarding information from their profile.

---

# Validation Rules

Required

* Business Type
* Industry
* At least one Product Category
* Typical Order Quantity
* Budget Range

Optional

* Preferred Fabric Types
* Additional Preferences

Validation

* Required fields cannot be empty.
* Multiple category selection allowed.
* Duplicate category selections should be prevented.

---

# Error Handling

Handle:

* Network interruptions.
* Session expiration.
* Invalid data.
* Duplicate submissions.
* Save failures.

Users should receive clear feedback and be able to retry without losing progress.

---

# Edge Cases

* Buyer refreshes the page during onboarding.
* Buyer leaves onboarding and returns later.
* Session expires during onboarding.
* Buyer attempts to access Marketplace before onboarding completion.
* Buyer edits onboarding after placing orders.
* Buyer skips optional questions.
* Buyer changes business type after onboarding.

---

# Security Considerations

* Only authenticated Buyers may access Buyer Onboarding.
* Suppliers must never access Buyer Onboarding APIs.
* Buyer profiles are accessible only to the profile owner.
* Input must be validated and sanitized before storage.

---

# Responsive Behaviour

The onboarding experience should work seamlessly on:

* Desktop
* Tablet
* Mobile

The conversational interface should remain usable on small screens without requiring horizontal scrolling.

---

# Performance Requirements

* Initial onboarding screen loads within 2 seconds.
* Profile save completes within 2 seconds.
* Marketplace personalization should be available immediately after onboarding completion.

---

# Acceptance Criteria

## Onboarding Flow

* Buyer is automatically redirected after registration.
* Buyer cannot access buyer-only features until onboarding is complete.
* Progress is clearly indicated.
* Required questions are enforced.
* Optional questions may be skipped.

---

## Data Collection

* Business information is stored successfully.
* Category preferences are saved.
* Fabric preferences are saved.
* Budget and quantity are saved.
* Additional preferences are stored when provided.

---

## Personalization

* Homepage reflects buyer preferences.
* Recommendations are generated using onboarding data.
* AI Assistant receives buyer context.
* Search ranking considers onboarding preferences.

---

## Completion

* Buyer Profile is created.
* Personalization Profile is generated.
* `onboarding_completed` is updated.
* Buyer is redirected to the Marketplace or Buyer Dashboard.

---

# Future Enhancements

The onboarding architecture should support:

* Voice-first onboarding
* Multi-language onboarding
* AI-generated follow-up questions
* Industry-specific onboarding flows
* Business website import
* OCR-based business verification
* Saved draft onboarding
* Dynamic personalization based on confidence scoring

These enhancements should integrate without changing the core onboarding workflow.

---

# Out of Scope

The Buyer Onboarding feature intentionally does not manage:

* Authentication
* Supplier onboarding
* Product management
* Inventory
* Shopping cart
* Checkout
* Orders
* Dashboard analytics
* Recommendation algorithms (only provides the input profile)

Its responsibility is limited to collecting, validating, storing, and exposing buyer profile information that enables personalization across the marketplace.
