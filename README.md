# RPS Employee Dashboard

An internal employee dashboard — attendance, leave, team directory, and
announcements — with an AI-powered announcement summary. Built with React,
TypeScript, and Vite.

The app runs entirely on the client against local mock data behind a service
layer, so no backend is required. The one external dependency is Google Gemini,
used for the AI summary (and it degrades gracefully when no key is set).

**Live demo:** <https://rps-employee-dashboard-ashy.vercel.app/>

---

## Features

- **Dashboard** — KPI cards, an attendance summary (proportion bar + legend), a
  leave summary (usage bars), recent announcements, and quick actions.
- **Attendance** — personal monthly view with statistics, a calendar grid, and a
  daily log table; navigate month to month.
- **Leave** — request form with validation, balance summary, and filterable
  history with status badges. Balances are derived from approved requests.
- **Team directory** — searchable, filterable (team + status) responsive grid of
  employee cards, each with a one-click **Connect** intro email.
- **Announcements** — AI summary (Google Gemini) with loading/retry states, plus
  the full announcement feed.
- **Profile** — editable details with a save confirmation toast.
- **Theming** — light/dark mode, persisted, with a topbar toggle.
- **UX** — responsive app shell (sidebar + topbar, mobile drawer), reusable UI
  kit, skeleton loading, and empty/error states throughout.

## Tech stack

- **React 19** + **TypeScript** (strict) + **Vite**
- **React Router 7** (data router, code-split routes)
- **CSS Modules** with a CSS-variable design-token system (light/dark)
- **ESLint** (typescript-eslint, react-hooks, react-refresh)
- **Google Gemini** REST API for the AI summary

---

## Getting started

### Prerequisites

- Node.js 20.19+ (or 22.12+) and npm

### Install

```bash
git clone https://github.com/rahulm820/rps-employee-dashboard.git
cd rps-employee-dashboard/my-app
npm install
```

### Configure environment (optional — enables the AI summary)

```bash
cp .env.example .env
# then edit .env and add your Gemini API key(s)
```

Without a key the app still runs; the AI summary card shows an "AI not
configured" state. Get a key at <https://aistudio.google.com/apikey>.

### Run

```bash
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # type-check + production build
```

---

## Environment variables

All variables are optional and read at build/dev time via Vite (`import.meta.env`).
Because this is a client-only app, any `VITE_`-prefixed value is bundled and
visible in the browser — fine for a demo, but a production app should proxy AI
calls through a backend.

| Variable                | Required | Default            | Description                                           |
| ----------------------- | -------- | ------------------ | ----------------------------------------------------- |
| `VITE_GEMINI_API_KEY`   | No       | —                  | Primary Google Gemini API key for the AI summary.     |
| `VITE_GEMINI_API_KEY_2` | No       | —                  | Optional fallback key, used if the primary key fails. |
| `VITE_GEMINI_MODEL`     | No       | `gemini-2.0-flash` | Gemini model id.                                      |

`.env` files are git-ignored; `.env.example` documents the expected keys.

---

## Project structure

```
src/
├─ main.tsx               # entry: tokens + global CSS, mounts <App/>
├─ App.tsx                # ThemeProvider → ToastProvider → RouterProvider
├─ routes/                # route config, paths, code-split page modules
├─ pages/                 # one component per route (composed from features)
├─ components/
│  ├─ ui/                 # reusable UI kit (Button, Card, Table, Modal, …) + tokens
│  ├─ layout/             # app shell: RootLayout, Sidebar, Topbar, PageHeader
│  ├─ dashboard/          # dashboard widgets (KPIs, summaries, quick actions)
│  ├─ attendance/         # attendance stats, calendar, table, toolbar
│  ├─ leave/              # request form, balances, history, status badge
│  ├─ directory/          # employee grid, card, toolbar
│  ├─ announcements/      # announcement card, AI summary
│  └─ icons.tsx           # inline SVG icon set
├─ hooks/                 # data hooks (useAsync + per-resource hooks)
├─ services/              # domain services over the mock API (+ aiService)
├─ lib/api/               # mock request client (latency, abort, typed errors)
├─ data/                  # mock JSON fixtures + typed loader
├─ types/                 # domain models and shared types
├─ theme/                 # ThemeProvider + useTheme
├─ constants/             # app constants, navigation config
├─ utils/                 # date & formatting helpers
└─ styles/                # global base styles
```

## Architecture

**Data flow.** UI components call **hooks**, which wrap **services**, which read
from **mock JSON** through a small **mock API client** (`lib/api`). The client
simulates latency, supports `AbortSignal`, deep-clones responses, and throws
typed errors — so swapping it for real `fetch` calls wouldn't touch the layers
above it.

**Async state.** `useAsync` runs an abortable factory on mount and when its deps
change, exposing `{ data, loading, error, refetch }` with derived loading. Every
data-driven view has loading skeletons and error/empty states.

**Theming.** Design tokens live in `components/ui/tokens.css` as CSS variables
keyed off `data-theme` on `<html>`; `ThemeProvider` sets and persists the theme.

**Performance.** Routes are code-split (`React.lazy`) so each page loads its own
chunk; list cards are `React.memo`'d, and hot derived values are memoized.

## AI feature (Gemini)

`services/aiService.ts` wraps the Gemini `generateContent` REST endpoint. It
builds a concise summarization prompt from the current announcements, supports
cancellation, and returns typed `AiError`s. Multiple keys are tried in order
(primary → fallback) so a rate-limited key transparently falls back to the next;
aborts are never retried. The `AiSummary` component surfaces loading, error/retry,
and "not configured" states.

## Notes & limitations

- Data is mock and in-memory: created leave requests persist for the session only.
- The Gemini key is client-side (see Environment variables). Proxy through a
  backend for production.
- Dates in the mock fixtures are set around July 2026 so the demo looks populated.
