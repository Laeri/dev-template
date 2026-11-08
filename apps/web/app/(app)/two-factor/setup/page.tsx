import { redirect } from "next/navigation"

import { TwoFactorSetup } from "@/components/two-factor/setup"
import { requireSessionAllowNo2FA } from "@/lib/session"

export default async function TwoFactorSetupPage() {
  const { user } = await requireSessionAllowNo2FA()
  if (user.twoFactorEnabled) redirect("/dashboard")

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-md">
        <TwoFactorSetup />
      </div>
    </div>
  )
}
