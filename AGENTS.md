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

## Data access

- Client components fetch and mutate app data **only** through oRPC + TanStack Query: `useQuery(orpc.x.y.queryOptions(...))`, `useMutation(orpc.x.y.mutationOptions())` from `apps/web/lib/orpc.ts`.
- **No Next.js server functions**: no `"use server"`, no server actions, no form `action={serverFn}`. The only route handlers are `/rpc` (oRPC) and `/api/auth` (better-auth). Don't add others.
- Server components may read the session (`apps/web/lib/session.ts`) to gate or redirect. If a server component ever needs app data, it must call the same oRPC router through a server-side router client (not set up yet), never `db` directly.
- All business logic lives in oRPC procedures (`apps/web/server/router.ts`) behind the middlewares in `apps/web/server/orpc.ts` (`authed`, `adminOnly`).

## Auth

- Public sign-up is disabled (`emailAndPassword.disableSignUp` in `apps/web/lib/auth.ts`). The first admin is created at `/setup`, which is only reachable while no admin exists. After that, admins create password users in the admin section.
- SAML (`@better-auth/sso`) and LDAP users are provisioned on first sign-in with role `user`. Providers are configured at runtime in the admin section and stored in the DB.
- TOTP 2FA is required only for admins with a password (`credential`) account (`apps/web/lib/two-factor.ts`). SAML/LDAP users and regular password users don't need it. Enforcement lives in the `authed` middleware and `requireSession()`; keep both in sync.
- SAML/LDAP identities must never be linked into an existing password admin account, since that would bypass TOTP.
