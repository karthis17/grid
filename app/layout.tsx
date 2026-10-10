import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SmoothScrollProvider from "@/components/SmothScrollProvider";
import localFont from "next/font/local";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const helvetica = localFont({
  src: "./fonts/HelveticaNeueCyr-Bold.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-helvetica",
  display: "swap",
});

const fraunces = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Lucid Dream — Architecture Visualization Studio",
  description:
    "Lucid Dream is a premier architecture visualization studio crafting CGI stills, films, real-time rendering, and brand storytelling for architects across India since 2012.",
  metadataBase: new URL("https://luciddream.co.in"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${helvetica.variable} ${playfair.variable}`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/frames/frame_0001.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="bg-[#f7f7f4] text-[#17170F] antialiased selection:bg-[#ff5a36] selection:text-white overflow-x-hidden min-h-screen">
        <LanguageProvider>
          <Header />
          <SmoothScrollProvider>
            <main id="smooth-wrapper" className="min-h-screen">
              {children}
            </main>
          </SmoothScrollProvider>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
