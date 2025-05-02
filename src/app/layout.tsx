import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationToast from '@/components/dashboard/common/NotificationToast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Urlaub Gegen Hand - Exchange Skills for Vacation Experiences',
  description:
    'Exchange your skills for unforgettable vacation experiences around the world. Find opportunities or host travelers in a unique cultural exchange.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ProfileProvider>
            <NotificationProvider>
              {children}
              <NotificationToast />
            </NotificationProvider>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
