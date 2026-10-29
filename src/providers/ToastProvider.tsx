"use client"
import {createContext, ReactNode, useRef, useState} from "react";

export type ToastType = "success" | "info" | "error"

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}


interface ToastContextValue {
    toasts: Toast[];
    dismissToast: (id: string) => void;
    toast: (message: string, type?: ToastType) => void;
}


const toastContext = createContext<ToastContextValue | null>(null);
const TOAST_DURATION = 3500;
const MAX_TOAST = 3;


export function ToastProvider({children}: { children: ReactNode }) {
    const [toast, setToast] = useState<Toast[]>([]);
    const duration = useRef(new Map<number, ReturnType<typeof setTimeout>>());
    const nextId = useRef(0);
    return (
        <></>
    );
}