# Next.js monorepo template

A pnpm + Turborepo monorepo with:

| Concern       | Tool                                                                             |
| ------------- | -------------------------------------------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org) (App Router, `proxy.ts`)                        |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com)                                       |
| UI            | [shadcn/ui](https://ui.shadcn.com), every component, in `apps/web/components/ui` |
| API           | [oRPC](https://orpc.dev), contract-first (`packages/api`)                        |
| Data fetching | [TanStack Query](https://tanstack.com/query) via `@orpc/tanstack-query`          |
| Tables        | [TanStack Table v9](https://tanstack.com/table)                                  |
| Forms         | [React Hook Form](https://react-hook-form.com) + zod resolver                    |
| Validation    | [Zod 4](https://zod.dev)                                                         |
| Auth          | [better-auth](https://better-auth.com) (email + password, verification, reset)   |
| Database      | [Drizzle ORM](https://orm.drizzle.team) + Postgres                               |
| Email         | [React Email](https://react.email) + Nodemailer                                  |

## Structure

```
apps/
  web/                   Next.js app (everything that runs on the server or in the browser)
    app/                 routes; app/globals.css holds the Tailwind + shadcn theme
    app/rpc/             oRPC HTTP handler (/rpc/*)
    app/api/auth/        better-auth handler (/api/auth/*)
    components/ui/       shadcn/ui components
    db/                  Drizzle schema, client, migrations
    emails/              React Email templates
    server/              oRPC router implementing the contract
    lib/                 auth, auth-client, orpc client, email sending, env
    proxy.ts             optimistic auth redirect for /dashboard
packages/
  api/                   oRPC contract + zod input/output schemas (no server code)
  eslint-config/         shared ESLint config
  typescript-config/     shared tsconfig
```

`packages/api` is the only shared package, and that is deliberate: it is the
wire contract. The server implements it with `implement(contract)` and the
client is typed from it (`ContractRouterClient<typeof contract>`), so the
client never imports server code. It depends only on `zod` and
`@orpc/contract`, and holds only what crosses the wire (inputs, outputs,
errors). Database tables live in `apps/web/db` and are mapped to these shapes
in the router, so the contract does not change when the schema does.

## Getting started

```bash
cp apps/web/.env.example apps/web/.env   # then set BETTER_AUTH_SECRET (openssl rand -base64 32)
docker compose up -d                     # Postgres on :5432, Mailpit on :1025 / UI on :8025
pnpm install
pnpm db:migrate
pnpm dev                                 # http://localhost:3000
pnpm email:dev                           # email previews on http://localhost:3001
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

**Add a shadcn component**: `cd apps/web && pnpm dlx shadcn@latest add <name>`
(all components are already installed; use this for updates or registry items).
Import as `@/components/ui/<name>`.

**Add an API procedure**:

1. Define it in `packages/api/src/contracts/*` (input/output zod schemas, errors).
2. Implement it in `apps/web/server/router.ts`. TypeScript fails until you do.
3. Call it from the client with `useQuery(orpc.<ns>.<proc>.queryOptions(...))`
   or `useMutation(orpc.<ns>.<proc>.mutationOptions())`.

**Add an email**: create `apps/web/emails/<name>.tsx` with `PreviewProps`, then
add a `send…Email` helper in `apps/web/lib/email.tsx` that calls `sendEmail()`.

**Change the database schema**: edit `apps/web/db/schema/*`, then
`pnpm db:generate && pnpm db:migrate`.

## Supply-chain cooldown

`pnpm-workspace.yaml` sets `minimumReleaseAge: 10080` (7 days). pnpm will
only install package versions that have been public for at least a week,
which keeps freshly published (and possibly compromised) releases out of the
lockfile. If an install fails with `ERR_PNPM_NO_MATURE_MATCHING_VERSION`, widen
the version range so an older release qualifies, or add a trusted package to
`minimumReleaseAgeExclude`.

Packages allowed to run install scripts are listed under `allowBuilds`.
