"use client";

import Image from "next/image";
import { GalleryItem } from "@/lib/GalleryItems";
import { useCallback, useRef, useState } from "react";
import GalleryViewer from "@/components/GalleryViewer";

// Cycle of vertical offsets (px) applied to each column independently.
// Tweak these numbers (or wire up a real `offset` field on GalleryItem)
// to match the exact stagger you want per item.
const OFFSET_CYCLE_L = [0, 160, 40, 220];
const OFFSET_CYCLE_R = [64, 0, 200, 32];

function getOffset(index: number, cycle: number[]) {
  return cycle[index % cycle.length];
}

// Pure presentational — no state, just renders the media and forwards
// the click + the ref the parent needs for the FLIP open animation.
function GalleryMedia({
  item,
  onClick,
  mediaRef,
}: {
  item: GalleryItem;
  onClick: () => void;
  mediaRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={mediaRef} onClick={onClick} className="cursor-pointer">
      {item.type === "video" ? (
        <video controls className="w-full h-auto">
          <source src={item.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Image
          width={1440}
          height={920}
          src={item.src}
          alt={item.title ?? item.meta}
          className="w-full h-auto"
        />
      )}
    </div>
  );
}

export default function GalleryGrid1({
  itemsR,
  itemsL,
}: {
  itemsR: GalleryItem[];
  itemsL: GalleryItem[];
}) {
  // Flat list, left column first then right column — this is the order
  // GalleryViewer will step through with next/prev.
  const items = [...itemsL, ...itemsR];

  const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);
  const originRectRef = useRef<DOMRect | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openImage = useCallback((index: number) => {
    const mediaEl = mediaRefs.current[index];
    if (!mediaEl) return;

    originRectRef.current = mediaEl.getBoundingClientRect();
    setOpenIndex(index);
  }, []);

  const closeViewer = useCallback(() => {
    setOpenIndex(null);
  }, []);

  return (
    <>
      <div className="grid max-w-7xl grid-cols-2 mx-auto gap-x-10">
        {/* Left column — global indices 0..itemsL.length-1 */}
        <div className="flex flex-col gap-24">
          {itemsL.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="relative"
              style={{ marginTop: getOffset(index, OFFSET_CYCLE_L) }}
            >
              <GalleryMedia
                item={item}
                onClick={() => openImage(index)}
                mediaRef={(el) => {
                  mediaRefs.current[index] = el;
                }}
              />
            </div>
          ))}
        </div>

        {/* Right column — global indices continue after itemsL */}
        <div className="flex flex-col gap-24">
          {itemsR.map((item, index) => {
            const globalIndex = itemsL.length + index;
            return (
              <div
                key={`${item.id}-${index}`}
                className="relative"
                style={{ marginTop: getOffset(index, OFFSET_CYCLE_R) }}
              >
                <GalleryMedia
                  item={item}
                  onClick={() => openImage(globalIndex)}
                  mediaRef={(el) => {
                    mediaRefs.current[globalIndex] = el;
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {openIndex !== null && (
        <GalleryViewer
          items={items}
          initialIndex={openIndex}
          originRect={originRectRef.current}
          onClose={closeViewer}
        />
      )}
    </>
  );
}
