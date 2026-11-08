# CamperPower

CamperPower is an independent decision and configuration platform for 12V camper electrical systems.

Core promise:
- Convert daily energy use (Wh/day) into a practical system design.
- Generate a transparent bill of materials (battery, solar, MPPT, DC-DC, cables, fuses).
- Include compatibility and safety checks for older camper installations.

## Why This Product
The source niche analysis indicates a market gap for a Dutch independent tool that is not tied to a single shop or brand. Existing results are fragmented across forums, shop content, and brand blogs.

## Product Scope (MVP)
- Configurator: Wh/day -> recommended components.
- Compatibility checker: lithium migration for older systems.
- Safety outputs: fuse and cable guidance with clear limitations.
- Price compare outlinks for affiliate monetization.

## Repository Structure
- `docs/`: central documentation hub and index.
- `docs/product/`: product definition and PDF-backed source extract.
- `docs/design/`: UX and interaction design.
- `docs/decisions/`: ADRs for key product and safety decisions.
- `backend/`: backend services (planned).
- `frontend/`: web app (planned).

## Documentation Foundation
- Strategy: `docs/FOUNDATION-STRATEGY.md`
- Architecture: `docs/ARCHITECTURE.md`
- Rule Engine: `docs/RULE_ENGINE_SPEC.md`
- Delivery Roadmap: `docs/ROADMAP-13-WEEKS.md`
- Verification: `docs/VERIFICATION_PLAN.md`
- Technical Audit: `docs/TECHNICAL_AUDIT.md`
- ADRs: `docs/decisions/`

## Source Material
Primary source:
- `docs/product/CAMPERPOWER_PDF_EXTRACT.txt`

Extracted from:
- `Affiliate-niches-analyse_CamperPower_GardenTech_EVChargeGuide.pdf`

## Next Build Steps
1. Define calculator formulas and validation rules.
2. Implement frontend MVP flow in 5 steps.
3. Build backend rule engine and versioned rule registry.
4. Add analytics events for tool completion and affiliate click-through.
5. Start validation sprint with keyword and program checks.
