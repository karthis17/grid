import type { Metadata } from "next";

const siteUrl = "https://luciddream.co.in";
const aboutOgImage = `${siteUrl}/gallery/04_Perkins&Eastman_Genet_City_01.webp`;

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Lucid Dream, a multidisciplinary architecture visualization studio founded in 2012 by architect Arun Babu. Crafting CGI stills, architectural films, real-time rendering, and immersive spatial narratives.",
  keywords: [
    "About Lucid Dream",
    "Arun Babu architect",
    "archviz team Chennai",
    "architecture visualization India",
    "multidisciplinary CGI studio",
    "architectural storytelling",
    "3D animation studio Pune",
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/about`,
    siteName: "Lucid Dream",
    title: "About | Lucid Dream — Architecture Visualization Studio",
    description:
      "A multidisciplinary creative studio building compelling narratives, believable spaces, and memorable architectural visual experiences since 2012.",
    images: [
      {
        url: aboutOgImage,
        width: 1440,
        height: 800,
        alt: "Lucid Dream Studio — About Us",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Lucid Dream — Architecture Visualization Studio",
    description:
      "A multidisciplinary creative studio building compelling narratives, believable spaces, and memorable architectural visual experiences since 2012.",
    images: [aboutOgImage],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteUrl}/about#webpage`,
      url: `${siteUrl}/about`,
      name: "About Lucid Dream",
      description:
        "Multidisciplinary architecture visualization studio founded in 2012 by Arun Babu.",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: "Lucid Dream",
        url: siteUrl,
      },
      mainEntity: {
        "@type": "ProfessionalService",
        name: "Lucid Dream",
        url: siteUrl,
        founder: {
          "@type": "Person",
          name: "Arun Babu",
          jobTitle: "Founder & Partner-Architect",
        },
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/about#breadcrumb`,
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
          name: "About",
          item: `${siteUrl}/about`,
        },
      ],
    },
  ],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutJsonLd),
        }}
      />
      {children}
    </>
  );
}

