import './globals.css';
import Header from '@/components/Header';
import { DM_Sans } from 'next/font/google';
import { StyledEngineProvider } from '@mui/material/styles';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'VarsityLink',
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
      <body id="__next" className={dmSans.className}>
        <StyledEngineProvider injectFirst>
          <Header />
          <main>{children}</main>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
