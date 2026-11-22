// IMPROVED SUITE: expected values derived from AC1-AC6 and the reviewed case table, not from the code.
import { describe, test, expect } from 'vitest';
import { checkAvailability, type Booking } from './booking';

// Fresh fixture for every call. Default: now = 540 (09:00), room not blocked, one booking 600-660 "Intro CS".
type Input = { start: number; end: number; now: number; blocked: boolean; bookings: Booking[] };
const make = (over: Partial<Input> & Pick<Input, 'start' | 'end'>): Input => ({
  now: 540,
  blocked: false,
  bookings: [{ id: 'b1', start: 600, end: 660, label: 'Intro CS' }],
  ...over,
});
const run = (i: Input) => checkAvailability(i.start, i.end, i.now, i.blocked, i.bookings);

// [id, requirement, description, input, expected available, reason pattern for rejections]
type Case = [string, string, string, Input, boolean, RegExp | null];
const cases: Case[] = [
  ['T01', 'AC4', 'touching after: starts exactly when booking ends', make({ start: 660, end: 720 }), true, null],
  ['T02', 'AC1', 'starts at now: must start strictly after now', make({ start: 540, end: 570 }), false, /after the current time/],
  ['T03', 'AC1', 'zero duration is not a booking', make({ start: 720, end: 720 }), false, /earlier than end/],
  ['T04', 'AC1', 'reversed interval is invalid', make({ start: 750, end: 720 }), false, /earlier than end/],
  ['T05', 'AC1', 'ends after the end of the day (1440)', make({ start: 1380, end: 1441 }), false, /within 0–1440/],
  ['T06', 'AC2', 'exactly 120 minutes is allowed', make({ start: 720, end: 840 }), true, null],
  ['T07', 'AC2', '121 minutes exceeds the maximum', make({ start: 720, end: 841 }), false, /120 minutes/],
  ['T08', 'AC4', 'touching before: ends exactly when booking starts', make({ start: 570, end: 600 }), true, null],
  ['T09', 'AC4', 'partial overlap', make({ start: 630, end: 690 }), false, /Overlaps existing booking/],
  ['T10', 'AC4', 'candidate contains the existing booking', make({ start: 570, end: 690 }), false, /Overlaps existing booking/],
  ['T11', 'AC4', 'candidate inside the existing booking', make({ start: 615, end: 645 }), false, /Overlaps existing booking/],
  ['T12', 'AC4', 'identical interval', make({ start: 600, end: 660 }), false, /Overlaps existing booking/],
  ['T13', 'AC3', 'blocked room is rejected even without a conflict', make({ start: 660, end: 720, blocked: true }), false, /blocked/],
  ['T14', 'AC4', 'no existing bookings: nothing to overlap', make({ start: 630, end: 690, bookings: [] }), true, null],
  ['T15', 'AC1', 'own case: one minute after now is the smallest valid start', make({ start: 541, end: 571 }), true, null],
  ['T16', 'AC1/AC2', 'own case: ends exactly at 1440 and lasts exactly 120 minutes', make({ start: 1320, end: 1440 }), true, null],
  ['T18', 'AC1', 'own case: missing (NaN) current time must never give Available (Practice #06 cleanup 2)', make({ start: 660, end: 720, now: NaN }), false, /valid start, end, and current times/],
];

describe('checkAvailability decisions', () => {
  test.each(cases)('%s (%s) %s', (_id, _ac, _desc, input, expected, reason) => {
    const result = run(input);
    expect(result.available).toBe(expected);
    if (reason) expect(result.reason).toMatch(reason); // rejected for the right reason
  });
});

describe('AC5 data preservation', () => {
  test('T17 (AC5) existing bookings stay unchanged after repeated checks', () => {
    const input = make({ start: 660, end: 720 });
    const before = JSON.stringify(input.bookings);
    const frozen = Object.freeze(input.bookings.map((b) => Object.freeze({ ...b }))) as Booking[];
    expect(run({ ...input, bookings: frozen }).available).toBe(true);
    expect(run({ ...input, bookings: frozen }).available).toBe(true);
    expect(run({ ...input, start: 630, end: 690, bookings: frozen }).available).toBe(false);
    expect(JSON.stringify(input.bookings)).toBe(before);
    expect(input.bookings).toEqual([{ id: 'b1', start: 600, end: 660, label: 'Intro CS' }]);
  });
});

describe('AC5 regression for BUG-B (in-place sort)', () => {
  test('T19 (AC5) bookings given out of order are not reordered', () => {
    const bookings: Booking[] = [
      { id: 'b2', start: 780, end: 840, label: 'Maths' },
      { id: 'b1', start: 600, end: 660, label: 'Intro CS' },
    ];
    const before = JSON.parse(JSON.stringify(bookings));
    const result = checkAvailability(660, 720, 540, false, bookings);
    expect(result.available).toBe(true);
    expect(bookings).toEqual(before);
  });
});
