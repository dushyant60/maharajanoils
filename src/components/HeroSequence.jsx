"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";

const TOTAL_FRAMES = 100;

const getFramePath = (index) => {
  // Map index 1-100 to file names 000-099
  const paddedIndex = (index - 1).toString().padStart(3, "0");
  return `/oil_image_sequence/A_high_end_commercial_video_s_${paddedIndex}.jpg`;
};

export default function HeroSequence({ scrollContainerRef }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const currentFrame = useRef(1);

  // Scroll mapping
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"]
  });

  // Apply spring physics for smooth, buttery scroll interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Map smooth progress (0-1) to frame index (1-100)
  const frameIndex = useTransform(smoothProgress, [0, 1], [1, TOTAL_FRAMES]);

  const canvasSize = useRef({ width: 0, height: 0 });
  const initialized = useRef(false);

  // Initialize canvas size (run once or on resize)
  const initCanvas = () => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    canvasSize.current = { width: rect.width, height: rect.height };
    
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasRef.current.width = rect.width * dpr;
    canvasRef.current.height = rect.height * dpr;
    
    const ctx = canvasRef.current.getContext("2d");
    // Reset transform before scaling to prevent compounding scales on resize
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
    ctx.scale(dpr, dpr);
    initialized.current = true;
  };

  // Canvas drawing logic
  const drawFrame = (index) => {
    if (!initialized.current) initCanvas();
    
    const canvas = canvasRef.current;
    if (!canvas || !imagesRef.current[index - 1]) return;

    const ctx = canvas.getContext("2d", { alpha: false }); 
    const image = imagesRef.current[index - 1];

    // If image isn't downloaded yet, just skip drawing so the previous frame stays visible
    if (!image.complete || image.naturalWidth === 0) return;

    const { width: rectWidth, height: rectHeight } = canvasSize.current;
    if (rectWidth === 0 || rectHeight === 0) return;
    
    const scale = Math.max(rectWidth / image.width, rectHeight / image.height);
    const x = (rectWidth / 2) - (image.width / 2) * scale;
    const y = (rectHeight / 2) - (image.height / 2) * scale;
    
    ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
  };

  // Preload images progressively
  useEffect(() => {
    const images = [];
    imagesRef.current = images; // Assign immediately so drawFrame can access them

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = getFramePath(i);
      
      img.onload = () => {
        // As soon as the first frame loads, draw it immediately so the user isn't staring at a blank screen!
        if (i === 1) {
          drawFrame(1);
          setImagesLoaded(true); // Signal that at least the first frame is ready
        }
        // If the user happens to be scrolling while loading, try to draw the current frame when it arrives
        if (i === currentFrame.current) {
           requestAnimationFrame(() => drawFrame(i));
        }
      };
      
      images.push(img);
    }
    
    // Fallback resize listener
    const handleResize = () => {
      initCanvas();
      requestAnimationFrame(() => drawFrame(currentFrame.current));
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll events
  useMotionValueEvent(frameIndex, "change", (latest) => {
    const index = Math.round(latest);
    if (index !== currentFrame.current && index >= 1 && index <= TOTAL_FRAMES) {
      currentFrame.current = index;
      requestAnimationFrame(() => drawFrame(index));
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className="hero-sequence-canvas"
      style={{
        position: 'absolute',
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
