import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Sabarisan Transport | Direct Goods Transport & Shifting from Erode',
  description:
    'Sabarisan Transport - Reliable goods transport and house shifting from Erode across all districts of Tamil Nadu, Karnataka & Kerala. Transparent per-KM pricing, instant calculator, and real-time shipment tracking.',
  keywords: [
    'Sabarisan Transport',
    'Sabarisan Transport Erode',
    'Transport service in Erode',
    'Goods transport from Erode',
    'Home shifting Erode',
    'Office shifting Erode',
    'Cargo transport Tamil Nadu',
    'Transport Tamil Nadu Karnataka Kerala',
    'Lorry booking Erode',
  ],
  authors: [{ name: 'Sabarisan Transport' }],
  openGraph: {
    title: 'Sabarisan Transport | Tamil Nadu • Karnataka • Kerala',
    description: 'Direct goods transport and shifting services from Erode with transparent per-KM rates.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#e11d48',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen antialiased selection:bg-rose-500 selection:text-white`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
