# Employee Dashboard — Design System (Light & Dark Mode)
 
> Adapted from a reference palette/typography/component system originally derived from a B2B SaaS landing page . The color tokens, type scale, spacing scale, and component patterns below have been repurposed for our internal **Employee Dashboard** application. Treat the underlying hex/spacing values as a solid starting system — adjust as needed once real UI is built and reviewed against accessibility contrast requirements.
 
---
 
## 1. Brand Personality
 
- **Category**: Internal B2B tool — employee-facing HR/workforce dashboard (attendance, leave, team directory, announcements)
- **Tone**: Clear, calm, dependable — this is a tool people check daily to get a quick answer (Am I approved? Who's on my team? What's the latest announcement?), so it should feel efficient and low-friction rather than "marketed at." No hype, no sales language — just clarity and trust.
- **Visual language**: Near-black neutrals and a warm off-white surface for a professional, low-glare workspace feel; a single desaturated sage/olive-green accent used sparingly for emphasis — status highlights, approved states, key stats (attendance %, leave balance), and primary actions. The restraint of the palette signals "this is a tool for getting things done," not a consumer app competing for attention.
- **Layout rhythm**: Unlike a marketing site's full-bleed alternating sections, the dashboard uses a persistent app shell (sidebar + topbar) with consistent card-based content areas — stat cards for quick-glance metrics (attendance summary, leave balance), tables/lists for detail (attendance log, leave history, directory), and a feed-style layout for announcements. Generous whitespace and a clear content hierarchy carry over from the reference system, but flattened into a functional, day-to-day app layout rather than a scrolling story.
---
 
## 2. Color Tokens
 
Extracted dominant palette (retained from the reference system — neutral-led with a single accent):
 
| Hex | Role guess |
|---|---|
| `#1B1B1B` | Primary near-black (dark bg / dark text) |
| `#313130` | Dark warm gray (secondary dark surface) |
| `#EFEFEE` | Off-white (primary light bg) |
| `#515150` | Mid gray (secondary text / muted) |
| `#1D1D08` | Deep olive-black |
| `#32331B` | Dark olive |
| `#181626` | Near-black indigo |
| `#182000` | Near-black green |
| `#CAD68A` | Sage green — **primary accent (light)** |
| `#3B4505` | Olive green — **primary accent (dark)** |
 
### Light Mode
 
```css
:root[data-theme="light"] {
  --color-bg: #EFEFEE;              /* page background, off-white not pure white */
  --color-surface: #FFFFFF;         /* cards, elevated panels */
  --color-surface-alt: #E4E4E1;     /* subtle section band alternation */
  --color-text-primary: #1B1B1B;    /* headings, body copy */
  --color-text-secondary: #515150;  /* subheads, supporting copy */
  --color-text-muted: #8A8A87;      /* captions, meta text */
  --color-border: #D8D8D5;
 
  --color-accent: #3B4505;          /* olive-green, used for links/CTAs on light bg */
  --color-accent-soft: #CAD68A;     /* accent fills, chips, highlighted stat backgrounds */
  --color-accent-contrast: #FFFFFF; /* text on filled accent buttons */
 
  --color-cta-bg: #1B1B1B;          /* primary CTA button (dark pill on light bg) */
  --color-cta-text: #EFEFEE;
 
  --color-success: #3B4505;
  --color-focus-ring: #3B4505;
}
```
 
### Dark Mode
 
```css
:root[data-theme="dark"] {
  --color-bg: #1B1B1B;              /* page background */
  --color-surface: #232322;         /* cards, elevated panels */
  --color-surface-alt: #313130;     /* section band alternation, hero overlay */
  --color-text-primary: #EFEFEE;    /* headings, body copy */
  --color-text-secondary: #B5B5B2;  /* subheads, supporting copy */
  --color-text-muted: #7C7C79;      /* captions, meta text */
  --color-border: #3A3A38;
 
  --color-accent: #CAD68A;          /* sage green, used for links/highlights on dark bg */
  --color-accent-soft: #32331B;     /* accent fills, chips (dark, low-contrast) */
  --color-accent-contrast: #1B1B1B; /* text on filled accent buttons */
 
  --color-cta-bg: #EFEFEE;          /* primary CTA button (light pill on dark bg) */
  --color-cta-text: #1B1B1B;
 
  --color-success: #CAD68A;
  --color-focus-ring: #CAD68A;
}
```
 
