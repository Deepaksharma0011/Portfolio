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
  { rgb: "255, 0, 128", color: "#ff0080", angle: 0, radius: 38, speed: 0.035, size: 3.3, history: [] },
  { rgb: "0, 229, 255", color: "#00e5ff", angle: 0.349, radius: 44, speed: 0.035, size: 3.3, history: [] },
  { rgb: "255, 204, 0", color: "#ffcc00", angle: 0.698, radius: 50, speed: 0.035, size: 3.3, history: [] },
  { rgb: "0, 255, 128", color: "#00ff80", angle: 1.047, radius: 42, speed: 0.035, size: 3.3, history: [] },
  { rgb: "157, 78, 221", color: "#9d4edd", angle: 1.396, radius: 48, speed: 0.035, size: 3.3, history: [] },
  { rgb: "255, 102, 0", color: "#ff6600", angle: 1.745, radius: 36, speed: 0.035, size: 3.3, history: [] },
  { rgb: "58, 134, 255", color: "#3a86ff", angle: 2.094, radius: 52, speed: 0.035, size: 3.3, history: [] },
  { rgb: "255, 0, 110", color: "#ff006e", angle: 2.443, radius: 40, speed: 0.035, size: 3.3, history: [] },
  { rgb: "0, 212, 255", color: "#00d4ff", angle: 2.793, radius: 46, speed: 0.035, size: 3.3, history: [] },
  { rgb: "161, 255, 10", color: "#a1ff0a", angle: 3.142, radius: 54, speed: 0.035, size: 3.3, history: [] },
  { rgb: "255, 0, 255", color: "#ff00ff", angle: 3.491, radius: 34, speed: 0.035, size: 3.3, history: [] },
  { rgb: "255, 170, 0", color: "#ffaa00", angle: 3.84, radius: 44, speed: 0.035, size: 3.3, history: [] },
  { rgb: "255, 51, 51", color: "#ff3333", angle: 4.189, radius: 48, speed: 0.035, size: 3.3, history: [] },
  { rgb: "6, 255, 165", color: "#06ffa5", angle: 4.538, radius: 36, speed: 0.035, size: 3.3, history: [] },
  { rgb: "199, 125, 255", color: "#c77dff", angle: 4.887, radius: 52, speed: 0.035, size: 3.3, history: [] },
  { rgb: "255, 92, 141", color: "#ff5c8d", angle: 5.236, radius: 40, speed: 0.035, size: 3.3, history: [] },
  { rgb: "57, 255, 20", color: "#39ff14", angle: 5.585, radius: 46, speed: 0.035, size: 3.3, history: [] },
  { rgb: "67, 97, 238", color: "#4361ee", angle: 5.934, radius: 50, speed: 0.035, size: 3.3, history: [] },
];

const TRAIL_LENGTH = 14;
const ANCHOR_LAG = 0.12;

const CursorAnimation = () => {
  const [enabled, setEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const anchorRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);
  const initializedRef = useRef(false);
  const dotsRef = useRef<OrbDot[]>(DOTS.map((d) => ({ ...d, history: [] })));

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const setPos = (x: number, y: number) => {
      mouseRef.current = { x, y };
      if (!initializedRef.current) {
        anchorRef.current = { x, y };
        initializedRef.current = true;
      }
      visibleRef.current = true;
    };

    const handleMouseMove = (e: MouseEvent) => setPos(e.clientX, e.clientY);
    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0] || e.changedTouches[0];
      if (t) setPos(t.clientX, t.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0] || e.changedTouches[0];
      if (t) setPos(t.clientX, t.clientY);
    };
    const handleMouseLeave = () => { visibleRef.current = false; };
    const handleMouseEnter = () => { visibleRef.current = true; };

    const drawTrail = (
      points: { x: number; y: number }[],
      color: string,
      rgb: string
    ) => {
      if (points.length < 2) return;
      const head = points[points.length - 1];
      const tail = points[0];
      const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      gradient.addColorStop(0, `rgba(${rgb}, 0.02)`);
      gradient.addColorStop(1, `rgba(${rgb}, 0.7)`);

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!visibleRef.current || !initializedRef.current) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const { x: mx, y: my } = mouseRef.current;
      const anchor = anchorRef.current;
      anchor.x += (mx - anchor.x) * ANCHOR_LAG;
      anchor.y += (my - anchor.y) * ANCHOR_LAG;

      dotsRef.current.forEach((dot) => {
        dot.angle += dot.speed;
        const x = anchor.x + Math.cos(dot.angle) * dot.radius;
        const y = anchor.y + Math.sin(dot.angle) * dot.radius;
        dot.history.push({ x, y });
        if (dot.history.length > TRAIL_LENGTH) dot.history.shift();
      });

      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, 46, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.stroke();

      dotsRef.current.forEach((dot) => {
        const trail = dot.history;
        if (trail.length > 1) drawTrail(trail, dot.color, dot.rgb);

        const head = trail[trail.length - 1];
        if (head) {
          ctx.beginPath();
          ctx.arc(head.x, head.y, dot.size, 0, Math.PI * 2);
          ctx.fillStyle = dot.color;
          ctx.shadowColor = dot.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameRef.current = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [enabled]);

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
