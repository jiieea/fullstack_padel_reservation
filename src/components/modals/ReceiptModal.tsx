'use client';

import { Fragment } from 'react';
import { useReceipt } from '@/hooks/useReceipt';
import { Modal } from './Modal';

export function ReceiptModal() {
  const r = useReceipt();
  if (!r.receipt) return null;
  return (
    <Modal boxStyle={{ textAlign: 'center' }}>
      <span className="badge ok" style={{ marginBottom: 8 }}>✓ PEMBAYARAN BERHASIL</span>
      <h2>E-Ticket &amp; Bukti Lunas</h2>
      <div className="code">{r.receipt.code}</div>
      <dl>{r.rows.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <a className="btn dark" href={r.waLink} target="_blank" rel="noopener noreferrer">📲 Kirim WA</a>
        <button className="btn ghost-dark" type="button" onClick={r.saveCalendar}>📅 Simpan Kalender</button>
      </div>
      <button className="btn" type="button" style={{ width: '100%' }} onClick={r.close}>Selesai</button>
    </Modal>
  );
}
