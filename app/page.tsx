
import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { galleryItems } from "@/lib/GalleryItems";
import { ClientsList } from "@/lib/ClientList";
import Clients from "@/components/Clients";

const siteUrl = "https://luciddream.co.in";
const ogImage = `${siteUrl}${galleryItems[0].src}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lucid Dream — Architecture Visualization Studio",
    template: "%s | Lucid Dream",
  },
  description:
    "Lucid Dream is a Chennai-based architecture visualization studio crafting CGI stills, films, real-time rendering, and brand storytelling for architects and design firms across India since 2012.",
  keywords: [
    "architecture visualization",
    "3D rendering studio",
    "CGI architecture",
    "real-time CG",
    "archviz India",
    "architectural animation",
    "Lucid Dream studio",
    "architecture films Chennai",
    "3D visualization Pune",
    "design branding studio",
  ],
  authors: [{ name: "Arun Babu", url: siteUrl }],
  creator: "Lucid Dream",
  publisher: "Lucid Dream",
  applicationName: "Lucid Dream",
  category: "Architecture & Design",

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Lucid Dream",
    title: "Lucid Dream — Architecture Visualization Studio",
    description:
      "A creative studio crafting compelling architectural visuals — CGI stills, animation, real-time rendering, and brand identity for architects since 2012.",
    images: [
      {
        url: ogImage,
        width: 1400,
        height: 900,
        alt: "Lucid Dream — architecture visualization work",
      },
    ],
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "Lucid Dream — Architecture Visualization Studio",
    description:
      "Architecture visualization, CGI, and animation studio working with architects across India since 2012.",
    images: [ogImage],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};
export default function DPage() {
  return (
    <main>
      <GalleryGrid items={galleryItems} />
      <Clients clients={ClientsList} />
    </main>
  );
}
