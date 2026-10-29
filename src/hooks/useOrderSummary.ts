import { fmtHourRange, fmtIsoFull, rp } from '@/lib/format';
import { useBooking } from '@/providers/BookingProvider';
import { useData } from '@/providers/DataProvider';
import type { CheckoutForm } from '@/actions/booking.reducer';
import { useOrderTotals } from './useOrderTotals';

export function useOrderSummary() {
  const { state, dispatch } = useBooking();
  const { config, members } = useData();
  const { court, totals } = useOrderTotals();
  const rescheduleActive = !!state.rescheduleCode;

  return {
    form: state.form, addons: state.addons, feedback: state.feedback, rescheduleActive,
    rows: {
      court: court ? court.name : '-',
      date: court ? fmtIsoFull(state.selectedDate) : '-',
      time: court ? `${fmtHourRange(state.hours)} (${state.hours.length}j)` : '-',
      base: rp(totals.base),
      discount: totals.disc > 0 ? `-${rp(totals.disc)} (${totals.totalDiscPct}%)` : '-Rp0',
    },
    totalLabel: rescheduleActive ? 'Rp0 (Reschedule)' : rp(totals.total),
    setField: (patch: Partial<CheckoutForm>) => dispatch({ type: 'SET_FIELDS', patch }),
    toggleAddon: (id: string, checked: boolean) => dispatch({ type: 'TOGGLE_ADDON', id, checked }),
    applyMember: () => {
      const code = state.form.memberCode.trim().toUpperCase();
      const member = members.find(m => m.id.toUpperCase() === code);
      dispatch(member ? { type: 'MEMBER_APPLIED', member } : { type: 'MEMBER_REJECTED' });
    },
    applyPromo: () => {
      const code = state.form.promo.trim().toUpperCase();
      const promo = config.promos.find(p => p.code.toUpperCase() === code);
      dispatch(promo ? { type: 'PROMO_APPLIED', promo } : { type: 'PROMO_REJECTED' });
    },
  };
}
