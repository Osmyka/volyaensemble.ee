# VOLYA Ensemble Website

A modern business-card website for **VOLYA**, a Ukrainian song and dance ensemble in Tallinn, Estonia. The site presents the ensemble to the public: schedule, registration, merch, and contact details in Estonian, Ukrainian, and English.

Built for a non-profit community organisation under the Ukrainian Youth Association in Estonia (СУМ). Designed and developed by **Osmyka OÜ** ([software studio Osmyka](https://osmyka.com)).

Live site: [https://volyaensemble.ee](https://volyaensemble.ee)

## Architecture and technologies

The project is a full-stack web application on the Cloudflare edge:

| Layer | Technology |
| --- | --- |
| UI | React 19, App Router–style routes under `app/` |
| Full-stack runtime | [vinext](https://github.com/cloudflare/vinext) (Vite + Next-compatible React Server Components) |
| Build / local tooling | Vite 8, TypeScript, Tailwind CSS 4 |
| Hosting | Cloudflare Workers + static assets (`ASSETS`) |
| Optional data | Cloudflare D1 + Drizzle ORM |
| Optional object storage | Cloudflare R2 (declared in hosting config) |

**How it fits together**

- Site code lives in `app/` (pages, components, i18n, styles).
- `worker/index.ts` is the Cloudflare Worker entry (routing and image handling).
- `vite.config.ts` drives local development and generates the Worker config used for deploy (no checked-in `wrangler.jsonc`).
- `.openai/hosting.json` declares optional D1 / R2 bindings for the Sites hosting environment.
- `db/schema.ts` and `drizzle.config.ts` support database schema and migrations when D1 is used.

The public site is multilingual (ET / UK / EN), theme-aware (light / dark), and mobile-first, with a schedule grid, join form, and merch ordering flow.

## Prerequisites

- Node.js `>= 22.13.0`

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm test
```

## Deploy to Cloudflare Workers

Worker configuration is generated at build time into `dist/server/wrangler.json` from `localBindingConfig` in `vite.config.ts`. Deploy from the project root:

```bash
npx wrangler login   # one-time
npm run deploy
```

- Service name: `volyaensemble-ee`
- `env.ASSETS` is bound to `dist/client`
- `npm run cf:tail` streams production logs

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production vinext build |
| `npm start` | Serve the production build locally |
| `npm test` | Build and run rendered HTML checks |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Drizzle migrations after schema changes |
| `npm run deploy` | Build and deploy to Cloudflare Workers |

## Project layout

```
app/                 Site pages, components, i18n, styles
worker/              Cloudflare Worker entry
db/                  Drizzle schema
vite.config.ts       Local bindings + deploy-oriented Worker config
drizzle.config.ts    Migration tooling
.openai/hosting.json Optional D1 / R2 binding declarations
```

## License

This project is released under the [MIT License](./LICENSE). Copyright © 2026 Osmyka OÜ.

## Credits

- **Organisation:** VOLYA — Ukrainian song and dance ensemble in Estonia  
- **Development:** Osmyka OÜ  
- **Stack references:** [vinext](https://github.com/cloudflare/vinext) · [Drizzle](https://orm.drizzle.team/docs/get-started/d1-new) · [Cloudflare Workers](https://developers.cloudflare.com/workers/)
