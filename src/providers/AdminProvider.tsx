'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AdminTabId } from '@/constants';
import { useAuth } from './AuthProvider';
import { useBooking } from './BookingProvider';
import { useData } from './DataProvider';

export interface SlotTarget { courtId: number; hour: number; date: string }
interface AdminContextValue {
  tab: AdminTabId; setTab: (t: AdminTabId) => void;
  date: string; setDate: (d: string) => void;
  slotTarget: SlotTarget | null; openSlot: (t: SlotTarget) => void; closeSlot: () => void;
}
const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const { todayIso } = useData();
  const { state } = useBooking();
  const [tab, setTab] = useState<AdminTabId>('schedule');
  const [date, setDate] = useState('');
  const [slotTarget, setSlotTarget] = useState<SlotTarget | null>(null);

  useEffect(() => { if (isAdmin && !date) setDate(state.selectedDate || todayIso); }, [isAdmin, date, state.selectedDate, todayIso]);
  useEffect(() => { if (!isAdmin) setSlotTarget(null); }, [isAdmin]);

  const openSlot = useCallback((t: SlotTarget) => setSlotTarget(t), []);
  const closeSlot = useCallback(() => setSlotTarget(null), []);
  const value = useMemo(() => ({ tab, setTab, date, setDate, slotTarget, openSlot, closeSlot }),
    [tab, date, slotTarget, openSlot, closeSlot]);
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}
