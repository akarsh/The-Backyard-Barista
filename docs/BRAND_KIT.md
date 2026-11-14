# Brand & Marketing Toolkit Guide — KaapiWerk

> Official brand identity, visual guidelines, print specifications, and trilingual marketing copy toolkit for **KaapiWerk** (`కాపీవెర్క్` / `Akarsh Seggemu · Coffee Barista`).
>
> **Copyright & Trademark Notice**: © 2026 **Akarsh Seggemu** (`ఆకర్ష్ సెగ్గెము`). All original geometric brand marks, names, and copy belong to Akarsh Seggemu.

---

## 1. Brand Essence & Naming

### Brand Name: **KaapiWerk**
- **Telugu Identity**: `కాపీవెర్క్` · `ఆకర్ష్ సెగ్గెము · కాఫీ బారిస్టా`
- **German / Berlin Identity**: `KaapiWerk · Berliner Rösterei`
- **Phonetic Architecture**:
  - **Seggemu** (*SEG-geh-moo* / `సెగ్గెము`): Founder surname rooted in Telangana, anchoring personal craftsmanship and ownership.
  - **Kaapi** (*KAA-pee* / `కాపీ`): South Indian cultural homage to slow, aromatic filter coffee hospitality.
  - **Werk** (*VERK* / `వెర్క్`): German craft-workshop ethos evoking Berlin micro-roastery precision, calibration, and architectural clarity.

### Brand Voice (EN · DE · TE)
| Attribute | English (`en`) | Deutsch (`de`) | తెలుగు (`te`) |
| :--- | :--- | :--- | :--- |
| **Tone** | Warm, sensory, exact, unpretentious | Herzlich, präzise, sensorisch, direkt | ఆత్మీయం, స్పష్టమైనది, ఆచరణాత్మకం |
| **Core Promise** | Gram-by-gram specialty craft | Grammgenaue Spezialitäten-Handwerkskunst | కచ్చితమైన కొలతలతో ప్రత్యేక కాఫీ |
| **Avoid** | Gatekeeping jargon, vague claims | Gestelztes Marketing, Übertreibungen | కృత్రిమ పదాలు, అస్పష్టత |

---

## 2. Print-Ready Logo Specifications (`src/components/BrandLogo.tsx`)

The **KaapiWerk** mark is a 100% original geometric SVG built exclusively from crisp, print-safe primitives on a `64 × 64` grid:
1. **Octagonal Seal** — Deccan / Kakatiya stone-architecture chamfered perimeter (`points="20,4 44,4 60,20 60,44 44,60 20,60 4,44 4,20"`) with Limestone/Basalt backing fill.
2. **V60 Pour-Over Funnel & Collar** — Sharp diagonal extraction cone (`points="18,17 46,17 37,29 27,29"`) crowned by a Bauhaus collar bar (`x1=13..51`) and center extraction drop.
3. **Pochampally Diamond Coffee Bean** — Telangana handloom-inspired diamond drop (`points="32,35 44,44.5 32,54 20,44.5"`) carved by a negative-space roasted coffee bean S-curve seam (`M32 37.5 C30 41.5 34 47.5 32 51.5`).
4. **Woven Pochampally Selvedge (`PochampallyStrip.tsx`)** — Repeating `6px` geometric terracotta, turmeric, and ink diagonal ribbon separating hero/footer stationery boundaries.

### Clear Space & Sizing Rules
- **Clear Space**: Maintain at least `0.25 × W` (25% of logo width) unobstructed margin on all four sides.
- **Minimum Digital Size**: `24px × 24px` (`16px` simplified favicon without stem detail).
- **Minimum Print Size**: `18 mm × 18 mm` for cup sleeves, roast bags, and wax/rubber stamps.

### Approved Print Variants
| Variant | Ink / Substrate | Usage |
| :--- | :--- | :--- |
| **Primary 2-Color Screen / Digital** | Limestone (`#F8F5EE`) fill + Kakatiya Ink (`#191614`) frame + Pochampally Terracotta (`#A62C1B`) cone + Turmeric Gold (`#B45309`) diamond | Web header, packaging stickers, ceramic saucer rim, menus |
| **Dark Mode Digital** | Basalt (`#1C1917`) fill + Ivory (`#F5F0E6`) frame + Ember (`#DC4A33`) cone + Marigold (`#F59E0B`) diamond | Dark UI theme, neon/LED storefront signage |
| **1-Ink Rubber / Kraft Cup Stamp** | Solid Kakatiya Ink (`#191614`) or Unbleached Black on Kraft cardboard | Disposable coffee cups, paper carry bags, kraft tasting cards, wax seals |
| **Knockout White Foil** | Pure White (`#FFFFFF`) on matte espresso bag or dark ceramic tumbler | Foil stamping on 250g / 1kg whole-bean bags |

---

## 3. Telangana Dual-Theme Color Palette (Web & Print)

