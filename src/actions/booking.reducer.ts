import type { Booking, CourtFilter, Member, PayMethod, Promo, User } from '@/types';
import { fromIso } from '@/lib/format';
import { pickSlot } from './booking.actions';

export interface CheckoutForm { name: string; wa: string; email: string; memberCode: string; promo: string; reminder: boolean }
export interface Feedback { type: 'ok' | 'err' | ''; message: string }
export const EMPTY_FEEDBACK: Feedback = { type: '', message: '' };
const EMPTY_FORM: CheckoutForm = { name: '', wa: '', email: '', memberCode: '', promo: '', reminder: true };

export interface BookingState {
  calYear: number; calMonth: number; selectedDate: string; filter: CourtFilter;
  courtId: number | null; hours: number[]; addons: string[];
  promoPct: number; appliedPromo: string; memberId: string | null;
  rescheduleCode: string | null; payMethod: PayMethod;
  form: CheckoutForm; feedback: Feedback;
  payOpen: boolean; receipt: Booking | null; remOpen: boolean;
  autofilledUid: string | null;
}

export const initialBookingState: BookingState = {
  calYear: 1970, calMonth: 0, selectedDate: '', filter: 'all', courtId: null, hours: [], addons: [],
  promoPct: 0, appliedPromo: '', memberId: null, rescheduleCode: null, payMethod: 'QRIS',
  form: EMPTY_FORM, feedback: EMPTY_FEEDBACK, payOpen: false, receipt: null, remOpen: false, autofilledUid: null,
};

export type BookingAction =
  | { type: 'INIT_TODAY'; iso: string }
  | { type: 'CAL_PREV' } | { type: 'CAL_NEXT' }
  | { type: 'SELECT_DATE'; iso: string }
  | { type: 'SET_FILTER'; filter: CourtFilter }
  | { type: 'PICK_SLOT'; courtId: number; hour: number }
  | { type: 'TOGGLE_ADDON'; id: string; checked: boolean }
  | { type: 'SET_FIELDS'; patch: Partial<CheckoutForm> }
  | { type: 'SET_FEEDBACK'; feedback: Feedback }
  | { type: 'MEMBER_APPLIED'; member: Member } | { type: 'MEMBER_REJECTED' }
  | { type: 'PROMO_APPLIED'; promo: Promo } | { type: 'PROMO_REJECTED' }
  | { type: 'START_RESCHEDULE'; booking: Booking } | { type: 'CANCEL_RESCHEDULE' }
  | { type: 'OPEN_PAY' } | { type: 'CLOSE_PAY' } | { type: 'SET_PAY_METHOD'; method: PayMethod }
  | { type: 'BOOKING_PAID'; booking: Booking } | { type: 'RESCHEDULE_DONE'; booking: Booking }
  | { type: 'CLOSE_RECEIPT' } | { type: 'OPEN_REM' } | { type: 'CLOSE_REM' } | { type: 'CLOSE_MODALS' }
  | { type: 'FILL_FROM_USER'; uid: string; user?: User; memberId?: string }
  | { type: 'SESSION_ENDED' };

export function bookingReducer(s: BookingState, a: BookingAction): BookingState {
  switch (a.type) {
    case 'INIT_TODAY': {
      if (s.selectedDate) return s;
      const d = fromIso(a.iso);
      return { ...s, selectedDate: a.iso, calYear: d.getFullYear(), calMonth: d.getMonth() };
    }
    case 'CAL_PREV': return s.calMonth === 0 ? { ...s, calMonth: 11, calYear: s.calYear - 1 } : { ...s, calMonth: s.calMonth - 1 };
    case 'CAL_NEXT': return s.calMonth === 11 ? { ...s, calMonth: 0, calYear: s.calYear + 1 } : { ...s, calMonth: s.calMonth + 1 };
    case 'SELECT_DATE': return { ...s, selectedDate: a.iso, courtId: null, hours: [] };
    case 'SET_FILTER': return { ...s, filter: a.filter };
    case 'PICK_SLOT': return { ...s, ...pickSlot({ courtId: s.courtId, hours: s.hours }, a.courtId, a.hour) };
    case 'TOGGLE_ADDON':
      return { ...s, addons: a.checked ? [...new Set([...s.addons, a.id])] : s.addons.filter(x => x !== a.id) };
    case 'SET_FIELDS': return { ...s, form: { ...s.form, ...a.patch } };
    case 'SET_FEEDBACK': return { ...s, feedback: a.feedback };
    case 'MEMBER_APPLIED':
      return { ...s, memberId: a.member.id, form: { ...s.form, name: a.member.name, wa: a.member.wa },
        feedback: { type: 'ok', message: `✓ Member ${a.member.tier} aktif!` } };
    case 'MEMBER_REJECTED': return { ...s, memberId: null, feedback: { type: 'err', message: 'ID Member salah.' } };
    case 'PROMO_APPLIED':
      return { ...s, promoPct: a.promo.pct, appliedPromo: a.promo.code, feedback: { type: 'ok', message: `✓ Promo ${a.promo.code} aktif!` } };
    case 'PROMO_REJECTED':
      return { ...s, promoPct: 0, appliedPromo: '', feedback: { type: 'err', message: 'Promo tidak valid.' } };
    case 'START_RESCHEDULE': {
      const d = fromIso(a.booking.date);
      return { ...s, rescheduleCode: a.booking.code, selectedDate: a.booking.date, calYear: d.getFullYear(), calMonth: d.getMonth(),
        courtId: a.booking.court, hours: [...a.booking.hours],
        form: { ...s.form, name: a.booking.name, wa: a.booking.wa, email: a.booking.email || '' } };
    }
    case 'CANCEL_RESCHEDULE': return { ...s, rescheduleCode: null, courtId: null, hours: [] };
    case 'OPEN_PAY': return { ...s, payOpen: true };
    case 'CLOSE_PAY': return { ...s, payOpen: false };
    case 'SET_PAY_METHOD': return { ...s, payMethod: a.method };
    case 'BOOKING_PAID':
      return { ...s, payOpen: false, receipt: a.booking, courtId: null, hours: [], addons: [], promoPct: 0,
        appliedPromo: '', form: { ...s.form, promo: '' } };
    case 'RESCHEDULE_DONE': return { ...s, receipt: a.booking, rescheduleCode: null, courtId: null, hours: [] };
    case 'CLOSE_RECEIPT': return { ...s, receipt: null };
    case 'OPEN_REM': return { ...s, remOpen: true };
    case 'CLOSE_REM': return { ...s, remOpen: false };
    case 'CLOSE_MODALS': return { ...s, payOpen: false, receipt: null, remOpen: false };
    case 'FILL_FROM_USER': {
      const u = a.user;
      return { ...s, autofilledUid: a.uid, memberId: a.memberId ?? s.memberId,
        form: { ...s.form, ...(u?.name && { name: u.name }), ...(u?.wa && { wa: u.wa }), ...(u?.email && { email: u.email }),
          ...(a.memberId && { memberCode: a.memberId }) } };
    }
    case 'SESSION_ENDED':
      return { ...s, memberId: null, rescheduleCode: null, autofilledUid: null, remOpen: false,
        form: { ...s.form, name: '', wa: '', email: '', memberCode: '' } };
    default: return s;
  }
}
