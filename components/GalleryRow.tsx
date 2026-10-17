"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
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
};

function getRatio(item: GalleryItem | VideoItem): number {
  if (item.width && item.height) return item.width / item.height;
  return 1.5;
}

type VimeoPlayer = {
  destroy(): Promise<void>;
  getPaused(): Promise<boolean>;
  on(event: "play" | "pause", callback: () => void): void;
  pause(): Promise<void>;
  play(): Promise<void>;
  ready(): Promise<void>;
};

type VimeoSDK = {
  Player: new (iframe: HTMLIFrameElement) => VimeoPlayer;
};

// Singleton promise for loading the Vimeo SDK once across all gallery cells
let vimeoSdkPromise: Promise<VimeoSDK> | null = null;

function loadVimeoSDK(): Promise<VimeoSDK> {
  if (typeof window === "undefined") {
    return new Promise(() => {});
  }
  const win = window as Window & { Vimeo?: VimeoSDK };
  if (win.Vimeo) {
    return Promise.resolve(win.Vimeo);
  }
  if (!vimeoSdkPromise) {
    vimeoSdkPromise = new Promise<VimeoSDK>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://player.vimeo.com/api/player.js"]',
      );
      if (existing) {
        existing.addEventListener("load", () => {
          if (win.Vimeo) resolve(win.Vimeo);
        });
        existing.addEventListener("error", reject);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://player.vimeo.com/api/player.js";
      script.async = true;
      script.onload = () => {
        if (win.Vimeo) {
          resolve(win.Vimeo);
        } else {
          reject(new Error("Vimeo SDK not available"));
        }
      };
      script.onerror = (err) => {
        vimeoSdkPromise = null; // Allow retry on failure
        reject(err);
      };
      document.head.appendChild(script);
    });
  }
  return vimeoSdkPromise;
}

