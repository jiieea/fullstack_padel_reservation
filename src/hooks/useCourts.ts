import { HOURS } from '@/constants';
import { rpThousands } from '@/lib/format';
import { useBooking } from '@/providers/BookingProvider';
import type { Court } from '@/types';
import { useSlotResolver } from './useSlotResolver';

export function useCourts() {
  const { state, dispatch } = useBooking();
  const slots = useSlotResolver(state.rescheduleCode);
  const ready = !!state.selectedDate;
  const courts = slots.config.courts.filter(c => state.filter === 'all' || c.type === state.filter);

  const slotsFor = (court: Court) => ready
    ? HOURS.map(hour => {
        const status = slots.getStatus(court.id, state.selectedDate, hour);
        return {
          hour, available: status.available, peak: slots.isPeak(hour),
          selected: state.courtId === court.id && state.hours.includes(hour),
          caption: status.available ? rpThousands(slots.getPrice(court.id, state.selectedDate, hour)) : status.label ?? '',
        };
      })
    : [];

  return { courts, slotsFor, pickSlot: (courtId: number, hour: number) => dispatch({ type: 'PICK_SLOT', courtId, hour }) };
}
