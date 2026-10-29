import { BookingControls } from '../booking/BookingControls';
import { CalendarWidget } from '../booking/CalendarWidget';
import { CourtList } from '../booking/CourtList';
import { OrderSummary } from '../booking/OrderSummary';
import { SectionHeading } from './SectionHeading';

/** Server component shell; interactive pieces are client components. */
export function BookingSection() {
  return (
    <section id="booking">
      <div className="wrap">
        <SectionHeading
          title="Self-Service Booking & Kalender Interaktif"
          description="Pilih tanggal dari kalender bulanan, cek indikator kepadatan lapangan, dan kunci jadwal Anda secara instan." />
        <div className="cal-top">
          <CalendarWidget />
          <BookingControls />
        </div>
        <div className="layout">
          <CourtList />
          <OrderSummary />
        </div>
      </div>
    </section>
  );
}
