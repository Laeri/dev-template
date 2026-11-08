import "server-only"

import { contract } from "@workspace/api"
import { implement, ORPCError } from "@orpc/server"

import { auth } from "@/lib/auth"

export interface BaseContext {
  headers: Headers
}

export const os = implement(contract).$context<BaseContext>()

/** Resolves the better-auth session and rejects unauthenticated calls. */
export const authed = os.middleware(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers })
  if (!session) throw new ORPCError("UNAUTHORIZED")
  return next({ context: { session: session.session, user: session.user } })
})
