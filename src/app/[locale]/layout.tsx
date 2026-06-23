import type { Metadata } from 'next';
import { Poppins, Roboto, Caveat } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/ThemeProvider';
import { GlobalDialogProvider } from '@/components/providers/GlobalDialogProvider';
import { QueryProvider } from '@/components/providers/query-provider';

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

const caveat = Caveat({
  weight: ['400', '500', '600', '700'],
  variable: '--font-caveat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Karsa',
  description: 'Your AI-Powered Productivity Assistant',
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }>,
) {
  const { children, params } = props;
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${roboto.variable} ${poppins.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <GlobalDialogProvider>{children}</GlobalDialogProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
