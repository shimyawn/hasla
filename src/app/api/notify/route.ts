import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Force this route to run on the Node.js runtime (default for app routes
// in Next.js, but stated explicitly because googleapis is Node-only).
export const runtime = 'nodejs'
// Always evaluate fresh; never cache POST responses.
export const dynamic = 'force-dynamic'

/** Normalise GOOGLE_PRIVATE_KEY across the various ways users paste it
 *  into Vercel: literal \n escapes, surrounding quotes, base64 encoding. */
function normalizePrivateKey(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  let key = raw.trim()
  // Strip surrounding quotes if user copied them too
  if ((key.startsWith('"') && key.endsWith('"')) ||
      (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1)
  }
  // Literal \n → real newline
  key = key.replace(/\\n/g, '\n')
  // If it looks like base64 (no BEGIN block) try decoding
  if (!key.includes('BEGIN PRIVATE KEY') && /^[A-Za-z0-9+/=\s]+$/.test(key)) {
    try {
      const decoded = Buffer.from(key, 'base64').toString('utf8')
      if (decoded.includes('BEGIN PRIVATE KEY')) key = decoded
    } catch {
      /* fall through */
    }
  }
  return key
}

interface NotifyPayload {
  email?: string
  phone?: string
  lang?: string
  consent?: boolean
  consentVersion?: string
  source?: string
  honeypot?: string        // bot trap — must be empty string
  formStartedAt?: number   // client epoch ms when form became interactive
}

// --- Per-IP rate limit (in-memory, per serverless instance) ----------------
// Good enough for soft-open scale. For massive bursts swap in Vercel KV.
const RATE_WINDOW_MS = 60 * 1000
const RATE_MAX_REQUESTS = 5
const ipRequestLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const log = ipRequestLog.get(ip) ?? []
  const recent = log.filter((t) => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_MAX_REQUESTS) {
    ipRequestLog.set(ip, recent) // refresh sliding window
    return true
  }
  recent.push(now)
  ipRequestLog.set(ip, recent)
  // Occasional cleanup so the map doesn't grow forever
  if (Math.random() < 0.05) {
    for (const [k, v] of ipRequestLog) {
      const stillRecent = v.filter((t) => now - t < RATE_WINDOW_MS)
      if (stillRecent.length === 0) ipRequestLog.delete(k)
      else ipRequestLog.set(k, stillRecent)
    }
  }
  return false
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() ?? 'unknown'
  return req.headers.get('x-real-ip') ?? 'unknown'
}

// Append with retry — handles Google API 429 / 5xx with brief backoff.
async function appendWithRetry(
  fn: () => Promise<unknown>,
  attempts = 3,
): Promise<void> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      await fn()
      return
    } catch (err) {
      lastErr = err
      const e = err as { code?: number; status?: number; response?: { status?: number } }
      const code = e?.code ?? e?.status ?? e?.response?.status ?? 0
      const isRetryable = code === 429 || (code >= 500 && code < 600)
      if (!isRetryable || i === attempts - 1) throw err
      // 600ms, 1.8s
      await new Promise((r) => setTimeout(r, 600 * Math.pow(3, i)))
    }
  }
  throw lastErr
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

  // ── Bot defense layer ───────────────────────────────────────────
  // 1) Honeypot — bots auto-fill every input. Real users can't see it.
  if (payload.honeypot && payload.honeypot.trim() !== '') {
    // Pretend success so the bot doesn't try a different attack vector.
    return NextResponse.json({ ok: true })
  }

  // 2) Min submit time — humans take >2s to fill out the form.
  const formStartedAt = typeof payload.formStartedAt === 'number' ? payload.formStartedAt : 0
  if (formStartedAt > 0) {
    const elapsed = Date.now() - formStartedAt
    if (elapsed < 2000) {
      // Pretend success — bot won't know the form was rejected.
      return NextResponse.json({ ok: true })
    }
  }

  // 3) IP rate limit — same IP capped at N requests / minute.
  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429 },
    )
  }
  // ────────────────────────────────────────────────────────────────

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
  const privateKey = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY)
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

    await appendWithRetry(() =>
      sheets.spreadsheets.values.append({
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
      }),
    )

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

