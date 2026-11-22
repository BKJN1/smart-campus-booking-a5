/**
 * Convert raw text from a time field into whole minutes after midnight.
 * Returns NaN for anything that is not a plain (optionally negative) integer, e.g. "6e2", "660.9", "12abc", "".
 * Replaces parseInt(), which silently turned "6e2" into 6 and "660.9" into 660 (risk R-01).
 */
export function parseMinutes(raw: string): number {
  const text = raw.trim();
  return /^-?\d+$/.test(text) ? Number(text) : NaN;
}
