"use client";

import { memo, useCallback, useRef, useState } from "react";
import Image from "next/image";
import { getMediaType, type GalleryItem } from "@/lib/GalleryItems";

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
  if (item.width && item.height) return item.width / item.height;
  return 1.5;
}

type CellProps = {
  entry: RowEntry;
  priority?: boolean;
  /** Stretch to the parent's height (small feature column). */
  fill?: boolean;
  /** Override aspect ratio (big feature cell). Defaults to the item's own ratio. */
  ratio?: number;
  sizes?: string;
};

const Cell = memo(function Cell({
  entry,
  priority = false,
  fill = false,
  ratio,
  sizes = "(max-width: 640px) 100vw, 66vw",
}: CellProps) {
  const { item } = entry;
  const isVideo = getMediaType(item) === "video";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [overlayActive, setOverlayActive] = useState(false);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      if (v.preload === "none") v.preload = "auto";
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, []);

  const handleCellClick = useCallback(() => {
    if (isVideo) {
      togglePlay();
    } else {
      setOverlayActive((prev) => !prev);
    }
  }, [isVideo, togglePlay]);

  const aspect = fill ? undefined : (ratio ?? getRatio(item));

  return (
    <div
      className={`gallery-item group min-h-0 min-w-0 cursor-pointer select-none ${
        fill ? "h-full" : ""
      }`}
      onClick={handleCellClick}
    >
      <div
        className={`relative overflow-hidden ${fill ? "h-full" : ""}`}
        style={{
          ...(aspect ? { aspectRatio: String(aspect) } : {}),
        }}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            muted
            loop
            autoPlay
            playsInline
            preload="none"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={item.src}
            alt={item.title}
            width={item.width ?? 1200}
            height={item.height ?? 800}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            quality={75}
            decoding="async"
            sizes={sizes}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        )}

        {isVideo ? (
          <span className="pointer-events-none absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition-transform duration-200 group-hover:scale-110">
            {isPlaying ? (
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </span>
        ) : (
          <div
            style={{
              backgroundColor: item.overlayColor
                ? item.overlayColor
                : "rgba(23, 23, 15, 0.85)",
            }}
            onMouseLeave={() => setOverlayActive(false)}
            className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300 ${
              overlayActive
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none group-hover:pointer-events-auto"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 text-center px-2">
              <h2 className="text-sm sm:text-base md:text-xl font-medium tracking-tight text-white drop-shadow-xs">
                {item.title}
              </h2>
              <span className="shrink-0 font-mono text-xs sm:text-sm md:text-base uppercase text-white/80">
                {item.meta}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

const FeatureRow = memo(function FeatureRow({
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

  const bigCell = (
    <Cell
      entry={big}
      priority={prioritySrcs?.has(big.item.src)}
      ratio={getRatio(big.item)}
      sizes="(max-width: 640px) 100vw, 66vw"
    />
  );

  const smallColumn = (
    <div className="grid min-h-0 min-w-0 grid-rows-2 gap-4">
      {[small1, small2].map((entry) => (
        <Cell
          key={entry.item.id}
          entry={entry}
          priority={prioritySrcs?.has(entry.item.src)}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {entries.slice(0, 3).map((entry) => (
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
        className={`hidden min-w-0 gap-4 sm:grid ${
          reverse ? "grid-cols-[1fr_2fr]" : "grid-cols-[2fr_1fr]"
        }`}
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
});

const RATIO_ROW_SIZES: Record<number, string> = {
  2: "(max-width: 640px) 100vw, 50vw",
  3: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  4: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
};

const RatioRow = memo(function RatioRow({
  entries,
  prioritySrcs,
}: {
  entries: RowEntry[];
  prioritySrcs?: Set<string>;
}) {
  const isQuad = entries.length >= 4;
  const isTrio = entries.length === 3;
  const columns = entries.map((e) => `${getRatio(e.item)}fr`).join(" ");
  const sizes =
    RATIO_ROW_SIZES[entries.length] ?? "(max-width: 640px) 100vw, 50vw";

  return (
    <>
      {/* Mobile & Tablet (< md): clean stacked or 2-col responsive layout */}
      <div
        className={`grid gap-3 sm:gap-4 md:hidden ${
          isQuad
            ? "grid-cols-1 sm:grid-cols-2"
            : isTrio
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {entries.map((entry) => (
          <Cell
            key={entry.item.id}
            entry={entry}
            priority={prioritySrcs?.has(entry.item.src)}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ))}
      </div>

      {/* Desktop (md and above): exact proportional architectural grid */}
      <div
        className="hidden md:grid md:gap-4"
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
    </>
  );
});

type GalleryRowProps = {
  variant: RowVariant;
  entries: RowEntry[];
  prioritySrcs?: Set<string>;
};

function GalleryRow({ variant, entries, prioritySrcs }: GalleryRowProps) {
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

  if (variant === "feature-left" || variant === "feature-right") {
    return (
      <FeatureRow
        entries={entries}
        reverse={variant === "feature-right"}
        prioritySrcs={prioritySrcs}
      />
    );
  }

  // duo | trio | quad | auto
  return <RatioRow entries={entries} prioritySrcs={prioritySrcs} />;
}

export default memo(GalleryRow);
