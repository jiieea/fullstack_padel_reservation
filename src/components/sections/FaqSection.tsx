import { SectionHeading } from './SectionHeading';

const FAQ = [
  ['Apakah saya harus login untuk booking?', 'Ya. Klik "Masuk / Daftar", buat akun member gratis, lalu booking dan ubah jadwal dapat dilakukan dengan akun Anda.'],
  ['Bagaimana cara kerja Self-Service Reschedule?', 'Di bagian "Booking Saya", klik tombol "Ubah Jadwal" pada tiket aktif Anda, lalu pilih tanggal dan jam baru di kalender tanpa biaya tambahan.'],
  ['Metode pembayaran apa saja yang didukung?', 'Kami mendukung QRIS instan, Virtual Account (BCA, Mandiri, BNI, BRI), dan Kartu Kredit/Debit.'],
  ['Bagaimana cara kerja Automated Reminder?', 'Sistem mengirimkan pengingat H-24 jam dan H-2 jam sebelum waktu bermain ke pusat notifikasi dan tautan WhatsApp.'],
];

export function FaqSection() {
  return (
    <section id="faq">
      <div className="wrap">
        <SectionHeading title="Pertanyaan Umum" />
        {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </div>
    </section>
  );
}
