import { SectionHeading } from './SectionHeading';

export function PricingSection() {
  return (
    <section id="harga">
      <div className="wrap">
        <SectionHeading title="Harga & Keanggotaan" description="Tarif transparan dengan dukungan sistem Member Tetap dan jadwal rutin mingguan." />
        <div className="grid3">
          <div className="plan">
            <h3>Reguler</h3>
            <div className="pr">Rp150rb+</div>
            <ul>
              <li>Bayar instan via QRIS, VA, atau Kartu</li>
              <li>Reschedule mandiri hingga 12 jam sebelumnya</li>
              <li>Notifikasi pengingat otomatis via WA</li>
            </ul>
            <a className="btn dark" href="#booking">Mulai Booking</a>
          </div>
          <div className="plan hl">
            <h3>Member Gold</h3>
            <div className="pr">Rp499rb/bln</div>
            <ul>
              <li>Diskon otomatis 15% di setiap pemesanan</li>
              <li>Gunakan ID <code>MBR-GOLD01</code> untuk uji coba</li>
              <li>Gratis sewa raket 4 kali sebulan</li>
            </ul>
            <a className="btn" href="#booking">Coba ID Member</a>
          </div>
          <div className="plan">
            <h3>Member VIP / Komunitas</h3>
            <div className="pr">Rp1,2jt/bln</div>
            <ul>
              <li>Jadwal tetap mingguan terkunci otomatis</li>
              <li>Diskon 25% (Gunakan ID <code>MBR-VIP01</code>)</li>
              <li>Pelatih 1 sesi per bulan</li>
            </ul>
            <a className="btn dark" href="#booking">Coba ID VIP</a>
          </div>
        </div>
      </div>
    </section>
  );
}
