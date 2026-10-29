'use client';

import { useReminders } from '@/hooks/useReminders';
import { Modal } from './Modal';

export function ReminderModal() {
  const r = useReminders();
  if (!r.isOpen) return null;
  return (
    <Modal>
      <h2>🔔 Pusat Pengingat Otomatis</h2>
      <p style={{ fontSize: 14, color: 'var(--mut)', margin: '0 0 16px' }}>Pengingat otomatis untuk jadwal bermain milik akun Anda.</p>
      <div style={{ marginBottom: 18 }}>
        {r.active.length === 0 && <p className="empty">Belum ada jadwal dengan pengingat aktif. Booking lapangan untuk melihatnya di sini.</p>}
        {r.active.map(b => (
          <div key={b.code} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: 12, marginBottom: 8 }}>
            <strong>{b.courtName} ({b.code})</strong><br /><small>{b.label}</small>
          </div>
        ))}
      </div>
      <button className="btn dark" type="button" style={{ width: '100%' }} onClick={r.closeModal}>Tutup</button>
    </Modal>
  );
}
