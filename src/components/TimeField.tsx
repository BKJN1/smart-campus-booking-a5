import { minutesToLabel } from '@/lib/booking';
import { parseMinutes } from '@/lib/time';

type TimeFieldProps = {
  label: string;
  value: string;
  onChange: (raw: string) => void;
  hint?: string;
  min?: number;
  max?: number;
};

export function TimeField({ label, value, onChange, hint, min = 0, max = 1440 }: TimeFieldProps) {
  const parsed = parseMinutes(value);
  const showHint = value !== '' && !Number.isNaN(parsed);
  const outOfRange = (showHint && (parsed < min || parsed > max)) || (value !== '' && !showHint);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border px-3 py-2 text-sm tabular-nums outline-none transition focus:ring-2 ${
            outOfRange
              ? 'border-rose-400 focus:ring-rose-300'
              : 'border-slate-300 focus:border-teal-500 focus:ring-teal-200'
          }`}
          placeholder="e.g. 600"
        />
        {showHint && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 tabular-nums">
            {minutesToLabel(Math.max(0, Math.min(DAY_MAX, parsed)))}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

const DAY_MAX = 1440;
