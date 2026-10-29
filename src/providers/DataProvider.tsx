'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type Dispatch, type ReactNode } from 'react';
import { dataReducer, initialDataState, type DataAction, type DataState } from '@/actions/data.actions';
import { seedData } from '@/actions/seed.actions';
import { DEFAULT_CONFIG, DEFAULT_MEMBERS, STORAGE_KEYS } from '@/constants';
import { toIso } from '@/lib/format';
import { loadJSON, saveRaw } from '@/lib/storage';
import type { Booking, Block, PersistedData, Session, User } from '@/types';

type DataContextValue = DataState & { dispatch: Dispatch<DataAction> };
const DataContext = createContext<DataContextValue | null>(null);

const readAll = (): PersistedData => ({
  config: loadJSON(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG),
  members: loadJSON(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS),
  bookings: loadJSON<Booking[]>(STORAGE_KEYS.BOOKINGS, []),
  blocks: loadJSON<Block[]>(STORAGE_KEYS.BLOCKS, []),
  users: loadJSON<User[]>(STORAGE_KEYS.USERS, []),
  session: loadJSON<Session | null>(STORAGE_KEYS.SESSION, null),
});

/** Single source of truth for persisted data (localStorage), synced across tabs. */
export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialDataState);
  const written = useRef<Record<string, string>>({});

  // hydrate (client only → no SSR mismatch) + cross-tab sync
  useEffect(() => {
    let cancelled = false;
    seedData(readAll(), toIso(new Date())).then(payload => {
      if (!cancelled) dispatch({ type: 'HYDRATE', payload, todayIso: toIso(new Date()) });
    });
    const onStorage = () => dispatch({ type: 'HYDRATE', payload: readAll(), todayIso: toIso(new Date()) });
    window.addEventListener('storage', onStorage);
    return () => { cancelled = true; window.removeEventListener('storage', onStorage); };
  }, []);

  // persist
  useEffect(() => {
    if (!state.hydrated) return;
    const entries: [string, unknown][] = [
      [STORAGE_KEYS.CONFIG, state.config], [STORAGE_KEYS.MEMBERS, state.members],
      [STORAGE_KEYS.BOOKINGS, state.bookings], [STORAGE_KEYS.BLOCKS, state.blocks],
      [STORAGE_KEYS.USERS, state.users], [STORAGE_KEYS.SESSION, state.session],
    ];
    for (const [key, value] of entries) {
      const json = JSON.stringify(value);
      if (written.current[key] !== json) { written.current[key] = json; saveRaw(key, json); }
    }
  }, [state]);

  const value = useMemo(() => ({ ...state, dispatch }), [state]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
}
