import { HOURS } from '@/constants';
import { useAdmin } from '@/providers/AdminProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useSlotResolver } from '../useSlotResolver';

export function useMasterSchedule() {
  const { isAdmin } = useAuth();
  const { date, setDate, openSlot } = useAdmin();
  const slots = useSlotResolver();
  const courts = slots.config.courts;

  const rows = date ? HOURS.map(hour => ({
    hour,
    cells: courts.map(court => ({
      court, status: slots.getStatus(court.id, date, hour), price: slots.getPrice(court.id, date, hour),
      open: () => { if (isAdmin) openSlot({ courtId: court.id, hour, date }); },
    })),
  })) : [];

  return { date, setDate, courts, rows };
}
