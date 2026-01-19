import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = 'https://www.your-domain.com'; // Placeholder - CHANGE THIS

export const metadata: Metadata = {
  title: {
    default: 'RippleChat | Seamless Communication, Always Connected',
    template: '%s | RippleChat',
  },
  description: 'RippleChat is a modern, real-time chat application designed for fast, secure, and engaging conversations. Share messages, images, and ephemeral stories instantly. Built with Next.js and Firebase.',
  keywords: ['chat', 'real-time', 'messaging', 'stories', 'firebase', 'nextjs', 'communication'],
  authors: [{ name: 'RippleChat' }],
  creator: 'Firebase Studio',
  metadataBase: new URL(siteUrl),

  openGraph: {
    title: 'RippleChat | Seamless Communication, Always Connected',
    description: 'Join the conversation on RippleChat, a modern platform for real-time messaging and story sharing.',
    url: siteUrl,
    siteName: 'RippleChat',
    images: [
      {
        url: 'https://placehold.co/1200x630/64B5F6/FFFFFF/png?text=RippleChat',
        width: 1200,
        height: 630,
        alt: 'RippleChat Logo'
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RippleChat | Seamless Communication, Always Connected',
    description: 'Join the conversation on RippleChat, a modern platform for real-time messaging and story sharing.',
    images: ['https://placehold.co/1200x630/64B5F6/FFFFFF/png?text=RippleChat'],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
