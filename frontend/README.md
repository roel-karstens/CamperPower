# CamperPower Frontend

Production-ready website and calculator experience for CamperPower.

## Stack
- React 19
- TypeScript 6
- Vite 8
- ESLint 10

## Core Product Surface
- Trust-led homepage with clear value proposition.
- Interactive 12V system configurator:
  - usage profiling (Wh/day),
  - autonomy and charging profile,
  - compatibility and safety warnings,
  - recommendation output with BOM classes.
- Supporting pages:
  - Methodology
  - Privacy
  - Affiliate Disclosure
  - Image Credits
  - Sources
  - Contact

## Commands
```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Quality Baseline
- Lint must pass with zero errors.
- TypeScript build must pass with zero errors.
- Vite production bundle must build successfully.

## Design Notes
- Palette, typography, and trust patterns are aligned with the CamperPower design docs in `../docs/design/`.
- Image attribution requirements are reflected in the public Image Credits page.
