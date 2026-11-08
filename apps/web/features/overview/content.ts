/** Content of the template overview page (app/page.tsx). */

export type Library = { name: string; role: string; docs: string; note: string }

export const stack: { group: string; libraries: Library[] }[] = [
  {
    group: "Framework & tooling",
    libraries: [
      {
        name: "Next.js 16",
        role: "Framework",
        docs: "https://nextjs.org/docs",
        note: "App Router, server components, proxy.ts for optimistic auth redirects.",
      },
      {
        name: "React 19",
        role: "UI runtime",
        docs: "https://react.dev",
        note: "Server and client components.",
      },
      {
        name: "TypeScript",
        role: "Language",
        docs: "https://www.typescriptlang.org/docs/",
        note: "Strict, shared config in packages/typescript-config.",
      },
      {
        name: "pnpm",
        role: "Package manager",
        docs: "https://pnpm.io",
        note: "Workspace with a 7-day minimumReleaseAge supply-chain cooldown.",
      },
      {
        name: "Turborepo",
        role: "Monorepo tasks",
        docs: "https://turborepo.com/docs",
        note: "Runs dev, build, lint, typecheck and format across packages.",
      },
      {
        name: "ESLint + Prettier",
        role: "Lint & format",
        docs: "https://eslint.org/docs/latest/",
        note: "Shared config in packages/eslint-config, Tailwind class sorting.",
      },
    ],
  },
  {
    group: "UI",
    libraries: [
      {
        name: "Tailwind CSS v4",
        role: "Styling",
        docs: "https://tailwindcss.com/docs",
        note: "Theme tokens in app/globals.css, light and dark mode.",
      },
      {
        name: "shadcn/ui",
        role: "Components",
        docs: "https://ui.shadcn.com/docs",
        note: "Every component installed in components/ui.",
      },
      {
        name: "Radix UI",
        role: "Primitives",
        docs: "https://www.radix-ui.com/primitives/docs/overview/introduction",
        note: "Accessible primitives behind most shadcn components.",
      },
      {
        name: "Base UI",
        role: "Primitives",
        docs: "https://base-ui.com/react/overview/quick-start",
        note: "Used by the combobox.",
      },
      {
        name: "Lucide",
        role: "Icons",
        docs: "https://lucide.dev/guide/packages/lucide-react",
        note: "Icon set configured for shadcn.",
      },
      {
        name: "next-themes",
        role: "Theming",
        docs: "https://github.com/pacocoursey/next-themes",
        note: "System theme by default; press d to toggle.",
      },
      {
        name: "Sonner",
        role: "Toasts",
        docs: "https://sonner.emilkowal.ski",
        note: "Toaster mounted in components/providers.tsx.",
      },
      {
        name: "Recharts",
        role: "Charts",
        docs: "https://recharts.github.io/en-US/guide",
        note: "Wrapped by the shadcn chart component.",
      },
    ],
  },
  {
    group: "Data & API",
    libraries: [
      {
        name: "oRPC",
        role: "API",
        docs: "https://orpc.dev/docs/getting-started",
        note: "Contract-first: packages/api defines it, server/router.ts implements it.",
      },
      {
        name: "TanStack Query",
        role: "Data fetching",
        docs: "https://tanstack.com/query/latest/docs/framework/react/overview",
        note: "Via @orpc/tanstack-query, devtools enabled in development.",
      },
      {
        name: "TanStack Table v9",
        role: "Tables",
        docs: "https://tanstack.com/table/latest",
        note: "useTable + tableFeatures, see the tasks table on the dashboard.",
      },
      {
        name: "Zod 4",
        role: "Validation",
        docs: "https://zod.dev",
        note: "Shared input/output schemas for the API and forms.",
      },
      {
        name: "React Hook Form",
        role: "Forms",
        docs: "https://react-hook-form.com/docs",
        note: "Field + Controller with the zod resolver.",
      },
      {
        name: "Drizzle ORM",
        role: "Database",
        docs: "https://orm.drizzle.team/docs/overview",
        note: "Postgres schema and migrations in db/, Drizzle Studio included.",
      },
      {
        name: "PostgreSQL",
        role: "Database server",
        docs: "https://www.postgresql.org/docs/",
        note: "Runs via docker compose (or the dev container).",
      },
      {
        name: "date-fns",
        role: "Dates",
        docs: "https://date-fns.org/docs/Getting-Started",
        note: "Date formatting and math.",
      },
    ],
  },
  {
    group: "Auth & email",
    libraries: [
      {
        name: "better-auth",
        role: "Authentication",
        docs: "https://www.better-auth.com/docs",
        note: "Email + password, admin plugin, TOTP two-factor.",
      },
      {
        name: "@better-auth/sso",
        role: "SAML",
        docs: "https://www.better-auth.com/docs/plugins/sso",
        note: "Optional SAML providers, managed by admins at runtime.",
      },
      {
        name: "React Email",
        role: "Email templates",
        docs: "https://react.email/docs",
        note: "Templates in emails/, preview server on :3001.",
      },
      {
        name: "Nodemailer",
        role: "Email delivery",
        docs: "https://nodemailer.com",
        note: "SMTP; Mailpit catches mail locally on :8025.",
      },
    ],
  },
]

