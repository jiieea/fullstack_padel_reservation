'use client';

import { SectionHeading } from '../sections/SectionHeading';
import { useMyBookings } from '@/hooks/useMyBookings';
import { fmtHourRange, rp } from '@/lib/format';

export function MyBookingsSection() {
  const m = useMyBookings();
  return (
    <section id="saya" className="alt mine">
      <div className="wrap">
        <SectionHeading title="Self-Service Portal & Booking Saya" description="Cari pesanan dengan Kode Booking atau Nomor WhatsApp untuk melakukan Reschedule mandiri." />
        <form className="lookup-bar" onSubmit={e => e.preventDefault()}>
          <input type="text" placeholder="Cari Kode Booking (PDL-...) atau No. WhatsApp..." value={m.query} onChange={e => m.setQuery(e.target.value)} />
          <button className="btn dark" type="submit">Cari</button>
        </form>
        <div>
          {m.list.length === 0 && <p className="empty">Belum ada booking.</p>}
          {m.list.map(b => (
            <div className="item" key={b.code}>
              <div>
                <span className="badge gold">{b.code}</span> <strong style={{ fontSize: 17 }}>{b.courtName}</strong> — {b.name}<br />
                <small>📅 {b.label} | ⏰ {fmtHourRange(b.hours, '-')} | 💰 {rp(b.total)}</small>
              </div>
              <div className="item-acts">
                <button type="button" className="btn sm ghost-dark" onClick={() => m.downloadIcs(b.code)}>📅 .ICS</button>
                <button type="button" className="btn sm ghost-dark" onClick={() => m.reschedule(b.code)}>🔄 Ubah Jadwal</button>
                <button type="button" className="btn sm danger" onClick={() => m.cancel(b.code)}>Batalkan</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
