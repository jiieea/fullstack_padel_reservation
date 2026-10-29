'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type Dispatch, type ReactNode } from 'react';
import { bookingReducer, initialBookingState, type BookingAction, type BookingState } from '@/actions/booking.reducer';
import { useAuth } from './AuthProvider';
import { useData } from './DataProvider';

interface BookingContextValue { state: BookingState; dispatch: Dispatch<BookingAction> }
const BookingContext = createContext<BookingContextValue | null>(null);

/** UI state of the public booking flow (calendar, slot selection, form, payment/receipt/reminder modals). */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);
  const { hydrated, todayIso, users, members } = useData();
  const { session, isAdmin } = useAuth();

  useEffect(() => { if (hydrated) dispatch({ type: 'INIT_TODAY', iso: todayIso }); }, [hydrated, todayIso]);

  // pre-fill the form (and member discount) once per logged-in member
  useEffect(() => {
    if (!hydrated || !session || isAdmin || state.autofilledUid === session.uid) return;
    dispatch({
      type: 'FILL_FROM_USER', uid: session.uid,
      user: users.find(u => u.uid === session.uid),
      memberId: members.find(m => m.id === session.uid)?.id,
    });
  }, [hydrated, session, isAdmin, state.autofilledUid, users, members]);

  // clear personal data when the session ends
  const prevUid = useRef<string | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    const uid = session?.uid ?? null;
    if (prevUid.current && !uid) dispatch({ type: 'SESSION_ENDED' });
    prevUid.current = uid;
  }, [hydrated, session]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
}
