import { DEFAULT_CONFIG, DEFAULT_MEMBERS } from '@/constants';
import type { Block, Booking, Member, PersistedData, Pricing, Promo, Session, User } from '@/types';

export interface DataState extends PersistedData { hydrated: boolean; todayIso: string }

export const initialDataState: DataState = {
  config: DEFAULT_CONFIG, members: DEFAULT_MEMBERS, bookings: [], blocks: [], users: [],
  session: null, hydrated: false, todayIso: '',
};

export type DataAction =
  | { type: 'HYDRATE'; payload: PersistedData; todayIso: string }
  | { type: 'SET_SESSION'; session: Session | null }
  | { type: 'ADD_USER'; user: User }
  | { type: 'ADD_BOOKING'; booking: Booking }
  | { type: 'UPDATE_BOOKING'; code: string; patch: Partial<Booking> }
  | { type: 'REMOVE_BOOKING'; code: string }
  | { type: 'ADD_BLOCK'; block: Block }
  | { type: 'REMOVE_BLOCK'; court: number; date: string; hour: number }
  | { type: 'SAVE_PRICING'; basePrices: Record<number, number>; pricing: Pricing }
  | { type: 'ADD_PROMO'; promo: Promo }
  | { type: 'REMOVE_PROMO'; code: string }
  | { type: 'ADD_MEMBER'; member: Member; user?: User }
  | { type: 'REMOVE_MEMBER'; id: string };

export function dataReducer(state: DataState, a: DataAction): DataState {
  switch (a.type) {
    case 'HYDRATE': return { ...state, ...a.payload, todayIso: a.todayIso, hydrated: true };
    case 'SET_SESSION': return { ...state, session: a.session };
    case 'ADD_USER': return { ...state, users: [...state.users, a.user] };
    case 'ADD_BOOKING': return { ...state, bookings: [...state.bookings, a.booking] };
    case 'UPDATE_BOOKING':
      return { ...state, bookings: state.bookings.map(b => (b.code === a.code ? { ...b, ...a.patch } : b)) };
    case 'REMOVE_BOOKING': return { ...state, bookings: state.bookings.filter(b => b.code !== a.code) };
    case 'ADD_BLOCK': return { ...state, blocks: [...state.blocks, a.block] };
    case 'REMOVE_BLOCK':
      return { ...state, blocks: state.blocks.filter(b => !(b.court === a.court && b.date === a.date && b.hour === a.hour)) };
    case 'SAVE_PRICING':
      return {
        ...state,
        config: {
          ...state.config,
          pricing: a.pricing,
          courts: state.config.courts.map(c => (a.basePrices[c.id] !== undefined ? { ...c, price: a.basePrices[c.id] } : c)),
        },
      };
    case 'ADD_PROMO': return { ...state, config: { ...state.config, promos: [...state.config.promos, a.promo] } };
    case 'REMOVE_PROMO':
      return { ...state, config: { ...state.config, promos: state.config.promos.filter(p => p.code !== a.code) } };
    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, a.member], users: a.user ? [...state.users, a.user] : state.users };
    case 'REMOVE_MEMBER': return { ...state, members: state.members.filter(m => m.id !== a.id) };
    default: return state;
  }
}
