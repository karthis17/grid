import type { Metadata } from "next";
import { Fraunces, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SmoothScrollProvider from "@/components/SmothScrollProvider";
// import IntroAnimation from "@/components/IntroComponent";
import localFont from "next/font/local";

const helvetica = localFont({
  src: "./fonts/HelveticaNeueCyr-Bold.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-helvetica",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Periphery Studio",
  description: "Architecture and spatial design portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable}  ${helvetica.variable} ${playfair.variable}`}>
      <body>
        <Header />
        <SmoothScrollProvider>
          <main id="smooth-wrapper">
            {children}
          </main>
        </SmoothScrollProvider>
        <Footer />
      </body>
    </html>
  );
}
