/**
 * AI service — wraps the Google Gemini REST API.
 *
 * The key is read from `import.meta.env.VITE_GEMINI_API_KEY` (see `.env.example`).
 * This runs in the browser, so the key is exposed to the client — fine for a
 * demo/assignment, but a production app should proxy these calls through a
 * backend. Swapping the fetch target for your own endpoint is all it takes.
 */
import type { Announcement } from '../types'

// Primary key first, optional fallback second. Tried in order.
const API_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY,
  import.meta.env.VITE_GEMINI_API_KEY_2,
].filter((k): k is string => Boolean(k))

const MODEL = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash-lite'

export class AiError extends Error {
  readonly status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'AiError'
    this.status = status
  }
}

/** Whether at least one Gemini API key is configured. */
export function isAiConfigured(): boolean {
  return API_KEYS.length > 0
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  promptFeedback?: { blockReason?: string }
}

function endpoint(key: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`
}

/** Pull a human-readable message out of Gemini's error body, if present. */
function extractApiError(body: string): string {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string } }
    return parsed.error?.message ?? ''
  } catch {
    return ''
  }
}

function buildPrompt(items: Announcement[]): string {
  const list = items
    .map((a, i) => `${i + 1}. [${a.category}] ${a.title} — ${a.body}`)
    .join('\n')

  return [
    'You are an assistant inside an employee dashboard.',
    'Summarize the company announcements below for a busy employee.',
    'Respond with 2–4 short bullet points, each starting with "- ".',
    'Lead with anything time-sensitive or that needs action. Keep the whole',
    'summary under 70 words. Do not add a preamble or closing remark.',
    '',
    'Announcements:',
    list,
  ].join('\n')
}

/** Single Gemini call with one key. Throws AiError on failure. */
async function generate(prompt: string, key: string, signal?: AbortSignal): Promise<string> {
  let response: Response
  try {
    response = await fetch(endpoint(key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 300 },
      }),
      signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new AiError('Network error contacting Gemini. Check your connection and try again.')
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    const apiMessage = extractApiError(detail)
    const hint = response.status === 400 || response.status === 403 ? ' — check your API key' : ''
    throw new AiError(
      `Gemini request failed (${response.status})${hint}.${apiMessage ? ` ${apiMessage}` : ''}`,
      response.status,
    )
  }

  const data = (await response.json()) as GeminiResponse

  if (data.promptFeedback?.blockReason) {
    throw new AiError(`Gemini blocked the request (${data.promptFeedback.blockReason}).`)
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? '')
    .join('')
    .trim()

  if (!text) throw new AiError('Gemini returned an empty summary. Try again.')
  return text
}

/**
 * Ask Gemini to summarize the given announcements. Tries each configured key
 * in order, falling back to the next one if a request fails (e.g. rate limit),
 * and only surfaces an error if every key fails. Aborts are not retried.
 */
export async function summarizeAnnouncements(
  items: Announcement[],
  signal?: AbortSignal,
): Promise<string> {
  if (items.length === 0) return ''

  if (API_KEYS.length === 0) {
    throw new AiError(
      'Gemini API key not configured. Add VITE_GEMINI_API_KEY to a .env file to enable AI summaries.',
    )
  }

  const prompt = buildPrompt(items)
  let lastError: unknown

  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      return await generate(prompt, API_KEYS[i], signal)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err
      lastError = err
      if (i < API_KEYS.length - 1) {
        console.warn(`Gemini key ${i + 1} failed, trying fallback key…`, err)
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new AiError('All Gemini API keys failed. Please try again later.')
}
