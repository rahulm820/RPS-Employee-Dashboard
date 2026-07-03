/** Join truthy class names into a single string, ignoring non-string values. */
export function cx(...classes: unknown[]): string {
  return classes.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ')
}
