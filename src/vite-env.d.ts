/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Gemini API key for AI features. */
  readonly VITE_GEMINI_API_KEY?: string
  /** Optional fallback Gemini key, used if the primary key fails. */
  readonly VITE_GEMINI_API_KEY_2?: string
  /** Gemini model id (defaults to gemini-2.0-flash). */
  readonly VITE_GEMINI_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
