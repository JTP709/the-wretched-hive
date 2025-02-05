import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./Navigation";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Wretched Hive",
  description: "Your go-to hub for scum and villainy essentials",
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
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <div className="w-full flex justify-center">
            <span className="font-bold text-4xl">The Wretched Hive</span>
          </div>
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <Navigation />
            <Providers>
              {children}
            </Providers>
          </main>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          </footer>
        </div>
      </body>
    </html>
  );
}
