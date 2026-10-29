import { Footer } from './layout/Footer';
import { Header } from './layout/Header';
import { MyBookingsSection } from './mine/MyBookingsSection';
import { BookingSection } from './sections/BookingSection';
import { FacilitiesSection } from './sections/FacilitiesSection';
import { FaqSection } from './sections/FaqSection';
import { Hero } from './sections/Hero';
import { PricingSection } from './sections/PricingSection';

/** Public/member portal. Static sections stay server components. */
export function MemberPortal() {
  return (
    <div id="memberApp">
      <Header />
      <main>
        <Hero />
        <BookingSection />
        <MyBookingsSection />
        <PricingSection />
        <FacilitiesSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
