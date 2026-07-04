/** Formatting helpers for numbers, text, and labels. */

/** Format a 0–1 fraction as a whole-number percent, e.g. 0.94 → "94%". */
export function formatPercent(fraction: number, fractionDigits = 0): string {
  return `${(fraction * 100).toFixed(fractionDigits)}%`
}

/** Return "1 day" / "3 days", pluralizing by count. */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}

export function capitalize(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text
}

/** Turn a value like "annual" into "Annual", or "in_progress" into "In progress". */
export function titleCase(text: string): string {
  return capitalize(text.replace(/[_-]+/g, ' '))
}
