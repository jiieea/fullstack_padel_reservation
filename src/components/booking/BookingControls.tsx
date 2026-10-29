'use client';

import { COURT_FILTERS } from '@/constants';
import { useBookingControls } from '@/hooks/useBookingControls';

const STEPS = ['Pilih Tanggal', 'Pilih Court & Jam', 'Data & Member', 'Payment Gateway'];

export function BookingControls() {
  const c = useBookingControls();
  return (
    <div className="booking-ctrl">
      <div className="steps-bar">
        {STEPS.map((label, i) => (
          <div key={label} className={`step-item${i === 0 ? ' active' : ''}`}><span>{i + 1}</span> {label}</div>
        ))}
      </div>
      <div>
        <strong style={{ fontSize: 18, display: 'block', marginBottom: 4 }}>{c.selectedDateLabel}</strong>
        <span style={{ fontSize: 13, color: 'var(--mut)' }}>Harga dinamis aktif menyesuaikan waktu dan hari.</span>
      </div>
      <div className="filters-row">
        <div className="filters" role="group" aria-label="Jenis lapangan">
          {COURT_FILTERS.map(f => (
            <button key={f.id} type="button" className="chip" aria-pressed={c.filter === f.id} onClick={() => c.setFilter(f.id)}>{f.label}</button>
          ))}
        </div>
        {c.rescheduleActive && (
          <div style={{ background: '#fef9c3', color: '#854d0e', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
            Mode Reschedule Aktif{' '}
            <button type="button" onClick={c.cancelReschedule}
              style={{ marginLeft: 8, cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline', color: '#991b1b' }}>Batal</button>
          </div>
        )}
      </div>
    </div>
  );
}
