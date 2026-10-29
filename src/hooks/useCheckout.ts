import { useCallback, useEffect } from 'react';
import { buildReschedulePatch } from '@/actions/booking.actions';
import { EMPTY_FEEDBACK } from '@/actions/booking.reducer';
import { CHECKOUT_PENDING } from '@/constants';
import { normWa } from '@/lib/format';
import { validateCheckout } from '@/lib/validation';
import { useAuth } from '@/providers/AuthProvider';
import { useBooking } from '@/providers/BookingProvider';
import { useData } from '@/providers/DataProvider';
import { useOrderTotals } from './useOrderTotals';

/** "Lanjut ke Pembayaran" — login gate, validation, reschedule shortcut, or open payment. */
export function useCheckout() {
  const { state, dispatch } = useBooking();
  const { bookings, dispatch: dataDispatch } = useData();
  const { session, isAdmin, openAuth, pendingKey, clearPending } = useAuth();
  const { court } = useOrderTotals();
  const rescheduleActive = !!state.rescheduleCode;

  const confirm = useCallback(() => {
    if (!session) { openAuth('Masuk dulu untuk melanjutkan booking.', CHECKOUT_PENDING); return; }
    const error = validateCheckout({ hasCourt: !!court, name: state.form.name, wa: normWa(state.form.wa), email: state.form.email.trim() });
    if (error) { dispatch({ type: 'SET_FEEDBACK', feedback: { type: 'err', message: error } }); return; }
    dispatch({ type: 'SET_FEEDBACK', feedback: EMPTY_FEEDBACK });

    if (state.rescheduleCode && court) {
      const existing = bookings.find(b => b.code === state.rescheduleCode);
      if (existing) {
        const patch = buildReschedulePatch(court, state.selectedDate, state.hours);
        dataDispatch({ type: 'UPDATE_BOOKING', code: existing.code, patch });
        dispatch({ type: 'RESCHEDULE_DONE', booking: { ...existing, ...patch } });
        return;
      }
    }
    dispatch({ type: 'OPEN_PAY' });
  }, [session, openAuth, court, state, bookings, dispatch, dataDispatch]);

  // resume checkout after the user logged in (once the form was pre-filled)
  useEffect(() => {
    if (pendingKey === CHECKOUT_PENDING && session && !isAdmin && state.autofilledUid === session.uid) {
      clearPending(); confirm();
    }
  }, [pendingKey, session, isAdmin, state.autofilledUid, clearPending, confirm]);

  return {
    confirm,
    buttonLabel: rescheduleActive ? 'Konfirmasi Jadwal Baru' : session ? 'Lanjut ke Pembayaran' : 'Masuk & Lanjut Bayar',
  };
}
