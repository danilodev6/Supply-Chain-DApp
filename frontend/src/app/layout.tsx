import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TrackingProvider } from "@/../context/TrackingContext";
import { Footer, Navbar } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Supply Chain Web3 dApp",
  description: "A blockchain-based supply chain DApp for tracking and managing products transparently and securely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TrackingProvider>
          <Navbar />
          {children}
          <Footer />
        </TrackingProvider>
      </body>
    </html>
  );
}
