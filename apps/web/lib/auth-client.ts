import { adminClient, twoFactorClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  plugins: [
    // The sign-in form handles `twoFactorRedirect` itself.
    twoFactorClient(),
    adminClient(),
  ],
})

export const { signIn, signOut, useSession } = authClient
