import { useState } from 'react';
import { buildWalkin } from '@/actions/admin.actions';
import { fmtIsoFull } from '@/lib/format';
import { useAdmin } from '@/providers/AdminProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useData } from '@/providers/DataProvider';
import { useSlotResolver } from '../useSlotResolver';

export function useAdminSlotModal() {
  const { isAdmin } = useAuth();
  const { dispatch } = useData();
  const { slotTarget, closeSlot } = useAdmin();
  const slots = useSlotResolver();
  const [guest, setGuest] = useState({ name: '', wa: '' });

  const court = slotTarget ? slots.config.courts.find(c => c.id === slotTarget.courtId) : undefined;
  const target = slotTarget && court ? slotTarget : null;
  const status = target ? slots.getStatus(target.courtId, target.date, target.hour) : null;
  const price = target ? slots.getPrice(target.courtId, target.date, target.hour) : 0;

  const guard = (fn: () => void) => () => { if (!isAdmin || !target) return; fn(); closeSlot(); };

  return {
    target, court, status, price, guest, setGuest, close: closeSlot,
    dateLabel: target ? fmtIsoFull(target.date) : '',
    cancelBooking: guard(() => { if (status?.booking) dispatch({ type: 'REMOVE_BOOKING', code: status.booking.code }); }),
    unblock: guard(() => dispatch({ type: 'REMOVE_BLOCK', court: target!.courtId, date: target!.date, hour: target!.hour })),
    addWalkin: guard(() => dispatch({ type: 'ADD_BOOKING', booking: buildWalkin(court!, target!.date, target!.hour, price, guest.name, guest.wa) })),
    setMaintenance: guard(() => dispatch({ type: 'ADD_BLOCK', block: { court: target!.courtId, date: target!.date, hour: target!.hour, note: 'Maintenance' } })),
  };
}
