import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

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
];

const CursorAnimation = () => {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const moveTimeoutRef = useRef<number | null>(null);
  const particlesRef = useRef<TrailParticle[]>([]);
  const particleIdRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const idleAngleRef = useRef(0);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

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

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      setIsMoving(true);
      isMovingRef.current = true;

      const vx = ((e.clientX - prev.x) / dt) * 12;
      const vy = ((e.clientY - prev.y) / dt) * 12;

      const distance = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);
      if (distance > 3) {
        const count = Math.min(Math.floor(distance / 4), 4);
        for (let i = 0; i < count; i++) {
          const t = i / count;
          const px = prev.x + (e.clientX - prev.x) * t;
          const py = prev.y + (e.clientY - prev.y) * t;
          particlesRef.current.push({
            id: particleIdRef.current++,
            x: px,
            y: py,
            vx: vx + (Math.random() - 0.5) * 1.5,
            vy: vy + (Math.random() - 0.5) * 1.5,
            life: 1,
            size: 1.5 + Math.random() * 2,
            color: TRAIL_COLORS[particleIdRef.current % TRAIL_COLORS.length],
          });
        }
      }

      lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };

      if (moveTimeoutRef.current) window.clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = window.setTimeout(() => {
        setIsMoving(false);
        isMovingRef.current = false;
      }, 140);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Moving trail particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.025;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const opacity = p.life * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${opacity})`;
        ctx.fill();

        const next = particles[i - 1];
        if (next && next.color === p.color) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(${p.color}, ${opacity * 0.5})`;
          ctx.lineWidth = p.size * 0.5 * p.life;
          ctx.stroke();
        }
      }

      // Idle: rotating multi-colored orbiting lines around cursor
      if (!isMovingRef.current && isVisible) {
        const { x: cx, y: cy } = mousePosRef.current;
        idleAngleRef.current += 0.015;
        const baseAngle = idleAngleRef.current;
        const radius = 26;
        const lineCount = TRAIL_COLORS.length;
        const arcSpan = (Math.PI * 2) / lineCount * 0.55;

        for (let i = 0; i < lineCount; i++) {
          const color = TRAIL_COLORS[i];
          const startAngle =
            baseAngle + (i * Math.PI * 2) / lineCount + (i % 2 === 0 ? 0 : -baseAngle * 2);
          const endAngle = startAngle + arcSpan;

          ctx.beginPath();
          ctx.arc(cx, cy, radius + (i % 2) * 4, startAngle, endAngle);
          ctx.strokeStyle = `rgba(${color}, 0.85)`;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.shadowColor = `rgba(${color}, 0.8)`;
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
  }, [enabled, cursorX, cursorY, isVisible]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        aria-hidden="true"
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isMoving ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <div
          className={`rounded-full border border-primary/60 transition-all duration-150 ${
            isMoving ? "w-6 h-6" : "w-10 h-10"
          }`}
          style={{
            boxShadow: isMoving
              ? "0 0 20px -5px hsl(239 84% 67% / 0.4)"
              : "0 0 30px -5px hsl(239 84% 67% / 0.5)",
          }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-primary"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
};

export default CursorAnimation;
