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
| Auth          | [better-auth](https://better-auth.com): password, TOTP 2FA, SAML, admin          |
| Database      | [Drizzle ORM](https://orm.drizzle.team) + Postgres                               |
| Email         | [React Email](https://react.email) + Nodemailer                                  |

## Structure

```
apps/
  web/                   Next.js app (everything that runs on the server or in the browser)
    app/                 routes (thin pages); app/globals.css holds the theme tokens
    app/rpc/             oRPC HTTP handler (/rpc/*)
    app/api/auth/        better-auth handler (/api/auth/*)
    features/            feature folders: components, oRPC procedures, helpers
    components/ui/       shadcn/ui components (shared)
    db/                  Drizzle schema, client, migrations
    emails/              React Email templates
    server/              oRPC setup + middlewares; router.ts combines the feature routers
    lib/                 cross-cutting: auth, sessions, 2FA rule, settings, orpc client, email, env
    proxy.ts             optimistic auth redirect for /dashboard, /admin
packages/
  api/                   oRPC contract + zod schemas, one file per feature (no server code)
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

### Feature folders

Code is grouped by feature, not by kind. Everything a feature needs on the
web side lives in `apps/web/features/<feature>/`:

```
apps/web/features/tasks/
  components/            UI used by the feature's pages (tasks-table, create-task-dialog)
  server/router.ts       oRPC procedures for the feature ("server-only")
  task-options.ts        helpers shared by the feature's UI
packages/api/src/
  contracts/task.ts      the feature's contract (procedures, errors)
  schemas/task.ts        the feature's zod schemas
```

| Feature      | Contains                                |
| ------------ | --------------------------------------- |
| `admin`      | Admin section shell (navigation)        |
| `auth`       | Sign-in forms, SSO sign-in, sign-out    |
| `health`     | Health check procedure                  |
| `overview`   | Content of the start page               |
| `settings`   | App settings (2FA requirement toggle)   |
| `setup`      | First-admin setup form and procedure    |
| `sso`        | SAML provider management                |
| `tasks`      | Example CRUD: table, dialog, procedures |
| `two-factor` | TOTP enrolment and verification         |
| `users`      | Admin user management                   |

Rules of thumb:

- Pages in `app/` stay thin: they gate access and compose feature components.
- A feature may use shared code (`components/ui`, `lib`, `db`, `emails`), but
  doesn't reach into another feature's internals. Move code that several
  features need into a shared place.
- Files under `features/*/server/` start with `import "server-only"`, so
  importing them from client code fails the build.
- The Drizzle schema stays in `db/schema/` (one file per feature), because
  all tables share one set of migrations.

## Why this stack

The start page (`/`) explains this in more detail, with links to each
library's docs. Each point also says what it buys you compared with a
classic SPA + Spring Boot setup.

- **Monorepo (pnpm workspaces + Turborepo).** Contract, server and UI change
  in one pull request and can't drift apart. Shared lint and TypeScript
  configs. Room for more apps (mobile, workers, docs) that reuse
  `packages/api`. Turborepo runs tasks in order and caches them.

  _vs. SPA + Spring Boot:_ Usually two
  repositories, two build systems (npm and Maven/Gradle), two CI pipelines and
  two deployments. An API change needs coordinated pull requests and releases,
  and a frontend deployed before or after the backend can break in production.
  Here one pull request, one pipeline and one deployment keep both sides in
  step.

- **pnpm.** Fast, disk-efficient installs from a content-addressable store.
  Strict `node_modules`, so there are no phantom dependencies. Install scripts
  only run for packages in `allowBuilds`.

  _vs. SPA + Spring Boot:_ With Spring Boot you maintain two dependency
  ecosystems (Maven Central and npm), each with its own update, audit and
  vulnerability tooling. Here there is one lockfile and one place to update
  and audit.

- **Feature folders.** Code that changes together lives together, and a
  feature is easy to find, review or delete (see above).

  _vs. SPA + Spring Boot:_ In a layered Spring Boot project one feature is
  spread over controller, service, repository, entity, DTO and mapper
  packages, plus TypeScript types, an API client and components in the SPA
  repository. Here a feature is one folder plus its contract file, so it can
  be reviewed or removed as a unit.

- **oRPC, contract first.** The contract in `packages/api` is the single
  source of truth. End-to-end types without code generation; the server fails
  typecheck until it implements every procedure; the client is typed without
  importing server code; errors are typed; frontend work can start against the
  contract before the backend exists; it can be exported as OpenAPI.

  _vs. SPA + Spring Boot:_ With Spring Boot the SPA either hand-writes
  TypeScript interfaces that mirror the Java DTOs (they drift and fail at
  runtime) or generates a client from OpenAPI (springdoc + openapi-generator):
  an extra build step, generated code to keep in sync, annotations as the
  source of truth and often wrong nullability. Here types flow straight from
  the contract, with no generation step, and a breaking change fails the
  build.

- **One client for web and mobile.** Any TypeScript app (React Native/Expo,
  CLI, worker, another service) can import `@workspace/api` and call `/rpc`
  with full types, including the TanStack Query helpers.

  _vs. SPA + Spring Boot:_ With Spring Boot every client platform needs its
  own generated OpenAPI client, regenerated after each API change. Here a
  React Native app imports the same TypeScript package and gets the same typed
  calls and query helpers.

- **Zod, shared validation.** The same schema validates the form in the
  browser (react-hook-form zod resolver) and the request on the server. Rules
  are written once, and types are inferred from them.

  _vs. SPA + Spring Boot:_ With Spring Boot rules are written twice: Bean
  Validation annotations (@NotBlank, @Size) on Java DTOs and again in the SPA.
  They drift apart (a different max length, a missing rule, different
  messages) and users see errors only after a round trip. Here one schema
  serves both sides.

- **TypeScript everywhere.** Types, schemas, constants and helpers are shared
  between frontend and backend. Refactors are checked on both sides of the
  network. One language and toolchain for the whole team.

  _vs. SPA + Spring Boot:_ Java + TypeScript means two languages and
  toolchains, duplicated enums, constants and helpers, and specialised
  frontend and backend developers. Serialization is a classic source of bugs
  too (Jackson date formats, LocalDateTime time zones, Long precision in
  JavaScript). Here types, schemas, validation logic and helpers are shared
  directly, and oRPC carries Date, Map and Set over the wire as-is.

- **React Email.** Emails are React components, not another templating
  language (no Handlebars, MJML or Jinja). Typed props, a preview server, and
  HTML that works across email clients.

  _vs. SPA + Spring Boot:_ Spring Boot emails typically use Thymeleaf or
  FreeMarker: another syntax, variables that are only checked at runtime, and
  no reuse of frontend components. Here templates are type-checked like any
  other code.

- **Tailwind CSS v4.** Design tokens are CSS variables in
  `app/globals.css`. Theming means changing variables; dark mode redefines
  them under `.dark`. shadcn/ui uses the same tokens. No JS config.

  _vs. SPA + Spring Boot:_ With Spring Boot, server-rendered views (Thymeleaf)
  and the SPA are separate frontends: the Tailwind build has to be bolted onto
  Maven/Gradle (frontend-maven-plugin) or kept in the SPA repository, and the
  two drift apart. Here one build and one set of tokens style server-rendered
  and client pages alike.

- **Next.js for every shape of app.** Backend only (route handlers, like
  `/rpc`); backend + server-rendered frontend (server components); backend +
  SPA-like client (client components with TanStack Query, like the dashboard);
  or a static site without a server (`output: "export"`) for wikis, docs and
  simple sites. Modes can be mixed per route.

  _vs. SPA + Spring Boot:_ A SPA ships an empty HTML page plus a JavaScript
  bundle: slower first paint, weak SEO, loading spinners, and auth checks that
  only run after the bundle loads (flicker or a flash of protected UI). Static
  pages or server-rendered HTML would need another stack next to Spring Boot.
  A separate frontend origin also needs CORS or a reverse proxy. Here server
  components gate and render pages before any HTML is sent, static, SSR and
  SPA-style pages share one deployment, and the API is same-origin. Server and
  client code also hot-reload in one dev server instead of waiting for JVM
  restarts.

- **better-auth.** One integrated, self-hosted auth library, storing data in
  your own Postgres: no per-user pricing, no lock-in. Included here: email +
  password, TOTP 2FA, SAML SSO, admin roles. Available as plugins: magic
  links, email OTP, passkeys, social logins (Google, GitHub, Microsoft, Apple,
  …), organizations, API keys. Keycloak, Entra ID, Okta and other OIDC
  providers can be added with the generic OAuth plugin or as an OIDC SSO
  provider. Rate limiting and CSRF protection are built in.

  _vs. SPA + Spring Boot:_ With Spring Security, SAML, OIDC and TOTP need
  extra modules or an external Keycloak, plus considerable configuration. A
  SPA talking to a separate API also has to choose between tokens in
  localStorage (exposed to XSS) with refresh logic, or cookies with CORS and
  CSRF set up across origins. Here sessions are httpOnly cookies on the same
  origin, and 2FA and SSO are plugins of one library.

- **Drizzle ORM.** SQL-shaped, typed queries straight from the schema, no
  generation step or engine binary; migrations are reviewable SQL files.

  _vs. SPA + Spring Boot:_ JPA/Hibernate hides SQL behind entity mapping,
  which brings N+1 queries, lazy-loading surprises
  (LazyInitializationException) and a separate migration tool (Flyway,
  Liquibase) kept in sync by hand. Here queries are explicit and migrations
  are generated from the schema.

- **shadcn/ui.** Components are source code in the repo, so you own and can
  change them, built on accessible Radix and Base UI primitives.

  _vs. SPA + Spring Boot:_ React components can't be used in Thymeleaf views,
  so server-rendered pages (login, error pages, simple admin screens) and the
  SPA end up with two UI implementations. Here the same components render on
  the server and in the browser.

**When SPA + Spring Boot still fits.** It can still be the
right call for teams that are already strong in Java, for systems that depend
on JVM libraries or the wider Spring ecosystem, or for CPU-heavy backends. A
Next.js frontend can also talk to an existing Spring Boot API; you lose the
shared types unless you generate them from OpenAPI.

## Getting started

```bash
cp apps/web/.env.example apps/web/.env   # then set BETTER_AUTH_SECRET (openssl rand -base64 32)
docker compose up -d                     # Postgres on :5432, Mailpit on :1025 / UI on :8025
pnpm install
pnpm db:migrate
pnpm dev                                 # http://localhost:3000
pnpm email:dev                           # email previews on http://localhost:3001
```

Open http://localhost:3000. The start page (`apps/web/app/page.tsx`) explains
the template: libraries (with links to their docs), what is preconfigured,
routes, structure and UI components. Replace it with your own landing page.
On a fresh database every other page redirects to `/setup`, where you create
the first admin account. Emails (e.g. password resets) show up in Mailpit at
http://localhost:8025.

### Dev container

Alternatively, open the repo in a dev container (VS Code: "Reopen in
Container"). It runs Node 24 + pnpm alongside the Postgres and Mailpit services
from `docker-compose.yml`, creates `apps/web/.env` with a fresh secret if it is
missing, installs dependencies and runs migrations. Then run `pnpm dev`. Inside
the container `DATABASE_URL` and `SMTP_HOST` point at the `postgres` and
`mailpit` services. Ports 3000, 3001 and Mailpit's 8025 are forwarded.
node_modules live in container volumes, so host and container installs don't
clash. When you add a workspace package, add a volume for its node_modules in
`.devcontainer/docker-compose.yml`.

## Production (self-hosted)

The root `Dockerfile` builds the Next.js
[standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
into a small Node 24 image that runs `server.js` as a non-root user. Its
`migrate` target is a one-off image that applies the Drizzle migrations.

`docker-compose.prod.yml` runs Postgres, the migration job and the app behind
an existing [nginx-proxy](https://github.com/nginx-proxy/nginx-proxy) with
acme-companion for TLS. The app joins the proxy's external Docker network
(`PROXY_NETWORK`, default `nginx-proxy`) and sets `VIRTUAL_HOST` and
`LETSENCRYPT_HOST`. Postgres stays on an internal network.

```bash
cp .env.prod.example .env.prod   # set APP_DOMAIN, POSTGRES_PASSWORD, BETTER_AUTH_SECRET, SMTP_*
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

Then open `https://<APP_DOMAIN>/setup` to create the first admin. On every
`up`, the `migrate` service runs before the app starts.

Notes:

- `NEXT_PUBLIC_APP_URL` is inlined at build time (a build arg derived from
  `APP_DOMAIN`). All other env vars are read at runtime.
- `next build` loads `lib/env.ts`, so the Dockerfile passes placeholder server
  env vars to the build step only. They don't end up in the runtime image.
- `next.config.ts` sends `X-Accel-Buffering: no` so nginx doesn't buffer
  streamed responses.
- The image healthcheck calls `health.check` (oRPC, `GET /rpc/health/check`).
- The image runs a single instance. To run several, see the multi-server
  notes in the
  [Next.js self-hosting guide](https://nextjs.org/docs/app/guides/self-hosting)
  (encryption key, `deploymentId`, shared cache).

## Authentication

Public sign-up is **disabled** (`emailAndPassword.disableSignUp` in
`apps/web/lib/auth.ts`). Accounts come from three places:

| Source          | How users are created                       | Role          |
| --------------- | ------------------------------------------- | ------------- |
| `/setup`        | First admin, only while no admin exists     | admin         |
| Admin → Users   | Admin creates an email + password user      | admin or user |
| SAML (optional) | Created automatically on first SAML sign-in | user          |

**Two-factor authentication (TOTP).** Admin → Security has a switch
"Require TOTP for password admins". It is **off by default**. When it's on,
admins who sign in with a password must enrol an authenticator app before
they can use the app, and they can't turn 2FA off again. SAML users and
regular password users are never asked for a code. To turn the switch on you
need TOTP on your own account first (Admin → Security → Set up two-factor).

**SAML (Admin → SAML), optional.** Nothing to configure unless you want SSO;
until a provider exists the sign-in page shows only email + password. To add
one, enter your IdP's entity ID, SSO URL and signing certificate (or metadata
XML), plus the email domains it serves. Each provider card shows the values to
configure in the IdP:

- ACS / Reply URL: `{BETTER_AUTH_URL}/api/auth/sso/saml2/sp/acs/{providerId}`
- SP metadata: `{BETTER_AUTH_URL}/api/auth/sso/saml2/sp/metadata?providerId={providerId}`

Users then pick "SSO" on the sign-in page and enter their work email.

**Account linking.** SAML identities are never attached to an existing admin
account (that would bypass the admin's password and TOTP), and existing
password users aren't linked implicitly either. A new SAML identity whose
email is already taken is rejected.

LDAP sign-in lives on the `feat/ldap` branch.

## Scripts

| Script             | What it does                                      |
| ------------------ | ------------------------------------------------- |
| `pnpm dev`         | Run the web app (turbo)                           |
| `pnpm email:dev`   | React Email preview server on :3001               |
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
2. Implement it in `apps/web/features/<feature>/server/router.ts` (wire it up
   in `apps/web/server/router.ts`). Protect it with the `authed` or `adminOnly`
   middleware from `server/orpc.ts`. TypeScript fails until you implement it.
3. Call it from the client with `useQuery(orpc.<ns>.<proc>.queryOptions(...))`
   or `useMutation(orpc.<ns>.<proc>.mutationOptions())`.

**Add a feature**: create `apps/web/features/<feature>/` with `components/` and
`server/router.ts`, add its contract and schemas to `packages/api`, register
the router in `apps/web/server/router.ts`, and add a page under `app/` that
composes the feature's components.

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
