'use client';

import type { PricingDraft } from '@/actions/admin.actions';
import { useAdminPricing } from '@/hooks/admin/useAdminPricing';

const FIELDS: { key: keyof PricingDraft; label: string; min: number; max: number; step?: number }[] = [
  { key: 'peakStart', label: 'Jam Mulai Peak Hour', min: 7, max: 22 },
  { key: 'peakEnd', label: 'Jam Selesai Peak Hour', min: 8, max: 23 },
  { key: 'peakPct', label: 'Surge Peak Hour (%)', min: 0, max: 100, step: 5 },
  { key: 'weekendPct', label: 'Surge Akhir Pekan (%)', min: 0, max: 100, step: 5 },
  { key: 'earlyPct', label: 'Diskon Early Bird (%)', min: 0, max: 70, step: 5 },
];

export function PricingPanel() {
  const p = useAdminPricing();
  return (
    <div className="adm-panel">
      <div className="adm-card">
        <h3>Pengaturan Harga Dasar Lapangan (Base Rate)</h3>
        <div className="form-grid">
          {p.courts.map(c => (
            <div key={c.id}>
              <label>{c.name}</label>
              <input type="number" step={10000} value={p.basePrices[c.id] ?? ''} onChange={e => p.setBasePrice(c.id, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      <div className="adm-card">
        <h3>Aturan Dynamic Pricing &amp; Multiplier</h3>
        <div className="form-grid">
          {FIELDS.map(f => (
            <div key={f.key}>
              <label>{f.label}</label>
              <input type="number" min={f.min} max={f.max} step={f.step} value={p.pricing[f.key]} onChange={e => p.setPricingField(f.key, e.target.value)} />
            </div>
          ))}
          <div><button type="button" className="btn dark" style={{ width: '100%' }} onClick={p.save}>Simpan Aturan</button></div>
        </div>
      </div>

      <div className="adm-card">
        <h3>Manajemen Kode Promo</h3>
        <div className="form-grid" style={{ marginBottom: 16 }}>
          <div><label>Kode Promo</label><input type="text" placeholder="MISAL: RAMADHAN20" value={p.promoForm.code} onChange={e => p.setPromoForm({ code: e.target.value })} /></div>
          <div><label>Diskon (%)</label><input type="number" placeholder="20" min={5} max={90} value={p.promoForm.pct} onChange={e => p.setPromoForm({ pct: e.target.value })} /></div>
          <div><button type="button" className="btn" onClick={p.addPromo}>+ Tambah Promo</button></div>
        </div>
        <table className="adm-table">
          <tbody>
            {p.promos.map(pr => (
              <tr key={pr.code}>
                <td><strong>{pr.code}</strong></td><td>{pr.pct}%</td>
                <td><button type="button" className="btn sm danger" onClick={() => p.removePromo(pr.code)}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