**Usage rule**: the sage-green accent (`#CAD68A` / `#3B4505`) is a *seasoning*, not a base color — reserve it for stat numbers, small badges, underlines, icon fills, and hover states. Large surfaces stay neutral (black/off-white/gray). In the dashboard context, this maps naturally onto: approved leave badges, key attendance/leave stat numerals, active nav item indicator, and primary action buttons ("Request Leave", "Submit").
 
---
 
## 3. Typography
 
```css
--font-family-base: "Inter", "Helvetica Neue", Arial, sans-serif;
 
--font-size-hero: clamp(2.5rem, 5vw, 4rem);      /* not typically used in-app; reserved for login/empty states */
--font-size-h2: clamp(1.75rem, 3vw, 2.5rem);      /* page titles, e.g. "Leave" */
--font-size-h3: 1.25rem;                          /* card / section titles */
--font-size-body: 1rem;
--font-size-small: 0.875rem;
--font-size-stat: clamp(2rem, 4vw, 3rem);         /* stat card numerals — attendance %, leave balance */
 
--line-height-tight: 1.1;   /* headlines */
--line-height-body: 1.6;
 
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;    /* page titles, stat numbers */
 
--letter-spacing-tight: -0.02em;  /* large headlines */
```
 
- Page titles: semibold/bold weight, tight line-height, sentence case (e.g. "Leave requests", "Team directory").
- Stat call-outs: extra-large numerals in bold, accent or neutral color, paired with a small regular-weight label underneath (e.g. **12** / "Days remaining").
- Body copy: regular weight, comfortable 1.6 line-height, secondary-gray color.
---
 
## 4. Spacing & Layout
 
```css
--space-xs: 0.5rem;
--space-sm: 1rem;
--space-md: 1.5rem;
--space-lg: 2.5rem;
--space-xl: 4rem;
--space-2xl: 6rem;   /* rarely used in-app; reserved for empty/login states */
 
--container-max: 1280px;
--radius-sm: 8px;
--radius-md: 16px;
--radius-pill: 999px;  /* buttons, badges */
```
 
- App shell: persistent sidebar + topbar, with `--color-bg` as the main canvas and `--color-surface` cards for content blocks (stat cards, tables, forms).
- Cards use `--radius-md`, subtle border (`--color-border`), soft shadow only in light mode; dark mode cards rely on a lighter surface tone instead of shadow for elevation.
- Buttons are pill-shaped (`--radius-pill`), high-contrast fill — primary actions (submit, approve) use `--color-cta-bg`/`--color-cta-text`; secondary/ghost actions use an outlined style.
---
 
## 5. Components
 
### Buttons
 
```css
.btn-primary {
  background: var(--color-cta-bg);
  color: var(--color-cta-text);
  border-radius: var(--radius-pill);
  padding: 0.875rem 1.75rem;
  font-weight: var(--font-weight-medium);
}
 
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
}
```
 
### Stat Card
 
```css
.stat-card {
  color: var(--color-text-primary);
}
.stat-card .value {
  font-size: var(--font-size-stat);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
}
.stat-card .label {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
}
```
 
Used for: attendance summary (present/absent/late counts), leave balance by type, directory headcount, etc.
 
### Feature/Content Card
 
```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}
```
 
Used for: employee directory cards, announcement cards, leave request panel.
 
### Logo Strip
 
- Not applicable in-app (was a marketing-site pattern for partner/integration logos). Retained here only as a reference in case a future "Integrations" settings page is added.
---
 
## 6. Section Inventory — *not carried over*
 
The original reference document's Section 6 was a 13-section landing-page inventory (hero, logo strip, testimonial carousel, footer, etc.). That structure belongs to a marketing site, not an internal dashboard app, so it has intentionally been dropped rather than adapted. The dashboard's actual page/section structure is defined separately in the application's architecture blueprint (Dashboard, Attendance, Leave, Directory, Announcements, Profile).
 
---
 
## 7. Notes & Caveats
 
- Color tokens, spacing scale, and component patterns are carried over as-is from the reference system — they weren't designed for this project originally, so treat them as a strong starting point and revisit contrast ratios (especially `--color-text-muted` and `--color-accent` on dark surfaces) for WCAG AA compliance once real content is in place.
- Typography assumes Inter is available; confirm licensing/hosting (Google Fonts or self-hosted) before shipping.
- No native dark-mode toggle existed in the original reference source — the dark-mode tokens here follow the same neutral/accent structure as light mode, which fits this project well since dark mode is an explicit bonus requirement for the Employee Dashboard.