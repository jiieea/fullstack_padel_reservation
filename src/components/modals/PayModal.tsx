'use client';

import { PAYMENT_TIMEOUT_SECONDS, PAY_METHODS } from '@/constants';
import { usePayment } from '@/hooks/usePayment';
import { usePaymentTimer } from '@/hooks/usePaymentTimer';
import { rp } from '@/lib/format';
import type { PayMethod } from '@/types';
import { Modal } from './Modal';

const field = { padding: 10, border: '1px solid var(--line)', borderRadius: 8 } as const;

function PayStage({ method, total }: { method: PayMethod; total: number }) {
  if (method === 'QRIS') {
    return (
      <>
        <strong style={{ fontSize: 14 }}>Scan QRIS Instan</strong>
        <div className="qris-box">
          <svg viewBox="0 0 100 100" width="130" height="130">
            <rect width="30" height="30" x="5" y="5" fill="none" stroke="#10201d" strokeWidth="6" />
            <rect width="14" height="14" x="13" y="13" fill="#10201d" />
            <rect width="30" height="30" x="65" y="5" fill="none" stroke="#10201d" strokeWidth="6" />
            <rect width="14" height="14" x="73" y="13" fill="#10201d" />
            <rect width="30" height="30" x="5" y="65" fill="none" stroke="#10201d" strokeWidth="6" />
            <rect width="14" height="14" x="13" y="73" fill="#10201d" />
            <path d="M45 10h10v15H45zM45 35h15v10H45zM70 45h25v10H70zM40 55h20v15H40zM65 65h15v25H65zM85 75h10v20H85zM10 45h25v10H10z" fill="#10201d" />
          </svg>
        </div>
      </>
    );
  }
  if (method === 'VA_BCA') {
    return (
      <>
        <strong style={{ fontSize: 14 }}>Virtual Account BCA</strong><br />
        <div className="va-num">8801 0812 3456 7890</div><br />
        <small>Sebesar <strong>{rp(total)}</strong></small>
      </>
    );
  }
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <input type="text" placeholder="Nomor Kartu" style={field} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input type="text" placeholder="MM/YY" style={field} />
        <input type="text" placeholder="CVV" style={field} />
      </div>
    </div>
  );
}

export function PayModal() {
  const { open } = usePayment();
  return open ? <PayModalContent /> : null; // mounted only while open → timer restarts each time
}

function PayModalContent() {
  const p = usePayment();
  const timer = usePaymentTimer(PAYMENT_TIMEOUT_SECONDS, p.cancel);
  return (
    <Modal>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className="badge gold">🔒 PadeliaPay Gateway</span>
        <span style={{ fontSize: 13, color: 'var(--err)', fontWeight: 600 }}>Selesaikan dalam <span>{timer}</span></span>
      </div>
      <h2>Pembayaran Instan</h2>
      <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--mut)' }}>Pilih metode pembayaran untuk mengunci jadwal lapangan.</p>
      <div className="pay-methods">
        {PAY_METHODS.map(m => (
          <button key={m.id} type="button" className={`pay-tab${p.method === m.id ? ' active' : ''}`} onClick={() => p.setMethod(m.id)}>{m.label}</button>
        ))}
      </div>
      <div className="pay-stage"><PayStage method={p.method} total={p.total} /></div>
      <dl>
        {p.summary.map(([k, v], i) => (
          <Row key={k} label={k} value={v} gold={i === p.summary.length - 1} />
        ))}
      </dl>
      <button className="btn dark" type="button" style={{ width: '100%' }} onClick={p.simulatePay}>Simulasikan Pembayaran Lunas</button>
      <button className="btn ghost-dark" type="button" style={{ width: '100%', marginTop: 8 }} onClick={p.cancel}>Batal</button>
    </Modal>
  );
}

function Row({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return <><dt>{label}</dt><dd style={gold ? { color: 'var(--gold)', fontWeight: 700 } : undefined}>{value}</dd></>;
}
