import './globals.css';
import Header from '@/components/Header';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'NIL Influencer Marketplace',
  description:
    'Connecting small businesses with student-athletes for impactful marketing campaigns powered by AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
