<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repo conventions

- Package manager: pnpm 11 workspace. `minimumReleaseAge` (7 days) is enforced in `pnpm-workspace.yaml`; don't remove it. If an install is blocked, loosen the version range instead.
- TanStack Table is **v9** (`useTable`, `tableFeatures`, `create*RowModel`), not v8. See `node_modules/@tanstack/react-table/skills/`.
- shadcn forms use `Field` + react-hook-form `Controller` (there is no `Form` component).
- API changes start in `packages/api` (contract), then `apps/web/server/router.ts`.
- `packages/api` is the only shared package. It holds the wire contract (zod + `@orpc/contract` only) and must stay free of server code; the client imports it.
- Everything else lives in `apps/web`: shadcn components in `components/ui`, Drizzle in `db/`, React Email templates in `emails/`. Env vars are in `apps/web/.env`.
