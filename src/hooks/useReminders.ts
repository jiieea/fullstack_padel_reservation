import { useMemo } from 'react';
import { activeReminders } from '@/actions/booking.actions';
import { useBooking } from '@/providers/BookingProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useData } from '@/providers/DataProvider';

export function useReminders() {
  const { bookings, todayIso } = useData();
  const { state, dispatch } = useBooking();
  const { session, isAdmin } = useAuth();
  const userId = session && !isAdmin ? session.uid : null;
  const active = useMemo(() => activeReminders(bookings, todayIso, userId), [bookings, todayIso, userId]);
  return {
    active, count: active.length, hasActive: active.length > 0, isLoggedIn: !!userId, isOpen: state.remOpen && !!userId,
    openModal: () => dispatch({ type: 'OPEN_REM' }), closeModal: () => dispatch({ type: 'CLOSE_REM' }),
  };
}
