export function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function formatISODate(iso: string) {
  return iso;
}

/** Returns the YYYY-MM-DD date key for any Date object. */
export function dayKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

/** Alias for dayKey(new Date()) — returns today's YYYY-MM-DD key. */
export function todayKey(): string {
  return dayKey(new Date());
}

/** Returns the day-of-week index (0 = Sunday … 6 = Saturday) for a Date. */
export function dow(date: Date): number {
  return date.getDay();
}
