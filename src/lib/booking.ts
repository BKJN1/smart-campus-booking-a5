export type Booking = {
  id: string;
  start: number;
  end: number;
  label: string;
};

export type CheckResult = {
  available: boolean;
  reason: string;
};

export function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Evaluates all acceptance criteria for a candidate booking.
 * Pure function — never mutates existingBookings.
 */
export function checkAvailability(
  start: number,
  end: number,
  currentTime: number,
  roomBlocked: boolean,
  existingBookings: Booking[],
): CheckResult {
  // AC1: 0 ≤ start < end ≤ 1440 and start must be after current time
  if (Number.isNaN(start) || Number.isNaN(end) || Number.isNaN(currentTime)) {
    return { available: false, reason: 'Please enter valid start, end, and current times.' };
  }
  if (![start, end, currentTime].every(Number.isInteger)) {
    return { available: false, reason: 'Times must be whole minutes (e.g. 600 = 10:00).' };
  }
  if (start < 0 || end > 1440) {
    return { available: false, reason: 'Times must be within 0–1440 (00:00–24:00).' };
  }
  if (start >= end) {
    return { available: false, reason: 'Start time must be earlier than end time.' };
  }
  if (start <= currentTime) {
    return {
      available: false,
      reason: `Start time must be after the current time (${minutesToLabel(currentTime)}).`,
    };
  }

  // AC2: reject bookings longer than 120 minutes
  if (end - start > 120) {
    return { available: false, reason: 'Booking duration cannot exceed 120 minutes.' };
  }

  // AC3: reject when room is blocked
  if (roomBlocked) {
    return { available: false, reason: 'This room is currently blocked and cannot be booked.' };
  }

  // AC4: reject overlap with existing bookings (touching endpoints allowed)
  for (const b of existingBookings) {
    if (start < b.end && end > b.start) {
      return {
        available: false,
        reason: `Overlaps existing booking "${b.label}" (${minutesToLabel(b.start)}–${minutesToLabel(b.end)}).`,
      };
    }
  }

  return { available: true, reason: 'Room is available for the selected interval.' };
}
