import { describe, expect, test } from 'vitest';
import { parseMinutes } from './time';

// M1 / R-01: raw text from <input type="number"> must become whole minutes or NaN — never a silently different number.
describe('parseMinutes (mitigation M1)', () => {
  test.each([
    ['P01', '600', 600],
    ['P02', '0', 0],
    ['P03', '1440', 1440],
    ['P04', '-5', -5], // kept as a number so the domain rule reports "within 0–1440"
  ])('%s accepts whole minutes %s', (_id, raw, expected) => {
    expect(parseMinutes(raw)).toBe(expected);
  });
  test.each([
    ['P05', '6e2'], // parseInt gave 6 (baseline bug: 600–700 shown as Available)
    ['P06', '660.9'], // parseInt silently truncated to 660
    ['P07', ''],
    ['P08', '12abc'],
    ['P09', 'Infinity'],
  ])('%s rejects %s as NaN', (_id, raw) => {
    expect(Number.isNaN(parseMinutes(raw))).toBe(true);
  });
});
