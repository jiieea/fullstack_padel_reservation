import { useBooking } from '@/providers/BookingProvider';
import type { CourtFilter } from '@/types';
import { useCalendar } from './useCalendar';

export function useBookingControls() {
  const { state, dispatch } = useBooking();
  const { selectedDateLabel } = useCalendar();
  return {
    filter: state.filter, selectedDateLabel,
    setFilter: (filter: CourtFilter) => dispatch({ type: 'SET_FILTER', filter }),
    rescheduleActive: !!state.rescheduleCode,
    cancelReschedule: () => dispatch({ type: 'CANCEL_RESCHEDULE' }),
  };
}
