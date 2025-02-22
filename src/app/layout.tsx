import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eric Tuovila",
  description: "Eric Tuovila's homepage",
  icons: {
    icon: [
      { url: '/images/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/favicon.ico', sizes: '32x32 16x16', type: 'image/x-icon' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" sizes="32x32" />
        <link rel="icon" type="image/png" href="/images/icon-192x192.png" sizes="192x192" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