// Health check — env presence + actually try to read the sheet so we know
// auth and sharing are correct. Visit /api/notify directly in the browser.
export async function GET() {
  const sheetId = process.env.GOOGLE_SHEET_ID
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const rawKey = process.env.GOOGLE_PRIVATE_KEY
  const privateKey = normalizePrivateKey(rawKey)
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Sheet1'

  const env = {
    GOOGLE_SHEET_ID: sheetId ? `set (${sheetId.slice(0, 6)}…)` : 'MISSING',
    GOOGLE_CLIENT_EMAIL: clientEmail ?? 'MISSING',
    GOOGLE_PRIVATE_KEY: rawKey ? 'set' : 'MISSING',
    GOOGLE_SHEET_TAB_NAME: process.env.GOOGLE_SHEET_TAB_NAME ?? 'Sheet1 (default)',
  }

  // Diagnose private_key shape so format problems are obvious
  const pkDiag = rawKey
    ? {
        rawLength: rawKey.length,
        normalizedLength: privateKey?.length,
        startsWithBegin: privateKey?.startsWith('-----BEGIN PRIVATE KEY-----'),
        endsWithEnd: privateKey?.trimEnd().endsWith('-----END PRIVATE KEY-----'),
        hasRealNewlines: privateKey?.includes('\n') ?? false,
        rawHadEscapedNewlines: rawKey.includes('\\n'),
        rawHadSurroundingQuotes:
          (rawKey.startsWith('"') && rawKey.endsWith('"')) ||
          (rawKey.startsWith("'") && rawKey.endsWith("'")),
      }
    : null

  if (!sheetId || !clientEmail || !privateKey) {
    return NextResponse.json({
      ok: false,
      env,
      privateKeyDiag: pkDiag,
      sheetTest: { ok: false, reason: 'env_missing — fill the env vars first' },
    })
  }

  // Try to actually reach the sheet
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    const sheets = google.sheets({ version: 'v4', auth })
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      fields: 'properties.title,sheets.properties.title',
    })
    const tabs = meta.data.sheets?.map((s) => s.properties?.title).filter(Boolean) as string[]
    const tabExists = tabs?.includes(tabName)
    return NextResponse.json({
      ok: true,
      env,
      sheetTest: {
        ok: true,
        spreadsheetTitle: meta.data.properties?.title,
        availableTabs: tabs,
        configuredTab: tabName,
        tabExists,
        hint: tabExists
          ? '✓ All checks passed — submitting the form should work.'
          : `⚠ The tab '${tabName}' was not found. Available tabs: ${tabs?.join(', ')}. Update GOOGLE_SHEET_TAB_NAME env var to one of these (or rename your tab to '${tabName}').`,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown'
    let hint = 'Check the docs/notify-form-setup.md.'
    if (message.includes('PERMISSION_DENIED') || message.includes('does not have permission')) {
      hint = `Service account doesn't have access to the sheet. Open the sheet → Share button → add '${clientEmail}' as Editor (with bell icon UNCHECKED).`
    } else if (message.includes('Requested entity was not found')) {
      hint = 'GOOGLE_SHEET_ID is wrong or the sheet was deleted. Double-check the ID in Vercel env vars.'
    } else if (message.includes('invalid_grant') || message.includes('Invalid JWT')) {
      hint = 'GOOGLE_PRIVATE_KEY looks malformed. Re-copy the private_key value from the JSON file (the entire string including the BEGIN/END lines).'
    } else if (message.includes('SERVICE_DISABLED') || message.includes('has not been used')) {
      hint = 'Google Sheets API is not enabled for the project. Open Google Cloud Console → APIs & Services → Library → search "Google Sheets API" → Enable.'
    } else if (message.includes('DECODER routines') || message.includes('unsupported')) {
      hint = 'GOOGLE_PRIVATE_KEY 형식 문제 — JSON에서 복사할 때 escape 문자가 깨졌습니다. 권장: JSON의 private_key 값을 base64로 인코딩해서 다시 등록하세요. 또는 대안: 따옴표 없이, 한 줄짜리 형태로 (\\n 그대로 포함) 정확히 다시 붙여넣어 주세요.'
    }
    return NextResponse.json({
      ok: false,
      env,
      privateKeyDiag: pkDiag,
      sheetTest: { ok: false, error: message, hint },
    })
  }
}
