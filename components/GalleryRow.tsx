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

  const aspect = fill ? undefined : (ratio ?? getRatio(item));

  return (
    <div
      className={`gallery-item group min-h-0 min-w-0 cursor-pointer ${
        fill ? "h-full" : ""
      }`}
      onClick={isVideo ? togglePlay : undefined}
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
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out"
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
          style={{ backgroundColor: item.overlayColor }}
          onClick={(e) => {
            e.currentTarget.style.setProperty("opacity", "100%");
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty("opacity", "0%");
          }}
          className={`opacity-0 text-white absolute inset-0  transition-all group-hover:translate-y-0`}
        >
          <div className="flex h-full items-center justify-center gap-4">
            <h2 className="text-xl font-medium tracking-[-0.01em]">
              {item.title}
            </h2>
            <span className="shrink-0 font-mono text-lg uppercase">
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
  3: "(max-width: 640px) 100vw, 33vw",
  4: "(max-width: 640px) 50vw, 25vw",
};

const RatioRow = memo(function RatioRow({
  entries,
  prioritySrcs,
}: {
  entries: RowEntry[];
  prioritySrcs?: Set<string>;
}) {
  const columns = entries.map((e) => `${getRatio(e.item)}fr`).join(" ");
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
