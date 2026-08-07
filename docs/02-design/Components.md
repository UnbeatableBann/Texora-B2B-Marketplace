# Components Design System

# Purpose

This document defines every reusable UI component used throughout the Textile Marketplace.

The goal is to establish a consistent, scalable, and maintainable design system that allows every screen to be built using reusable building blocks instead of custom UI.

Every feature should compose these shared components rather than creating feature-specific variations whenever possible.

---

# Design Principles

The component library should follow these principles.

## Reusable

Components should be reusable across multiple pages.

---

## Consistent

The same component should behave the same way everywhere.

---

## Accessible

Every component should support:

* Keyboard navigation
* Focus states
* Screen readers
* Sufficient contrast

---

## Responsive

Components should work on:

* Desktop
* Tablet
* Mobile

---

## Stateless by Default

Components should receive data via props and emit events.

Business logic should remain outside components.

---

## Composable

Complex interfaces should be created by composing simple components.

---

# Component Categories

```text
Components

│

├── Layout

├── Navigation

├── Forms

├── Inputs

├── Buttons

├── Feedback

├── Cards

├── Data Display

├── Commerce

├── AI

├── Dashboard

└── Utility
```

---

# Layout Components

## App Layout

Used by:

* Buyer Dashboard
* Supplier Dashboard
* Marketplace

Contains

* Header
* Sidebar
* Content
* Footer

---

## Container

Provides consistent page width.

Variants

* Small
* Medium
* Large
* Full Width

---

## Section

Groups related content.

Supports

* Title
* Description
* Actions

---

## Grid

Responsive grid system.

Supports

* 1 Column
* 2 Column
* 3 Column
* 4 Column
* Auto Fill

---

## Stack

Vertical layout component.

Supports spacing only.

---

## Divider

Visual separator.

Variants

* Horizontal
* Vertical

---

# Navigation Components

## Header

Contains

* Logo
* Navigation
* Search
* Notifications (Future)
* Profile Menu

---

## Sidebar

Used inside dashboards.

Supports

* Navigation Groups
* Active Item
* Collapse

---

## Breadcrumb

Example

```text
Marketplace

>

Cotton

>

Premium Cotton
```

---

## Tabs

Used for:

* Profile
* Orders
* Product Management

---

## Pagination

Supports

* Previous
* Next
* Page Numbers

---

# Button Components

## Primary Button

Main action.

Examples

* Login
* Checkout
* Publish Product

---

## Secondary Button

Supporting action.

---

## Outline Button

Less emphasis.

---

## Text Button

Minimal emphasis.

---

## Icon Button

Icon only.

Example

Search

Back

Delete

---

## Floating Action Button

Used for

* AI Assistant

---

# Form Components

## Form

Wrapper around form elements.

Handles

* Validation
* Submission

---

## Form Section

Groups fields.

---

## Form Label

Reusable label.

---

## Form Helper Text

Displays guidance.

---

## Validation Message

Displays errors.

---

# Input Components

## Text Input

Supports

* Placeholder
* Validation
* Disabled

---

## Text Area

Multi-line input.

---

## Password Input

Supports

* Show Password

---

## Search Input

Used throughout marketplace.

Supports

* Search Icon
* Clear Button

---

## Number Input

Used for

* Quantity
* Price

---

## Email Input

Validation included.

---

## Phone Input

Country-aware (future).

---

## Select

Dropdown selection.

---

## Multi Select

Used during onboarding.

---

## Checkbox

Multiple selections.

---

## Radio Group

Single selection.

---

## Toggle Switch

Binary settings.

---

## Date Picker

Future.

---

## File Upload

Used for

* Product Images
* Company Logo

Supports

* Drag & Drop
* Multiple Files

---

# Card Components

## Product Card

Displays

* Image
* Name
* Price
* Supplier
* Availability

Used by

* Marketplace
* Recommendations
* Search

---

## Category Card

Displays

* Category
* Image
* Product Count

---

## Dashboard Card

Displays metrics.

Examples

* Total Products
* Orders
* Revenue

---

## Supplier Card

Displays

* Business Name
* Location
* Categories

---

## Recommendation Card

Displays recommended products.

---

## Order Card

Displays

* Order Number
* Status
* Total

---

## Profile Card

Displays profile summary.

---

# Commerce Components

## Product Gallery

Supports

* Primary Image
* Gallery
* Zoom (future)

---

## Price Display

Displays

* Price
* Currency

Future

* Discounts

---

## Quantity Selector

Supports

* Increase
* Decrease

---

## Availability Badge

Variants

* In Stock
* Low Stock
* Out Of Stock

---

## Shopping Cart Item

Displays

* Product
* Quantity
* Price
* Remove

---

## Order Summary

Displays

* Items
* Totals
* Checkout

---