### Light Mode — *Deccan Limestone*
| Token | Hex | RGB | Approx. Print CMYK | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Deccan Limestone** | `#F8F5EE` | `248, 245, 238` | `2 / 3 / 7 / 0` | Primary page canvas & warm stationery stock |
| **Crisp Loom** | `#FFFFFF` | `255, 255, 255` | `0 / 0 / 0 / 0` | Cards, recipe sheets, clean menu panels |
| **Warm Sand** | `#EFE9DC` | `239, 233, 220` | `5 / 7 / 14 / 0` | Secondary surface, active dock highlight |
| **Kakatiya Ink** | `#191614` | `25, 22, 20` | `68 / 65 / 67 / 80` | Primary headlines, borders, 1-ink stamps |
| **Muted Stone** | `#5C534A` | `92, 83, 74` | `53 / 52 / 58 / 30` | Secondary labels & metadata (`>= 4.5:1` contrast) |
| **Pochampally Terracotta** | `#A62C1B` | `166, 44, 27` | `18 / 89 / 94 / 12` | Primary CTAs, brand accent, terracotta clay |
| **Turmeric Gold** | `#B45309` | `180, 83, 9` | `18 / 68 / 100 / 8` | Native Telugu sublines, spice warmth accents |

### Dark Mode — *Deccan Basalt*
| Token | Hex | RGB | Role |
| :--- | :--- | :--- | :--- |
| **Deccan Basalt** | `#12100E` | `18, 16, 14` | Primary dark background |
| **Roasted Charcoal** | `#1C1917` | `28, 25, 23` | Elevated cards & utility dock |
| **Espresso Elevated** | `#26221E` | `38, 34, 30` | Interactive chips & active controls |
| **Warm Ivory** | `#F5F0E6` | `245, 240, 230` | High-contrast dark-mode typography |
| **Terracotta Ember** | `#DC4A33` | `220, 74, 51` | Dark-mode primary CTA & active action |
| **Marigold Gold** | `#F59E0B` | `245, 158, 11` | Highlight metrics, Telugu accent, gold badge |

---

## 4. Typography System

- **Display / Editorial Serif**: `Fraunces` (Optical size 9–144, weights `400`, `500`, `600`) — used for headlines, coffee titles, and brand lockup.
- **UI / Body Sans**: `Plus Jakarta Sans` (weights `400`, `500`, `600`, `700`) — clean geometric legibility across iPhone, iPad, and MacBook viewports.
- **Brew Metrics Monospace**: `JetBrains Mono` (`tabular-nums`, weights `400`, `500`) — reserved strictly for gram weights, brew ratios (`1:16`), temperatures (`93°C`), and countdown timers.
- **Telugu Script**: `Noto Sans Telugu` (weights `400`, `500`, `600`) — paired automatically whenever Telugu text or `<html lang="te">` is active.

---

## 5. Packaging & Merchandising Application Specs

1. **250g Whole-Bean Bag Label (`70 mm × 105 mm` vertical card)**:
   - **Top**: Centered octagonal logo mark (`20 mm`) + `KAAPIWERK` wordmark.
   - **Body**: Origin Lot (e.g., `Worka Sakaro Reserve`), Elevation (`2,150m`), Process (`Washed`), 3 tasting notes separated by middle dots (`·`).
   - **Recipe Stamp**: Bottom monospace band (`16g · 256ml · 95°C · 2:45`).
   - **Footer**: `© 2026 Akarsh Seggemu · Berlin · భాగ్యనగరం`.
2. **Cup Sleeve / Takeaway Stamp**:
   - Use the **1-Ink Kakatiya `#191614`** octagonal stamp at `24 mm` diameter centered on unbleached kraft sleeves.
3. **Digital OpenGraph / Social Card (`1200 × 630 px`)**:
   - Deccan Limestone (`#F8F5EE`) or Basalt (`#12100E`) background, crisp 1px structural border, left editorial serif headline, right 4:3 pour-over photography.

---

## 6. Ready-to-Use Trilingual Marketing Copy Templates

### Social Bio / Storefront Tagline
- **English**: *KaapiWerk by Akarsh Seggemu — Telangana hospitality meets Berlin micro-roastery craft.*
- **Deutsch**: *KaapiWerk von Akarsh Seggemu — Telangana-Kaffee trifft Berliner Rösthandwerk.*
- **తెలుగు**: *ఆకర్ష్ సెగ్గెము · కాపీవెర్క్ — తెలంగాణ కాఫీ ఆతిథ్యం, బెర్లిన్ రోస్టరీ నైపుణ్యం.*

### Launch Post Caption
- **English**: *New on bar: dial in your flavor direction, lock your roast curve, and follow our live gram-by-gram brew timer—built for home espresso bars and V60 rituals alike.*
- **Deutsch**: *Neu an der Bar: Wähle deine Aromen, fixiere deine Röstkurve und brühe mit unserem Live-Phasen-Timer aufs Gramm genau.*
- **తెలుగు**: *కొత్త కాఫీ స్టూడియో: మీకు ఇష్టమైన రుచిని ఎంచుకోండి, రోస్ట్ & పాలను సెట్ చేయండి మరియు లైవ్ బ్రూ టైమర్‌తో కచ్చితమైన కాఫీని ఇంట్లోనే తయారు చేయండి.*
