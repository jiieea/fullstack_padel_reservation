import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';

const body = Jost({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' });
const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: 'Padelia - Booking Lapangan Padel & Sistem Manajemen',
  description: 'Booking lapangan padel real-time, pembayaran instan, reschedule mandiri, dan portal manajemen.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${body.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
