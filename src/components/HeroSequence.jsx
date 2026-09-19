"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";

const TOTAL_FRAMES = 100;
const EAGER_COUNT = 12; // frames loaded before we paint anything
const BATCH_SIZE = 6;   // frames loaded per batch after that

// Same naming pattern as before, just .avif instead of .jpg,
// and pointing at the new /seq folder produced by convert.py
const getFramePath = (index) => {
  const paddedIndex = (index - 1).toString().padStart(3, "0");
  return `/seq/A_high_end_commercial_video_s_${paddedIndex}.avif`;
};

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // don't let one bad frame block the batch
    img.src = src;
  });

export default function HeroSequence({ scrollContainerRef }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES).fill(null));
  const canvasSize = useRef({ width: 0, height: 0 });
  const currentFrame = useRef(1);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Draw the requested frame, or the nearest loaded one if it isn't ready yet
  const drawFrame = useCallback((index) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    let img = null;
    for (let d = 0; d < TOTAL_FRAMES; d++) {
      const back = imagesRef.current[index - 1 - d];
      if (back) { img = back; break; }
      const fwd = imagesRef.current[index - 1 + d];
      if (fwd) { img = fwd; break; }
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const { width: w, height: h } = canvasSize.current;
    if (!w || !h) return;

    const scale = Math.max(w / img.width, h / img.height);
    const x = w / 2 - (img.width / 2) * scale;
    const y = h / 2 - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }, []);

  // Size the canvas for the current layout/DPR. Context is created once
  // here (with alpha:false actually taking effect, since this is the
  // first getContext call) and cached in ctxRef.
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvasSize.current = { width: rect.width, height: rect.height };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext("2d", { alpha: false });
    }
    // Resizing canvas.width/height resets any existing transform,
    // so re-apply the DPR scale every time.
    ctxRef.current.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  // Progressive load: paint as soon as the first batch is in,
  // then keep streaming the rest in the background.
  useEffect(() => {
    let cancelled = false;
    sizeCanvas();

    (async () => {
      const eager = await Promise.all(
        Array.from({ length: EAGER_COUNT }, (_, i) => loadImage(getFramePath(i + 1)))
      );
      if (cancelled) return;
      eager.forEach((img, i) => { imagesRef.current[i] = img; });
      setReady(true);
      drawFrame(1);

      for (let start = EAGER_COUNT; start < TOTAL_FRAMES; start += BATCH_SIZE) {
        const idx = Array.from(
          { length: Math.min(BATCH_SIZE, TOTAL_FRAMES - start) },
          (_, k) => start + k
        );
        const imgs = await Promise.all(idx.map((i) => loadImage(getFramePath(i + 1))));
        if (cancelled) return;
        idx.forEach((i, k) => { imagesRef.current[i] = imgs[k]; });

        // If the user scrolled into this batch before it finished, refresh the view
        if (idx.includes(currentFrame.current - 1)) {
          drawFrame(currentFrame.current);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [drawFrame, sizeCanvas]);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!ready) return;
    const index = Math.round(latest);
    if (index !== currentFrame.current && index >= 1 && index <= TOTAL_FRAMES) {
      currentFrame.current = index;
      requestAnimationFrame(() => drawFrame(index));
    }
  });

  useEffect(() => {
    const onResize = () => {
      sizeCanvas();
      requestAnimationFrame(() => drawFrame(currentFrame.current));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [drawFrame, sizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-sequence-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: 0,
      }}
    />
  );
}