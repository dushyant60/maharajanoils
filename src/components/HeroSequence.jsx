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

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setImagesLoaded(true);
        }
      };
      // For images that might fail or are already cached
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }
  }, []);

  const canvasSize = useRef({ width: 0, height: 0 });

  // Canvas drawing logic
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesRef.current[index - 1]) return;

    const ctx = canvas.getContext("2d", { alpha: false }); // alpha false is an optimization
    const image = imagesRef.current[index - 1];

    if (!image.complete || image.naturalWidth === 0) return;

    const { width: rectWidth, height: rectHeight } = canvasSize.current;
    if (rectWidth === 0 || rectHeight === 0) return;
    
    // We don't need clearRect if the image covers the entire canvas (optimization)
    // Maintain aspect ratio while covering the entire canvas
    const scale = Math.max(rectWidth / image.width, rectHeight / image.height);
    const x = (rectWidth / 2) - (image.width / 2) * scale;
    const y = (rectHeight / 2) - (image.height / 2) * scale;
    
    ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
  };

  // Draw initial frame once loaded
  useEffect(() => {
    if (imagesLoaded && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      canvasSize.current = { width: rect.width, height: rect.height };
      
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x to save GPU
      canvasRef.current.width = rect.width * dpr;
      canvasRef.current.height = rect.height * dpr;
      
      const ctx = canvasRef.current.getContext("2d");
      ctx.scale(dpr, dpr);
      
      drawFrame(1);
    }
  }, [imagesLoaded]);

  // Handle scroll events
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!imagesLoaded) return;
    
    const index = Math.round(latest);
    if (index !== currentFrame.current && index >= 1 && index <= TOTAL_FRAMES) {
      currentFrame.current = index;
      requestAnimationFrame(() => drawFrame(index));
    }
  });

  // Handle resize events to redraw
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        canvasSize.current = { width: rect.width, height: rect.height };
        
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvasRef.current.width = rect.width * dpr;
        canvasRef.current.height = rect.height * dpr;
        
        const ctx = canvasRef.current.getContext("2d");
        ctx.scale(dpr, dpr);
        
        if (imagesLoaded) {
          requestAnimationFrame(() => drawFrame(currentFrame.current));
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded]);

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
