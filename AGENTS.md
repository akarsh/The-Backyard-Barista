# AGENTS.md — AI Coding Agent Guide

> Universal orientation specification for Claude, GPT, Gemini, Codex, Cursor, and any automated engineering agent inspecting or modifying **Seggemu KaapiWerk** (`సెగ్గెము ఆకర్ష్ · కాఫీ బారిస్టా` / `Akarsh Seggemu · Coffee Barista`).

## 1. Project Identity & Purpose

- **Brand**: Seggemu KaapiWerk — Telangana-rooted (`Kaapi`), Berlin-inspired (`Werk`) specialty coffee crafting studio created by **Akarsh Seggemu**.
- **Dual-Mode Runtime**:
  1. **Live AI Server Mode** (`npm run dev` or `npm start`): Express (`server.ts`) serves Vite/React + rate-limited `/api/barista/*` endpoints backed by Google `@google/genai`.
  2. **Zero-Cost Static Mode** (`npm run build` → `dist/`, GitHub Pages `*.github.io`): Pure static SPA. When `/api/barista/*` returns HTTP `404`/`405` or network fallback, the client seamlessly switches to `src/utils/staticBarista.ts` and loads/syncs `public/data/recipe-journal.json` with zero cloud database or GCP cost.

## 2. Tech Stack

- **Frontend**: React 19, TypeScript 7, Vite 8 (`@tailwindcss/vite`, Tailwind CSS v4), `lucide-react` icons.
- **Backend**: Node.js (ESM), Express 4, `tsx` (dev runner), `@google/genai` (server-side only).
- **Theming**: Tailwind v4 class-based dark mode (`@custom-variant dark (&:where(.dark, .dark *));`) paired with `matchMedia("(prefers-color-scheme: dark)")` system detection and an inline pre-paint script in `index.html` to eliminate flash of unstyled content (FOUC).

## 3. Repository Structure

```text
.
├── index.html                  # Pre-paint theme loader, Noto Sans Telugu + Playfair/Inter/JetBrains fonts
├── server.ts                   # Express server, Vite middleware, Gemini API routes & security middleware
├── vite.config.ts              # ESM-safe Vite config (fileURLToPath) for React + Tailwind v4
├── public/
│   └── data/
│       └── recipe-journal.json # Static repository JSON database (versioned, zero raw PII)
├── docs/
│   ├── ARCHITECTURE.md         # Human + AI visual architecture & Mermaid diagrams
│   └── BRAND_KIT.md            # Brand & marketing toolkit (logo specs, Telangana palette, EN/DE/TE copy)
├── AGENTS.md                   # Universal AI repository guide (this file)
├── CLAUDE.md                   # Claude-specific quick reference & conventions
└── src/
    ├── main.tsx                # React 19 entry point
    ├── index.css               # Tailwind v4 import, @custom-variant dark, root canvas styling
    ├── App.tsx                 # Top-level state (preferences, recipe, theme, i18n, SHA-256 auth, journal)
    ├── types/
    │   └── coffee.ts           # Shared TypeScript interfaces (CraftPreferences, CraftedRecipe, JournalEntry)
    ├── data/
    │   └── pantry.ts           # Origin lots, roast curves, milk pairings, flavor chips & default recipe
    ├── i18n/
    │   └── translations.ts     # Full English (en), German (de), and Telugu (te) UI dictionary
    ├── hooks/
    │   ├── useLanguage.ts      # EN / DE / TE language selector with persistence & <html lang> sync
    │   └── useTheme.ts         # "system" | "light" | "dark" manager with live OS listener
    ├── utils/
    │   ├── copyRecipe.ts       # Formats CraftedRecipe into emoji-rich clipboard summary
    │   ├── githubJournal.ts    # Fetches static JSON, merges entries, commits via GitHub Contents API
    │   ├── security.ts         # SHA-256 salted userKey derivation, handle masking, prototype-safe JSON parser
    │   └── staticBarista.ts    # Deterministic offline barista craft & chat engine for GitHub Pages
    └── components/
        ├── BrandLogo.tsx       # Original 100% copyright-free octagonal V60 + Pochampally print-ready stamp SVG
        ├── PochampallyStrip.tsx # Signature 6px Telangana ikat × Bauhaus geometric selvedge divider
        ├── FloatingUtilityDock.tsx # Right-edge floating EN/DE/తె, Auto/Light/Dark & Scroll-to-Top dock
        ├── LanguageToggle.tsx  # Reusable EN / DE / తె segmented switcher
        ├── ThemeToggle.tsx     # Reusable Auto / Light / Dark segmented control
        ├── Header.tsx          # Sticky top navigation bar + drawer trigger
        ├── HeroSection.tsx     # Brand lockup, Telugu tagline, hero showcase, metric strip
        ├── CraftingStudio.tsx  # Two-column configurator, brew sheet, Brew Timer, Visualize Brew, Milo chat
        ├── BrewTimer.tsx       # Multi-phase circular countdown timer synced to recipe.brewRecipe.timerPhases
        ├── ShoppingListPanel.tsx # Editable ingredients & gear checklist derived from active recipe
        ├── RecipeJournalSection.tsx # Passwordless SHA-256 sign-in, saved recipes, GitHub PAT sync & JSON export
        ├── OriginShowcase.tsx  # Direct-trade single-origin lots & roast/milk matrix
        ├── ArchitectureDiagram.tsx # Interactive "05. System Map for Humans" flow visualizer
        ├── SavedBrewsDrawer.tsx # Slide-over quick access drawer for saved journal entries
        ├── MobileBottomNav.tsx # Responsive mobile-only quick navigation dock
        └── ResilientImage.tsx  # Image renderer with warm gradient fallback
```

