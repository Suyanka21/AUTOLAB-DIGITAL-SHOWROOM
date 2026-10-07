# Design System & Token Specification
## Project: AutoLab Digital Showroom
### Standards: Anti-AI Design Protocol Compliant (Luxury Atelier Aesthetic)

---

## 1. Aesthetic Identity & Anti-AI Rules

This design system adheres strictly to `.agents/skills/anti-ai-design/SKILL.md`:
* **Zero Generic AI Purple/Blue Gradients:** Uses an authentic bespoke luxury palette inspired by high-end automotive upholstery: Deep Obsidian, Warm Champagne Gold, Saddle Leather, and Satin Titanium.
* **No Centered Generic Card Stacks:** Uses an asymmetric, editorial layout with high spatial precision and docking configuration trays.
* **Editorial Typographic Contrast:** Sophisticated pairings (Editorial Serif for vehicle headings + precision Technical Sans for material specifications).
* **Defensive Micro-Interactions:** Subtle hover state transitions with explicit cubic-bezier curves (`cubic-bezier(0.16, 1, 0.3, 1)`). Never use `transition: all`.
* **Resilient 4 UX Pillars:** Every interactive surface explicitly handles Loading, Empty, Error, and Success states.

---

## 2. Color Palette & Semantic Tokens

### 2.1 Color Tokens
* **Background Deep (Obsidian):** `#08090C` (rich dark atelier room, not flat grayish black)
* **Surface Elevation 1 (Charcoal Substrate):** `#0E1017` (subtle border boundary)
* **Surface Elevation 2 (Card / Tray Surface):** `#161922` (interactive panels & docks)
* **Surface Hover:** `#1E2330`
* **Border Subtle:** `rgba(255, 255, 255, 0.08)`
* **Border Focus / Active Swatch Ring:** `rgba(212, 175, 55, 0.6)` (Gold Glow)
* **Primary Accent (Champagne Gold):** `#D4AF37` (precision luxury, badges, active states)
* **Secondary Accent (Warm Saddle Bronze):** `#C5A059` (secondary highlights)
* **Tertiary Accent (Emerald Atelier):** `#10B981` (verification, success alerts)
* **Text High-Contrast:** `#F8FAFC` (pure titanium white)
* **Text Muted:** `#94A3B8` (slate 400 — secondary metadata)
* **Text Subtle:** `#64748B` (slate 500 — captions, timestamps)

---

## 3. Typography Hierarchy

* **Display 1 (Atelier Hero):** 44px / 1.1 line-height, medium tracking `-0.02em`.
* **Heading 1 (Vehicle Platform):** 28px / 1.2 line-height, semibold.
* **Heading 2 (Zone Title):** 20px / 1.3 line-height, medium.
* **Body Regular (Descriptions):** 14px / 1.5 line-height, clean readability.
* **Body Small (Metadata):** 12px / 1.4 line-height, secondary notes.
* **Caption / Reference Code:** 11px / 1.4 line-height, monospace tracking `+0.05em` (`AL-SC-2026-XXXX`).

---

## 4. Radius Grammar & Elevation

* **Small Radius (`rounded-md` / 6px):** Swatch pills, small inputs, buttons.
* **Medium Radius (`rounded-lg` / 10px):** Configuration trays, modals, floating action bars.
* **Large Radius (`rounded-xl` / 16px):** Viewport container, summary sheet cards.
* **Pill (`rounded-full`):** Color swatch circles and status pills.

---

## 5. Required Component States (The 4 UX Pillars)

Every interactive list, viewer, and form must implement:
1. **Loading State:** Shimmering silhouette skeleton with pulsating amber/gold indicator.
2. **Empty State:** Purpose-built empty card with clear explanation and a primary action button.
3. **Error State:** Inline dismissible alert banner with retry capability.
4. **Success State:** Affirmative visual confirmation with generated reference code badge.
