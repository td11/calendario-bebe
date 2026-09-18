<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Proyecto: Calendario de Votación Bebé

## Descripción
Calendario interactivo (21 Sep - 25 Oct 2025) para votar el día de nacimiento de una bebé. Los usuarios escriben su nombre y eligen un día. Incluye leaderboard/porra.

## Stack
- Next.js 16 (App Router, TypeScript, Tailwind)
- Redis via `redis` package (Upstash en Vercel)
- Repo: https://github.com/td11/calendario-bebe
- Deploy: Vercel

## Env Vars
- `REDIS_URL` - URL de conexión Redis (Upstash en Vercel Marketplace)

## Archivos clave
- `src/app/page.tsx` - Cliente: calendario + formulario + leaderboard
- `src/app/api/votes/route.ts` - API GET/POST con Redis
- `src/app/layout.tsx` - Layout en español
- `src/app/globals.css` - Estilos base con Tailwind
