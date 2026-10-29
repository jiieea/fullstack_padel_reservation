'use client';

import { useAdminFinance } from '@/hooks/admin/useAdminFinance';
import { rp, rpThousands } from '@/lib/format';
import { BarRow } from './BarRow';

export function FinancePanel() {
  const f = useAdminFinance();
  return (
    <div className="adm-panel">
      <div className="kpi-grid">
        <div className="kpi-card"><small>Total Pendapatan</small><strong>{rp(f.revenue)}</strong></div>
        <div className="kpi-card"><small>Jam Terjual</small><strong>{f.hours} Jam</strong></div>
        <div className="kpi-card"><small>Member Aktif</small><strong>{f.members}</strong></div>
      </div>
      <div className="two-col">
        <div className="adm-card">
          <h3>Okupansi per Lapangan</h3>
          {f.perCourt.map(c => <BarRow key={c.court.id} label={c.court.name} pct={c.hours * 5} value={rpThousands(c.revenue)} />)}
        </div>
        <div className="adm-card">
          <h3>Metode Pembayaran</h3>
          {f.perMethod.map(m => <BarRow key={m.method} label={m.method} pct={m.count * 25} value={`${m.count} Tx`} color="var(--g)" />)}
        </div>
      </div>
      <div className="adm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0 }}>Jurnal Transaksi Lunas</h3>
          <button type="button" className="btn sm dark" onClick={f.exportCsv}>⬇ Ekspor CSV</button>
        </div>
        <table className="adm-table">
          <tbody>
            {f.bookings.map(b => (
              <tr key={b.code}>
                <td><strong>{b.code}</strong></td><td>{b.name}</td><td>{b.courtName}</td>
                <td><span className="badge ok">{b.payMethod || 'QRIS'}</span></td><td><strong>{rp(b.total)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
