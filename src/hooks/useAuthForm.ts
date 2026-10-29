import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export type AuthMode = 'login' | 'register';

export function useAuthForm() {
  const { login, register, closeAuth, authNote } = useAuth();
  const [mode, setModeState] = useState<AuthMode>('login');
  const [fields, setFields] = useState({ identifier: '', password: '', name: '', wa: '', email: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const setField = (patch: Partial<typeof fields>) => setFields(f => ({ ...f, ...patch }));
  const setMode = (m: AuthMode) => { setModeState(m); setError(''); };

  const submit = async () => {
    setBusy(true);
    const err = mode === 'register'
      ? await register({ name: fields.name, wa: fields.wa, email: fields.email, password: fields.password })
      : await login(fields.identifier, fields.password);
    setBusy(false);
    if (err) setError(err);
  };

  return { mode, setMode, fields, setField, error, busy, submit, close: closeAuth, note: authNote };
}
