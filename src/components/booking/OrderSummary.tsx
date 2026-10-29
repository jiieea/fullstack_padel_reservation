'use client';

import { ADDONS } from '@/constants';
import { useCheckout } from '@/hooks/useCheckout';
import { useOrderSummary } from '@/hooks/useOrderSummary';
import { rp } from '@/lib/format';

export function OrderSummary() {
  const s = useOrderSummary();
  const { confirm, buttonLabel } = useCheckout();
  const { form } = s;

  return (
    <aside className="sum" aria-label="Ringkasan pesanan">
      <h3>Ringkasan Booking</h3>
      <div className="row"><span>Lapangan</span><span>{s.rows.court}</span></div>
      <div className="row"><span>Tanggal</span><span>{s.rows.date}</span></div>
      <div className="row"><span>Jam Main</span><span>{s.rows.time}</span></div>
      <div className="row"><span>Sewa Lapangan</span><span>{s.rows.base}</span></div>
      <div className="row"><span>Diskon Member/Promo</span><span>{s.rows.discount}</span></div>

      <div className="addons">
        {ADDONS.map(a => (
          <label key={a.id}>
            <span><input type="checkbox" checked={s.addons.includes(a.id)} onChange={e => s.toggleAddon(a.id, e.target.checked)} /> {a.n}</span>
            <span>{rp(a.p)}</span>
          </label>
        ))}
      </div>

      <label className="lbl" htmlFor="memberCode">ID Member Tetap (Opsional - Diskon Otomatis)</label>
      <div className="promo">
        <input type="text" id="memberCode" placeholder="Contoh: MBR-GOLD01" value={form.memberCode} onChange={e => s.setField({ memberCode: e.target.value })} />
        <button className="btn ghost" type="button" onClick={s.applyMember}>Cek</button>
      </div>

      <label className="lbl" htmlFor="promo">Kode Promo / Voucher</label>
      <div className="promo">
        <input type="text" id="promo" placeholder="Coba PADELIA10" value={form.promo} onChange={e => s.setField({ promo: e.target.value })} />
        <button className="btn ghost" type="button" onClick={s.applyPromo}>Pakai</button>
      </div>

      <label className="lbl" htmlFor="nm">Nama Pemesan *</label>
      <input type="text" id="nm" autoComplete="name" placeholder="Nama lengkap Anda" value={form.name} onChange={e => s.setField({ name: e.target.value })} />

      <label className="lbl" htmlFor="wa">Nomor WhatsApp (Pengingat Otomatis) *</label>
      <input type="tel" id="wa" autoComplete="tel" placeholder="08123456789" value={form.wa} onChange={e => s.setField({ wa: e.target.value })} />

      <label className="lbl" htmlFor="em">Email (E-Receipt &amp; Kalender) *</label>
      <input type="email" id="em" autoComplete="email" placeholder="nama@email.com" value={form.email} onChange={e => s.setField({ email: e.target.value })} />

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, margin: '8px 0', cursor: 'pointer', color: '#cfd8d2' }}>
        <input type="checkbox" checked={form.reminder} onChange={e => s.setField({ reminder: e.target.checked })} style={{ accentColor: 'var(--gold)' }} />
        Aktifkan Pengingat Otomatis (H-24 Jam &amp; H-2 Jam)
      </label>

      <div className="total"><span>Total Bayar</span><strong>{s.totalLabel}</strong></div>
      <p className="err" role="alert" style={{ color: s.feedback.type === 'ok' ? '#a7f3d0' : '#ffb4a2' }}>{s.feedback.message}</p>
      <button className="btn" type="button" style={{ width: '100%' }} onClick={confirm}>{buttonLabel}</button>
    </aside>
  );
}
