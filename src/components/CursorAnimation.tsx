import { useEffect, useRef, useState } from "react";

interface OrbDot {
  color: string;
  rgb: string;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  history: { x: number; y: number }[];
}

const DOTS: OrbDot[] = [
  { rgb: "255, 0, 128", color: "#ff0080", angle: 0, radius: 38, speed: 0.05, size: 4.2, history: [] },
  { rgb: "0, 255, 255", color: "#00ffff", angle: 0.785, radius: 44, speed: 0.05, size: 4.0, history: [] },
  { rgb: "255, 204, 0", color: "#ffcc00", angle: 1.571, radius: 50, speed: 0.05, size: 4.5, history: [] },
  { rgb: "0, 255, 128", color: "#00ff80", angle: 2.356, radius: 42, speed: 0.05, size: 4.2, history: [] },
  { rgb: "153, 51, 255", color: "#9933ff", angle: 3.142, radius: 48, speed: 0.05, size: 4.0, history: [] },
  { rgb: "255, 102, 0", color: "#ff6600", angle: 3.927, radius: 36, speed: 0.05, size: 4.5, history: [] },
  { rgb: "51, 153, 255", color: "#3399ff", angle: 4.712, radius: 52, speed: 0.05, size: 4.0, history: [] },
  { rgb: "255, 51, 153", color: "#ff3399", angle: 5.498, radius: 40, speed: 0.05, size: 4.2, history: [] },
];

const TRAIL_LENGTH = 18;
const ANCHOR_LAG = 0.12;

const CursorAnimation = () => {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const anchorRef = useRef({ x: 0, y: 0 });
  const dotsRef = useRef<OrbDot[]>(DOTS.map((d) => ({ ...d, history: [] })));

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

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const drawGradientLine = (
      points: { x: number; y: number }[],
      color: string,
      baseWidth: number,
      glow: number
    ) => {
      if (points.length < 2) return;
      for (let i = 0; i < points.length - 1; i++) {
        const t = i / (points.length - 1);
        const opacity = 0.05 + t * 0.75;
        const width = baseWidth * (0.2 + t * 0.8);
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
        ctx.strokeStyle = color.replace("<opacity>", opacity.toFixed(2));
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = color.replace("<opacity>", "0.6");
        ctx.shadowBlur = glow * t;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;
      const anchor = anchorRef.current;

      anchor.x += (mx - anchor.x) * ANCHOR_LAG;
      anchor.y += (my - anchor.y) * ANCHOR_LAG;

      if (!isVisible) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      dotsRef.current.forEach((dot) => {
        dot.angle += dot.speed;
        const x = anchor.x + Math.cos(dot.angle) * dot.radius;
        const y = anchor.y + Math.sin(dot.angle) * dot.radius;
        dot.history.push({ x, y });
        if (dot.history.length > TRAIL_LENGTH) dot.history.shift();
      });

      // Draw subtle orbit ring around the anchor
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, 46, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.stroke();

      dotsRef.current.forEach((dot) => {
        const trail = dot.history;
        if (trail.length > 1) {
          const colorTemplate = `rgba(${dot.rgb}, <opacity>)`;
          drawGradientLine(trail, colorTemplate, 2.8, 12);
        }

        const head = trail[trail.length - 1];
        if (head) {
          ctx.beginPath();
          ctx.arc(head.x, head.y, dot.size, 0, Math.PI * 2);
          ctx.fillStyle = dot.color;
          ctx.shadowColor = dot.color;
          ctx.shadowBlur = 16;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Center glow dot
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

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
