import { useEffect } from 'react';
import { useAdmin } from '@/providers/AdminProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useBooking } from '@/providers/BookingProvider';

/** Escape closes every open modal. */
export function useEscapeToCloseModals() {
  const { closeAuth } = useAuth();
  const { dispatch } = useBooking();
  const { closeSlot } = useAdmin();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      closeAuth(); dispatch({ type: 'CLOSE_MODALS' }); closeSlot();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeAuth, dispatch, closeSlot]);
}
