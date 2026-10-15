const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 把 "YYYY-MM-DD" 解析为 DateTime。
 * 固定存成 UTC 当天 12:00，保证任意时区取回后仍是同一天。
 */
export function parseDateOnly(value: string | null): Date | null {
  if (!value || !DATE_ONLY.test(value)) return null;
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

/** Date/ISO 字符串 → 本地时区的 "YYYY-MM-DD"，非法输入返回 null。 */
export function toDateKey(value: string | Date | null): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
