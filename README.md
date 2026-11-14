# KaapiWerk

KaapiWerk is a trilingual coffee-crafting studio by Akarsh Seggemu, bringing Telangana coffee hospitality together with Berlin roasting craft. Explore single-origin beans, tune roast and milk pairings, and create precise brew recipes with Milo, the AI barista.

Languages: English, Deutsch, and తెలుగు.

## Get started

Requires Node.js 22 (see `.nvmrc`) and Bun.

```sh
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

For live AI recipes, chat, and brew visualization, set `GEMINI_API_KEY` in a local `.env` file. Keep API keys out of source control. Without a configured key, the server-side AI endpoints cannot run.

## Commands

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Express and Vite development server on port 3000 |
| `bun run build` | Build the static site into `dist/` |
| `bun run preview` | Preview the production build |
| `bun run lint` | Type-check the project with TypeScript |
| `bun start` | Serve the production build with Node |

Set `PORT` to change the server port.

## Runtime modes

- **Live server:** Express serves the app and rate-limited `/api/barista/*` endpoints. Gemini API keys are used only on the server.
- **Static hosting:** Deploy the `dist/` output to GitHub Pages or another static host. If the AI endpoints are unavailable, the app falls back to its local barista engine.
- **Recipe journal:** Recipes can be saved locally and exported or optionally synced to a GitHub repository. GitHub tokens are kept in memory and are not persisted.

## Developer system map

The interactive architecture diagram is hidden in regular browsing. To view it, open `/?developer=1#how-it-works`. This query parameter only controls visibility; it is not access control.

## Project documentation

- [Architecture and system diagrams](docs/ARCHITECTURE.md)
- [Brand and marketing guide](docs/BRAND_KIT.md)
