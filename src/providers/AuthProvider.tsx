'use client';

import {createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {isAdminSession, loginAction, registerAction, toSession} from '@/actions/auth.actions';
import {DEFAULT_AUTH_NOTE} from '@/constants';
import type {Session, User} from '@/types';
import {useData} from './DataProvider';
import {useToast} from "@/providers/ToastProvider";

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
    const { toast } = useToast();
    const [authOpen, setAuthOpen] = useState(false);
    const [authNote, setAuthNote] = useState(DEFAULT_AUTH_NOTE);
    const [pendingKey, setPendingKey] = useState<string | null>(null);

    const isAdmin = useMemo(() => isAdminSession(session, users), [session, users]);
    const user = useMemo(() => (session ? users.find(u => u.uid === session.uid) ?? null : null), [session, users]);

    useEffect(() => {
        if (hydrated && session?.role === 'admin' && !isAdmin) dispatch({ type: 'SET_SESSION', session: null });
    }, [hydrated, session, isAdmin, dispatch]);

    const openAuth = useCallback((note?: string, pending?: string) => {
        setAuthNote(note || DEFAULT_AUTH_NOTE); setPendingKey(pending ?? null); setAuthOpen(true);
    }, []);
    const closeAuth = useCallback(() => { setAuthOpen(false); setPendingKey(null); }, []);
    const clearPending = useCallback(() => setPendingKey(null), []);

    const finishLogin = useCallback((u: User, kind: 'login' | 'register') => {
        dispatch({ type: 'SET_SESSION', session: toSession(u) });
        setAuthOpen(false);
        if (u.role !== 'member') setPendingKey(null); // admins never resume a member action
        toast(
            kind === 'register' ? `Akun berhasil dibuat. Selamat datang, ${u.name}!`
                : u.role === 'admin' ? `Berhasil masuk sebagai Admin.`
                    : `Berhasil masuk. Selamat datang kembali, ${u.name}!`,
            'success',
        );
    }, [dispatch, toast]);

    const login = useCallback(async (identifier: string, password: string) => {
        const res = await loginAction(users, identifier, password);
        if (!res.ok) return res.error;
        finishLogin(res.user, 'login'); return null;
    }, [users, finishLogin]);

    const register = useCallback(async (input: { name: string; wa: string; email: string; password: string }) => {
        const res = await registerAction(users, input);
        if (!res.ok) return res.error;
        dispatch({ type: 'ADD_USER', user: res.user });
        finishLogin(res.user, 'register'); return null;
    }, [users, dispatch, finishLogin]);

    const logout = useCallback(() => {
        dispatch({ type: 'SET_SESSION', session: null });
        setPendingKey(null);
        window.location.hash = '#top';
        toast('Anda telah keluar. Sampai jumpa!', 'info');
    }, [dispatch, toast]);

    const value = useMemo(() => ({
        session, user, isAdmin, authOpen, authNote, pendingKey, openAuth, closeAuth, clearPending, login, register, logout,
    }), [session, user, isAdmin, authOpen, authNote, pendingKey, openAuth, closeAuth, clearPending, login, register, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}