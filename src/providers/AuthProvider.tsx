'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isAdminSession, loginAction, registerAction, toSession } from '@/actions/auth.actions';
import { DEFAULT_AUTH_NOTE } from '@/constants';
import type { Session, User } from '@/types';
import { useData } from './DataProvider';

interface AuthContextValue {
  session: Session | null; user: User | null; isAdmin: boolean;
  authOpen: boolean; authNote: string; pendingKey: string | null;
  openAuth: (note?: string, pendingKey?: string) => void;
  closeAuth: () => void; clearPending: () => void;
  /** resolves to an error message, or null on success */
  login: (identifier: string, password: string) => Promise<string | null>;
  register: (input: { name: string; wa: string; email: string; password: string }) => Promise<string | null>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { session, users, hydrated, dispatch } = useData();
  const [authOpen, setAuthOpen] = useState(false);
  const [authNote, setAuthNote] = useState(DEFAULT_AUTH_NOTE);
  /** an action the user wanted to do before being asked to log in ("checkout", "cancel:CODE", …) */
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const isAdmin = useMemo(() => isAdminSession(session, users), [session, users]);
  const user = useMemo(() => (session ? users.find(u => u.uid === session.uid) ?? null : null), [session, users]);

  // an admin session that doesn't match an admin account is rejected
  useEffect(() => {
    if (hydrated && session?.role === 'admin' && !isAdmin) dispatch({ type: 'SET_SESSION', session: null });
  }, [hydrated, session, isAdmin, dispatch]);

  const openAuth = useCallback((note?: string, pending?: string) => {
    setAuthNote(note || DEFAULT_AUTH_NOTE); setPendingKey(pending ?? null); setAuthOpen(true);
  }, []);
  const closeAuth = useCallback(() => { setAuthOpen(false); setPendingKey(null); }, []);
  const clearPending = useCallback(() => setPendingKey(null), []);

  const finishLogin = useCallback((u: User) => {
    dispatch({ type: 'SET_SESSION', session: toSession(u) });
    setAuthOpen(false);
    if (u.role !== 'member') setPendingKey(null); // admins never resume a member action
  }, [dispatch]);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await loginAction(users, identifier, password);
    if (!res.ok) return res.error;
    finishLogin(res.user); return null;
  }, [users, finishLogin]);

  const register = useCallback(async (input: { name: string; wa: string; email: string; password: string }) => {
    const res = await registerAction(users, input);
    if (!res.ok) return res.error;
    dispatch({ type: 'ADD_USER', user: res.user });
    finishLogin(res.user); return null;
  }, [users, dispatch, finishLogin]);

  const logout = useCallback(() => {
    dispatch({ type: 'SET_SESSION', session: null });
    setPendingKey(null);
    window.location.hash = '#top';
  }, [dispatch]);

  const value = useMemo(() => ({
    session, user, isAdmin, authOpen, authNote, pendingKey, openAuth, closeAuth, clearPending, login, register, logout,
  }), [session, user, isAdmin, authOpen, authNote, pendingKey, openAuth, closeAuth, clearPending, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function   useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
