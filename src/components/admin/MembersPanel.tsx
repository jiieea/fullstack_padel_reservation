'use client';

import { DOW_OPTIONS, TIER_OPTIONS } from '@/constants';
import { useAdminMembers } from '@/hooks/admin/useAdminMembers';

export function MembersPanel() {
  const m = useAdminMembers();
  const { form } = m;
  return (
    <div className="adm-panel">
      <div className="adm-card">
        <h3>Tambah Member / Jadwal Rutin Mingguan</h3>
        <div className="form-grid">
          <div><label>ID Member</label><input type="text" placeholder="MBR-GOLD02" value={form.id} onChange={e => m.setField({ id: e.target.value })} /></div>
          <div><label>Nama Lengkap</label><input type="text" placeholder="Budi Santoso" value={form.name} onChange={e => m.setField({ name: e.target.value })} /></div>
          <div><label>No. WhatsApp (password awal)</label><input type="tel" placeholder="081299998888" value={form.wa} onChange={e => m.setField({ wa: e.target.value })} /></div>
          <div>
            <label>Tier &amp; Diskon</label>
            <select value={form.tier} onChange={e => m.setField({ tier: e.target.value })}>
              {TIER_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label>Lapangan Rutin</label>
            <select value={form.court} onChange={e => m.setField({ court: e.target.value })}>
              <option value="0">Tanpa Jadwal Rutin</option>
              <option value="1">Court Emerald</option><option value="2">Court Ivory</option>
              <option value="3">Court Champagne</option><option value="4">Court Lime</option>
            </select>
          </div>
          <div>
            <label>Hari Rutin</label>
            <select value={form.dow} onChange={e => m.setField({ dow: e.target.value })}>
              {DOW_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
          <div><label>Jam Mulai</label><input type="number" min={7} max={21} value={form.hour} onChange={e => m.setField({ hour: e.target.value })} /></div>
          <div><label>Durasi (Jam)</label><input type="number" min={1} max={3} value={form.dur} onChange={e => m.setField({ dur: e.target.value })} /></div>
          <div><button type="button" className="btn dark" style={{ width: '100%' }} onClick={m.add}>+ Simpan Member</button></div>
        </div>
      </div>
      <div className="adm-card">
        <h3>Daftar Member Aktif</h3>
        <table className="adm-table">
          <tbody>
            {m.members.map((mem, i) => (
              <tr key={`${mem.id}-${i}`}>
                <td><span className="badge gold">{mem.id}</span></td>
                <td><strong>{mem.name}</strong><br /><small>{mem.wa}</small></td>
                <td>{mem.tier} (-{mem.disc}%)</td>
                <td><button type="button" className="btn sm danger" onClick={() => m.remove(mem.id)}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