## 4. Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Start Express + Vite dev server on `http://localhost:3000` |
| `npm run build` | Compile production static bundle into `dist/` |
| `npm run lint` | Run TypeScript typechecking (`tsc --noEmit`) |
| `npm start` | Serve production `dist/` via Node ESM (`node server.ts`) |

## 5. Non-Negotiable Architecture & Security Invariants

1. **Server-Side AI Only**: Never import `@google/genai` or expose `GEMINI_API_KEY` in `src/`. All Gemini calls happen inside `server.ts`.
2. **Preserve Existing Hash & Storage Seeds**: Keep `USER_STORAGE_KEY = "sable_origin_journal_user_v1"`, `LOCAL_JOURNAL_STORAGE_KEY = "sable_origin_local_journal_v1"` in `src/App.tsx`, and the SHA-256 salt prefix `"sable-origin-journal-v1:"` in `src/utils/security.ts` untouched so existing saved recipes remain compatible.
3. **Zero Raw PII in Repo JSON**: Usernames/emails are normalized, validated, hashed via Web Crypto SHA-256 (`deriveUserKey`), and masked (`maskDisplayHandle`) before writing to `JournalEntry` or committing `public/data/recipe-journal.json`.
4. **Memory-Only GitHub Token**: `githubToken` in `App.tsx` lives exclusively in React memory (`useState`) and is cleared on sign-out. Never persist tokens in `localStorage` or `sessionStorage`.
5. **Prototype Pollution & XSS Defense**: Parse untrusted JSON with `safeJsonParse` + `sanitizeRepoJournalFile` (`src/utils/security.ts`). Keep `https://` protocol validation on external links.
6. **ESM Node Compatibility (`server.ts`)**: `npm start` executes `node server.ts` directly. Do not use TypeScript runtime-only features (`enum` declarations, parameter properties, or relative `.ts` file extension imports inside `server.ts`).
7. **Dual-Theme Parity**: Every UI surface, border, and text class must support both light (`#F8F5EE` Deccan Limestone / `#FFFFFF` / `#191614` / `#A62C1B` Pochampally Terracotta) and dark (`#12100E` Deccan Basalt / `#1C1917` / `#F5F0E6` / `#F59E0B` Marigold) modes using Tailwind `dark:` utilities without `!important`.
