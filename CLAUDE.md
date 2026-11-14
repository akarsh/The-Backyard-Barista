# CLAUDE.md — Project Working Agreement

Read `AGENTS.md`, `docs/ARCHITECTURE.md`, and `docs/BRAND_KIT.md` first for the complete file map, brand tokens, commands, and diagrams.

## Quick Context

- **App Name**: **KaapiWerk** (`కాపీవెర్క్` / `Akarsh Seggemu · Coffee Barista`), copyrighted by **Akarsh Seggemu**.
- **Runtime**: Works both as a full-stack Express + Gemini app (`server.ts`) and as a zero-cost static website on GitHub Pages (`dist/` + `src/utils/staticBarista.ts` + `public/data/recipe-journal.json`).

## Implementation Rules

1. **Before claiming completion**, run both:
   - `npm run lint` (`tsc --noEmit`)
   - `npm run build` (`vite build`)
2. **Styling & Telangana Dual-Theme Tokens**:
   - Tailwind v4 uses `@custom-variant dark (&:where(.dark, .dark *));` in `src/index.css`.
   - Light tokens: `#F8F5EE` (Deccan Limestone), `#FFFFFF` (Crisp Loom), `#EFE9DC` (Sand), `#191614` (Kakatiya Ink), `#5C534A` (Muted Stone), `#A62C1B` (Pochampally Terracotta), `#B45309` (Turmeric Gold).
   - Dark tokens: `#12100E` (Deccan Basalt), `#1C1917` (Roasted Charcoal), `#26221E` (Espresso Elevated), `#F5F0E6` (Warm Ivory), `#B8AFA4` (Muted Stone), `#DC4A33` (Terracotta Ember), `#F59E0B` (Marigold Gold).
   - Maintain a clean layout across iPhone (`375px–430px`), iPad (`768px–1024px`), and MacBook (`1280px+`) viewports.
3. **Do Not Break Compatibility**:
   - Leave `USER_STORAGE_KEY`, `LOCAL_JOURNAL_STORAGE_KEY`, and the SHA-256 salt `"sable-origin-journal-v1:"` unchanged.
   - Keep `package.json` `"start": "node server.ts"` and avoid `.ts` suffixes or TypeScript `enum` keywords in `server.ts`.
4. **Do Not Leak Secrets or PII**:
   - Keep `GEMINI_API_KEY` strictly inside `server.ts`.
   - Never persist GitHub PATs to storage or write unhashed emails/usernames to `recipe-journal.json`.
5. **Licensing**:
   - Project source and documentation are Apache-2.0 licensed; do not imply this grants rights to KaapiWerk trademarks.
   - Refresh `docs/DEPENDENCY_LICENSES.md` and `.json` after `bun install` by running `npm run licenses` when dependencies change; assess fonts, images, and other assets separately.
