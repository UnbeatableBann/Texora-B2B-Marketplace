# Onboarding

## Purpose

The onboarding process is the first experience users have after creating an account.

Its purpose is not simply to collect information, but to understand the user's business so the marketplace can immediately provide a personalized experience.

The onboarding system should:

* Minimize setup time
* Understand the user's business requirements
* Personalize the marketplace experience
* Improve product discovery
* Improve AI recommendations
* Reduce unnecessary browsing
* Enable future intelligent features

Authentication is responsible only for creating the account. After successful registration, every user is redirected to role-specific onboarding.

---

# Design Principles

The onboarding experience should follow these principles:

* Conversational instead of lengthy forms
* Progressive information collection
* Mobile-friendly
* Fast completion (under 2 minutes)
* Skippable where appropriate
* Easy to edit later
* Visually engaging
* AI-assisted wherever it improves usability

The assignment encourages AI-powered conversational or voice-assisted onboarding over traditional forms. This implementation follows that recommendation while still producing structured data required by the application.

---

# Onboarding Flow

```text
Register
      │
      ▼
Role Selection
      │
      ▼
Role-Specific Onboarding
      │
      ▼
Create Marketplace Profile
      │
      ▼
Generate Personalization Profile
      │
      ▼
Marketplace Ready
```

---

# Buyer Onboarding

## Objective

Buyer onboarding helps the marketplace understand:

* What business the buyer operates
* What products they are interested in
* Their purchasing behavior
* Their expected budget
* Their ordering patterns

This information allows the marketplace to personalize product discovery immediately.

---

# Buyer Experience

Instead of presenting one long form, onboarding should feel like a guided conversation.

Example:

```text
Welcome!

Let's understand your business.

↓

What type of business do you operate?

↓

Which fabric categories are you usually interested in?

↓

What is your typical order quantity?

↓

What's your preferred budget?

↓

You're all set.
```

Each answer is automatically converted into structured profile information.

---

# Buyer Information

## Business Type

Examples

* Garment Manufacturer
* Fashion Brand
* Boutique
* Textile Trader
* Exporter
* Interior Designer
* Hotel
* Hospital
* School
* Other

### Used For

* Homepage personalization
* Product recommendations
* AI context
* Search ranking

---

## Industry

Examples

* Apparel
* Home Furnishing
* Uniforms
* Healthcare
* Hospitality
* Industrial
* Retail

### Used For

* Category recommendations
* Homepage collections
* AI recommendations

---

## Product Categories of Interest

Examples

* Cotton
* Linen
* Polyester
* Silk
* Denim
* Wool
* Blended Fabrics

Multiple selections allowed.

### Used For

* Homepage sections
* Featured products
* Recommendation engine
* Similar products

---

## Preferred Fabric Types

Examples

* Organic Cotton
* Premium Cotton
* Waterproof Fabric
* Stretch Fabric
* Breathable Fabric
* Heavy GSM
* Lightweight Fabric

### Used For

* AI recommendations
* Search personalization
* Product suggestions

---

## Typical Order Quantity

Examples

* Under 100 meters
* 100–500 meters
* 500–1000 meters
* 1000+ meters

### Used For

* Supplier prioritization
* MOQ matching
* Recommendation filtering

---

## Budget Range

Examples

* Economy
* Mid Range
* Premium

or

* ₹50–₹100
* ₹100–₹200
* ₹200+

### Used For

* Default price filters
* Product ranking
* AI recommendations

---

## Additional Preferences

Optional free-text information.

Examples

"I mostly buy fabrics for school uniforms."

"We prefer wrinkle-resistant fabrics."

### Used For

* AI context
* Better recommendations
* Future personalization

---

# Buyer Personalization

After onboarding, the marketplace creates a Buyer Preference Profile.

The profile influences:

## Homepage

Show products matching:

* Preferred categories
* Budget
* Business type

---

## Search

Ranking prioritizes:

* Preferred fabrics
* Budget
* Relevant categories

---

## AI Assistant

AI receives buyer context.

Instead of asking:

"What kind of fabrics are you looking for?"

It already knows:

* Business
* Budget
* Categories
* Preferred fabrics

This produces better recommendations.

---

## Product Recommendations

Products are ranked using:

* Buyer preferences
* Category interest
* Budget
* Order quantity

---

## Similar Products

