"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  frameCount = 78,
  framePath = (i) => `/frames/frame_${String(i).padStart(4, "0")}.jpg`,
  scrollDistance = 1500,
}: ScrollVideoProps) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameStateRef = useRef<FrameState>({ frame: 0 });
  const lastGoodIndexRef = useRef<number>(-1);
  const framePathRef = useRef(framePath);

  const scrollIdleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [hintVisible, setHintVisible] = useState(true);
  const [hintMounted, setHintMounted] = useState(true);
  const hintHideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
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
      hintHideTimeout.current = setTimeout(() => setHintMounted(false), 350);
    }
  }, []);

  const drawImageFit = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvas: HTMLCanvasElement,
    ) => {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

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
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const lower = Math.floor(index);
      const upper = Math.min(lower + 1, frameCount - 1);
      const alpha = index - lower;

      let img1 = imagesRef.current[lower];

      const isDrawable = (img?: HTMLImageElement) =>
        !!img && img.complete && img.naturalWidth > 0;

      if (isDrawable(img1)) {
        lastGoodIndexRef.current = lower;
      } else if (lastGoodIndexRef.current >= 0) {
        img1 = imagesRef.current[lastGoodIndexRef.current];
      } else {
        return;
      }

      const img2 = imagesRef.current[upper];

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImageFit(ctx, img1, canvas);

      if (img2 && img2.complete && img2.naturalWidth > 0 && alpha > 0) {
        ctx.globalAlpha = alpha;
        drawImageFit(ctx, img2, canvas);
        ctx.globalAlpha = 1;
      }
    },
    [frameCount, drawImageFit],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const inner = innerRef.current;
    if (!canvas || !inner) return;

    canvas.width = inner.clientWidth;
    canvas.height = inner.clientHeight;

    drawFrame(frameStateRef.current.frame);
  }, [drawFrame]);

  useEffect(() => {
    let cancelled = false;
    const images = new Array<HTMLImageElement>(frameCount);
    imagesRef.current = images;
    lastGoodIndexRef.current = -1;

    let scrollTween: gsap.core.Tween | null = null;
    let trigger: ScrollTrigger | null = null;

    function loadImage(i: number): Promise<void> {
      return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
          if (!cancelled) setLoadedCount((count) => count + 1);
          resolve();
        };

        img.onerror = () => {
          console.error(
            `ScrollVideo: failed to load frame ${i + 1} at "${img.src}"`,
          );
          if (!cancelled) setLoadedCount((count) => count + 1);
          resolve();
        };

        img.src = framePathRef.current(i + 1);
        images[i] = img;
      });
    }

    const handleScrollActivity = () => {
      setHint(false);
      if (scrollIdleTimeoutRef.current) {
        clearTimeout(scrollIdleTimeoutRef.current);
      }
      scrollIdleTimeoutRef.current = setTimeout(() => setHint(true), 600);
    };

    async function init() {
      resizeCanvas();
      await loadImage(0);
      if (cancelled) return;

      drawFrame(0);
      setFirstFrameReady(true);

      const rest: Promise<void>[] = [];
      for (let i = 1; i < frameCount; i++) {
        rest.push(loadImage(i));
      }
      await Promise.all(rest);
      if (cancelled) return;

      if (lastGoodIndexRef.current === -1) {
        setLoadError(
          `No frame images loaded. Checked paths like "${framePathRef.current(
            1,
          )}" — confirm the frames exist there.`,
        );
        return;
      }

      // GSAP: pin the OUTER section, animate frames inside
      scrollTween = gsap.to(frameStateRef.current, {
        frame: frameCount - 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: 0.3,
          onUpdate: () => {
            drawFrame(frameStateRef.current.frame);
          },
          onLeave: () => {
            setHint(false);
            // Optionally add a class here to mark "animation finished"
            innerRef.current?.parentElement?.classList.add("video-finished");
          },
          onLeaveBack: () => {
            setHint(true);
            innerRef.current?.parentElement?.classList.remove("video-finished");
          },
        },
      });

      trigger = scrollTween.scrollTrigger ?? null;
    }

    init();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", handleScrollActivity, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScrollActivity);
      if (scrollIdleTimeoutRef.current)
        clearTimeout(scrollIdleTimeoutRef.current);
      if (hintHideTimeout.current) clearTimeout(hintHideTimeout.current);

      // true = revert pin styles and remove the pin-spacer
      scrollTween?.scrollTrigger?.kill(true);
      scrollTween?.kill();
    };
  }, [frameCount, scrollDistance, drawFrame, resizeCanvas, setHint]);

  const loadPct = Math.round((loadedCount / frameCount) * 100);

  return (
    <div ref={wrapperRef}>
      <div
        ref={innerRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {loadError && (
          <div className="absolute inset-0 z-11 flex flex-col items-center justify-center gap-2 bg-black px-6 text-center text-[0.85rem] text-[#ff5a36]">
            <div>⚠ ScrollVideo couldn&apos;t load any frames</div>
            <div className="max-w-120 text-[#8a8f98]">{loadError}</div>
          </div>
        )}

        {!firstFrameReady && !loadError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3.5 bg-black text-[0.9rem] text-[#8a8f98]">
            <div>Loading frames…</div>
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
        />

        {/* Your hint UI here (same as before) */}
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
              transform: `translate(-50%, ${hintVisible ? "0px" : "10px"})`,
              transition: "opacity 0.35s ease, transform 0.35s ease",
              pointerEvents: "none",
            }}
          >
            {/* same hint markup as before */}
            <div
              style={{
                width: 26,
                height: 42,
                borderRadius: 14,
                border: "1.5px solid rgba(255,255,255,0.55)",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(6px)",
                display: "flex",
                justifyContent: "center",
                paddingTop: 8,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 8,
                  borderRadius: 2,
                  background: "#fff",
                  animation: "scrollHintWheel 1.6s ease-in-out infinite",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                fontWeight: 500,
              }}
            >
              Scroll
            </span>
            <style>{`
            @keyframes scrollHintWheel {
              0% { transform: translateY(0); opacity: 1; }
              60% { transform: translateY(14px); opacity: 0; }
              61% { transform: translateY(0); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
            @media (prefers-reduced-motion: reduce) {
              [style*="scrollHintWheel"] { animation: none !important; }
            }
          `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
