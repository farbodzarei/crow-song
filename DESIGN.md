# Design

Visual system for Crow Song Yoga Therapy. Tokens are the single source of truth in
`src/styles/tokens.css`; this document explains intent. Colors are committed brand values
(from the brand identity deck) — identity preservation wins over any greenfield palette move.

## Theme

Dark-anchored, breathing in and out between dark (Crow) and light (Stone/Mist/Haze) sections.
The mood is an exhale: calm, grounded, quietly mystical. Not a wellness palette — deliberately
no sage, no blush. Restraint carries the premium.

## Color

Strategy: **Restrained** — dark/light surfaces with a single lavender accent ≤10%, used only
in small intentional moments (buttons, a rule, an underline, a hover, a marker, a glow).

- **Accent** — Lavender `#9B8BB8` (deep `#7A6A9A`, soft `#C4B8D6`)
- **Dark surfaces** — Crow `#2E2633`, Charcoal `#1C1B1E`
- **Light surfaces** — Stone `#F7F6F5`, Mist `#F4F2F6`, Haze `#E8E1EE` (lavender-tinted light)
- **Text on dark** — Mist `#F4F2F6` / white `#FFFFFF`; muted Soft `#C4B8D6`
- **Text on light** — Charcoal `#1C1B1E`; muted Mid `#7D7A80`

Rule: lavender is **never** a large background fill. (Exception under review: the client-approved
CTA band uses a full lavender fill — flagged, kept by client request.)

## Typography

**Raleway** throughout (local variable font, default W), weights 100–700. A single family with
committed weight/size contrast — display set light (100–300) at large sizes for a floating,
breath-like feel; headings 300–500 with airy, slightly expanded tracking; body 300–400 with
generous 1.7 line-height. Fluid `clamp()` scale, display ceiling ≤6rem.

## Motion

Library: **Motion** (`motion/react`). Ease `cubic-bezier(0.16,1,0.3,1)`, durations 0.9–1.4s.
Gentle fade + rise on scroll (small upward translate + opacity, slight stagger). Ambitious but
calm first-load choreography in the hero. Every effect has a reduced-motion fallback. Reserved
hooks (`#fx-layer`) for the custom feather cursor + particles.

## Layout

Wide calm container (max 1200px) with fluid side padding. Generous, varied vertical rhythm
between sections. Alternating dark/light cadence planned, not random. Mobile-first; the calm and
whitespace must survive on a phone.

## Components

Tokenized and reused: `Reveal` (scroll reveal, reduced-motion aware), `Divider` (the short
lavender rule), `Button` (in-palette variants), `Nav` (blur-on-scroll), `Cursor` (fine-pointer
lavender dot + trailing ring). One component per section under `src/sections/`.
