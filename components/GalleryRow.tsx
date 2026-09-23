"use client";

import Image from "next/image";
import { getMediaType, type GalleryItem } from "@/lib/GalleryItems";
import { useLayoutEffect, useRef, useState } from "react";

export type RowVariant =
  | "feature-left"
  | "feature-right"
  | "hero"
  | "quad"
  | "duo"
  | "trio"
  | "auto";

export type RowEntry = {
  item: GalleryItem;
  index: number;
};

function getRatio(item: GalleryItem): number {
  if (item.width && item.height) {
    return item.width / item.height;
  }
  return 1.5;
}

type CellProps = {
  entry: RowEntry;
  className?: string;
  priority?: boolean;
  mediaHeight?: number;
  cover?: boolean;
  /** Actual rendered width of this cell, for a correctly-sized image fetch. */
  sizes?: string;
};

function Cell({
  entry,
  className = "",
  priority = false,
  mediaHeight,
  cover = false,
  sizes = "(max-width: 640px) 100vw, 66vw",
}: CellProps) {
  const { item, index } = entry;
  const isVideo = getMediaType(item) === "video";

  return (
    <div
      className={`gallery-item group block min-w-0 cursor-pointer ${className}`}
    >
      <div
        className="gallery-media relative overflow-hidden"
        style={mediaHeight ? { height: `${mediaHeight}px` } : undefined}
      >
        {isVideo ? (
          <video
            src={item.src}
            poster={item.poster}
            muted
            loop
            playsInline
            preload={priority ? "metadata" : "none"}
            className={
              cover
                ? "gallery-image absolute inset-0 h-full w-full object-cover"
                : "gallery-image block h-auto w-full"
            }
          />
        ) : (
          <Image
            src={item.src}
            alt={item.title}
            width={item.width ?? 1200}
            height={item.height ?? 800}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            sizes={sizes}
            className={
              cover
                ? "gallery-image absolute inset-0 h-full w-full object-cover"
                : "gallery-image block h-auto w-full"
            }
          />
        )}

        <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/6" />

        {isVideo && (
          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white">
            <svg
              viewBox="0 0 24 24"
              width="10"
              height="10"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}

        <div style={{ backgroundColor: item.overlayColor }} className={`opacity-0 text-white/*** absolute inset-0  transition-all group-hover:translate-y-0 group-hover:opacity-100`}>
          <div className="flex h-full justify-center items-center  gap-4">
            <h2 className="text-xl font-medium tracking-[-0.01em] ] ">
              {item.title}
            </h2>
            <span className="shrink-0 font-mono text-lg uppercase">
              {item.meta}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const FEATURE_GAP = 16;

function FeatureRowInner({
  big,
  small1,
  small2,
  bigRatio,
  reverse,
  prioritySrcs,
}: {
  big: RowEntry;
  small1: RowEntry;
  small2: RowEntry;
  bigRatio: number;
  reverse: boolean;
  prioritySrcs?: Set<string>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => setWidth(element.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const hasWidth = width > 0;
  const availableWidth = Math.max(width - FEATURE_GAP, 0);
  const bigWidth = availableWidth * (2 / 3);
  const smallWidth = availableWidth * (1 / 3);
  const rowHeight = hasWidth ? bigWidth / bigRatio : 0;
  const smallHeight = hasWidth ? (rowHeight - FEATURE_GAP) / 2 : 0;

  const bigCell = (
    <Cell
      entry={big}
      priority={prioritySrcs?.has(big.item.src)}
      mediaHeight={hasWidth ? rowHeight : undefined}
      sizes="(max-width: 640px) 100vw, 66vw"
    />
  );

  const smallColumn = (
    <div
      className="grid min-w-0 grid-rows-2 gap-3 sm:gap-4"
      style={hasWidth ? { height: rowHeight } : undefined}
    >
      <Cell
        entry={small1}
        priority={prioritySrcs?.has(small1.item.src)}
        mediaHeight={hasWidth ? smallHeight : undefined}
        cover
        sizes="(max-width: 640px) 100vw, 33vw"
      />
      <Cell
        entry={small2}
        priority={prioritySrcs?.has(small2.item.src)}
        mediaHeight={hasWidth ? smallHeight : undefined}
        cover
        sizes="(max-width: 640px) 100vw, 33vw"
      />
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {[big, small1, small2].map((entry) => (
          <Cell
            key={entry.item.id}
            entry={entry}
            priority={prioritySrcs?.has(entry.item.src)}
            sizes="100vw"
          />
        ))}
      </div>

      {/* Desktop */}
      <div
        ref={containerRef}
        className="hidden min-w-0 sm:grid"
        style={{
          gridTemplateColumns: hasWidth
            ? reverse
              ? `${smallWidth}px ${bigWidth}px`
              : `${bigWidth}px ${smallWidth}px`
            : reverse
              ? "1fr 2fr"
              : "2fr 1fr",
          gap: `${FEATURE_GAP}px`,
        }}
      >
        {reverse ? (
          <>
            {smallColumn}
            {bigCell}
          </>
        ) : (
          <>
            {bigCell}
            {smallColumn}
          </>
        )}
      </div>
    </>
  );
}

const RATIO_ROW_SIZES: Record<number, string> = {
  2: "(max-width: 640px) 100vw, 50vw",
  3: "(max-width: 640px) 100vw, 33vw",
  4: "(max-width: 640px) 50vw, 25vw",
};

function RatioRow({
  entries,
  prioritySrcs,
}: {
  entries: RowEntry[];
  prioritySrcs?: Set<string>;
}) {
  const columns = entries.map((entry) => `${getRatio(entry.item)}fr`).join(" ");
  const sizes =
    RATIO_ROW_SIZES[entries.length] ?? "(max-width: 640px) 100vw, 50vw";

  return (
    <div
      className="grid gap-3 sm:gap-4"
      style={{ gridTemplateColumns: columns }}
    >
      {entries.map((entry) => (
        <Cell
          key={entry.item.id}
          entry={entry}
          priority={prioritySrcs?.has(entry.item.src)}
          sizes={sizes}
        />
      ))}
    </div>
  );
}

type GalleryRowProps = {
  variant: RowVariant;
  entries: RowEntry[];
  prioritySrcs?: Set<string>;
};

export default function GalleryRow({
  variant,
  entries,
  prioritySrcs,
}: GalleryRowProps) {
  if (!entries.length) return null;

  if (variant === "hero") {
    return (
      <div className="grid">
        <Cell
          entry={entries[0]}
          priority={prioritySrcs?.has(entries[0].item.src)}
          sizes="100vw"
        />
      </div>
    );
  }

  if (
    variant === "duo" ||
    variant === "trio" ||
    variant === "quad" ||
    variant === "auto"
  ) {
    return <RatioRow entries={entries} prioritySrcs={prioritySrcs} />;
  }

  if (variant === "feature-left" || variant === "feature-right") {
    return (
      <FeatureRow
        entries={entries}
        reverse={variant === "feature-right"}
        prioritySrcs={prioritySrcs}
      />
    );
  }

  return null;
}

function FeatureRow({
  entries,
  reverse,
  prioritySrcs,
}: {
  entries: RowEntry[];
  reverse: boolean;
  prioritySrcs?: Set<string>;
}) {
  const [big, small1, small2] = entries;
  if (!big || !small1 || !small2) return null;

  const bigRatio = getRatio(big.item);

  return (
    <FeatureRowInner
      big={big}
      small1={small1}
      small2={small2}
      bigRatio={bigRatio}
      reverse={reverse}
      prioritySrcs={prioritySrcs}
    />
  );
}
