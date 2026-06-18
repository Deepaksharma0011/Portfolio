import { useEffect, useRef, useState } from "react";

interface OrbitalLine {
  id: number;
  radius: number;
  color: string;
  speed: number;
  angleOffset: number;
  arcLength: number;
  strokeWidth: number;
  glow: number;
  lag: number;
  x: number;
  y: number;
}

const COLORS = [
  "139, 92, 246",   // violet
  "59, 130, 246",   // blue
  "236, 72, 153",   // pink
  "16, 185, 129",   // emerald
  "245, 158, 11",   // amber
  "99, 102, 241",   // indigo
  "14, 165, 233",   // sky
  "244, 114, 182",  // rose
  "45, 212, 191",   // teal
  "250, 204, 21",   // yellow
];

const LINE_COUNT = 14;

const CursorAnimation = () => {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const idleAngleRef = useRef(0);
  const linesRef = useRef<OrbitalLine[]>([]);
  const moveTimeoutRef = useRef<number | null>(null);
  const isMovingRef = useRef(false);

  useEffect(() => {
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      !window.matchMedia("(pointer: fine)").matches ||
      "ontouchstart" in window;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isTouch && !reducedMotion) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize orbital lines once
    if (linesRef.current.length === 0) {
      for (let i = 0; i < LINE_COUNT; i++) {
        const radius = 22 + i * 10 + (i % 3) * 6;
        linesRef.current.push({
          id: i,
          radius,
          color: COLORS[i % COLORS.length],
          speed: (i % 2 === 0 ? 1 : -1) * (0.0003 + i * 0.00008),
          angleOffset: (i * Math.PI * 2) / LINE_COUNT,
          arcLength: Math.PI * (0.35 + (i % 3) * 0.12),
          strokeWidth: 2 + (i % 3) * 0.5,
          glow: 8 + (i % 3) * 3,
          lag: 0.04 + (i / LINE_COUNT) * 0.12,
          x: mouseRef.current.x,
          y: mouseRef.current.y,
        });
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      isMovingRef.current = true;

      if (moveTimeoutRef.current) window.clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = window.setTimeout(() => {
        isMovingRef.current = false;
      }, 180);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;
      const target = { x: mx, y: my };

      // Smoothly move each line's anchor toward the cursor with different lag
      linesRef.current.forEach((line) => {
        line.x += (target.x - line.x) * line.lag;
        line.y += (target.y - line.y) * line.lag;
      });

      idleAngleRef.current += 0.008;

      if (isVisible) {
        linesRef.current.forEach((line, i) => {
          const rotation = idleAngleRef.current * (line.speed > 0 ? 1 : -1) + line.angleOffset;
          const startAngle = rotation;
          const endAngle = rotation + line.arcLength;

          // Arc
          ctx.beginPath();
          ctx.arc(line.x, line.y, line.radius, startAngle, endAngle);
          ctx.strokeStyle = `rgba(${line.color}, ${0.75 + (i % 3) * 0.05})`;
          ctx.lineWidth = line.strokeWidth;
          ctx.lineCap = "round";
          ctx.shadowColor = `rgba(${line.color}, 0.95)`;
          ctx.shadowBlur = line.glow;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Glowing dot at the end of the arc
          const endX = line.x + Math.cos(endAngle) * line.radius;
          const endY = line.y + Math.sin(endAngle) * line.radius;
          ctx.beginPath();
          ctx.arc(endX, endY, 3 + (i % 3) * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${line.color}, 0.95)`;
          ctx.shadowColor = `rgba(${line.color}, 1)`;
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Small center dot
        ctx.beginPath();
        ctx.arc(mx, my, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139, 92, 246, 0.9)";
        ctx.shadowColor = "rgba(139, 92, 246, 0.8)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (moveTimeoutRef.current) window.clearTimeout(moveTimeoutRef.current);
    };
  }, [enabled, isVisible]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      aria-hidden="true"
    />
  );
};

export default CursorAnimation;

