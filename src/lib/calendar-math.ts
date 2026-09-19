/**
 * Calendar arithmetic: the month grid, and the comparisons a date picker
 * needs. Plain TypeScript and the built-in Date, so every rule is unit tested.
 *
 * Every function works on local time. A calendar shows the days of the user's
 * own week, not of UTC, and a date built from year, month and day is always
 * read back the same way.
 */

/** Midnight on the same day, so two dates can be compared as days. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/**
 * The same day number in another month, pulled back to the last day when that
 * month is too short: 31 January plus one month is 28 February, not 3 March.
 */
export function addMonths(date: Date, months: number): Date {
  const year = date.getFullYear();
  const month = date.getMonth() + months;
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(date.getDate(), lastDay));
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/** Days are compared as days: the time of day never decides. */
export function compareDays(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

export function isBefore(date: Date, other: Date): boolean {
  return compareDays(date, other) < 0;
}

export function isAfter(date: Date, other: Date): boolean {
  return compareDays(date, other) > 0;
}

/** Inside a stretch of days, both ends included. */
export function isInRange(date: Date, from: Date | undefined, to: Date | undefined): boolean {
  if (from === undefined || to === undefined) return false;
  const [start, end] = compareDays(from, to) <= 0 ? [from, to] : [to, from];
  return !isBefore(date, start) && !isAfter(date, end);
}

export interface MonthGridDay {
  date: Date;
  /** A day shown to fill the row, belonging to the month before or after. */
  outside: boolean;
}

export interface MonthGridInput {
  /** Any day of the month to lay out. */
  month: Date;
  /** 0 for Sunday, 1 for Monday, and so on. */
  weekStartsOn?: number;
}

/**
 * The weeks of a month, each a full row of seven days. Rows are padded with
 * the neighbouring months' days so every week has the same shape — whether
 * those days are shown or hidden is the component's business.
 */
export function buildMonthGrid({ month, weekStartsOn = 0 }: MonthGridInput): MonthGridDay[][] {
  const first = startOfMonth(month);
  const last = endOfMonth(month);
  const start = ((weekStartsOn % 7) + 7) % 7;

  // How many days of the previous month come before the first of this one.
  const lead = (first.getDay() - start + 7) % 7;
  const weeks: MonthGridDay[][] = [];

  let cursor = addDays(first, -lead);
  while (true) {
    const week: MonthGridDay[] = [];
    for (let index = 0; index < 7; index += 1) {
      week.push({ date: cursor, outside: !isSameMonth(cursor, first) });
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
    // Stop once the row that holds the last day of the month is done.
    if (!isBefore(cursor, last)) break;
  }
  return weeks;
}

/** The weekday numbers in the order the grid shows them. */
export function weekdayOrder(weekStartsOn = 0): number[] {
  const start = ((weekStartsOn % 7) + 7) % 7;
  return Array.from({ length: 7 }, (_, index) => (start + index) % 7);
}
