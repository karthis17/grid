"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/lib/i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

interface FrameState {
  frame: number;
}

interface ScrollVideoProps {
  frameCount?: number;
  framePath?: (i: number) => string;
  scrollDistance?: number;
}

export default function ScrollVideo({
  frameCount = 61,
  framePath = (i) => `/frames/frame_${String(i).padStart(4, "0")}.jpg`,
  scrollDistance = 1000,
}: ScrollVideoProps) {
  const { t } = useLanguage();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameStateRef = useRef<FrameState>({ frame: 0 });
  const drawnFrameRef = useRef(-1);
  const lastGoodIndexRef = useRef(-1);
  const framePathRef = useRef(framePath);
  const rafRef = useRef<number | null>(null);
  const resizeRafRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const scrollIdleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const hintHideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hintVisible, setHintVisible] = useState(true);
  const [hintMounted, setHintMounted] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    framePathRef.current = framePath;
  }, [framePath]);

  const setHint = useCallback((show: boolean) => {
    if (hintHideTimeout.current) {
      clearTimeout(hintHideTimeout.current);
      hintHideTimeout.current = null;
    }

    if (show) {
      setHintMounted(true);
      requestAnimationFrame(() => setHintVisible(true));
    } else {
      setHintVisible(false);
      hintHideTimeout.current = setTimeout(
        () => setHintMounted(false),
        350,
      );
    }
  }, []);

  const drawImageFit = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvas: HTMLCanvasElement,
    ) => {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    },
    [],
  );

  const drawFrame = useCallback(
    (frame: number) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      if (!canvas || !ctx) return;

      // Frame images are discrete. Avoid doing expensive canvas work
      // repeatedly when ScrollTrigger reports fractional values.
      const index = Math.max(
        0,
        Math.min(frameCount - 1, Math.round(frame)),
      );

      if (index === drawnFrameRef.current) return;

      const images = imagesRef.current;
      let img = images[index];

      const isDrawable = (image?: HTMLImageElement) =>
        !!image && image.complete && image.naturalWidth > 0;

      if (isDrawable(img)) {
        lastGoodIndexRef.current = index;
      } else if (lastGoodIndexRef.current >= 0) {
        img = images[lastGoodIndexRef.current];
      } else {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImageFit(ctx, img, canvas);
      drawnFrameRef.current = index;
    },
    [drawImageFit, frameCount],
  );

  // Batch all scroll updates into one paint per browser frame.
  const requestDraw = useCallback(() => {
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      drawFrame(frameStateRef.current.frame);
    });
  }, [drawFrame]);

  const resizeCanvas = useCallback(() => {
    if (resizeRafRef.current !== null) return;

    resizeRafRef.current = requestAnimationFrame(() => {
      resizeRafRef.current = null;

      const canvas = canvasRef.current;
      const inner = innerRef.current;

      if (!canvas || !inner) return;

      const width = inner.clientWidth;
      const height = inner.clientHeight;

      if (!width || !height) return;

      // Keep the backing store at CSS resolution for much cheaper
      // frame rendering. This is intentional for scroll performance.
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        drawnFrameRef.current = -1;
      }

      const ctx = ctxRef.current;
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "medium";
      }

      requestDraw();
    });
  }, [requestDraw]);

  useEffect(() => {
    let cancelled = false;
    let scrollTween: gsap.core.Tween | null = null;

    const images = new Array<HTMLImageElement>(frameCount);
    imagesRef.current = images;
    lastGoodIndexRef.current = -1;
    drawnFrameRef.current = -1;

    const loadImage = (index: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();

        // Ask the browser to prioritize the first frame and nearby frames.
        img.decoding = "async";
        img.fetchPriority = index < 4 ? "high" : "auto";

        img.onload = () => {
          if (!cancelled) setLoadedCount((count) => count + 1);
          resolve();
        };

        img.onerror = () => {
          console.error(
            `ScrollVideo: failed to load frame ${index + 1} at "${img.src}"`,
          );

          if (!cancelled) setLoadedCount((count) => count + 1);
          resolve();
        };

        img.src = framePathRef.current(index + 1);
        images[index] = img;
      });

    const loadRemainingFrames = async () => {
      // Small batches prevent the browser/network from being hammered
      // by dozens of image requests at once.
      const batchSize = 6;

      for (let start = 1; start < frameCount && !cancelled; start += batchSize) {
        const end = Math.min(start + batchSize, frameCount);

        await Promise.all(
          Array.from({ length: end - start }, (_, offset) =>
            loadImage(start + offset),
          ),
        );
      }
    };

    const handleScrollActivity = () => {
      setHint(false);

      if (scrollIdleTimeoutRef.current) {
        clearTimeout(scrollIdleTimeoutRef.current);
      }

      scrollIdleTimeoutRef.current = setTimeout(() => {
        setHint(true);
      }, 600);
    };

    const init = async () => {
      const canvas = canvasRef.current;
      if (canvas) {
        ctxRef.current = canvas.getContext("2d", {
          alpha: false,
          desynchronized: true,
        });
      }

      resizeCanvas();

      // Do not block the entire animation until every frame is loaded.
      await loadImage(0);

      if (cancelled) return;

      drawFrame(0);
      setFirstFrameReady(true);

      // Start ScrollTrigger as soon as frame 0 is ready.
      // Remaining frames continue loading in the background.
      scrollTween = gsap.to(frameStateRef.current, {
        frame: Math.max(0, frameCount - 1),
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 0.5,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: () => {
            requestDraw();
          },
          onLeave: () => {
            setHint(false);
            innerRef.current?.parentElement?.classList.add("video-finished");
          },
          onLeaveBack: () => {
            setHint(true);
            innerRef.current?.parentElement?.classList.remove(
              "video-finished",
            );
          },
        },
      });

      // Background preload. Scroll interaction does not wait for it.
      await loadRemainingFrames();

      if (cancelled) return;

      if (lastGoodIndexRef.current === -1) {
        setLoadError(
          `No frame images loaded. Checked paths like "${framePathRef.current(
            1,
          )}" — confirm the frames exist there.`,
        );
      }
    };

    init();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (innerRef.current) {
      resizeObserver.observe(innerRef.current);
    }

    window.addEventListener("scroll", handleScrollActivity, {
      passive: true,
    });

    return () => {
      cancelled = true;

      resizeObserver.disconnect();

      window.removeEventListener("scroll", handleScrollActivity);

      if (scrollIdleTimeoutRef.current) {
        clearTimeout(scrollIdleTimeoutRef.current);
      }

      if (hintHideTimeout.current) {
        clearTimeout(hintHideTimeout.current);
      }

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }

      scrollTween?.scrollTrigger?.kill(true);
      scrollTween?.kill();

      ctxRef.current = null;
      imagesRef.current = [];
    };
  }, [
    frameCount,
    scrollDistance,
    drawFrame,
    requestDraw,
    resizeCanvas,
    setHint,
  ]);

  const loadPct = Math.round((loadedCount / frameCount) * 100);

  return (
    <div ref={wrapperRef}>
      <div
        ref={innerRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {loadError && (
          <div className="absolute inset-0 z-11 flex flex-col items-center justify-center gap-2 bg-black px-6 text-center text-[0.85rem] text-[#ff5a36]">
            <div>⚠ {t.banner.loadError}</div>
            <div className="max-w-120 text-[#8a8f98]">{loadError}</div>
          </div>
        )}

        {!firstFrameReady && !loadError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3.5 bg-black text-[0.9rem] text-[#8a8f98]">
            <div>{t.banner.loadingFrames}</div>
            <div className="h-0.75 w-45 overflow-hidden rounded-xs bg-[222]">
              <div
                className="h-full bg-[#ff5a36] transition-[width] duration-150 ease-out"
                style={{ width: `${loadPct}%` }}
              />
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
          style={{
            willChange: "contents",
            contain: "strict",
          }}
        />

        {hintMounted && (
          <div
            aria-hidden={!hintVisible}
            style={{
              position: "absolute",
              bottom: "8%",
              left: "50%",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              opacity: hintVisible ? 1 : 0,
              transform: `translate(-50%, ${
                hintVisible ? "0px" : "10px"
              })`,
              transition: "opacity 0.35s ease, transform 0.35s ease",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                width: 26,
                height: 42,
                display: "flex",
                justifyContent: "center",
                paddingTop: 8,
                boxSizing: "border-box",
              }}
            >
              <div
                className="scroll-hint"
                style={{
                  animation: "scrollHintWheel 1.6s ease-in-out infinite",
                }}
              />
            </div>

            <span
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                fontWeight: 500,
              }}
            >
              {t.banner.scroll}
            </span>

            <style>{`
              @keyframes scrollHintWheel {
                0% { transform: translateY(0); opacity: 1; }
                60% { transform: translateY(14px); opacity: 0; }
                61% { transform: translateY(0); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
              }

              @media (prefers-reduced-motion: reduce) {
                .scroll-hint { animation: none !important; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
