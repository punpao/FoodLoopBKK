import type { Metadata, Viewport } from 'next';
import { Anuphan, Mitr } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

// Both families cover Thai and Latin. next/font self-hosts them at build time,
// so the running app makes no request to Google.
const anuphan = Anuphan({ subsets: ['thai', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-anuphan', display: 'swap' });
const mitr = Mitr({ subsets: ['thai', 'latin'], weight: ['400', '500', '600'], variable: '--font-mitr', display: 'swap' });

export const metadata: Metadata = {
  title: 'FoodLoopBKK · ต้นแบบ',
  description: 'ต้นแบบแอป FoodLoopBKK เปลี่ยนการลดขยะอาหารให้เป็นนิสัยประจำวันของคนกรุงเทพฯ',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#2A6419' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={`${anuphan.variable} ${mitr.variable}`}>
      <body>{children}</body>
    </html>
  );
}
