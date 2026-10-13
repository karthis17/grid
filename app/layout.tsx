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

const siteUrl = "https://luciddream.co.in";
const defaultOgImage = `${siteUrl}/gallery/01_MOAD_Tahr_01.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lucid Dream — Architecture Visualization Studio",
    template: "%s | Lucid Dream",
  },
  description:
    "Lucid Dream is a premier architecture visualization studio crafting CGI stills, films, real-time rendering, and brand storytelling for architects across India since 2012.",
  keywords: [
    "architecture visualization",
    "3D architectural rendering",
    "CGI architecture",
    "real-time CG",
    "archviz India",
    "architectural animation",
    "architecture films Chennai",
    "architectural storytelling",
    "3D visualization Pune",
    "Lucid Dream studio",
  ],
  authors: [{ name: "Arun Babu", url: siteUrl }],
  creator: "Lucid Dream",
  publisher: "Lucid Dream",
  applicationName: "Lucid Dream",
  category: "Architecture & Design",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Lucid Dream",
    title: "Lucid Dream — Architecture Visualization Studio",
    description:
      "A creative studio crafting compelling architectural visuals — CGI stills, animation, real-time rendering, and brand identity for architects since 2012.",
    images: [
      {
        url: defaultOgImage,
        width: 1440,
        height: 1440,
        alt: "Lucid Dream — Architecture Visualization Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucid Dream — Architecture Visualization Studio",
    description:
      "Architecture visualization, CGI, and animation studio working with architects across India since 2012.",
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Lucid Dream",
  alternateName: "Lucid Dream Studio",
  url: siteUrl,
  logo: `${siteUrl}/LogoWhite.png`,
  image: defaultOgImage,
  description:
    "Lucid Dream is a premier architecture visualization studio crafting CGI stills, films, real-time rendering, and brand storytelling for architects across India since 2012.",
  foundingDate: "2012",
  founder: {
    "@type": "Person",
    name: "Arun Babu",
    jobTitle: "Founder & Partner-Architect",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  email: "info@luciddream.co.in",
  sameAs: [
    "https://www.instagram.com/luciddream_studio",
    "https://www.behance.net/Luciddream_ar",
    "https://vimeo.com/user5118274",
    "https://linkedin.com/company/luciddream",
  ],
  priceRange: "$$$",
  knowsAbout: [
    "Architecture Visualization",
    "3D Rendering",
    "Architectural Animation",
    "Real-time CGI",
    "Architectural CGI",
    "Brand Storytelling",
  ],
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
          href="/LogoWhite.png"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/frames/frame_0001.jpg"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
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
