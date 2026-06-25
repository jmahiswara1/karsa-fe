import { Poppins, Roboto } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
  subsets: ['latin'],
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  variable: '--font-sans',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${roboto.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
