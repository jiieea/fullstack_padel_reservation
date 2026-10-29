'use client';

import { hh, rp } from '@/lib/format';
import { useCourts } from '@/hooks/useCourts';

export function CourtList() {
  const { courts, slotsFor, pickSlot } = useCourts();
  return (
    <div>
      <div>
        {courts.map(c => (
          <article className="card" key={c.id}>
            <h3>{c.name}</h3>
            <div className="meta">
              <span><span className="badge gold" style={{ marginRight: 8 }}>{c.type.toUpperCase()}</span>{c.info}</span>
              <span>Base: <strong>{rp(c.price)}/jam</strong></span>
            </div>
            <div className="slots">
              {slotsFor(c).map(s => (
                <button key={s.hour} type="button" className={`slot${s.peak ? ' peak' : ''}`}
                  aria-pressed={s.selected} disabled={!s.available} onClick={() => pickSlot(c.id, s.hour)}>
                  {hh(s.hour)}<small>{s.caption}</small>
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="legend">
        <span>✨ Bingkai Emas: Jam Sibuk / Dynamic Surge</span>
        <span>🚫 Dicoret: Sudah Dipesan / Jadwal Rutin Member / Maintenance</span>
      </p>
    </div>
  );
}