function formatVimeoUrl(url?: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("background", "0");
    parsed.searchParams.set("autoplay", "0");
    parsed.searchParams.set("loop", "1");
    parsed.searchParams.set("byline", "0");
    parsed.searchParams.set("title", "0");
    parsed.searchParams.set("portrait", "0");
    parsed.searchParams.set("controls", "1");
    parsed.searchParams.set("muted", "0");
    parsed.searchParams.set("autopause", "1");
    return parsed.toString();
  } catch {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}background=0&autoplay=0&loop=1&byline=0&title=0&portrait=0&controls=1&muted=0&autopause=1`;
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
  const vimeoPlayerRef = useRef<VimeoPlayer | null>(null);
  const isInViewportRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [shouldLoadVimeo, setShouldLoadVimeo] = useState(false);
  const [isVimeoPlayerReady, setIsVimeoPlayerReady] = useState(false);

  // Lazy-load Vimeo iframe when approaching viewport (250px margin)
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
      { threshold: 0.01, rootMargin: "250px 0px 250px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVimeo]);

  // Viewport tracking for autoplay/pause: updates ref directly to avoid re-rendering Cell on scroll
  useEffect(() => {
    if (!isVimeo && !isVideo) return;
    const el = cellRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        isInViewportRef.current = visible;

        if (isVimeo && vimeoPlayerRef.current) {
          const player = vimeoPlayerRef.current;
          const playback = visible ? player.play() : player.pause();
          playback.catch((error: unknown) => {
            const action = visible ? "play" : "pause";
            console.warn(`Unable to ${action} Vimeo video.`, error);
          });
        } else if (isVideo && videoRef.current) {
          if (visible) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVimeo, isVideo]);

  // Initialize Vimeo player using the singleton loader without setInterval polling
  useEffect(() => {
    if (!isVimeo || !shouldLoadVimeo || !iframeRef.current) return;

    let isMounted = true;

    loadVimeoSDK()
      .then((Vimeo) => {
        if (!isMounted || !iframeRef.current || vimeoPlayerRef.current) return;
        try {
          const player = new Vimeo.Player(iframeRef.current);
          vimeoPlayerRef.current = player;

          player.on("play", () => {
            if (isMounted) setIsPlaying(true);
          });
          player.on("pause", () => {
            if (isMounted) setIsPlaying(false);
          });

          player
            .ready()
            .then(() => {
              if (!isMounted) return;
              setIsVimeoPlayerReady(true);
              // If already in viewport when ready, start playback
              if (isInViewportRef.current) {
                player.play().catch((error: unknown) => {
                  console.warn("Unable to play Vimeo video.", error);
                });
              }
            })
            .catch((error: unknown) => {
              console.warn("Unable to initialize Vimeo player.", error);
            });
        } catch (error) {
          console.warn("Failed to create Vimeo player instance.", error);
        }
      })
      .catch((error) => {
        console.warn("Failed to load Vimeo SDK.", error);
      });

    return () => {
      isMounted = false;
      if (vimeoPlayerRef.current) {
        try {
          vimeoPlayerRef.current.destroy?.();
        } catch {}
        vimeoPlayerRef.current = null;
      }
    };
  }, [isVimeo, shouldLoadVimeo]);

  const handleCellClick = useCallback(() => {
    if (!isVideo && !isVimeo) {
      setOverlayActive((prev) => !prev);
    }
  }, [isVideo, isVimeo]);

  const naturalRatio = ratio ?? getRatio(item);
  const aspectStyle = useMemo(
    () =>
      fill
        ? ({ "--item-ratio": String(naturalRatio) } as React.CSSProperties)
        : ({ aspectRatio: String(naturalRatio) }),
    [fill, naturalRatio],
  );

  const formattedVimeoUrl = useMemo(
    () => (isVimeo ? formatVimeoUrl(item.vimeoUrl) : ""),
    [isVimeo, item.vimeoUrl],
  );

  return (
    <div
      ref={cellRef}
      className={`gallery-item group min-h-0 min-w-0 cursor-pointer select-none ${
        fill ? "sm:h-full" : ""
      }`}
      onClick={handleCellClick}
    >
      <div
        className={`relative overflow-hidden ${
          fill ? "feature-fill-cell sm:h-full" : ""
        }`}
        style={aspectStyle}
      >
        {isVimeo ? (
          <>
            {/* Crisp WebP poster remains visible while iframe loads, then smoothly fades out */}
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
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out group-hover:scale-[1.02] ${
                isVimeoPlayerReady
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            />
            {shouldLoadVimeo && (
              <iframe
                ref={iframeRef}
                src={formattedVimeoUrl}
                title={item.title || "Vimeo video"}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center px-2">
              <h2 className="text-sm sm:text-base md:text-xl font-medium tracking-tight text-white drop-shadow-xs" >
                <p dangerouslySetInnerHTML={{ __html: item.title }} />
              </h2>
              {item.meta && (
                <span className="shrink-0 font-mono text-xs sm:text-sm md:text-base uppercase text-white/80">
                  {item.meta}
                </span>
              )}
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

  return (
    <div
      className={`grid min-w-0 grid-cols-1 gap-2 ${
        reverse ? "sm:grid-cols-[1fr_2fr]" : "sm:grid-cols-[2fr_1fr]"
      }`}
    >
      <div className={`min-w-0 ${reverse ? "order-1 sm:order-2" : "order-1"}`}>
        <Cell
          key={big.item.id}
          entry={big}
          priority={
            (big.item.src && prioritySrcs?.has(big.item.src)) ||
            (big.item.poster && prioritySrcs?.has(big.item.poster)) ||
            false
          }
          ratio={getRatio(big.item)}
          sizes="(max-width: 640px) 100vw, 66vw"
        />
      </div>
      <div
        className={`grid min-h-0 min-w-0 grid-cols-1 gap-2 sm:grid-rows-2 ${
          reverse ? "order-2 sm:order-1" : "order-2"
        }`}
      >
        <Cell
          key={small1.item.id}
          entry={small1}
          priority={
            (small1.item.src && prioritySrcs?.has(small1.item.src)) ||
            (small1.item.poster && prioritySrcs?.has(small1.item.poster)) ||
            false
          }
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <Cell
          key={small2.item.id}
          entry={small2}
          priority={
            (small2.item.src && prioritySrcs?.has(small2.item.src)) ||
            (small2.item.poster && prioritySrcs?.has(small2.item.poster)) ||
            false
          }
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
  const columns = useMemo(
    () => entries.map((e) => `${getRatio(e.item)}fr`).join(" "),
    [entries],
  );
  const sizes =
    RATIO_ROW_SIZES[entries.length] ?? "(max-width: 640px) 100vw, 50vw";

  return (
    <div
      className="ratio-row grid gap-2 grid-cols-1 sm:grid-cols-2"
      style={{ "--desktop-cols": columns } as React.CSSProperties}
    >
      {entries.map((entry) => (
        <Cell
          key={entry.item.id}
          entry={entry}
          priority={
            (entry.item.src && prioritySrcs?.has(entry.item.src)) ||
            (entry.item.poster && prioritySrcs?.has(entry.item.poster)) ||
            false
          }
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
    const heroEntry = entries[0];
    return (
      <div className="grid">
        <Cell
          key={heroEntry.item.id}
          entry={heroEntry}
          priority={
            (heroEntry.item.src && prioritySrcs?.has(heroEntry.item.src)) ||
            (heroEntry.item.poster &&
              prioritySrcs?.has(heroEntry.item.poster)) ||
            false
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
