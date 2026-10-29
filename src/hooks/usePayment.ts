import { buildBooking } from '@/actions/booking.actions';
import { fmtHourRange, fmtIsoFull, normWa, rp } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { useBooking } from '@/providers/BookingProvider';
import { useData } from '@/providers/DataProvider';
import type { PayMethod } from '@/types';
import { useOrderTotals } from './useOrderTotals';

export function usePayment() {
  const { state, dispatch } = useBooking();
  const { dispatch: dataDispatch } = useData();
  const { session } = useAuth();
  const { court, totals } = useOrderTotals();

  const summary: [string, string][] = court ? [
    ['Pemesan', state.form.name.trim()], ['Lapangan', court.name],
    ['Jadwal', `${fmtIsoFull(state.selectedDate)}, ${fmtHourRange(state.hours, '-')}`], ['Total', rp(totals.total)],
  ] : [];

  return {
    open: state.payOpen, method: state.payMethod, total: totals.total, summary,
    setMethod: (method: PayMethod) => dispatch({ type: 'SET_PAY_METHOD', method }),
    cancel: () => dispatch({ type: 'CLOSE_PAY' }),
    simulatePay: () => {
      if (!court) return;
      const booking = buildBooking({
        court, dateStr: state.selectedDate, hours: state.hours, total: totals.total,
        name: state.form.name.trim(), wa: normWa(state.form.wa), email: state.form.email.trim(),
        payMethod: state.payMethod, reminder: state.form.reminder, userId: session ? session.uid : null,
      });
      dataDispatch({ type: 'ADD_BOOKING', booking });
      dispatch({ type: 'BOOKING_PAID', booking });
    },
  };
}
