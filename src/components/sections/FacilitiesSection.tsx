import { SectionHeading } from './SectionHeading';

const FACILITIES = [
  ['Kaca Panoramic', 'Dinding kaca tempered 12 mm standar FIP di semua court.'],
  ['Lampu LED Turnamen', 'Pencahayaan 500 lux tanpa silau untuk permainan malam.'],
  ['Pro Shop & Sewa Alat', 'Raket karbon, bola bertekanan baru, dan overgrip tersedia.'],
  ['Locker & Hot Shower', 'Ruang ganti privat dengan air hangat dan handuk bersih.'],
];

export function FacilitiesSection() {
  return (
    <section id="fasilitas" className="alt">
      <div className="wrap">
        <SectionHeading title="Fasilitas Klub" />
        <div className="fac">
          {FACILITIES.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}
        </div>
      </div>
    </section>
  );
}
