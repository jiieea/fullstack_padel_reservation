import {sha256, randomCode} from '@/lib/crypto';
import {normWa} from '@/lib/format';
import {validateRegistration} from '@/lib/validation';
import type {Session, User} from '@/types';

export type AuthResult = { ok: true; user: User } | { ok: false; error: string };

export const toSession = (u: User): Session => ({uid: u.uid, name: u.name, role: u.role});

export const isAdminSession = (session: Session | null, users: User[]): boolean =>
    !!(session && session.role === 'admin' && users.some(u => u.uid === session.uid && u.role === 'admin'));

const norm = (s: string) => s.toLowerCase().replace(/[\s-]/g, '');

export async function loginAction(users: User[], identifier: string, password: string): Promise<AuthResult> {
    const id = norm(identifier.trim());
    if (!id || !password) return {ok: false, error: 'Isi ID dan password.'};
    const hash = await sha256(password);
    const user = users.find(u => [u.uid, u.email, u.wa].some(v => v && norm(String(v)) === id));
    if (!user || user.pass !== hash) return {ok: false, error: 'ID atau password salah.'};
    return {ok: true, user};
}

export async function registerAction(
    users: User[], input: { name: string; wa: string; email: string; password: string },
): Promise<AuthResult> {
    const name = input.name.trim(), wa = normWa(input.wa), email = input.email.trim().toLowerCase();
    const err = validateRegistration({name, wa, email, password: input.password});
    if (err) return {ok: false, error: err};
    if (users.some(u => (u.email || '').toLowerCase() === email || u.wa === wa))
        return {ok: false, error: 'Email / No. WA sudah terdaftar. Silakan masuk.'};
    // public registration is ALWAYS role "member"
    return {
        ok: true,
        user: {uid: randomCode('USR-', 6), name, wa, email, role: 'member', pass: await sha256(input.password)}
    };
}
