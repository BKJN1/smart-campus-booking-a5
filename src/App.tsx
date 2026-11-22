import { useMemo, useState } from 'react';
import { Lock, Unlock, Clock, DoorOpen } from 'lucide-react';
import { checkAvailability, minutesToLabel, type Booking } from '@/lib/booking';
import { getResultStatus, RESULT_STATUS_VIEW } from '@/components/resultStatus';
import { Timeline } from '@/components/Timeline';
import { TimeField } from '@/components/TimeField';

const SAMPLE_BOOKINGS: Booking[] = [
  { id: 'b1', start: 600, end: 660, label: 'Intro CS' },
];

export default function App() {
  const [currentTime, setCurrentTime] = useState('555');
  const [start, setStart] = useState('660');
  const [end, setEnd] = useState('720');
  const [roomBlocked, setRoomBlocked] = useState(false);

  const [bookings] = useState<Booking[]>(SAMPLE_BOOKINGS);

  const parsedCurrent = parseInt(currentTime, 10);
  const parsedStart = parseInt(start, 10);
  const parsedEnd = parseInt(end, 10);

  const hasValidInput =
    !Number.isNaN(parsedStart) && !Number.isNaN(parsedEnd) && !Number.isNaN(parsedCurrent);

  const missingMessage =
    !hasValidInput
      ? [
          Number.isNaN(parsedCurrent) && 'Enter a current time',
          Number.isNaN(parsedStart) && 'Enter a start time',
          Number.isNaN(parsedEnd) && 'Enter an end time',
        ]
          .filter(Boolean)
          .join(', ')
      : null;

  const result = useMemo(() => {
    if (!hasValidInput) return null;
    return checkAvailability(parsedStart, parsedEnd, parsedCurrent, roomBlocked, bookings);
  }, [hasValidInput, parsedStart, parsedEnd, parsedCurrent, roomBlocked, bookings]);

  const view = RESULT_STATUS_VIEW[getResultStatus(result)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <DoorOpen size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Smart Campus Room Availability
              </h1>
              <p className="text-sm text-slate-500">
                Check if Room <span className="font-semibold text-slate-700">B-204</span> is free
                for your requested time slot.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Input panel */}
          <section className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock size={16} className="text-teal-600" />
              Request Details
            </h2>

            <div className="space-y-4">
              <TimeField
                label="Current time (min after midnight)"
                value={currentTime}
                onChange={setCurrentTime}
                hint="0 = 00:00, 600 = 10:00, 1440 = 24:00"
              />

              <div className="grid grid-cols-2 gap-3">
                <TimeField
                  label="Start"
                  value={start}
                  onChange={setStart}
                  hint="Minutes after midnight"
                />
                <TimeField
                  label="End"
                  value={end}
                  onChange={setEnd}
                  hint="Minutes after midnight"
                />
              </div>

              {/* Room blocked toggle */}
              <button
                onClick={() => setRoomBlocked((v) => !v)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  roomBlocked
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-slate-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  {roomBlocked ? <Lock size={15} /> : <Unlock size={15} />}
                  Room blocked
                </span>
                <span
                  className={`relative h-5 w-9 rounded-full transition ${
                    roomBlocked ? 'bg-rose-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                      roomBlocked ? 'left-4' : 'left-0.5'
                    }`}
                  />
                </span>
              </button>
            </div>
          </section>

          {/* Result + timeline */}
          <section className="lg:col-span-3 space-y-6">
            {/* Result card */}
            <div className={`rounded-2xl p-5 ring-1 transition ${view.card}`}>
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${view.badge}`}
                >
                  <view.icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-lg font-bold ${view.titleText}`}>{view.title}</p>
                  {result && <p className={`text-sm ${view.reasonText}`}>{result.reason}</p>}
                  {missingMessage && (
                    <p className={`text-sm ${view.reasonText}`}>{missingMessage}.</p>
                  )}
                </div>
              </div>

              {result?.available && (
                <div className="mt-4 rounded-lg bg-white/70 px-3 py-2 text-sm text-slate-600">
                  You can book <span className="font-semibold text-slate-800">Room B-204</span> from{' '}
                  <span className="font-semibold tabular-nums">
                    {minutesToLabel(parsedStart)}
                  </span>{' '}
                  to <span className="font-semibold tabular-nums">{minutesToLabel(parsedEnd)}</span>{' '}
                  ({parsedEnd - parsedStart} min).
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">Room B-204 — Today</h2>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded bg-teal-500/80" /> Booked
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded border-2 border-emerald-500 bg-emerald-400/30" />{' '}
                    Request
                  </span>
                </div>
              </div>

              <Timeline
                bookings={bookings}
                proposedStart={hasValidInput ? parsedStart : null}
                proposedEnd={hasValidInput ? parsedEnd : null}
                available={result?.available ?? null}
              />
            </div>

            {/* Existing bookings list */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">
                Existing Bookings ({bookings.length})
              </h2>
              <ul className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <li key={b.id} className="flex items-center justify-between py-2.5">
                    <span className="text-sm font-medium text-slate-700">{b.label}</span>
                    <span className="text-sm tabular-nums text-slate-500">
                      {minutesToLabel(b.start)} – {minutesToLabel(b.end)}
                      <span className="ml-2 text-xs text-slate-400">({b.end - b.start} min)</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Times are minutes after midnight (600 = 10:00). Sample data only — no real bookings are
          created or modified.
        </footer>
      </div>
    </div>
  );
}
