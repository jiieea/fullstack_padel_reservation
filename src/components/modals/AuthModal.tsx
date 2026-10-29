'use client';

import {useAuthForm} from '@/hooks/useAuthForm';
import {useAuth} from '@/providers/AuthProvider';
import {Modal} from './Modal';

export function AuthModal() {
    const {authOpen} = useAuth();
    return authOpen ? <AuthModalContent/> : null; // mounting resets the form, like reopening the original dialog
}

function AuthModalContent() {
    const a = useAuthForm();
    const reg = a.mode === 'register';
    return (
        <Modal boxStyle={{maxWidth: 420}}>
            <h2>Selamat Datang</h2>
            <p style={{fontSize: 14, color: 'var(--mut)', margin: '0 0 8px'}}>{a.note}</p>
            <div className="pay-methods" style={{gridTemplateColumns: '1fr 1fr'}}>
                <button type="button" className={`pay-tab${!reg ? ' active' : ''}`}
                        onClick={() => a.setMode('login')}>Masuk
                </button>
                <button type="button" className={`pay-tab${reg ? ' active' : ''}`}
                        onClick={() => a.setMode('register')}>Daftar Member
                </button>
            </div>
            {reg && (
                <div>
                    <input className="auth-in" placeholder="Nama lengkap" autoComplete="name" value={a.fields.name}
                           onChange={e => a.setField({name: e.target.value})}/>
                    <input className="auth-in" type="tel" placeholder="No. WhatsApp (08...)" autoComplete="tel"
                           value={a.fields.wa} onChange={e => a.setField({wa: e.target.value})}/>
                    <input className="auth-in" type="email" placeholder="Email" autoComplete="email"
                           value={a.fields.email} onChange={e => a.setField({email: e.target.value})}/>
                </div>
            )}
            {!reg && (
                <input className="auth-in" autoFocus placeholder="Email / No. WA / ID Member / Username"
                       autoComplete="username"
                       value={a.fields.identifier} onChange={e => a.setField({identifier: e.target.value})}/>
            )}
            <input className="auth-in" type="password" placeholder="Password"
                   autoComplete={reg ? 'new-password' : 'current-password'}
                   value={a.fields.password} onChange={e => a.setField({password: e.target.value})}
                   onKeyDown={e => {
                       if (e.key === 'Enter') a.submit();
                   }}/>
            <p className="auth-err" role="alert">{a.error}</p>
            <button className="btn dark" type="button" style={{width: '100%'}} disabled={a.busy}
                    onClick={a.submit}>{reg ? 'Daftar & Masuk' : 'Masuk'}</button>
            <button className="btn ghost-dark" type="button" style={{width: '100%', marginTop: 8}}
                    onClick={a.close}>Batal
            </button>
            <p style={{fontSize: 12, color: 'var(--mut)', margin: '12px 0 0'}}>Demo
                member: <code>MBR-GOLD01</code> / <code>member123</code></p>
        </Modal>
    );
}
