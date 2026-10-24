"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export function TasteGlobe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    let width = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let phi = 0;
    let animationFrameId: number;

    const onResize = () => {
      if (canvas) {
        width = canvas.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.05, 0.05, 0.08],
      markerColor: [0.96, 0.62, 0.07], // Amber #f59e0b
      glowColor: [0.98, 0.75, 0.14],   // Gold #fbbf24
      markers: [
        { location: [40.7128, -74.006], size: 0.09 }, // New York
        { location: [41.8781, -87.6298], size: 0.07 }, // Chicago
        { location: [37.7749, -122.4194], size: 0.07 }, // San Francisco
        { location: [41.9028, 12.4964], size: 0.08 }, // Rome
        { location: [48.8566, 2.3522], size: 0.06 }, // Paris
        { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
      ],
      arcs: [
        { from: [40.7128, -74.006], to: [41.9028, 12.4964] }, // NY to Rome
        { from: [41.8781, -87.6298], to: [37.7749, -122.4194] }, // Chicago to SF
        { from: [40.7128, -74.006], to: [35.6762, 139.6503] }, // NY to Tokyo
        { from: [41.9028, 12.4964], to: [48.8566, 2.3522] }, // Rome to Paris
      ],
      arcColor: [0.96, 0.62, 0.07],
      arcWidth: 0.6,
      arcHeight: 0.25,
    });

    const animate = () => {
      if (!pointerInteracting.current && !prefersReducedMotion) {
        phi += 0.003;
      }
      globe.update({
        phi: phi + pointerInteractionMovement.current,
        width: width * 2,
        height: width * 2,
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    setTimeout(() => {
      if (canvas) canvas.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className={`relative mx-auto flex aspect-square w-full max-w-[340px] sm:max-w-[420px] items-center justify-center ${className}`}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.01;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.01;
          }
        }}
        className="h-full w-full cursor-grab opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
        style={{ width: "100%", height: "100%" }}
        aria-label="Interactive 3D Cultural Taste Hubs Globe"
      />
      {/* Specular glow halo under globe */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-amber-500/10 via-transparent to-transparent blur-xl" />
    </div>
  );
}
