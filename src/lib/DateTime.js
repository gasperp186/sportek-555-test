// src/lib/datetime.js

const pad = (n) => String(n).padStart(2, "0");

// "YYYY-MM-DD" ali Date -> Date | null
export function toDateOrNull(value) {
  if (!value) return null;
  if (value instanceof Date) return value;

  const [y, m, d] = String(value).split("-").map(Number);
  if (!y || !m || !d) return null;

  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

// "HH:mm" ali Date -> Date | null
export function toTimeDateOrNull(value) {
  if (!value) return null;
  if (value instanceof Date) return value;

  const [h, m] = String(value).split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;

  const base = new Date();
  base.setHours(h, m, 0, 0);
  return base;
}

// Date -> "YYYY-MM-DD"
export function formatYMD(d) {
  if (!d) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Date -> "HH:mm"
export function formatHM(d) {
  if (!d) return "";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
