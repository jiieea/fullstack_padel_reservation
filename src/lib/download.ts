import type { Booking } from '@/types';
import { fmtHourRange } from './format';

function saveBlob(content: string, type: string, filename: string) {
  const a = document.createElement('a');
  const url = URL.createObjectURL(new Blob([content], { type }));
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadICS(b: Booking): void {
  const sH = Math.min(...b.hours), eH = Math.max(...b.hours) + 1;
  const dt = b.date.replace(/-/g, '');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
    `SUMMARY:Main Padel - ${b.courtName} (${b.code})`,
    `DTSTART:${dt}T${String(sH).padStart(2, '0')}0000`,
    `DTEND:${dt}T${String(eH).padStart(2, '0')}0000`,
    'LOCATION:Padelia Club', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  saveBlob(ics, 'text/calendar', `${b.code}.ics`);
}

export function downloadBookingsCsv(bookings: Booking[]): void {
  const rows = [['Kode', 'Nama', 'WA', 'Lapangan', 'Tanggal', 'Jam', 'Metode', 'Total']].concat(
    bookings.map(b => [b.code, b.name, b.wa, b.courtName, b.date, fmtHourRange(b.hours, '-'), b.payMethod || 'QRIS', String(b.total)]));
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  saveBlob(csv, 'text/csv', 'padelia-transaksi.csv');
}
