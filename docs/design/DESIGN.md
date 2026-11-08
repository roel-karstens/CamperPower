# CamperPower Design Document

## Design Intent
Design for confidence under uncertainty: users are often stressed, time-limited, and worried about making expensive or unsafe electrical choices.

Core UX principles:
- Clarity over cleverness.
- Progressive disclosure for technical details.
- Safety-forward language at every critical step.
- Explainability for each recommendation.

## Visual Direction (Reference-Informed)
Reference review used these sites:
- puurwatt.nl
- mymoneymile.com
- macroatlas.vercel.app

Patterns to keep:
- Direct, question-first headlines and calm confidence.
- Dense but clean sections that prioritize utility over decoration.
- Transparent method language near calculators and outputs.
- Editorial imagery that supports context, not generic stock filler.

Patterns to avoid:
- Generic SaaS gradients and neon accents.
- Unexplained charts or claims without source context.
- Over-animated UI that distracts from decisions.

## Brand Personality
- Technical but warm.
- Practical, grounded, and honest about uncertainty.
- Designed for people making expensive decisions under pressure.

## Color System (Tight Palette)
Use a compact, repeatable palette with strict role mapping:

- Base ink: `#0F172A` (deep navy text)
- Canvas: `#F7F9F7` (soft mineral background)
- Surface: `#FFFFFF` (cards and forms)
- Primary: `#1F6E5A` (camper-energy green)
- Primary dark: `#164E41`
- Accent: `#C98A2E` (amber for key highlights)
- Info: `#2D6FA3`
- Danger: `#B43F3F`
- Border: `#D6DDD8`

Usage constraints:
- Maximum one primary and one accent per viewport section.
- Reserve accent for important values, warnings, and callouts.
- Keep backgrounds light; avoid heavy dark-mode bias for MVP.

## Typography
Avoid default UI stacks. Adopt a three-layer type system:

- Display/headlines: "Sora", "Avenir Next", sans-serif
- Body/interface: "Source Sans 3", "Segoe UI", sans-serif
- Data and formulas: "IBM Plex Mono", "Consolas", monospace

Type scale:
- H1: 44/52, weight 650
- H2: 32/40, weight 620
- H3: 24/32, weight 600
- Body L: 20/30
- Body: 18/28
- Small/meta: 14/22

## Layout and Spacing
- Content width: 72rem max for reading sections.
- Tool width: 82rem max for calculator and output grids.
- Vertical rhythm: 8px baseline, section spacing in 40/56/72px steps.
- Use strong alignment rails; no floating orphan cards.

## Imagery Style
- Use real-world, context-rich photos: camper interiors, wiring context, batteries, solar setups, route/camp scenes.
- Favor documentary realism over glossy ad-style visuals.
- Crop to support reading flow (not just decoration).
- Every image must have alt text and source attribution.
- Maintain a dedicated public credits page (see `IMAGE-SOURCES.md`).

## Motion Guidelines
- Keep motion purposeful and sparse.
- Page-load: mild fade-up for hero + stagger for 3 key actions.
- Step transitions: horizontal slide with 180-220ms easing.
- Avoid looped decorative animations and parallax for MVP.

## UI Token Example
```css
:root {
	--cp-ink: #0f172a;
	--cp-canvas: #f7f9f7;
	--cp-surface: #ffffff;
	--cp-primary: #1f6e5a;
	--cp-primary-dark: #164e41;
	--cp-accent: #c98a2e;
	--cp-info: #2d6fa3;
	--cp-danger: #b43f3f;
	--cp-border: #d6ddd8;
}
```

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
- Methodology
- Image Credits

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
- Method notes and assumptions are visible near the result summary.

## Mobile-First Constraints
- Keep each step under one screen when possible.
- Sticky summary card for total usage and key outputs.
- Avoid complex side-by-side tables on small screens.

## Trust Features
- Source notes for rules and assumptions.
- Version stamp for calculator logic.
- "Reviewed by" badge for expert-reviewed rule sets.
- Public methodology and image-credit pages linked from footer.

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

## Design QA Checklist
- Palette and type tokens match this document.
- No generic stock-photo hero image without contextual relevance.
- Every page includes at least one clear next action.
- Calculator outputs include explanation and assumption references.
- Footer includes links to methodology, disclosures, and image credits.