# Dashboard Components

## Metric Card

Displays

* Title
* Value
* Trend (future)

---

## Quick Action Card

Navigation shortcut.

---

## Activity List

Displays

* Recent Orders
* Recent Products

---

## Inventory Alert

Displays

* Product
* Current Stock

---

## Recommendation Carousel

Horizontal product list.

---

# AI Components

## AI Chat Button

Floating action button.

---

## Chat Window

Contains

* Conversation
* Input
* Suggestions

---

## AI Message

Assistant message.

---

## User Message

User message.

---

## Suggested Prompt

Quick conversation starter.

---

## AI Product Card

Product recommendation inside chat.

---

## AI Loading Indicator

Displayed while generating responses.

---

# Feedback Components

## Alert

Variants

* Success
* Error
* Warning
* Information

---

## Toast

Temporary notification.

---

## Loading Spinner

General loading.

---

## Skeleton

Placeholder UI.

---

## Empty State

Used when no data exists.

Example

"No Orders"

---

## Error State

Displays

* Message
* Retry Button

---

## Success State

Used after

* Checkout
* Profile Update

---

# Modal Components

## Modal

Reusable dialog.

---

## Confirmation Modal

Examples

* Delete Product
* Archive Product

---

## Drawer

Right-side panel.

Examples

* Inventory History

---

## Bottom Sheet

Mobile interaction.

---

# Table Components

## Data Table

Supports

* Sorting
* Pagination
* Selection

Used for

* Orders
* Products
* Inventory

---

## Table Toolbar

Contains

* Search
* Filters
* Actions

---

# Badge Components

## Status Badge

Variants

* Pending
* Published
* Completed
* Archived

---

## Category Badge

Displays category.

---

## AI Badge

Indicates AI-generated content.

---

# Utility Components

## Avatar

Buyer

Supplier

---

## Logo

Business logo.

---

## Tooltip

Hover information.

---

## Chip

Used for

* Categories
* Tags
* Filters

---

## Tag

Metadata label.

---

## Separator

Visual divider.

---

# Component Relationships

```text
Page

↓

Layout

↓

Section

↓

Components

↓

Subcomponents

↓

Primitive Components
```

---

# Naming Convention

Component names should use PascalCase.

Examples

```text
ProductCard

ShoppingCartItem

OrderSummary

MetricCard

InventoryAlert
```

---

# Component Organization

```text
components/

├── layout/

├── navigation/

├── forms/

├── inputs/

├── buttons/

├── cards/

├── commerce/

├── dashboard/

├── ai/

├── feedback/

├── modals/

├── tables/

└── shared/
```

---

# Design Tokens

Every component should consume shared design tokens.

Never hardcode values.

Typography

* Font Family
* Font Size
* Font Weight

Spacing

* XS
* SM
* MD
* LG
* XL

Colors

* Primary
* Secondary
* Surface
* Border
* Text
* Success
* Warning
* Error

Radius

* Small
* Medium
* Large
* Full

Shadow

* Small
* Medium
* Large

---

# Accessibility Requirements

Every component must:

* Support keyboard navigation.
* Display visible focus indicators.
* Provide accessible labels.
* Meet WCAG AA contrast requirements.
* Support screen readers.
* Maintain logical tab order.

---

# Responsive Behavior

Desktop

* Full layouts
* Hover interactions
* Multi-column grids

Tablet

* Responsive layouts
* Touch-friendly controls

Mobile

* Single-column layouts
* Larger touch targets
* Bottom sheets where appropriate
* Swipe gestures for supported components

---

# Acceptance Criteria

## Reusability

* Components are reusable across multiple features.
* No duplicated UI implementations exist for the same behavior.

---

## Consistency

* Shared components have consistent styling and interaction patterns.
* Design tokens are used instead of hardcoded values.

---

## Accessibility

* All interactive components are keyboard accessible.
* Components expose appropriate ARIA attributes where needed.
* Focus states are visible.

---

## Responsiveness

* Components adapt correctly across desktop, tablet, and mobile.
* Layouts remain usable at all supported breakpoints.

---

## Performance

* Components render efficiently.
* Lazy loading is used for heavy components where appropriate.
* Components avoid unnecessary re-renders.

---

# Future Enhancements

The design system should support:

* Dark Mode
* Multiple Themes
* Component Variants
* Motion & Animation Tokens
* Charts and Data Visualization
* Rich Text Editor
* Drag-and-Drop Components
* Timeline Components
* Calendar Components
* Virtualized Tables
* Design Token Automation
* Figma Design Token Synchronization

---

# Out of Scope

This document does not define:

* Page layouts
* Business logic
* API integrations
* Feature workflows
* Backend implementation
* Database models

Its responsibility is limited to defining the reusable UI components that form the visual foundation of the Textile Marketplace.
