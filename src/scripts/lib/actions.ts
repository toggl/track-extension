/**
 * Re-render time-entries list action
 */
export function renderTimeEntries () {
  return { type: 'bg/render-entries-list' as const };
}
