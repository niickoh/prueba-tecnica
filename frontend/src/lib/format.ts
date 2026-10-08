const LOCALE = 'es-AR';

const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const dateFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium' });
const monthFormat = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const percentFormat = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  maximumFractionDigits: 0,
});

export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso));

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));

/** `2022-07` → `jul 2022`. */
export function formatMonth(month: string): string {
  const [year, monthIndex] = month.split('-').map(Number);
  if (!year || !monthIndex) return month;
  return monthFormat.format(new Date(Date.UTC(year, monthIndex - 1, 1)));
}

export const formatPercent = (ratio: number) => percentFormat.format(ratio);
