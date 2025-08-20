import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans } from "next/font/google";
import { TrackingProvider } from "@/../context/TrackingContext";
import { Footer, Navbar } from "@/components";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
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
      <body className={`${notoSans.className}  antialiased`}>
        <TrackingProvider>
          <Navbar />
          <main className="px-10 md:px-20">{children}</main>
          <Footer />
        </TrackingProvider>
      </body>
    </html>
  );
}
