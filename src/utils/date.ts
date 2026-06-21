export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function friendlyDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function isWithinLastDays(value: string, days: number) {
  const date = new Date(value);
  const limit = new Date();
  limit.setDate(limit.getDate() - days);
  return date >= limit;
}
