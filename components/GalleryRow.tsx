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

type CellHandlers = {
  onOpen: (index: number) => void;
  registerMediaRef: (index: number, el: HTMLDivElement | null) => void;
  registerVideoRef: (index: number, el: HTMLVideoElement | null) => void;
};

type CellProps = CellHandlers & {
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
  onOpen,
  registerMediaRef,
  registerVideoRef,
  className = "",
  priority = false,
  mediaHeight,
  cover = false,
  sizes = "(max-width: 640px) 100vw, 66vw",
}: CellProps) {
  const { item, index } = entry;
  const isVideo = getMediaType(item) === "video";

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onOpen(index);
      }}
      className={`gallery-item group block min-w-0 cursor-pointer ${className}`}
    >
      <div
        ref={(el) => registerMediaRef(index, el)}
        className="gallery-media relative overflow-hidden"
        style={mediaHeight ? { height: `${mediaHeight}px` } : undefined}
      >
        {isVideo ? (
          <video
            ref={(el) => registerVideoRef(index, el)}
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

        <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/[0.06]" />

        <span className="absolute left-3 top-3 rounded bg-black/55 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white md:left-4 md:top-4">
          {item.no}
        </span>

        {isVideo && (
          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white">
            <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}

        <span className="absolute bottom-4 right-4 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Image src="/zoom-in.svg" alt="" width={16} height={16} />
        </span>
      </div>

      <div className="gallery-caption border-t border-black/15 pt-2.5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[13px] font-medium tracking-[-0.01em] text-[#17170F] md:text-[14px]">
            {item.title}
          </h2>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-black/40">
            {item.meta}
          </span>
        </div>
      </div>
    </a>
  );
}

const FEATURE_GAP = 16;

function FeatureRowInner({
  big,
  small1,
  small2,
  bigRatio,
  reverse,
  handlers,
  prioritySrcs,
}: {
  big: RowEntry;
  small1: RowEntry;
  small2: RowEntry;
  bigRatio: number;
  reverse: boolean;
  handlers: CellHandlers;
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
      {...handlers}
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
        {...handlers}
      />
      <Cell
        entry={small2}
        priority={prioritySrcs?.has(small2.item.src)}
        mediaHeight={hasWidth ? smallHeight : undefined}
        cover
        sizes="(max-width: 640px) 100vw, 33vw"
        {...handlers}
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
            {...handlers}
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
  handlers,
  prioritySrcs,
}: {
  entries: RowEntry[];
  handlers: CellHandlers;
  prioritySrcs?: Set<string>;
}) {
  const columns = entries.map((entry) => `${getRatio(entry.item)}fr`).join(" ");
  const sizes = RATIO_ROW_SIZES[entries.length] ?? "(max-width: 640px) 100vw, 50vw";

  return (
    <div className="grid gap-3 sm:gap-4" style={{ gridTemplateColumns: columns }}>
      {entries.map((entry) => (
        <Cell
          key={entry.item.id}
          entry={entry}
          priority={prioritySrcs?.has(entry.item.src)}
          sizes={sizes}
          {...handlers}
        />
      ))}
    </div>
  );
}

type GalleryRowProps = CellHandlers & {
  variant: RowVariant;
  entries: RowEntry[];
  prioritySrcs?: Set<string>;
};

export default function GalleryRow({
  variant,
  entries,
  prioritySrcs,
  ...handlers
}: GalleryRowProps) {
  if (!entries.length) return null;

  if (variant === "hero") {
    return (
      <div className="grid">
        <Cell
          entry={entries[0]}
          priority={prioritySrcs?.has(entries[0].item.src)}
          sizes="100vw"
          {...handlers}
        />
      </div>
    );
  }

  if (variant === "duo" || variant === "trio" || variant === "quad" || variant === "auto") {
    return <RatioRow entries={entries} handlers={handlers} prioritySrcs={prioritySrcs} />;
  }

  if (variant === "feature-left" || variant === "feature-right") {
    return (
      <FeatureRow
        entries={entries}
        reverse={variant === "feature-right"}
        handlers={handlers}
        prioritySrcs={prioritySrcs}
      />
    );
  }

  return null;
}

function FeatureRow({
  entries,
  reverse,
  handlers,
  prioritySrcs,
}: {
  entries: RowEntry[];
  reverse: boolean;
  handlers: CellHandlers;
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
      handlers={handlers}
      prioritySrcs={prioritySrcs}
    />
  );
}