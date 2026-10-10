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
    <div className="pt-20 md:pt-24 min-h-screen bg-[#f7f7f4]">
      <div className="bg-[#1b1b1b] w-full py-16 sm:py-20 md:py-24 px-4 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#9C6B2E] mb-2">
          Portfolio
        </span>
        <h1 className="text-white uppercase text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Selected Works
        </h1>
      </div>
      <GalleryGrid items={galleryItems} priority />
    </div>
  );
}