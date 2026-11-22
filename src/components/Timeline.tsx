import { minutesToLabel, type Booking } from '@/lib/booking';

type TimelineProps = {
  bookings: Booking[];
  proposedStart: number | null;
  proposedEnd: number | null;
  available: boolean | null;
};

const DAY_MINUTES = 1440;

export function Timeline({ bookings, proposedStart, proposedEnd, available }: TimelineProps) {
  const pct = (min: number) => `${(min / DAY_MINUTES) * 100}%`;

  return (
    <div className="w-full">
      <div className="relative h-16 w-full rounded-lg bg-slate-100 ring-1 ring-slate-200 overflow-hidden">
        {/* hour gridlines every 2 hours */}
        {Array.from({ length: 13 }, (_, i) => i * 120).map((m) => (
          <div
            key={m}
            className="absolute top-0 bottom-0 w-px bg-slate-200"
            style={{ left: pct(m) }}
          />
        ))}

        {/* existing bookings */}
        {bookings.map((b) => (
          <div
            key={b.id}
            className="absolute top-1 bottom-1 rounded bg-teal-500/80"
            style={{ left: pct(b.start), width: `${((b.end - b.start) / DAY_MINUTES) * 100}%` }}
            title={`${b.label} ${minutesToLabel(b.start)}–${minutesToLabel(b.end)}`}
          />
        ))}

        {/* proposed interval */}
        {proposedStart !== null &&
          proposedEnd !== null &&
          proposedStart >= 0 &&
          proposedEnd <= DAY_MINUTES &&
          proposedStart < proposedEnd && (
            <div
              className={`absolute top-0 bottom-0 rounded border-2 ${
                available === true
                  ? 'border-emerald-500 bg-emerald-400/30'
                  : available === false
                    ? 'border-rose-500 bg-rose-400/30'
                    : 'border-slate-400 bg-slate-300/30'
              }`}
              style={{
                left: pct(proposedStart),
                width: `${((proposedEnd - proposedStart) / DAY_MINUTES) * 100}%`,
              }}
            />
          )}
      </div>

      {/* booking captions — placed below the bar so labels stay readable
          even when a booking bar is too narrow to fit text inside */}
      <div className="relative mt-1 h-5">
        {bookings.map((b) => (
          <span
            key={b.id}
            className="absolute flex items-center gap-1 whitespace-nowrap text-[10px] font-medium text-teal-700"
            style={{ left: pct(b.start) }}
          >
            <span className="h-2 w-2 rounded-sm bg-teal-500/80" />
            {b.label} {minutesToLabel(b.start)}–{minutesToLabel(b.end)}
          </span>
        ))}
      </div>

      {/* axis labels */}
      <div className="relative mt-1 h-4 text-[10px] text-slate-400">
        {[0, 240, 480, 720, 960, 1200, 1440].map((m) => (
          <span key={m} className="absolute -translate-x-1/2" style={{ left: pct(m) }}>
            {minutesToLabel(m)}
          </span>
        ))}
      </div>
    </div>
  );
}
