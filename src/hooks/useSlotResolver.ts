import { useCallback, useMemo } from 'react';
import { getDynamicPrice, isPeakHour } from '@/lib/pricing';
import { getOccupancyLevel, getSlotStatus, type SlotContext } from '@/lib/slots';
import { useData } from '@/providers/DataProvider';

/** Slot availability + dynamic price helpers bound to the current data. */
export function useSlotResolver(ignoreBookingCode?: string | null) {
  const { config, members, bookings, blocks, todayIso } = useData();
  const ctx = useMemo<SlotContext>(
    () => ({ members, bookings, blocks, todayIso, ignoreBookingCode }),
    [members, bookings, blocks, todayIso, ignoreBookingCode]);

  return {
    config,
    getStatus: useCallback((courtId: number, date: string, hour: number) => getSlotStatus(ctx, courtId, date, hour), [ctx]),
    getPrice: useCallback((courtId: number, date: string, hour: number) => {
      const court = config.courts.find(c => c.id === courtId);
      return court ? getDynamicPrice(config, court, date, hour) : 0;
    }, [config]),
    isPeak: useCallback((hour: number) => isPeakHour(config, hour), [config]),
    occupancy: useCallback((date: string) => getOccupancyLevel(ctx, config.courts, date), [ctx, config.courts]),
  };
}
