import { MAX_SLOT_HOURS } from '@/constants';
import { randomCode } from '@/lib/crypto';
import { fmtHourRange, fmtIsoFull, rp } from '@/lib/format';
import type { Booking, Court, PayMethod } from '@/types';

/** Slot-selection rules: extend adjacent hours (max 4), shrink from the ends, otherwise restart. */
export function pickSlot(prev: { courtId: number | null; hours: number[] }, courtId: number, h: number) {
  let hours = prev.hours;
  if (prev.courtId !== courtId) hours = [h];
  else if (hours.includes(h)) {
    const min = Math.min(...hours), max = Math.max(...hours);
    hours = h === min || h === max ? hours.filter(x => x !== h) : [h];
  } else if (hours.length && (h === Math.min(...hours) - 1 || h === Math.max(...hours) + 1) && hours.length < MAX_SLOT_HOURS) {
    hours = [...hours, h].sort((a, b) => a - b);
  } else hours = [h];
  return { courtId: hours.length ? courtId : null, hours };
}

export interface NewBookingInput {
  court: Court; dateStr: string; hours: number[]; total: number; name: string; wa: string; email: string;
  payMethod: PayMethod; reminder: boolean; userId: string | null;
}
export const buildBooking = (i: NewBookingInput): Booking => ({
  code: randomCode('PDL-', 5), court: i.court.id, courtName: i.court.name, date: i.dateStr, label: fmtIsoFull(i.dateStr),
  hours: [...i.hours], total: i.total, name: i.name, wa: i.wa, email: i.email, payMethod: i.payMethod,
  status: 'PAID', reminder: i.reminder, userId: i.userId, createdAt: Date.now(),
});

export const buildReschedulePatch = (court: Court, dateStr: string, hours: number[]): Partial<Booking> => ({
  court: court.id, courtName: court.name, date: dateStr, label: fmtIsoFull(dateStr), hours: [...hours],
});

export const filterBookings = (bookings: Booking[], q: string): Booking[] => {
  const query = q.trim().toLowerCase();
  return bookings
    .filter(b => !query || b.code.toLowerCase().includes(query) || b.wa.includes(query))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const activeReminders = (bookings: Booking[], todayIso: string, userId: string | null): Booking[] =>
  userId ? bookings.filter(b => b.userId === userId && b.reminder && b.date >= todayIso) : [];

export const buildWaLink = (b: Booking): string =>
  'https://wa.me/?text=' + encodeURIComponent(
    `Halo Padelia, E-Ticket Lunas:\nKode: *${b.code}*\n${b.courtName}, ${b.label} (${fmtHourRange(b.hours)})\nTotal: ${rp(b.total)}`);

export const receiptRows = (b: Booking): [string, string][] => [
  ['Pemesan', b.name], ['Lapangan', b.courtName], ['Tanggal', b.label],
  ['Jam', fmtHourRange(b.hours)], ['Total Lunas', rp(b.total)],
];
