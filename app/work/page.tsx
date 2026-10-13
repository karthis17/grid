import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { galleryItems } from "@/lib/GalleryItems";

export const metadata: Metadata = {
  title: "Works | Lucid Dream — Architecture Visualization Studio",
  description:
    "Explore architecture visualization projects, CGI stills, 3D animations, and real-time renderings crafted by Lucid Dream Studio.",
};

export default function Works() {
  return (
    <div className="">
      <GalleryGrid items={galleryItems} priority />
    </div>
  );
}