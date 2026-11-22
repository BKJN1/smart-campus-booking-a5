import { describe, expect, test } from 'vitest';
import { getResultStatus, RESULT_STATUS_VIEW, type ResultStatus } from './resultStatus';

describe('result status view (Task 3 refactor)', () => {
  test('S01 null result is pending ("Awaiting input")', () => {
    expect(getResultStatus(null)).toBe('pending');
    expect(RESULT_STATUS_VIEW.pending.title).toBe('Awaiting input');
  });
  test('S02 available result maps to the green "Available" view', () => {
    const s = getResultStatus({ available: true, reason: 'ok' });
    expect(s).toBe('available');
    expect(RESULT_STATUS_VIEW[s].card).toContain('emerald');
  });
  test('S03 rejected result maps to the red "Unavailable" view', () => {
    const s = getResultStatus({ available: false, reason: 'no' });
    expect(s).toBe('unavailable');
    expect(RESULT_STATUS_VIEW[s].card).toContain('rose');
  });
  test('S04 every status has a complete view', () => {
    const all: ResultStatus[] = ['available', 'unavailable', 'pending'];
    expect(Object.keys(RESULT_STATUS_VIEW).sort()).toEqual([...all].sort());
  });
});
