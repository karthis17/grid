import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SmoothScrollProvider from "@/components/SmothScrollProvider";
import IntroAnimation from "@/components/IntroComponent";
// import SmoothScrollProvider from "@/components/SmothScrollProvider";
// import { GradualBlur } from "@/components/blur/Blurbar";
import localFont from 'next/font/local';

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
    <html
      lang="en"
      className={`${fraunces.variable}  ${helvetica.variable} `}
    >
      <body>
        <Header />
              <IntroAnimation />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
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
