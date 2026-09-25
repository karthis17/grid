"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  scrollDistance = 5500,
}: ScrollVideoProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameStateRef = useRef<FrameState>({ frame: 0 });
  const lastGoodIndexRef = useRef<number>(-1);

  // `framePath`'s default value is a brand-new function literal on every
  // render (default params aren't memoized). Reading it through a ref lets
  // loadImage always use the current one WITHOUT making the heavy init
  // effect below re-run every time this component re-renders.
  const framePathRef = useRef(framePath);
  useEffect(() => {
    framePathRef.current = framePath;
  }, [framePath]);

  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [firstFrameReady, setFirstFrameReady] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Helper: draw image fit-to-canvas
  const drawImageFit = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      canvas: HTMLCanvasElement,
    ) => {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth: number,
        drawHeight: number,
        offsetX: number,
        offsetY: number;

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

  // Draw with interpolation between frames
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const lower = Math.floor(index);
      const upper = Math.min(lower + 1, frameCount - 1);
      const alpha = index - lower; // 0 to 1

      let img1 = imagesRef.current[lower];
      const isDrawable = (img?: HTMLImageElement) =>
        !!img && img.complete && img.naturalWidth > 0;

      if (isDrawable(img1)) {
        lastGoodIndexRef.current = lower;
      } else if (lastGoodIndexRef.current >= 0) {
        // Falls back to the last successfully-loaded frame instead of
        // bailing out, so an occasional failed/late frame doesn't blank
        // (or flicker) the canvas.
        img1 = imagesRef.current[lastGoodIndexRef.current];
      } else {
        return;
      }

      const img2 = imagesRef.current[upper];

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawImageFit(ctx, img1, canvas);

      // Cross-fade to next frame ONLY if it's loaded
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
    const section = sectionRef.current;
    if (!canvas || !section) return;
    canvas.width = section.clientWidth;
    canvas.height = section.clientHeight;
    drawFrame(frameStateRef.current.frame);
  }, [drawFrame]);

  useEffect(() => {
    let cancelled = false;
    const images = new Array(frameCount);
    imagesRef.current = images;
    lastGoodIndexRef.current = -1;

    // Kept in this closure (not returned through an async chain) so the
    // effect's cleanup can kill it SYNCHRONOUSLY on unmount, before a new
    // effect run gets a chance to create a second, competing pin.
    let scrollTween: gsap.core.Tween | null = null;

    function loadImage(i: number): Promise<void> {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!cancelled) setLoadedCount((c) => c + 1);
          resolve();
        };
        img.onerror = () => {
          console.error(
            `ScrollVideo: failed to load frame ${i + 1} at "${img.src}"`,
          );
          if (!cancelled) setLoadedCount((c) => c + 1);
          resolve();
        };
        img.src = framePathRef.current(i + 1);
        images[i] = img;
      });
    }

    async function init() {
      resizeCanvas();

      await loadImage(0);
      if (cancelled) return;
      drawFrame(0);
      setFirstFrameReady(true);

      const rest = [];
      for (let i = 1; i < frameCount; i++) rest.push(loadImage(i));
      await Promise.all(rest);

      if (cancelled) return;

      if (lastGoodIndexRef.current === -1) {
        setLoadError(
          `No frame images loaded. Checked paths like "${framePathRef.current(1)}" — ` +
            `confirm the frames exist there (public/ folder, filename padding, extension).`,
        );
        return;
      }

      scrollTween = gsap.to(frameStateRef.current, {
        frame: frameCount - 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top+=1",
          end: `+=${scrollDistance}`,
          scrub: 1.5,
          pin: true,
          // 0 skips GSAP's mismatch-prevention pass right as the pin
          // engages, which is a common cause of a visible flash/jump at
          // the moment pinning starts. 1 is the recommended value.
          anticipatePin: 1,
          fastScrollEnd: 0.3,
        },
        onUpdate: () => {
          drawFrame(frameStateRef.current.frame);
        },
      });
    }

    init();

    window.addEventListener("resize", resizeCanvas);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", resizeCanvas);
      // Synchronous kill — no longer waits on a promise chain, which used
      // to leave a window where a re-run effect's new pin could be created
      // before the old one was torn down (two competing pins = flicker and
      // broken scroll).
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
    };
    // Intentionally only depends on primitives. `framePath`, `resizeCanvas`
    // and `drawFrame` are read via refs/stable closures above so that a
    // parent re-render (which recreates the default `framePath` function
    // literal every time) doesn't tear down and recreate the whole pin —
    // that churn was the actual source of the flicker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, scrollDistance]);

  const loadPct = Math.round((loadedCount / frameCount) * 100);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {loadError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "#000",
            color: "#ff5a36",
            fontSize: "0.85rem",
            textAlign: "center",
            padding: "0 24px",
            zIndex: 11,
          }}
        >
          <div>⚠ ScrollVideo couldn&apos;t load any frames</div>
          <div style={{ color: "#8a8f98", maxWidth: 480 }}>{loadError}</div>
        </div>
      )}

      {!firstFrameReady && !loadError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            background: "#000",
            color: "#8a8f98",
            fontSize: "0.9rem",
            zIndex: 10,
          }}
        >
          <div>Loading frames…</div>
          <div
            style={{
              width: 180,
              height: 3,
              background: "#222",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${loadPct}%`,
                background: "#ff5a36",
                transition: "width 0.15s ease",
              }}
            />
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
    </section>
  );
}
