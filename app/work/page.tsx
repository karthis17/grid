import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { galleryRows } from "@/lib/GalleryItems";

const siteUrl = "https://luciddream.co.in";
const worksOgImage = `${siteUrl}/gallery/01_MOAD_Tahr_01.webp`;

export const metadata: Metadata = {
  title: "Works",
  description:
    "Explore selected architectural CGI stills, animations, real-time renderings, and spatial visual experiences crafted for architects and developers across India and worldwide.",
  keywords: [
    "architecture visualization portfolio",
    "CGI architecture gallery",
    "archviz projects India",
    "3D architectural rendering Pune",
    "architectural animations Chennai",
    "Lucid Dream works",
    "real-time CG buildings",
  ],
  alternates: {
    canonical: `${siteUrl}/work`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/work`,
    siteName: "Lucid Dream",
    title: "Works | Lucid Dream — Architecture Visualization Studio",
    description:
      "Explore selected architectural CGI stills, animations, real-time renderings, and design visualizations crafted by Lucid Dream Studio.",
    images: [
      {
        url: worksOgImage,
        width: 1440,
        height: 1440,
        alt: "Lucid Dream — Selected Architectural Works",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Works | Lucid Dream — Architecture Visualization Studio",
    description:
      "Explore architectural CGI stills, animations, real-time renderings, and design visualizations crafted by Lucid Dream Studio.",
    images: [worksOgImage],
  },
};

const worksJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/work#webpage`,
      url: `${siteUrl}/work`,
      name: "Works | Lucid Dream Architecture Visualization Portfolio",
      description:
        "Selected architectural visualization portfolio items and case studies.",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: "Lucid Dream",
        url: siteUrl,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/work#breadcrumb`,
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
          name: "Works",
          item: `${siteUrl}/work`,
        },
      ],
    },
  ],
};

export default function Works() {
  return (
    <div className="">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(worksJsonLd),
        }}
      />
      <GalleryGrid rows={galleryRows} priority />
    </div>
  );
}