# CamperPower Design Document

## Design Intent
Design for confidence under uncertainty: users are often stressed, time-limited, and worried about making expensive or unsafe electrical choices.

Core UX principles:
- Clarity over cleverness.
- Progressive disclosure for technical details.
- Safety-forward language at every critical step.
- Explainability for each recommendation.

## Primary User Flow
1. Trigger: "my battery is empty, I need reliable off-grid power."
2. Orientation: fixed installation vs power station.
3. Sizing: usage and autonomy inputs.
4. Compatibility: old system constraints and checks.
5. Result: bill of materials and outbound price comparison.
6. Follow-up: expansion and monitoring guidance.

## Information Architecture
- Home
- Configurator
- Compatibility Checker
- Safety and Installation Boundaries
- Guides and Calculators
- Product Comparison Pages

## Configurator IA and Interaction
### Step 1: Daily Usage
- Device cards with default Wh/day values.
- Manual override fields.
- Running total always visible.

### Step 2: Autonomy + Charging Sources
- Days without shore power.
- Charging options: solar, DC-DC while driving, shore power, power station.

### Step 3: Recommendation Output
- Battery capacity target (Ah / usable Wh).
- Solar panel target (Wp).
- MPPT and DC-DC sizing bands.
- Cable and fuse recommendations by current.

### Step 4: Compatibility and Safety Gate
- Ask about existing EBL/charger model.
- Highlight incompatibilities and required upgrades.
- Hard safety warnings for high-risk cases.

### Step 5: Bill of Materials
- Component categories with required specs.
- Multiple product options and outbound links.
- Export/share list action.

## UX Copy Requirements
- Every recommendation includes a short "why this" explanation.
- Every safety-related recommendation includes scope limitation text.
- Affiliate disclosure appears near outbound actions.

## Mobile-First Constraints
- Keep each step under one screen when possible.
- Sticky summary card for total usage and key outputs.
- Avoid complex side-by-side tables on small screens.

## Trust Features
- Source notes for rules and assumptions.
- Version stamp for calculator logic.
- "Reviewed by" badge for expert-reviewed rule sets.

## Accessibility and Performance
- WCAG AA contrast and keyboard navigation.
- Input components with explicit labels and units.
- Fast first contentful paint on mobile networks.

## Event Instrumentation
Track the full funnel:
- `view_configurator`
- `start_calculation`
- `complete_step_{n}`
- `view_recommendation`
- `export_list`
- `click_affiliate_link`
- `view_safety_warning`
