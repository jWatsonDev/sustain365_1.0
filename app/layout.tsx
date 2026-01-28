import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sustain365',
  description: '6-week challenge tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
