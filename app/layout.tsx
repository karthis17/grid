import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
// import SmoothScrollProvider from "@/components/SmothScrollProvider";
// import { GradualBlur } from "@/components/blur/Blurbar";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
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
    <html
      lang="en"
      className={`${fraunces.variable} ${plexMono.variable} ${inter.variable}`}
    >
      <body>
        <Header />

        {children}
        {/* <section style={{position: 'fixed',height: 500,overflow: 'hidden', zIndex: 9999, bottom: 0, left: 0, right: 0, pointerEvents: 'none'}}>


  <GradualBlur
    target="parent"
    position="bottom"
    height="5rem"
    strength={1}
    divCount={3}
    opacity={1}
  />
</section> */}
        <Footer />
      </body>
    </html>
  );
}
