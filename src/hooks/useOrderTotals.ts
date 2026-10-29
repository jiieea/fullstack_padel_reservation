import { useMemo } from 'react';
import { calcOrderTotals } from '@/lib/pricing';
import { useBooking } from '@/providers/BookingProvider';
import { useData } from '@/providers/DataProvider';

/** Selected court, applied member and computed totals — shared by summary, checkout and payment. */
export function useOrderTotals() {
  const { config, members } = useData();
  const { state } = useBooking();
  const court = useMemo(() => config.courts.find(c => c.id === state.courtId), [config.courts, state.courtId]);
  const member = useMemo(() => members.find(m => m.id === state.memberId) ?? null, [members, state.memberId]);
  const totals = useMemo(() => calcOrderTotals({
    court, hours: state.hours, dateStr: state.selectedDate, config, addonIds: state.addons,
    memberDiscPct: member ? Number(member.disc) : 0, promoPct: state.promoPct,
  }), [court, state.hours, state.selectedDate, config, state.addons, member, state.promoPct]);
  return { court, member, totals };
}
