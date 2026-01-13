// src/services/email.service.ts
import EmailConfig from '../config/email'

const wrap = (content: string) => `
  <div style="font-family:Arial,sans-serif;background:#f6f6f6;padding:24px">
    <div style="max-width:520px;margin:auto;background:#ffffff;padding:24px;border-radius:8px">
      ${content}
      <p style="margin-top:32px;font-size:12px;color:#777">
        — ${process.env.FROM_NAME}
      </p>
    </div>
  </div>
`

export const sendOtpEmail = async (to: string, otp: string) => {
  await EmailConfig.sendEmail(
    to,
    'Verify your email',
    wrap(`
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1 style="letter-spacing:4px">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
    `)
  )
}

export const sendWelcomeEmail = async (to: string, name: string) => {
  await EmailConfig.sendEmail(
    to,
    'Welcome to AkhaamulQuran',
    wrap(`
      <h2>Welcome, ${name}</h2>
      <p>Your email has been successfully verified.</p>
    `)
  )
}
