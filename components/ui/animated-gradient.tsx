"use client";

import { useEffect, useRef } from "react";

export default function AnimatedGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create gradient circles
    const circles = [
      {
        x: width * 0.2,
        y: height * 0.3,
        radius: width * 0.4,
        color: "rgba(59, 130, 246, 0.15)",
      }, // blue
      {
        x: width * 0.8,
        y: height * 0.7,
        radius: width * 0.4,
        color: "rgba(139, 92, 246, 0.15)",
      }, // purple
      {
        x: width * 0.5,
        y: height * 0.5,
        radius: width * 0.3,
        color: "rgba(236, 72, 153, 0.1)",
      }, // pink
    ];

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw each circle with slight movement
      circles.forEach((circle, i) => {
        const time = Date.now() * 0.001;
        const offsetX = Math.sin(time * (0.2 + i * 0.1)) * width * 0.02;
        const offsetY = Math.cos(time * (0.2 + i * 0.1)) * height * 0.02;

        const gradient = ctx.createRadialGradient(
          circle.x + offsetX,
          circle.y + offsetY,
          0,
          circle.x + offsetX,
          circle.y + offsetY,
          circle.radius
        );

        gradient.addColorStop(0, circle.color);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
          circle.x + offsetX,
          circle.y + offsetY,
          circle.radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{
        width: "100%",
        height: "100%",
        opacity: 0.7,
        mixBlendMode: "normal",
      }}
    />
  );
}
