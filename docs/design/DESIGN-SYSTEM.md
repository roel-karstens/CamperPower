# CamperPower design system

Outdoor, warm, and quiet. The interface borrows PuurWatt’s discipline (one message per screen, conclusion first, big numbers with a source, one type system, no shadows, short forms) and gives CamperPower its own face: golden hour, meadow, cream van, terracotta.

The light and dark tokens below were checked at WCAG 2.2 AA: 4.5:1 for text, 3:1 for borders. Button text always uses `--accent-fg` on `--accent`.

## How the palette was made

1. k-means (8 clusters) on `hero-mountains`, plus region samples of the left sky, the meadow, and the van.
2. The sky sits around OKLCH L 0.93, C 0.06, hue 85 (`#F9E4BA`). The meadow is the same hue, much darker (`#665225`). Shadows are warm brown (`#302D19`).
3. Those colours are atmosphere, not UI tokens. Page background is the sky pulled toward white and slightly less chroma (`#F6F0E4`). Body text is the shadow deepened until it clears 15:1 on that background.
4. Buttons stay in the rust/terracotta family the brand asked for, tuned so cream text still clears 4.5:1. Links and big numbers use a deep meadow spruce: it is in the photograph, and it is the complement of the rust.
5. Dark tokens are the same hues, flipped. The dark rust is `#B24A2E` rather than the lighter candidate `#C4623C`, which only reached 3.9:1.

## Colour

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#F6F0E4` | `#14110C` | Page |
| `--paper` | `#FFFBF6` | `#211C16` | Cards, header, forms |
| `--paper-2` | `#E8E0D0` | `#2C251C` | Alternate bands |
| `--ink` | `#1C160F` | `#F6F0E6` | Headings and body |
| `--ink-2` | `#3C3228` | `#E2D5C6` | Secondary text |
| `--muted` | `#5C5146` | `#C6B5A4` | Hints, sources |
| `--line` | `#7A6858` | `#A08C78` | Borders (3:1) |
| `--accent` | `#9A3F26` | `#B24A2E` | Primary button, footer mark |
| `--accent-hover` | `#7A3018` | `#8E3A24` | Button hover |
| `--accent-fg` | `#FFF8F1` | `#FFF8F1` | Text on `--accent` |
| `--text` | `#1E4636` | `#9FCFB8` | Links and big numbers |
| `--mark` | `#F0D4A6` | `#5C4328` | Selected answer, highlighted stat |
| `--tint` | `#F7F2E8` | `#2A231C` | Quiet wash |
| `--ok` | `#1E5C3E` | `#86C4A2` | Positive |
| `--warn` | `#8A5610` | `#E4B662` | Check this |
| `--err` | `#9C332C` | `#E89082` | Stop |
| `--sun` | `#B8732A` | `#E0A15A` | Chart fill only, not text |
| `--footer` | `#1A140F` | `#1A140F` | Footer stays dark in both themes |
| `--footer-fg` | `#F6F0E6` | `#F6F0E6` | Footer text |
| `--footer-muted` | `#D4C4B4` | `#D4C4B4` | Footer secondary |

Tightest pairs, still AA: muted on `--paper-2` 5.88:1 (light), `--accent-fg` on `--accent` 5.10:1 (dark), `--line` on `--paper-2` 4.05:1 (light, non-text). `--ink` on `--accent` is not a text pair; buttons use `--accent-fg`.

Footer hover uses `#F3D7A8` on `#1A140F` (12.8:1). Do not use the dark-theme `--mark` as footer text.

## Type

Fraunces Variable for headlines, the logo, and big numbers. Source Sans 3 Variable for body, forms, tables, and buttons.

Fraunces is a soft old-style serif: it carries the catalogue warmth of an outdoor brand, and it stays out of the way in a calculator. A single grotesque would have made the tools clear and the brand generic. A single serif would have made the forms precious. The pair is the exception to PuurWatt’s one-font rule, and it is the whole exception: no mono, no third family.

Both are self-hosted, Latin only, `font-display: swap`. Headlines use optical size and a little SOFT/WONK (`font-variation-settings`).

| Style | Size | Weight |
|---|---|---|
| Hero / h1 | `clamp(2.1rem, 4.4vw, 3.5rem)` | 560 |
| h2 | `clamp(1.5rem, 2.4vw, 2rem)` | 520 |
| Big stat | `clamp(1.7rem, 2.6vw, 2.35rem)` | 560 |
| Body | 1.0625rem / 1.6 | 400 |
| Eyebrow | 0.78rem, tracked uppercase | 600 |
| Small / source | 0.9rem | 400 |

Numbers use tabular figures. A source line sits under every big number that is not just a label.

## Shape, motion, hover

- Radius 2px. No drop shadows, including the sticky summary and cards.
- One curve: `cubic-bezier(0.2, 0, 0, 1)`, 160ms.
- Hover is a real contrast change: cards and secondary buttons invert to `--ink` with `--bg` text; the primary button steps to `--accent-hover`.
- `prefers-reduced-motion: reduce` removes transitions and the diagram’s dash animation.
- Dark theme follows the system until the header toggle stores `light` or `dark` in `localStorage` (`camperpower.theme`).

## Components

- **Header.** Sticky, solid `--paper`, brand left, one primary button, a light/dark toggle. Current page is an underline, not colour alone.
- **Hero.** Full-bleed `hero-mountains` with `srcset` 800/1600/2400 and `sizes="100vw"`. The 1600 and 2400 files are Lanczos upscales of a 1280px master, so a 1x desktop stays on 1600. A cream scrim covers the left copy; on small screens the photo stacks above the text so the van is not hidden.
- **Stat.** Big Fraunces number, short label, optional `--mark` tile for the number that is the answer.
- **Choice cards.** Short answers. The selected card is `--mark` with a rust ring. No elevation.
- **Result.** The sentence comes first (battery size, most likely cause, lithium verdict). The rest of the causes, the “already fine” checks, and the assumptions sit in `<details>`.
- **Footer.** Always the dark brown, with Methode, bronnen, geld, beeldverantwoording, privacy, contact.

## Imagery

- Home and the method page use the generated set. Credit line: “AI-gegenereerd met Grok Bot GenerateImage”, on `/beeldverantwoording` only.
- Guides use one calm Pexels photo each, 3:2 WebP at 800 and 1600. Not product macros, not AI.
- `hero-dunes` and `hero-coast` are in the repo and the credits page, and are not placed.
- Do not invent technical close-ups.

## Copy

Dutch, concrete, and willing to say what we do not know. An affiliate link, when one exists, appears at most once on a page and never next to negative advice. There are none on the site today.
