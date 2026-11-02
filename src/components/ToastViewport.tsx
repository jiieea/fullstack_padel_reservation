'use client';

import { useToast } from '@/providers/ToastProvider';

const ICONS = { success: '✓', error: '!', info: 'i' } as const;

export function ToastViewport() {
    const { toasts, dismissToast } = useToast();
    return (
        <div className="toast-viewport" role="status" aria-live="polite">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    <span className="toast-icon" aria-hidden="true">{ICONS[t.type]}</span>
                    <span className="toast-msg">{t.message}</span>
                    <button type="button" className="toast-close" aria-label="Tutup notifikasi" onClick={() => dismissToast(t.id)}>×</button>
                </div>
            ))}
        </div>
    );
}