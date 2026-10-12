import { ACCESS, LOW_STOCK_LIMIT } from "../data/seed";

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// Lower-case, trimmed, single-spaced text for forgiving comparisons.
export const norm = (v) => v.trim().replace(/\s+/g, " ").toLowerCase();

export const money = (n) => `M ${(Number(n) || 0).toFixed(2)}`;

// Returns [label, tone] for a stock level.
export const status = (n) =>
  n === 0 ? ["Out of stock", "out"] : n < LOW_STOCK_LIMIT ? ["Low stock", "low"] : ["In stock", "ok"];

export const matches = (b, q) =>
  `${b.title} ${b.author} ${b.genre} ${b.isbn}`.toLowerCase().includes(q.trim().toLowerCase());

export const flatIsbn = (v) => String(v).replace(/[-\s]/g, "").toUpperCase();

// ISBN-10 (last character may be X) or ISBN-13.
export const validIsbn = (v) => /^(\d{9}[\dX]|\d{13})$/.test(flatIsbn(v));

export const canOpen = (user, path) => !!user && (ACCESS[user.role] ?? []).includes(path);