export const preconfigured: { title: string; body: string }[] = [
  {
    title: "First-run setup",
    body: "Public sign-up is disabled. On a fresh database, /setup creates the first admin and then locks itself.",
  },
  {
    title: "Admin section",
    body: "Admins create password users, toggle security settings and manage SAML providers under /admin.",
  },
  {
    title: "Optional TOTP for admins",
    body: "Off by default. When enabled, password admins must enrol an authenticator app before they can continue.",
  },
  {
    title: "Optional SAML SSO",
    body: "Add identity providers at runtime. SAML users are provisioned on first sign-in and never linked into admin accounts.",
  },
  {
    title: "Contract-first API",
    body: "packages/api holds the zod + oRPC contract. Procedures are protected by the authed and adminOnly middlewares.",
  },
  {
    title: "Example feature",
    body: "A tasks CRUD (contract, router, Drizzle table, table UI and create dialog) shows the full data flow end to end.",
  },
  {
    title: "Database migrations",
    body: "Drizzle schema in db/schema with generated SQL migrations. Run pnpm db:migrate to apply them.",
  },
  {
    title: "Transactional email",
    body: "Password reset and verification templates, sent through SMTP and captured by Mailpit in development.",
  },
  {
    title: "Dev container",
    body: "Node, pnpm, Postgres and Mailpit in one container. Creates .env, installs and migrates on first start.",
  },
  {
    title: "Feature folders",
    body: "Each feature in apps/web/features/<name> holds its components, oRPC procedures and helpers.",
  },
  {
    title: "Dark mode",
    body: "System preference by default, persisted per browser. Press d anywhere to toggle.",
  },
]

export const routes: { path: string; description: string; access: string }[] = [
  { path: "/", description: "This overview", access: "Public" },
  {
    path: "/setup",
    description: "Create the first admin",
    access: "Until an admin exists",
  },
  {
    path: "/sign-in",
    description: "Email + password or SSO",
    access: "Public",
  },
  {
    path: "/dashboard",
    description: "Example tasks table",
    access: "Signed in",
  },
  {
    path: "/two-factor/setup",
    description: "Enrol an authenticator app",
    access: "Signed in",
  },
  { path: "/admin/users", description: "Manage users", access: "Admin" },
  {
    path: "/admin/security",
    description: "2FA requirement toggle",
    access: "Admin",
  },
  { path: "/admin/saml", description: "SAML providers", access: "Admin" },
  {
    path: "/rpc/*",
    description: "oRPC handler",
    access: "Per procedure",
  },
  {
    path: "/api/auth/*",
    description: "better-auth handler",
    access: "Per endpoint",
  },
]

export const structure = `apps/
  web/                 Next.js app
    app/               routes only (thin pages), globals.css (theme tokens)
    app/rpc/           oRPC handler (/rpc/*)
    app/api/auth/      better-auth handler (/api/auth/*)
    features/          feature folders (see below)
    components/ui/     shadcn/ui components (shared)
    db/                Drizzle schema, client, migrations
    emails/            React Email templates
    server/            oRPC setup + middlewares, router.ts combines features
    lib/               cross-cutting: auth, session, 2FA, settings, email
    proxy.ts           optimistic auth redirect
packages/
  api/                 oRPC contract + zod schemas, one file per feature
  eslint-config/       shared ESLint config
  typescript-config/   shared tsconfig`

export const featureTree = `features/tasks/
  components/          UI used by the feature's pages
    tasks-table.tsx
    create-task-dialog.tsx
  server/
    router.ts          oRPC procedures ("server-only")
  task-options.ts      code shared by the feature's UI

packages/api/src/
  contracts/task.ts    the feature's contract (procedures + errors)
  schemas/task.ts      the feature's zod schemas`

export const features: { name: string; contains: string }[] = [
  { name: "admin", contains: "Admin section shell (navigation)" },
  { name: "auth", contains: "Sign-in forms, SSO sign-in, sign-out" },
  { name: "health", contains: "Health check procedure" },
  { name: "overview", contains: "Content of this page" },
  { name: "settings", contains: "App settings (2FA requirement toggle)" },
  { name: "setup", contains: "First-admin setup form and procedure" },
  { name: "sso", contains: "SAML provider management" },
  { name: "tasks", contains: "Example CRUD: table, dialog, procedures" },
  { name: "two-factor", contains: "TOTP enrolment and verification" },
  { name: "users", contains: "Admin user management" },
]

