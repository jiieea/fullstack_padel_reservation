'use client';

import { DOW_SHORT } from '@/constants';
import { useCalendar } from '@/hooks/useCalendar';

export function CalendarWidget() {
  const cal = useCalendar();
  return (
    <div className="cal-widget" aria-label="Kalender Interaktif">
      <div className="cal-head">
        <button type="button" onClick={cal.prevMonth} aria-label="Bulan sebelumnya">‹</button>
        <strong>{cal.monthLabel || '\u00A0'}</strong>
        <button type="button" onClick={cal.nextMonth} aria-label="Bulan berikutnya">›</button>
      </div>
      <div className="cal-grid">
        {DOW_SHORT.map(w => <div key={w} className="dow">{w}</div>)}
        {Array.from({ length: cal.leadingBlanks }, (_, i) => <div key={`b${i}`} />)}
        {cal.days.map(d => (
          <button key={d.iso} type="button" className="cal-day" aria-pressed={d.isSelected} disabled={d.isPast} onClick={() => cal.selectDate(d.iso)}>
            <span>{d.day}</span>
            {!d.isPast && <span className={`occ-dot occ-${d.level}`} />}
          </button>
        ))}
      </div>
      <div className="legend" style={{ fontSize: 11, justifyContent: 'center', marginTop: 10 }}>
        <span>🟢 Lengang</span><span>🟡 Sedang</span><span>🔴 Padat</span>
      </div>
    </div>
  );
}
