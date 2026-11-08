import "server-only"

import type { RenderedEmail } from "@workspace/email"
import nodemailer from "nodemailer"

import { env } from "@/lib/env"

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: env.SMTP_USER
    ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
    : undefined,
})

export async function sendEmail(to: string, email: RenderedEmail) {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject: email.subject,
    html: email.html,
    text: email.text,
  })
}