Recommendations prioritize products aligned with buyer interests rather than generic similarity.

---

# Supplier Onboarding

## Objective

Supplier onboarding helps the marketplace understand:

* Business profile
* Products offered
* Operating capability
* Marketplace readiness

This information powers supplier profiles and improves buyer discovery.

---

# Supplier Experience

Like buyers, suppliers complete a conversational onboarding.

Example

```text
Tell us about your business.

↓

Business Name

↓

What fabrics do you manufacture?

↓

What's your MOQ?

↓

Operating hours

↓

You're ready to start selling.
```

---

# Supplier Information

## Business Name

Used throughout the marketplace.

---

## Business Type

Examples

* Manufacturer
* Wholesaler
* Distributor
* Trader
* Exporter

### Used For

* Supplier profile
* Search filters
* Buyer confidence

---

## Contact Information

* Email
* Phone

Used for marketplace communication.

---

## Business Address

Collect:

* City
* State
* Country

### Used For

* Supplier profile
* Buyer trust
* Future shipping features

---

## Operating Hours

Examples

Monday–Friday

9 AM–6 PM

### Used For

* Supplier profile
* Future support availability

---

## Product Categories

Examples

* Cotton
* Silk
* Linen
* Polyester
* Denim

### Used For

* Marketplace categorization
* Product creation defaults

---

## Fabric Types Offered

Examples

* Organic Cotton
* Premium Cotton
* Printed Cotton
* Waterproof Fabric

### Used For

* Buyer search
* AI recommendations
* Supplier discovery

---

## Minimum Order Quantity (MOQ)

Examples

100 meters

500 meters

1000 meters

### Used For

* Buyer matching
* Recommendation filtering
* Order validation

---

## Additional Business Information

Optional.

Examples

"We specialize in sustainable fabrics."

### Used For

* Supplier profile
* AI context

---

# Supplier Personalization

Supplier onboarding generates a Supplier Profile.

The profile is used to:

* Configure supplier dashboard
* Suggest product categories
* Pre-fill product creation
* Improve buyer search results
* Support AI responses

---

# AI Assisted Onboarding

The onboarding assistant should behave like a business consultant.

Responsibilities

* Ask one question at a time.
* Understand natural language.
* Confirm extracted information.
* Skip unnecessary questions.
* Handle corrections naturally.

Example

User:

"I own a garment factory making school uniforms."

AI extracts

```text
Business Type:
Garment Manufacturer

Industry:
Uniforms
```

No additional clarification required.

---

# Voice Support

The onboarding assistant should optionally support voice input.

Voice responses should be converted into structured data using speech recognition before validation.

Voice interaction should remain optional.

---

# Progress Tracking

Display onboarding progress throughout the experience.

Example

```text
Business Information

██████░░░░

60%
```

Users should always know how many steps remain.

---

# Skip Policy

Optional questions may be skipped.

Required questions must be completed before onboarding finishes.

---

# Completion Criteria

Buyer onboarding is complete when:

* Business Type
* Industry
* Product Categories
* Typical Order Quantity
* Budget

have been collected.

---

Supplier onboarding is complete when:

* Business Name
* Business Type
* Contact Information
* Business Address
* Product Categories
* MOQ

have been collected.

---

# Marketplace Personalization

After onboarding, the application generates a Personalization Profile.

This profile influences:

* Homepage recommendations
* Featured products
* Search ranking
* Product recommendations
* AI conversations
* Similar product suggestions
* Dashboard content

No recommendation should rely solely on onboarding. Future behavior (search history, viewed products, orders) should gradually become more influential while onboarding serves as the initial personalization signal.

---

# Data Lifecycle

```text
User Answers
        │
        ▼
Validation
        │
        ▼
Structured Profile
        │
        ▼
Personalization Profile
        │
        ▼
Marketplace Experience
        │
        ▼
Updated by Future User Activity
```

Onboarding establishes the user's initial profile, while ongoing interactions continuously refine personalization.

---

# Future Enhancements

The onboarding architecture should support future capabilities without requiring redesign.

Potential enhancements include:

* Resume interrupted onboarding
* AI-generated business insights
* Industry-specific onboarding flows
* Import business profile from website
* OCR-based business verification
* Voice-first onboarding
* Multi-language onboarding
* Dynamic question generation based on previous answers

These enhancements are outside the scope of the hackathon prototype but are supported by the overall design.
