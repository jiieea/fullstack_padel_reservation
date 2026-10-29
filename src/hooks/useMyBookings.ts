import { useCallback, useEffect, useMemo, useState } from 'react';
import { filterBookings } from '@/actions/booking.actions';
import { downloadICS } from '@/lib/download';
import { useAuth } from '@/providers/AuthProvider';
import { useBooking } from '@/providers/BookingProvider';
import { useData } from '@/providers/DataProvider';

type Act = 'cancel' | 'reschedule';

export function useMyBookings() {
  const { bookings, dispatch: dataDispatch } = useData();
  const { dispatch } = useBooking();
  const { session, openAuth, pendingKey, clearPending } = useAuth();
  const [query, setQuery] = useState('');
  const list = useMemo(() => filterBookings(bookings, query), [bookings, query]);

  const run = useCallback((act: Act, code: string) => {
    const booking = bookings.find(b => b.code === code);
    if (!booking) return;
    if (act === 'cancel') dataDispatch({ type: 'REMOVE_BOOKING', code });
    else { dispatch({ type: 'START_RESCHEDULE', booking }); window.location.hash = '#booking'; }
  }, [bookings, dataDispatch, dispatch]);

  // cancel / reschedule require login; resume the action after logging in
  const request = useCallback((act: Act, code: string) => {
    if (!session) { openAuth('Masuk dulu untuk mengelola booking.', `${act}:${code}`); return; }
    run(act, code);
  }, [session, openAuth, run]);

  useEffect(() => {
    if (!session || !pendingKey) return;
    const m = /^(cancel|reschedule):(.+)$/.exec(pendingKey);
    if (m) { clearPending(); run(m[1] as Act, m[2]); }
  }, [session, pendingKey, clearPending, run]);

  return {
    query, setQuery, list,
    cancel: (code: string) => request('cancel', code),
    reschedule: (code: string) => request('reschedule', code),
    downloadIcs: (code: string) => { const b = bookings.find(x => x.code === code); if (b) downloadICS(b); },
  };
}
