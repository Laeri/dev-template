# Next.js monorepo template

A pnpm + Turborepo monorepo with:

| Concern       | Tool                                                                           |
| ------------- | ------------------------------------------------------------------------------ |
| Framework     | [Next.js 16](https://nextjs.org) (App Router, `proxy.ts`)                      |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com)                                     |
| UI            | [shadcn/ui](https://ui.shadcn.com), every component, in `packages/ui`          |
| API           | [oRPC](https://orpc.dev), contract-first (`packages/api`)                      |
| Data fetching | [TanStack Query](https://tanstack.com/query) via `@orpc/tanstack-query`        |
| Tables        | [TanStack Table v9](https://tanstack.com/table)                                |
| Forms         | [React Hook Form](https://react-hook-form.com) + zod resolver                  |
| Validation    | [Zod 4](https://zod.dev)                                                       |
| Auth          | [better-auth](https://better-auth.com) (email + password, verification, reset) |
| Database      | [Drizzle ORM](https://orm.drizzle.team) + Postgres                             |
| Email         | [React Email](https://react.email) + Nodemailer                                |

## Structure

```
apps/
  web/                 Next.js app
    app/rpc/           oRPC HTTP handler (/rpc/*)
    app/api/auth/      better-auth handler (/api/auth/*)
    server/            oRPC router implementing the contract
    lib/               auth, auth-client, orpc client, email, env
    proxy.ts           optimistic auth redirect for /dashboard
packages/
  api/                 oRPC contract + shared zod schemas (no server code)
  db/                  Drizzle schema, client, migrations
  email/               React Email templates + render helpers
  ui/                  shadcn/ui components, styles, hooks
  eslint-config/       shared ESLint config
  typescript-config/   shared tsconfig
```

The contract in `packages/api` is the single source of truth: the server
implements it with `implement(contract)` and the client is typed from it
(`ContractRouterClient<typeof contract>`), so the client never imports
server code. Its zod schemas are also used by the forms (`zodResolver`).

## Getting started

```bash
cp .env.example .env               # then set BETTER_AUTH_SECRET (openssl rand -base64 32)
docker compose up -d               # Postgres on :5432, Mailpit on :1025 / UI on :8025
pnpm install
pnpm db:migrate
pnpm dev                           # web on :3000, email preview on :3001
```

Sign up at http://localhost:3000/sign-up. The verification email shows up in
Mailpit at http://localhost:8025.

## Scripts

| Script             | What it does                                      |
| ------------------ | ------------------------------------------------- |
| `pnpm dev`         | Run every app's dev server (turbo)                |
| `pnpm build`       | Build everything                                  |
| `pnpm lint`        | ESLint across the workspace                       |
| `pnpm typecheck`   | `tsc --noEmit` across the workspace               |
| `pnpm format`      | Prettier                                          |
| `pnpm db:generate` | Generate a migration from the Drizzle schema      |
| `pnpm db:migrate`  | Apply migrations                                  |
| `pnpm db:push`     | Push the schema without a migration (prototyping) |
| `pnpm db:studio`   | Open Drizzle Studio                               |

## Common tasks

**Add a shadcn component**: `cd packages/ui && pnpm dlx shadcn@latest add <name>`
(all components are already installed; use this for updates or registry items).
Import as `@workspace/ui/components/<name>`.

**Add an API procedure**:

1. Define it in `packages/api/src/contracts/*` (input/output zod schemas, errors).
2. Implement it in `apps/web/server/router.ts`. TypeScript fails until you do.
3. Call it from the client with `useQuery(orpc.<ns>.<proc>.queryOptions(...))`
   or `useMutation(orpc.<ns>.<proc>.mutationOptions())`.

**Add an email**: create `packages/email/emails/<name>.tsx` with `PreviewProps`,
export a `render…` helper from `packages/email/src/index.tsx`, and send it with
`sendEmail()` from `apps/web/lib/email.ts`. Preview with `pnpm --filter @workspace/email dev`.

**Change the database schema**: edit `packages/db/src/schema/*`, then
`pnpm db:generate && pnpm db:migrate`.

## Supply-chain cooldown

`pnpm-workspace.yaml` sets `minimumReleaseAge: 10080` (7 days). pnpm will
only install package versions that have been public for at least a week,
which keeps freshly published (and possibly compromised) releases out of the
lockfile. If an install fails with `ERR_PNPM_NO_MATURE_MATCHING_VERSION`, widen
the version range so an older release qualifies, or add a trusted package to
`minimumReleaseAgeExclude`.

Packages allowed to run install scripts are listed under `allowBuilds`.
