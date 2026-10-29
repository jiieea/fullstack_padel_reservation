import {PHONE_REGEX} from '@/constants';

export function validateCheckout(i: {
    hasCourt: boolean;
    name: string;
    wa: string;
    email: string
}): string | null {
    if (!i.hasCourt) return 'Pilih lapangan dan jam main terlebih dulu.';
    if (i.name.trim().length < 2) return 'Isi nama pemesan.';
    if (!PHONE_REGEX.test(i.wa)) return 'Nomor WhatsApp tidak valid.';
    if (!i.email.includes('@')) return 'Email tidak valid.';
    return null;
}

export function validateRegistration(i: { name: string; wa: string; email: string; password: string }): string | null {
    if (i.name.length < 2) return 'Isi nama lengkap.';
    if (!PHONE_REGEX.test(i.wa)) return 'Nomor WhatsApp tidak valid.';
    if (!i.email.includes('@')) return 'Email tidak valid.';
    if (i.password.length < 6) return 'Password minimal 6 karakter.';
    return null;
}