export type Reason = {
  title: string
  summary: string
  points: string[]
  docs?: { label: string; href: string }
}

/** Why the template is built the way it is. */
export const reasons: Reason[] = [
  {
    title: "Monorepo",
    summary:
      "The web app and the shared API contract live in one repository, built by Turborepo.",
    points: [
      "One pull request can change the contract, the server and the UI together, so they never drift apart.",
      "Shared ESLint and TypeScript configs keep every package consistent.",
      "Room to grow: add a mobile app, a worker or a docs site under apps/ and reuse packages/api.",
      "Turborepo runs tasks in dependency order and caches results, so unchanged packages are skipped.",
    ],
    docs: {
      label: "Turborepo docs",
      href: "https://turborepo.com/docs",
    },
  },
  {
    title: "pnpm",
    summary:
      "A fast, disk-efficient package manager with first-class workspaces.",
    points: [
      "A content-addressable store links each package version once, so installs are fast and use little disk space.",
      "A strict node_modules layout: code can only import dependencies it declares, so there are no phantom dependencies.",
      "Install scripts run only for packages listed in allowBuilds, not for every dependency.",
    ],
    docs: { label: "pnpm docs", href: "https://pnpm.io/motivation" },
  },
  {
    title: "Package cooldown against supply-chain attacks",
    summary:
      "minimumReleaseAge in pnpm-workspace.yaml only installs versions that have been public for 7 days.",
    points: [
      "Hijacked npm releases (such as the 2025 chalk/debug compromise and the Shai-Hulud worm) are usually detected and unpublished within hours or days.",
      "A 7-day delay means a malicious release is almost always gone before it can reach your lockfile.",
      "If an install is blocked, widen the version range so an older release qualifies. Trusted packages can be excluded explicitly.",
    ],
    docs: {
      label: "pnpm minimumReleaseAge",
      href: "https://pnpm.io/settings#minimumreleaseage",
    },
  },
  {
    title: "Feature folders",
    summary:
      "Code is grouped by what it does (tasks, users, sso) rather than by what it is (components, routers).",
    points: [
      "Code that changes together lives together: a feature's UI, procedures and helpers sit in one folder.",
      "Easy to find, review, hand over or delete a whole feature.",
      "Route files in app/ stay thin and only compose feature components.",
      "Only truly shared code lives outside features: components/ui, lib, db, emails.",
    ],
  },
  {
    title: "oRPC, contract first",
    summary:
      "packages/api defines every procedure (input, output, errors) before it is implemented.",
    points: [
      "End-to-end type safety without code generation: rename a field and TypeScript points out every caller.",
      "The server must implement the whole contract, so missing or mismatched procedures fail typecheck.",
      "The client is typed from the contract alone and never imports server code.",
      "Typed errors: the client knows exactly which errors a procedure can return.",
      "The contract is a small, reviewable API surface. Frontend work can start against it (or a mock) before the backend exists.",
      "It can be exported as an OpenAPI spec for non-TypeScript consumers.",
    ],
    docs: {
      label: "oRPC contract-first",
      href: "https://orpc.dev/docs/contract-first/define-contract",
    },
  },
  {
    title: "One client for web and mobile",
    summary:
      "The same contract and typed client can be used by any TypeScript app, not only this one.",
    points: [
      "A React Native or Expo app can import @workspace/api and call the same /rpc endpoints with full types.",
      "The same goes for CLIs, background workers and other services.",
      "TanStack Query integration works the same in React Native.",
    ],
    docs: {
      label: "oRPC client",
      href: "https://orpc.dev/docs/client/client-side",
    },
  },
  {
    title: "Zod, shared validation",
    summary:
      "The same zod schema validates a form in the browser and the request on the server.",
    points: [
      "Validation rules are written once, in packages/api/src/schemas.",
      "Forms use them through the react-hook-form zod resolver, so users get the same errors instantly, before any request is sent.",
      "The server validates the same schema again, because client checks can be bypassed.",
      "TypeScript types are inferred from the schemas, so types and validation can't drift apart.",
    ],
    docs: { label: "Zod docs", href: "https://zod.dev" },
  },
  {
    title: "TypeScript everywhere",
    summary:
      "Frontend and backend are written in the same language, so code can be shared across the boundary.",
    points: [
      "Share types, schemas, constants and helpers between server and client.",
      "Refactors cross the network boundary safely: the compiler checks both sides.",
      "One toolchain (lint, format, typecheck, tests) and one language for the whole team.",
    ],
    docs: {
      label: "TypeScript docs",
      href: "https://www.typescriptlang.org/docs/",
    },
  },
  {
    title: "React Email",
    summary:
      "Emails are React components, not templates in yet another templating language.",
    points: [
      "No Handlebars, MJML or Jinja: the same JSX, components and TypeScript as the rest of the app.",
      "Typed props: a template can't be sent with missing or wrong data.",
      "Live preview server (pnpm email:dev) and Mailpit to see real sends.",
      "Renders to HTML that works across email clients, including Outlook.",
    ],
    docs: { label: "React Email docs", href: "https://react.email/docs" },
  },
  {
    title: "Tailwind CSS v4",
    summary:
      "Design tokens are CSS variables, configured in CSS rather than JavaScript.",
    points: [
      "Colors, radii and fonts are CSS variables in app/globals.css (@theme), so theming means changing a few variables.",
      "Dark mode redefines the same variables under .dark; components don't change.",
      "shadcn/ui components use the same tokens, so a new theme restyles everything at once.",
      "No tailwind.config.js, and the new engine builds much faster.",
    ],
    docs: {
      label: "Tailwind theme variables",
      href: "https://tailwindcss.com/docs/theme",
    },
  },
  {
    title: "Next.js, one framework for every shape of app",
    summary:
      "The same project can be a backend, a server-rendered app, a SPA-like client or a static site.",
    points: [
      "Backend only: route handlers serve an API, like /rpc and /api/auth here.",
      "Backend + server-rendered frontend: server components render HTML on the server, fast first load and SEO.",
      "Backend + SPA-like client: client components fetch through TanStack Query, like the dashboard and admin pages.",
      'Static site without a server: output: "export" builds plain HTML for wikis, docs or simple sites, hosted on any static host or CDN.',
      "Mix per route: static marketing pages, dynamic app pages and an API in one deployment.",
    ],
    docs: {
      label: "Next.js static exports",
      href: "https://nextjs.org/docs/app/guides/static-exports",
    },
  },
  {
    title: "better-auth",
    summary:
      "One integrated, self-hosted auth library instead of stitching together several services.",
    points: [
      "Users, sessions and accounts are stored in your own Postgres via Drizzle. No per-user pricing, no vendor lock-in.",
      "Included here: email + password, TOTP two-factor, SAML SSO, admin roles.",
      "Add as plugins: magic links, email OTP, passkeys, social logins (Google, GitHub, Microsoft, Apple, …), organizations and multi-tenancy, API keys.",
      "Keycloak, Entra ID, Okta and other OIDC providers can be added with the generic OAuth plugin or as an OIDC SSO provider.",
      "Rate limiting, CSRF protection and secure cookies are built in.",
    ],
    docs: {
      label: "better-auth docs",
      href: "https://www.better-auth.com/docs",
    },
  },
  {
    title: "Drizzle ORM",
    summary: "A typed, SQL-shaped ORM with plain SQL migrations.",
    points: [
      "Queries look like SQL, so there is little to learn and nothing hidden.",
      "Types come straight from the schema, with no generation step or query engine binary.",
      "Migrations are SQL files in git, easy to review.",
    ],
    docs: {
      label: "Drizzle docs",
      href: "https://orm.drizzle.team/docs/overview",
    },
  },
  {
    title: "TanStack Query",
    summary:
      "Server state on the client: caching, deduplication and refetching.",
    points: [
      "Requests are cached and deduplicated, and refetched when data goes stale.",
      "Loading and error states, retries and optimistic updates come built in.",
      "Typed query and mutation options are generated from the oRPC contract.",
    ],
    docs: {
      label: "TanStack Query docs",
      href: "https://tanstack.com/query/latest/docs/framework/react/overview",
    },
  },
  {
    title: "shadcn/ui",
    summary:
      "Components are copied into the repo as source, not installed as a dependency.",
    points: [
      "You own the code: change any component without forking a library.",
      "Built on accessible Radix and Base UI primitives.",
      "No breaking upgrades forced on you; pull updates when you want them.",
    ],
    docs: { label: "shadcn/ui docs", href: "https://ui.shadcn.com/docs" },
  },
]

export const commands = `cp apps/web/.env.example apps/web/.env   # set BETTER_AUTH_SECRET
docker compose up -d                     # Postgres + Mailpit
pnpm install
pnpm db:migrate
pnpm dev                                 # http://localhost:3000`

/** Components from the standard shadcn/ui registry, linked to their docs. */
export const shadcnComponents = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "dialog",
  "direction",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "menubar",
  "native-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle",
  "toggle-group",
  "tooltip",
]

/** Additional registry components (chat / AI building blocks). */
export const extraComponents = [
  "attachment",
  "bubble",
  "code-block",
  "marker",
  "message",
  "message-scroller",
  "questionnaire",
  "trace",
]
