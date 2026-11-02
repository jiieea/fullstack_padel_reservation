"use client"
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef, useState
} from "react";

export type ToastType = "success" | "info" | "error"

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}


interface ToastContextValue {
    toasts: Toast[];
    dismissToast: (id: number) => void;
    toast: (message: string, type?: ToastType) => void;
}


const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_DURATION = 3500;
const MAX_TOAST = 3;


export function ToastProvider({children}: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
    const nextId = useRef(0);

    const dismissToast = useCallback((id: number) => {
        clearTimeout(timers.current.get(id));
        timers.current.delete(id);
        setToasts(toasts.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback((message: string, type: ToastType = "success") => {
        const id = ++nextId.current;
        setToasts(list => [...list.slice(-(MAX_TOAST - 1)), {id, message, type}]);
        timers.current.set(id, setTimeout(() => dismissToast(id), TOAST_DURATION));
    }, [dismissToast]);


    useEffect(() => {
        const map = timers.current;
        return () => {
            map.forEach(clearTimeout);
            map.clear();
        }
    }, []);

    const value = useMemo(() => ({ toasts, toast, dismissToast }), [toasts, toast, dismissToast]);
    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}


export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}