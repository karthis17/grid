import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { labItems, labRows } from "@/lib/labItem";

const siteUrl = "https://luciddream.co.in";
const labOgImage = `${siteUrl}/lab-image/Lab_01.webp`;

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Experimental visuals, research, real-time animation, and creative CGI studies by Lucid Dream Lab.",
  keywords: [
    "creative lab",
    "architecture experiments",
    "CGI research",
    "real-time animations",
    "Lucid Dream Lab",
    "3D animation studies",
  ],
  alternates: {
    canonical: `${siteUrl}/lab`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/lab`,
    siteName: "Lucid Dream",
    title: "Lab | Lucid Dream — Architecture Visualization Studio",
    description:
      "Experimental visuals, research, real-time animation, and creative CGI studies by Lucid Dream Lab.",
    images: [
      {
        url: labOgImage,
        width: 1920,
        height: 1920,
        alt: "Lucid Dream Lab — Creative Experiments",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lab | Lucid Dream — Architecture Visualization Studio",
    description:
      "Experimental visuals, research, real-time animation, and creative CGI studies by Lucid Dream Lab.",
    images: [labOgImage],
  },
};

const labJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/lab#webpage`,
      url: `${siteUrl}/lab`,
      name: "Lab | Lucid Dream Creative Studies",
      description:
        "Experimental visuals, research, real-time animation, and creative CGI studies.",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: "Lucid Dream",
        url: siteUrl,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/lab#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Lab",
          item: `${siteUrl}/lab`,
        },
      ],
    },
  ],
};

export default function LabPage() {
  return (
    <div className="">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(labJsonLd),
        }}
      />
      <GalleryGrid rows={labRows} priority />
    </div>
  );
}