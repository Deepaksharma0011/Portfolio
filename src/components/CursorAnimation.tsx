import { useEffect, useRef, useState } from "react";

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

const TRAIL_COLORS = [
  "139, 92, 246",   // violet
  "59, 130, 246",   // blue
  "236, 72, 153",   // pink
  "16, 185, 129",   // emerald
  "245, 158, 11",   // amber
  "99, 102, 241",   // indigo
  "14, 165, 233",   // sky
  "244, 114, 182",  // rose
];

const CursorAnimation = () => {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const moveTimeoutRef = useRef<number | null>(null);
  const particlesRef = useRef<TrailParticle[]>([]);
  const particleIdRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const idleAngleRef = useRef(0);

  // Detect device capabilities on mount (runs once on client)
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
      const now = performance.now();
      const prev = lastMouseRef.current;
      const dt = Math.max(now - prev.time, 1);

      mousePosRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      isMovingRef.current = true;

      const vx = ((e.clientX - prev.x) / dt) * 12;
      const vy = ((e.clientY - prev.y) / dt) * 12;

      const distance = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);
      if (distance > 2) {
        const count = Math.min(Math.floor(distance / 2.5), 8);
        for (let i = 0; i < count; i++) {
          const t = i / count;
          const px = prev.x + (e.clientX - prev.x) * t;
          const py = prev.y + (e.clientY - prev.y) * t;
          particlesRef.current.push({
            id: particleIdRef.current++,
            x: px,
            y: py,
            vx: vx + (Math.random() - 0.5) * 2,
            vy: vy + (Math.random() - 0.5) * 2,
            life: 1,
            size: 1.5 + Math.random() * 2.5,
            color: TRAIL_COLORS[particleIdRef.current % TRAIL_COLORS.length],
          });
        }
      }

      lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };

      if (moveTimeoutRef.current) window.clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = window.setTimeout(() => {
        isMovingRef.current = false;
      }, 160);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Moving trail particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.022;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const opacity = p.life * 0.8;

        // Draw stretched line trail between consecutive particles
        const next = particles[i - 1];
        if (next) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          const midX = (p.x + next.x) / 2;
          const midY = (p.y + next.y) / 2;
          ctx.quadraticCurveTo(midX, midY, next.x, next.y);
          ctx.strokeStyle = `rgba(${p.color}, ${opacity * 0.7})`;
          ctx.lineWidth = p.size * 0.8 * p.life;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${opacity})`;
        ctx.fill();
      }

      // Cursor position dot (subtle glow)
      const { x: cx, y: cy } = mousePosRef.current;
      if (isVisible) {
        ctx.beginPath();
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139, 92, 246, 0.9)";
        ctx.shadowColor = "rgba(139, 92, 246, 0.8)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Idle: long rotating multi-colored lines around cursor
      if (!isMovingRef.current && isVisible) {
        const { x: cx, y: cy } = mousePosRef.current;
        idleAngleRef.current += 0.012;
        const baseAngle = idleAngleRef.current;
        const innerRadius = 18;
        const outerRadius = 55;       // longer lines
        const lineCount = 16;         // more lines
        const arcSpan = (Math.PI * 2) / lineCount * 0.65;

        for (let i = 0; i < lineCount; i++) {
          const color = TRAIL_COLORS[i % TRAIL_COLORS.length];
          const angleOffset = (i * Math.PI * 2) / lineCount;
          const startAngle = baseAngle + angleOffset;
          const endAngle = startAngle + arcSpan;

          ctx.beginPath();
          ctx.arc(cx, cy, innerRadius + (i % 3) * 10, startAngle, endAngle);
          ctx.strokeStyle = `rgba(${color}, 0.85)`;
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.shadowColor = `rgba(${color}, 0.9)`;
          ctx.shadowBlur = 12;
          ctx.stroke();

          // Outer longer arc
          ctx.beginPath();
          ctx.arc(cx, cy, outerRadius + (i % 2) * 8, -baseAngle * 1.2 + angleOffset, -baseAngle * 1.2 + angleOffset + arcSpan * 1.3);
          ctx.strokeStyle = `rgba(${color}, 0.6)`;
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.shadowColor = `rgba(${color}, 0.7)`;
          ctx.shadowBlur = 8;
          ctx.stroke();
        }
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
