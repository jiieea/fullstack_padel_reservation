export const rp = (n: number): string => 'Rp' + Math.round(n).toLocaleString('id-ID');
export const rpThousands = (n: number): string => `${rp(n / 1000)}rb`;
export const hh = (h: number): string => `${String(h).padStart(2, '0')}.00`;
export const toIso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const fromIso = (s: string): Date => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const fmtDateFull = (d: Date): string =>
  d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const fmtIsoFull = (iso: string): string => fmtDateFull(fromIso(iso));
export const normWa = (w?: string): string => (w || '').replace(/[\s-]/g, '');
export const fmtHourRange = (hours: number[], sep = ' - '): string =>
  `${hh(Math.min(...hours))}${sep}${hh(Math.max(...hours) + 1)}`;
export const fmtCountdown = (sec: number): string => {
  const s = Math.max(0, sec);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};
