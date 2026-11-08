import "server-only"

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import {
  APIError,
  createAuthMiddleware,
  getSessionFromCtx,
} from "better-auth/api"
import { admin, twoFactor } from "better-auth/plugins"

import { db, schema } from "@/db"
import { sendResetPasswordEmail, sendVerifyEmail } from "@/lib/email"
import { env } from "@/lib/env"

export const APP_NAME = "Next.js Template"

export const auth = betterAuth({
  appName: APP_NAME,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    // No public sign-up: the first admin is created at /setup, further
    // password users are created by admins (admin plugin `createUser`).
    disableSignUp: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, { name: user.name, url })
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerifyEmail(user.email, { name: user.name, url })
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // TOTP is mandatory for password admins, so they may not turn it off.
      if (ctx.path === "/two-factor/disable") {
        const session = await getSessionFromCtx(ctx)
        if (session?.user.role === "admin") {
          throw new APIError("FORBIDDEN", {
            message: "Two-factor authentication is required for admins",
          })
        }
      }
    }),
  },
  plugins: [twoFactor({ issuer: APP_NAME }), admin()],
})

export type Session = typeof auth.$Infer.Session
export type SessionUser = Session["user"]
