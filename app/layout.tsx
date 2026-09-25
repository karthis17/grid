import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SmoothScrollProvider from "@/components/SmothScrollProvider";
import IntroAnimation from "@/components/IntroComponent";
import localFont from "next/font/local";

const helvetica = localFont({
  src: "./fonts/HelveticaNeueCyr-Light.woff2",
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
    <html lang="en" className={`${fraunces.variable}  ${helvetica.variable} `}>
      <body>
        <Header />
        <IntroAnimation />
        <SmoothScrollProvider>
          <div id="smooth-wrapper">
            <div id="smooth-content">{children}</div>
          </div>
        </SmoothScrollProvider>
        <Footer />
      </body>
    </html>
  );
}
