export type CourtType = 'indoor' | 'outdoor';
export type CourtFilter = 'all' | CourtType;
export type PayMethod = 'QRIS' | 'VA_BCA' | 'CARD';
export type Role = 'admin' | 'member';
export type OccupancyLevel = 'low' | 'mid' | 'high';

export interface Court { id: number; name: string; type: CourtType; price: number; info: string }
export interface Pricing { peakStart: number; peakEnd: number; peakPct: number; weekendPct: number; earlyPct: number }
export interface Promo { code: string; pct: number }
export interface Config { courts: Court[]; pricing: Pricing; promos: Promo[] }

export interface Member {
  id: string; name: string; wa: string; tier: string; disc: number;
  court: number; dow: number; hour: number; dur: number;
}
export interface Addon { id: string; n: string; p: number }

export interface Booking {
  code: string; court: number; courtName: string; date: string; label: string;
  hours: number[]; total: number; name: string; wa: string; email?: string;
  payMethod: PayMethod | 'CASH'; status: 'PAID'; reminder: boolean;
  userId?: string | null; createdAt: number;
}
export interface Block { court: number; date: string; hour: number; note: string }

export interface User { uid: string; name: string; wa?: string; email?: string; role: Role; pass: string }
export interface Session { uid: string; name: string; role: Role }

export type SlotReason = 'FREE' | 'PAST' | 'MAINT' | 'MEMBER' | 'BOOKED';
export interface SlotStatus {
  available: boolean; reason: SlotReason; label?: string; detail?: string; booking?: Booking;
}

export interface PersistedData {
  config: Config; members: Member[]; bookings: Booking[];
  blocks: Block[]; users: User[]; session: Session | null;
}
