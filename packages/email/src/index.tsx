import { render } from "@react-email/render"

import ResetPassword, {
  type ResetPasswordProps,
} from "../emails/reset-password"
import VerifyEmail, { type VerifyEmailProps } from "../emails/verify-email"

export interface RenderedEmail {
  subject: string
  html: string
  text: string
}

async function renderEmail(
  subject: string,
  element: React.ReactElement
): Promise<RenderedEmail> {
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ])
  return { subject, html, text }
}

export function renderVerifyEmail(props: VerifyEmailProps) {
  return renderEmail("Verify your email address", <VerifyEmail {...props} />)
}

export function renderResetPassword(props: ResetPasswordProps) {
  return renderEmail("Reset your password", <ResetPassword {...props} />)
}

export type { ResetPasswordProps, VerifyEmailProps }
