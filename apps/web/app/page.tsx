import { Button } from "@/components/ui/button"
import Link from "next/link"

import { getSession } from "@/lib/session"

const stack = [
  "Next.js",
  "Tailwind v4",
  "shadcn/ui",
  "oRPC",
  "TanStack Query",
  "TanStack Table",
  "React Hook Form",
  "Zod",
  "better-auth",
  "Drizzle",
  "React Email",
]

export default async function Page() {
  const session = await getSession()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">
        Next.js monorepo template
      </h1>
      <p className="max-w-lg text-balance text-muted-foreground">
        {stack.join(" · ")}
      </p>
      <div className="flex gap-3">
        {session ? (
          <Button asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        ) : (
          <>
            <Button asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </>
        )}
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        Press <kbd>d</kbd> to toggle dark mode
      </p>
    </div>
  )
}
