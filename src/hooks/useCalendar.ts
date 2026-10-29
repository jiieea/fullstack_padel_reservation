import { useMemo } from 'react';
import { fmtIsoFull, toIso } from '@/lib/format';
import { useBooking } from '@/providers/BookingProvider';
import { useData } from '@/providers/DataProvider';
import { useSlotResolver } from './useSlotResolver';

export function useCalendar() {
  const { state, dispatch } = useBooking();
  const { todayIso } = useData();
  const slots = useSlotResolver(state.rescheduleCode);
  const ready = !!state.selectedDate;

  const view = useMemo(() => {
    if (!ready) return { label: '', blanks: 0, days: [] as { day: number; iso: string; isPast: boolean; isSelected: boolean; level: 'low' | 'mid' | 'high' }[] };
    const first = new Date(state.calYear, state.calMonth, 1);
    const count = new Date(state.calYear, state.calMonth + 1, 0).getDate();
    const days = Array.from({ length: count }, (_, i) => {
      const iso = toIso(new Date(state.calYear, state.calMonth, i + 1));
      const isPast = iso < todayIso;
      return { day: i + 1, iso, isPast, isSelected: iso === state.selectedDate, level: isPast ? ('low' as const) : slots.occupancy(iso) };
    });
    return { label: first.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }), blanks: first.getDay(), days };
  }, [ready, state.calYear, state.calMonth, state.selectedDate, todayIso, slots]);

  return {
    ready, monthLabel: view.label, leadingBlanks: view.blanks, days: view.days,
    selectedDateLabel: ready ? fmtIsoFull(state.selectedDate) : 'Hari Ini',
    prevMonth: () => dispatch({ type: 'CAL_PREV' }),
    nextMonth: () => dispatch({ type: 'CAL_NEXT' }),
    selectDate: (iso: string) => dispatch({ type: 'SELECT_DATE', iso }),
  };
}

