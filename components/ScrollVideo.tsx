import { useRef, useEffect } from "react";
import { useScrollVideo } from "./hooks/useScrollVideo";

export interface ScrollVideoProps {
  totalFrames: number;
  framePath: (index: number) => string;

  /** Décalage avant activation (en px) */
  startOffset?: number;

  /** Décalage après activation (en px) */
  endOffset?: number;

  /** Durée du fade (0 → 1) */
  fadeDistance?: number;
}

export function ScrollVideo({
  totalFrames,
  framePath,
  startOffset = 300,   // commence 300px avant
  endOffset = 300,     // finit 300px après
  fadeDistance = 0.15, // 15% de fade
}: ScrollVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const images = useScrollVideo(totalFrames, framePath);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = (i: number) => {
      const img = images[i];
      if (!img) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = 0 - startOffset;
      const end = windowHeight - rect.height + endOffset;

      // Avant activation
      if (rect.top > start) {
        canvas.style.position = "absolute";
        canvas.style.top = "0px";
        canvas.style.opacity = "0";
        drawFrame(0);
        return;
      }

      // Après activation
      if (rect.top < end) {
        canvas.style.position = "absolute";
        canvas.style.top = `${container.offsetHeight - windowHeight}px`;
        canvas.style.opacity = "0";
        drawFrame(totalFrames - 1);
        return;
      }

      // Zone active → FIXED
      canvas.style.position = "fixed";
      canvas.style.top = "0px";

      // Progression
      const totalScroll = Math.abs(start - end);
      const current = Math.abs(rect.top - start);
      const progress = Math.min(Math.max(current / totalScroll, 0), 1);

      const frameIndex = Math.floor(progress * (totalFrames - 1));
      drawFrame(frameIndex);

      // Fade-in / fade-out
      let opacity = 1;

      if (progress < fadeDistance) {
        opacity = progress / fadeDistance;
      } else if (progress > 1 - fadeDistance) {
        opacity = (1 - progress) / fadeDistance;
      }

      canvas.style.opacity = String(opacity);
    };

    drawFrame(0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [images, totalFrames, startOffset, endOffset, fadeDistance]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: "300vh", // durée de l’animation
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        style={{
          width: "100vw",
          height: "100vh",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0,
          zIndex: 0, // vidéo en arrière-plan
        }}
      />
    </div>
  );
}