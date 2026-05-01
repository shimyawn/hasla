import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Force this route to run on the Node.js runtime (default for app routes
// in Next.js, but stated explicitly because googleapis is Node-only).
export const runtime = 'nodejs'
// Always evaluate fresh; never cache POST responses.
export const dynamic = 'force-dynamic'

interface NotifyPayload {
  email?: string
  phone?: string
  lang?: string
  consent?: boolean
  consentVersion?: string
  source?: string
}

function isMissing(v: string | undefined): v is undefined {
  return !v || v.trim() === ''
}

export async function POST(req: NextRequest) {
  let payload: NotifyPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const email = payload.email?.trim() ?? ''
  const phone = payload.phone?.trim() ?? ''
  const lang = payload.lang ?? ''
  const source = payload.source ?? 'mobile-leaflet'
  const consent = !!payload.consent
  const consentVersion = payload.consentVersion ?? ''

  if (isMissing(email) && isMissing(phone)) {
    return NextResponse.json({ ok: false, error: 'no_contact' }, { status: 400 })
  }
  if (!consent) {
    return NextResponse.json({ ok: false, error: 'no_consent' }, { status: 400 })
  }

  const sheetId = process.env.GOOGLE_SHEET_ID
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Sheet1'

  if (!sheetId || !clientEmail || !privateKey) {
    return NextResponse.json(
      { ok: false, error: 'sheets_env_missing' },
      { status: 500 },
    )
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    const sheets = google.sheets({ version: 'v4', auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${tabName}!A:G`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            email,
            phone,
            lang,
            source,
            consent ? 'TRUE' : 'FALSE',
            consentVersion,
          ],
        ],
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Surface Google API errors back to the client as a generic failure
    // but log full details server-side for debugging.
    // eslint-disable-next-line no-console
    console.error('[/api/notify] sheets append failed:', err)
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json(
      { ok: false, error: 'sheets_failed', detail: message },
      { status: 500 },
    )
  }
}

// Convenient health check — visit /api/notify directly to verify the
// route is wired up and env vars are present (does NOT verify auth or
// sheet access).
export async function GET() {
  const sheetId = process.env.GOOGLE_SHEET_ID
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const hasKey = !!process.env.GOOGLE_PRIVATE_KEY
  return NextResponse.json({
    ok: true,
    env: {
      GOOGLE_SHEET_ID: sheetId ? `set (${sheetId.slice(0, 6)}…)` : 'MISSING',
      GOOGLE_CLIENT_EMAIL: clientEmail ?? 'MISSING',
      GOOGLE_PRIVATE_KEY: hasKey ? 'set' : 'MISSING',
      GOOGLE_SHEET_TAB_NAME: process.env.GOOGLE_SHEET_TAB_NAME ?? 'Sheet1 (default)',
    },
  })
}
