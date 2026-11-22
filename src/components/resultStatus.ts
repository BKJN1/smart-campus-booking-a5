import { CalendarCheck, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';
import type { CheckResult } from '@/lib/booking';

/** The three states the result card can be in. */
export type ResultStatus = 'available' | 'unavailable' | 'pending';

export type ResultStatusView = {
  title: string;
  icon: LucideIcon;
  card: string;
  badge: string;
  titleText: string;
  reasonText: string;
};

/** Derive the display status once, instead of re-checking `result?.available` in every JSX branch. */
export function getResultStatus(result: CheckResult | null): ResultStatus {
  if (result === null) return 'pending';
  return result.available ? 'available' : 'unavailable';
}

/** Table-driven Strategy: each status owns its presentation. `Record` makes the table exhaustive at compile time. */
export const RESULT_STATUS_VIEW: Record<ResultStatus, ResultStatusView> = {
  available: {
    title: 'Available',
    icon: CheckCircle2,
    card: 'bg-emerald-50 ring-emerald-200',
    badge: 'bg-emerald-500 text-white',
    titleText: 'text-emerald-800',
    reasonText: 'text-emerald-700',
  },
  unavailable: {
    title: 'Unavailable',
    icon: XCircle,
    card: 'bg-rose-50 ring-rose-200',
    badge: 'bg-rose-500 text-white',
    titleText: 'text-rose-800',
    reasonText: 'text-rose-700',
  },
  pending: {
    title: 'Awaiting input',
    icon: CalendarCheck,
    card: 'bg-white ring-slate-200',
    badge: 'bg-slate-200 text-slate-400',
    titleText: 'text-slate-400',
    reasonText: 'text-slate-500',
  },
};
