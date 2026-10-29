'use client';

import { useAdminSlotModal } from '@/hooks/admin/useAdminSlotModal';
import { hh, rp } from '@/lib/format';
import { Modal } from './Modal';

const input = { padding: 10, border: '1px solid var(--line)', borderRadius: 8 } as const;

export function AdminSlotModal() {
  const m = useAdminSlotModal();
  if (!m.target || !m.court || !m.status) return null;
  const { status } = m;
  return (
    <Modal boxStyle={{ maxWidth: 420 }}>
      <h2>{m.court.name} — {hh(m.target.hour)}</h2>
      <p style={{ fontSize: 14, color: 'var(--mut)', margin: '4px 0 16px' }}>{m.dateLabel}</p>

      {status.reason === 'BOOKED' && status.booking && (
        <>
          <dl style={{ margin: '0 0 16px' }}>
            <dt>Kode</dt><dd>{status.booking.code}</dd>
            <dt>Nama</dt><dd>{status.booking.name} ({status.booking.wa})</dd>
          </dl>
          <button type="button" className="btn danger" style={{ width: '100%' }} onClick={m.cancelBooking}>Batalkan Booking</button>
        </>
      )}
      {status.reason === 'MAINT' && (
        <button type="button" className="btn dark" style={{ width: '100%' }} onClick={m.unblock}>Buka Kembali Slot</button>
      )}
      {status.reason === 'MEMBER' && <p>Slot ini dikunci untuk Member Rutin.</p>}
      {status.reason === 'FREE' && (
        <div style={{ display: 'grid', gap: 10 }}>
          <input type="text" placeholder="Nama Tamu" style={input} value={m.guest.name} onChange={e => m.setGuest(g => ({ ...g, name: e.target.value }))} />
          <input type="tel" placeholder="No. WA" style={input} value={m.guest.wa} onChange={e => m.setGuest(g => ({ ...g, wa: e.target.value }))} />
          <button type="button" className="btn dark" onClick={m.addWalkin}>+ Input Walk-in ({rp(m.price)})</button>
          <button type="button" className="btn danger" onClick={m.setMaintenance}>🛠️ Maintenance</button>
        </div>
      )}
      <button className="btn ghost-dark" type="button" style={{ width: '100%', marginTop: 10 }} onClick={m.close}>Tutup</button>
    </Modal>
  );
}
