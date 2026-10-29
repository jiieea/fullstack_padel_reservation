'use client';

import { useReminders } from '@/hooks/useReminders';
import { useAuth } from '@/providers/AuthProvider';
import { LogoMark } from './Logo';

const NAV = [
  ['#booking', 'Booking'], ['#saya', 'Tiket & Reschedule'], ['#harga', 'Harga & Member'],
  ['#fasilitas', 'Fasilitas'], ['#faq', 'FAQ'],
];

export function Header() {
  const { session, isAdmin, openAuth, logout } = useAuth();
  const { count, hasActive, isLoggedIn, openModal } = useReminders();

  return (
    <header>
      <div className="wrap">
        <a className="logo" href="#top"><LogoMark /> PADELHUB</a>
        <nav aria-label="Menu utama">
          {NAV.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="nav-right">
          {isLoggedIn && (
            <button type="button" className={`rem-bell${hasActive ? ' has' : ''}`} onClick={openModal} title="Pengingat Jadwal Otomatis">
              <span className="dot" /> 🔔 Pengingat (<span>{count}</span>)
            </button>
          )}
          {!session && (
            <button type="button" className="btn sm ghost" onClick={() => openAuth('Masuk untuk booking lapangan.')}>👤 Masuk / Daftar</button>
          )}
          {session && !isAdmin && (
            <span className="user-chip">
              👤 <strong>{session.name}</strong>
              <button type="button" className="btn sm ghost" onClick={logout}>Keluar</button>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
