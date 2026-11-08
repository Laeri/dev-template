import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import {
  commands,
  extraComponents,
  features,
  featureTree,
  preconfigured,
  reasons,
  routes,
  shadcnComponents,
  stack,
  structure,
} from "@/features/overview/content"
import { getSession } from "@/lib/session"
import { isSetupComplete } from "@/lib/setup"

/**
 * Template overview. Lives outside the (app) group so it is reachable before
 * /setup has been completed. Replace it with your own landing page.
 */

function title(name: string) {
  return name
    .split("-")
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(" ")
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="flex scroll-mt-20 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

const nav = [
  ["start", "Get started"],
  ["why", "Why"],
  ["stack", "Libraries"],
  ["preconfigured", "Preconfigured"],
  ["routes", "Routes"],
  ["structure", "Structure"],
  ["features", "Features"],
  ["components", "Components"],
] as const

export default async function Page() {
  const [setupDone, session] = await Promise.all([
    isSetupComplete(),
    getSession(),
  ])

  const primary = !setupDone
    ? { href: "/setup", label: "Create the first admin" }
    : session
      ? { href: "/dashboard", label: "Go to dashboard" }
      : { href: "/sign-in", label: "Sign in" }

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
          <span className="mr-auto font-semibold">Next.js template</span>
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            {nav.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>
          <Button size="sm" asChild>
            <Link href={primary.href}>{primary.label}</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-12">
        <section className="flex flex-col items-start gap-5">
          <Badge variant="secondary">pnpm · Turborepo · Next.js 16</Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance">
            A full-stack Next.js monorepo, ready to build on
          </h1>
          <p className="max-w-2xl text-balance text-muted-foreground">
            Type-safe API, database, authentication with an admin section,
            optional TOTP and SAML, transactional email and every shadcn/ui
            component, wired together. This page explains what is included. It
            lives in{" "}
            <code className="font-mono text-sm">apps/web/app/page.tsx</code>;
            replace it with your own landing page.
          </p>
          {!setupDone && (
            <p className="rounded-lg border bg-muted/50 px-3 py-2 text-sm">
              No admin account exists yet. Create one at{" "}
              <Link href="/setup" className="font-medium underline">
                /setup
              </Link>{" "}
              to unlock the rest of the app.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={primary.href}>
                {primary.label}
                <ArrowRightIcon />
              </Link>
            </Button>
            {primary.href === "/dashboard" && (
              <Button variant="outline" asChild>
                <Link href="/sign-in">Login page</Link>
              </Button>
            )}
            <Button variant="ghost" asChild>
              <a href="#stack">Browse the stack</a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Press <Kbd>d</Kbd> to toggle dark mode.
          </p>
        </section>

        <Section
          id="start"
          title="Get started"
          description="Run these from the repo root, or open the repo in the dev container and run pnpm dev."
        >
          <pre className="overflow-x-auto rounded-xl bg-muted p-4 font-mono text-sm">
            {commands}
          </pre>
          <p className="text-sm text-muted-foreground">
            Mailpit (captured emails) runs on{" "}
            <a
              href="http://localhost:8025"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              localhost:8025
            </a>
            . Email previews: <code className="font-mono">pnpm email:dev</code>{" "}
            on :3001. Database browser:{" "}
            <code className="font-mono">pnpm db:studio</code>.
          </p>
        </Section>

        <Section
          id="why"
          title="Why this stack"
          description="The decisions behind the template and what they buy you."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {reasons.map((reason) => (
              <Card key={reason.title} size="sm">
                <CardHeader>
                  <CardTitle>{reason.title}</CardTitle>
                  <CardDescription>{reason.summary}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <ul className="flex list-disc flex-col gap-1.5 pl-4 text-muted-foreground marker:text-foreground/30">
                    {reason.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {reason.comparison && (
                    <div className="rounded-lg bg-muted/60 p-3">
                      <p className="mb-1 text-xs font-medium tracking-wide text-foreground/70 uppercase">
                        vs. SPA + Spring Boot
                      </p>
                      <p className="text-muted-foreground">
                        {reason.comparison}
                      </p>
                    </div>
                  )}
                  {reason.docs && (
                    <a
                      href={reason.docs.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      {reason.docs.label}
                      <ExternalLinkIcon className="size-3.5" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          id="stack"
          title="Libraries"
          description="Each card links to the library's documentation."
        >
          {stack.map(({ group, libraries }) => (
            <div key={group} className="flex flex-col gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {group}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {libraries.map((lib) => (
                  <a
                    key={lib.name}
                    href={lib.docs}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <Card
                      size="sm"
                      className="h-full transition-colors group-hover:bg-muted/50"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {lib.name}
                          <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
                        </CardTitle>
                        <CardDescription>{lib.role}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-muted-foreground">
                        {lib.note}
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </Section>

        <Section
          id="preconfigured"
          title="Preconfigured"
          description="Already wired up, so you can start with your own features."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {preconfigured.map((item) => (
              <Card key={item.title} size="sm">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="routes" title="Routes">
          <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Path</th>
                  <th className="px-3 py-2 font-medium">What</th>
                  <th className="px-3 py-2 font-medium">Access</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.path} className="border-t">
                    <td className="px-3 py-2 font-mono">
                      {route.path.includes("*") ? (
                        route.path
                      ) : (
                        <Link href={route.path} className="hover:underline">
                          {route.path}
                        </Link>
                      )}
                    </td>
                    <td className="px-3 py-2">{route.description}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {route.access}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          id="structure"
          title="Project structure"
          description="packages/api is the only shared package: it is the wire contract, so the client never imports server code."
        >
          <pre className="overflow-x-auto rounded-xl bg-muted p-4 font-mono text-sm">
            {structure}
          </pre>
        </Section>

        <Section
          id="features"
          title="Feature folders"
          description="Each feature lives in apps/web/features/<name>. Its contract and schemas live in packages/api, one file per feature."
        >
          <div className="grid gap-3 md:grid-cols-2">
            <pre className="overflow-x-auto rounded-xl bg-muted p-4 font-mono text-sm">
              {featureTree}
            </pre>
            <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">Feature</th>
                    <th className="px-3 py-2 font-medium">Contains</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature) => (
                    <tr key={feature.name} className="border-t">
                      <td className="px-3 py-2 font-mono">{feature.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {feature.contains}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm text-muted-foreground">
            <li>
              Define the contract in{" "}
              <code className="font-mono">
                packages/api/src/contracts/&lt;feature&gt;.ts
              </code>{" "}
              (schemas in <code className="font-mono">schemas/</code>).
            </li>
            <li>
              Implement it in{" "}
              <code className="font-mono">
                features/&lt;feature&gt;/server/router.ts
              </code>{" "}
              and register it in{" "}
              <code className="font-mono">server/router.ts</code>.
            </li>
            <li>
              Build the UI in{" "}
              <code className="font-mono">
                features/&lt;feature&gt;/components/
              </code>{" "}
              and compose it in a thin page under{" "}
              <code className="font-mono">app/</code>.
            </li>
            <li>
              Add tables to <code className="font-mono">db/schema/</code> (one
              schema for all migrations) and emails to{" "}
              <code className="font-mono">emails/</code>.
            </li>
          </ol>
        </Section>

        <Section
          id="components"
          title="UI components"
          description="All installed in apps/web/components/ui. Import them as @/components/ui/<name>."
        >
          <Card size="sm">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                A few components rendered with the current theme.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Separator orientation="vertical" className="h-5" />
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </div>
              <Input placeholder="Input" className="max-w-xs" />
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-2">
            {shadcnComponents.map((name) => (
              <Badge key={name} variant="outline" asChild>
                <a
                  href={`https://ui.shadcn.com/docs/components/${name}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {title(name)}
                </a>
              </Badge>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Chat and AI building blocks, also from the{" "}
              <a
                href="https://ui.shadcn.com/docs/components"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                shadcn registry
              </a>
              :
            </p>
            <div className="flex flex-wrap gap-2">
              {extraComponents.map((name) => (
                <Badge key={name} variant="secondary">
                  {title(name)}
                </Badge>
              ))}
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-6 text-sm text-muted-foreground">
          <span className="mr-auto">
            See README.md for scripts and common tasks.
          </span>
          <Link href={primary.href} className="hover:text-foreground">
            {primary.label}
          </Link>
          {primary.href !== "/sign-in" && (
            <Link href="/sign-in" className="hover:text-foreground">
              Login
            </Link>
          )}
        </div>
      </footer>
    </div>
  )
}
