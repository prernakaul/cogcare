/**
 * Serverless endpoint for emailing BHI results.
 * Supports Brevo (Sendinblue) or Amazon SES — chosen by deployment admins via MAIL_PROVIDER.
 *
 * Optional standalone packaging: AWS Lambda, API Gateway, or other Node hosts. Production email + onboarding uses Amplify **`completeAssessment`** instead.
 * Do not expose API keys or secrets in the browser.
 *
 * Admin / server environment
 * --------------------------
 * MAIL_PROVIDER         — `brevo` (default) or `ses`
 *
 * Brevo (when MAIL_PROVIDER=brevo or unset):
 *   BREVO_API_KEY       — Brevo → SMTP & API → API keys
 *   BREVO_SENDER_EMAIL  — verified sender
 *   BREVO_SENDER_NAME   — optional, default "CogCare"
 *
 * Amazon SES (when MAIL_PROVIDER=ses):
 *   AWS_REGION                    — e.g. us-east-1
 *   SES_FROM_EMAIL                — verified identity / From address
 *   SES_FROM_NAME                 — optional display name, default "CogCare"
 *   SES_CONFIGURATION_SET         — optional SES configuration set for event publishing
 *   AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY — on non-AWS hosts; on Lambda use execution role
 * IAM: ses:SendEmail on the verified identities (and ses:SendRawEmail if you switch APIs later)
 *
 * Optional (all providers):
 *   ALLOWED_ORIGIN      — CORS origin (default "*")
 *
 * Frontend (.env): VITE_QUIZ_EMAIL_API_URL=https://<your-host>/api/send-quiz-email
 *
 * Legacy: production onboarding + report email uses the Amplify `completeAssessment` Lambda.
 * Keep this handler for local/dev or non-Amplify hosts only; HTML body is shared via /lib/bhiReportEmailHtml.js.
 */

import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { buildBhiReportEmailHtml } from '../lib/bhiReportEmailHtml.js'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

const SUBJECT = 'Your Brain Health Index results'

function normalizeMailProvider(raw) {
  const v = String(raw || 'brevo')
    .trim()
    .toLowerCase()
  if (v === 'ses' || v === 'amazon_ses' || v === 'aws-ses' || v === 'aws_ses') return 'ses'
  return 'brevo'
}

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME || 'CogCare'
  return { apiKey, senderEmail, senderName, ok: Boolean(apiKey && senderEmail) }
}

function getSesConfig() {
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
  const fromEmail = process.env.SES_FROM_EMAIL
  const fromName = process.env.SES_FROM_NAME || 'CogCare'
  const configurationSetName = process.env.SES_CONFIGURATION_SET || undefined
  return { region, fromEmail, fromName, configurationSetName, ok: Boolean(region && fromEmail) }
}

async function sendViaBrevo({ apiKey, senderEmail, senderName }, toEmail, htmlContent) {
  const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: toEmail }],
      subject: SUBJECT,
      htmlContent,
    }),
  })
  if (!brevoRes.ok) {
    const detail = await brevoRes.text()
    return { ok: false, status: 502, detail: detail.slice(0, 500) }
  }
  return { ok: true }
}

async function sendViaSes({ region, fromEmail, fromName, configurationSetName }, toEmail, htmlContent) {
  const client = new SESv2Client({ region })
  const fromHeader = fromName ? `"${fromName.replace(/"/g, '')}" <${fromEmail}>` : fromEmail
  const input = {
    FromEmailAddress: fromHeader,
    Destination: { ToAddresses: [toEmail] },
    Content: {
      Simple: {
        Subject: { Data: SUBJECT, Charset: 'UTF-8' },
        Body: { Html: { Data: htmlContent, Charset: 'UTF-8' } },
      },
    },
  }
  if (configurationSetName) {
    input.ConfigurationSetName = configurationSetName
  }
  try {
    await client.send(new SendEmailCommand(input))
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, status: 502, detail: msg.slice(0, 500) }
  }
}

export default async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const provider = normalizeMailProvider(process.env.MAIL_PROVIDER)

  const brevo = getBrevoConfig()
  const ses = getSesConfig()

  const providerReady = provider === 'ses' ? ses.ok : brevo.ok
  if (!providerReady) {
    if (process.env.NODE_ENV !== 'production') {
      // Dev mock: no credentials configured, return success so the UI flow is testable
      console.warn('[send-quiz-email] No email provider configured — returning mock success (dev only).')
      return res.status(200).json({ ok: true, mock: true, scenario: 'new_user' })
    }
    return res.status(503).json({
      error: 'Email service is not configured',
      detail:
        provider === 'ses'
          ? 'Set MAIL_PROVIDER=ses with AWS_REGION and SES_FROM_EMAIL (verified in SES).'
          : 'Set BREVO_API_KEY and BREVO_SENDER_EMAIL, or switch to MAIL_PROVIDER=ses with SES settings.',
    })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' })
    }
  }
  if (!body || typeof body !== 'object') {
    body = {}
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const results = body.results

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  const htmlContent = buildBhiReportEmailHtml(results, { footerSource: 'CogCare.org' })

  if (provider === 'ses') {
    const out = await sendViaSes(ses, email, htmlContent)
    if (!out.ok) {
      return res.status(out.status || 502).json({
        error: 'Could not send email',
        detail: out.detail,
      })
    }
  } else {
    const out = await sendViaBrevo(brevo, email, htmlContent)
    if (!out.ok) {
      return res.status(out.status || 502).json({
        error: 'Could not send email',
        detail: out.detail,
      })
    }
  }

  return res.status(200).json({ ok: true })
}
