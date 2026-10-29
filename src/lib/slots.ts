import { HOURS, OCC_THRESHOLDS } from '@/constants';
import type { Block, Booking, Court, Member, OccupancyLevel, SlotStatus } from '@/types';
import { fromIso } from './format';

export interface SlotContext {
  members: Member[]; bookings: Booking[]; blocks: Block[];
  todayIso: string; ignoreBookingCode?: string | null;
}

export function getSlotStatus(ctx: SlotContext, courtId: number, dateStr: string, hour: number): SlotStatus {
  if (dateStr === ctx.todayIso && hour <= new Date().getHours()) return { available: false, reason: 'PAST', label: 'Lewat' };
  const blk = ctx.blocks.find(b => b.court === courtId && b.date === dateStr && b.hour === hour);
  if (blk) return { available: false, reason: 'MAINT', label: 'Maintenance', detail: blk.note };
  const dow = fromIso(dateStr).getDay();
  const mem = ctx.members.find(m =>
    Number(m.court) === courtId && Number(m.dow) === dow && hour >= Number(m.hour) && hour < Number(m.hour) + Number(m.dur));
  if (mem) return { available: false, reason: 'MEMBER', label: 'Member Rutin', detail: mem.name };
  const bk = ctx.bookings.find(b => b.code !== ctx.ignoreBookingCode && b.court === courtId && b.date === dateStr && b.hours.includes(hour));
  if (bk) return { available: false, reason: 'BOOKED', label: 'Penuh', booking: bk };
  return { available: true, reason: 'FREE' };
}

export function getOccupancyLevel(ctx: SlotContext, courts: Court[], dateStr: string): OccupancyLevel {
  let busy = 0;
  courts.forEach(c => HOURS.forEach(h => { if (!getSlotStatus(ctx, c.id, dateStr, h).available) busy++; }));
  const ratio = busy / (courts.length * HOURS.length);
  return ratio > OCC_THRESHOLDS.high ? 'high' : ratio > OCC_THRESHOLDS.mid ? 'mid' : 'low';
}
