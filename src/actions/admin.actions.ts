import { randomCode, sha256 } from '@/lib/crypto';
import { fmtIsoFull, normWa } from '@/lib/format';
import type { Booking, Court, Member, Pricing, User } from '@/types';

export const buildWalkin = (court: Court, dateStr: string, hour: number, price: number, name: string, wa: string): Booking => ({
  code: randomCode('WLK-', 4), court: court.id, courtName: court.name, date: dateStr, label: fmtIsoFull(dateStr),
  hours: [hour], total: price, name: name.trim() || 'Walk-in', wa: wa.trim() || '081200',
  payMethod: 'CASH', status: 'PAID', reminder: false, createdAt: Date.now(),
});

export interface MemberForm {
  id: string; name: string; wa: string; tier: string; court: string; dow: string; hour: string; dur: string;
}
/** Builds the member record + its login account (initial password = WhatsApp number). */
export async function buildMemberWithAccount(f: MemberForm, existingUsers: User[]): Promise<{ member: Member; user?: User } | null> {
  const id = f.id.trim().toUpperCase(), name = f.name.trim(), wa = f.wa.trim();
  if (!id || !name) return null;
  const [tier, disc] = f.tier.split('|');
  const member: Member = { id, name, wa, tier, disc: Number(disc), court: Number(f.court), dow: Number(f.dow), hour: Number(f.hour), dur: Number(f.dur) };
  const user: User | undefined = existingUsers.some(u => u.uid === id)
    ? undefined
    : { uid: id, name, wa: normWa(wa), role: 'member', pass: await sha256(normWa(wa) || 'member123') };
  return { member, user };
}

export type PricingDraft = Record<keyof Pricing, string>;
export const toPricingDraft = (p: Pricing): PricingDraft => ({
  peakStart: String(p.peakStart), peakEnd: String(p.peakEnd), peakPct: String(p.peakPct),
  weekendPct: String(p.weekendPct), earlyPct: String(p.earlyPct),
});
export const fromPricingDraft = (d: PricingDraft): Pricing => ({
  peakStart: Number(d.peakStart), peakEnd: Number(d.peakEnd), peakPct: Number(d.peakPct),
  weekendPct: Number(d.weekendPct), earlyPct: Number(d.earlyPct),
});

export function computeFinance(bookings: Booking[], membersCount: number, courts: Court[]) {
  const revenue = bookings.reduce((s, b) => s + b.total, 0);
  const hours = bookings.reduce((s, b) => s + b.hours.length, 0);
  const perCourt = courts.map(c => {
    const bks = bookings.filter(b => b.court === c.id);
    return { court: c, revenue: bks.reduce((s, b) => s + b.total, 0), hours: bks.reduce((s, b) => s + b.hours.length, 0) };
  });
  const perMethod = (['QRIS', 'VA_BCA', 'CARD'] as const).map(m => ({
    method: m, count: bookings.filter(b => (b.payMethod || 'QRIS') === m).length,
  }));
  return { revenue, hours, members: membersCount, perCourt, perMethod };
}
