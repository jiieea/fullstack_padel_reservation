'use client';

import { useMasterSchedule } from '@/hooks/admin/useMasterSchedule';
import { hh, rpThousands } from '@/lib/format';

export function MasterSchedulePanel() {
  const s = useMasterSchedule();
  return (
    <div className="adm-panel">
      <div className="adm-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label htmlFor="admDatePick" style={{ fontWeight: 600 }}>Pilih Tanggal Operasional:</label>
          <input type="date" id="admDatePick" value={s.date} onChange={e => s.setDate(e.target.value)}
            style={{ minHeight: 40, padding: '0 12px', border: '1px solid var(--line)', borderRadius: 8 }} />
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 13, flexWrap: 'wrap' }}>
          <span className="badge ok">Hijau: Booking Pelanggan</span>
          <span className="badge warn">Kuning: Jadwal Member Tetap</span>
          <span className="badge err">Merah: Maintenance / Diblokir</span>
        </div>
      </div>
      <div className="msb-wrap">
        <table className="msb-table">
          <thead><tr><th>Jam</th>{s.courts.map(c => <th key={c.id}>{c.name}</th>)}</tr></thead>
          <tbody>
            {s.rows.map(row => (
              <tr key={row.hour}>
                <td><strong>{hh(row.hour)}</strong></td>
                {row.cells.map(({ court, status, price, open }) => (
                  <td key={court.id}>
                    {status.reason === 'BOOKED' && status.booking ? (
                      <div className="msb-cell booked" onClick={open}><span>{status.booking.name}</span><small>{status.booking.code}</small></div>
                    ) : status.reason === 'MEMBER' ? (
                      <div className="msb-cell member" onClick={open}><span>★ {status.detail}</span><small>Member Rutin</small></div>
                    ) : status.reason === 'MAINT' ? (
                      <div className="msb-cell maint" onClick={open}><span>🛠️ Maintenance</span></div>
                    ) : (
                      <div className="msb-cell avail" onClick={open}><span>Kosong</span><small>{rpThousands(price)}</small></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
