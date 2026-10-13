"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import {
  getMediaType,
  type GalleryItem,
  type VideoItem,
} from "@/lib/GalleryItems";

export type RowVariant =
  | "feature-left"
  | "feature-right"
  | "hero"
  | "quad"
  | "duo"
  | "trio"
  | "auto";

export type RowEntry = {
  item: GalleryItem | VideoItem;
  index: number;
};

function getRatio(item: GalleryItem | VideoItem): number {
  if (item.width && item.height) return item.width / item.height;
  return 1.5;
}

function formatVimeoUrl(url?: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("background", "1");
    parsed.searchParams.set("autoplay", "1");
    parsed.searchParams.set("loop", "1");
    parsed.searchParams.set("byline", "0");
    parsed.searchParams.set("title", "0");
    parsed.searchParams.set("portrait", "0");
    parsed.searchParams.set("controls", "0");
    parsed.searchParams.set("muted", "1");
    parsed.searchParams.set("autopause", "0");
    return parsed.toString();
  } catch {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&controls=0&muted=1&autopause=0`;
  }
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
  const mediaType = getMediaType(item);
  const isVimeo =
    mediaType === "vimeo" || Boolean("vimeoUrl" in item && item.vimeoUrl);
  const isVideo = !isVimeo && mediaType === "video";
  const cellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoPlayerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [overlayActive, setOverlayActive] = useState(false);
  const [shouldLoadVimeo, setShouldLoadVimeo] = useState(false);

  // Lazy-load Vimeo iframes only when approaching viewport to eliminate 40MB+ payload on initial page load
  useEffect(() => {
    if (!isVimeo) return;
    const el = cellRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldLoadVimeo(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.01, rootMargin: "250px 0px 250px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVimeo]);

  useEffect(() => {
    if (!isVimeo || !shouldLoadVimeo || !iframeRef.current) return;

    const init = () => {
      const Vimeo = (window as any).Vimeo;
      if (Vimeo?.Player && iframeRef.current && !vimeoPlayerRef.current) {
        try {
          const player = new Vimeo.Player(iframeRef.current);
          vimeoPlayerRef.current = player;
          player.on("play", () => setIsPlaying(true));
          player.on("pause", () => setIsPlaying(false));
        } catch {
          // Wait for iframe
        }
      }
    };

    init();
    const interval = setInterval(() => {
      if (!vimeoPlayerRef.current) {
        init();
      } else {
        clearInterval(interval);
      }
    }, 250);

    return () => {
      clearInterval(interval);
      if (vimeoPlayerRef.current) {
        try {
          vimeoPlayerRef.current.destroy?.();
        } catch { }
        vimeoPlayerRef.current = null;
      }
    };
  }, [isVimeo, shouldLoadVimeo]);

  const togglePlay = useCallback(() => {
    if (isVimeo) {
      if (!shouldLoadVimeo) {
        setShouldLoadVimeo(true);
        return;
      }
      const player = vimeoPlayerRef.current;
      if (player) {
        player
          .getPaused()
          .then((paused: boolean) => {
            if (paused) {
              player.play().catch(() => { });
            } else {
              player.pause().catch(() => { });
            }
          })
          .catch(() => {
            iframeRef.current?.contentWindow?.postMessage(
              isPlaying ? '{"method":"pause"}' : '{"method":"play"}',
              "*",
            );
            setIsPlaying((prev) => !prev);
          });
      } else {
        iframeRef.current?.contentWindow?.postMessage(
          isPlaying ? '{"method":"pause"}' : '{"method":"play"}',
          "*",
        );
        setIsPlaying((prev) => !prev);
      }
      return;
    }

    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      if (v.preload === "none") v.preload = "auto";
      v.play().catch(() => { });
    } else {
      v.pause();
    }
  }, [isVimeo, shouldLoadVimeo, isPlaying]);

  const handleCellClick = useCallback(() => {
    if (isVideo || isVimeo) {
      togglePlay();
    } else {
      setOverlayActive((prev) => !prev);
    }
  }, [isVideo, isVimeo, togglePlay]);

  const aspect = fill ? undefined : (ratio ?? getRatio(item));

  return (
    <div
      ref={cellRef}
      className={`gallery-item group min-h-0 min-w-0 cursor-pointer select-none ${fill ? "h-full" : ""
        }`}
      onClick={handleCellClick}
    >
      <div
        className={`relative overflow-hidden ${fill ? "h-full" : ""}`}
        style={{
          ...(aspect ? { aspectRatio: String(aspect) } : {}),
        }}
      >
        {isVimeo ? (
          <>
            {/* Instant local WebP poster - eliminates layout shifts & displays crisp visuals */}
            <Image
              src={item.poster || "/gallery/vimeo_1234951199.webp"}
              alt={item.title ?? "Vimeo video preview"}
              width={item.width ?? 1920}
              height={item.height ?? 1080}
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              quality={75}
              decoding="async"
              sizes={sizes}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out group-hover:scale-[1.02] ${shouldLoadVimeo ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            />
            {shouldLoadVimeo && (
              <>
                <iframe
                  ref={iframeRef}
                  src={formatVimeoUrl(item.vimeoUrl)}
                  title={item.title || "Vimeo video"}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 h-full w-full border-0 pointer-events-none"
                  allowFullScreen
                />
                <Script
                  src="https://player.vimeo.com/api/player.js"
                  strategy="lazyOnload"
                />
              </>
            )}
          </>
        ) : isVideo ? (
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
            src={item.src ?? ""}
            alt={item.title ?? ""}
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

        {isVideo || isVimeo ? (
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
        ) : !isVimeo ? (
          <div
            style={{
              backgroundColor: item.overlayColor
                ? item.overlayColor
                : "rgba(23, 23, 15, 0.85)",
            }}
            onMouseLeave={() => setOverlayActive(false)}
            className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300 ${overlayActive
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none group-hover:pointer-events-auto"
              }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center px-2">
              <h2 className="text-sm sm:text-base md:text-xl font-medium tracking-tight text-white drop-shadow-xs">
                {item.title}
              </h2>
              {item.meta && (
                <span className="shrink-0 font-mono text-xs sm:text-sm md:text-base uppercase text-white/80">
                  {item.meta}
                </span>
              )}
            </div>
          </div>
        ) : null}
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

  return (
    <div
      className={`grid min-w-0 grid-cols-1 gap-2 ${reverse ? "sm:grid-cols-[1fr_2fr]" : "sm:grid-cols-[2fr_1fr]"
        }`}
    >
      <div className={`min-w-0 ${reverse ? "order-1 sm:order-2" : "order-1"}`}>
        <Cell
          entry={big}
          priority={big.item.src ? prioritySrcs?.has(big.item.src) : false}
          ratio={getRatio(big.item)}
          sizes="(max-width: 640px) 100vw, 66vw"
        />
      </div>
      <div
        className={`grid min-h-0 min-w-0 grid-cols-1 gap-2 sm:grid-rows-2 ${reverse ? "order-2 sm:order-1" : "order-2"
          }`}
      >
        <Cell
          key={small1.item.id}
          entry={small1}
          priority={small1.item.src ? prioritySrcs?.has(small1.item.src) : false}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <Cell
          key={small2.item.id}
          entry={small2}
          priority={small2.item.src ? prioritySrcs?.has(small2.item.src) : false}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>
    </div>
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
    <div
      className={`ratio-row grid gap-2 ${isQuad || isTrio ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
        }`}
      style={{ "--desktop-cols": columns } as React.CSSProperties}
    >
      {entries.map((entry) => (
        <Cell
          key={entry.item.id}
          entry={entry}
          priority={entry.item.src ? prioritySrcs?.has(entry.item.src) : false}
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
          priority={
            entries[0].item.src
              ? prioritySrcs?.has(entries[0].item.src)
              : false
          }
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
