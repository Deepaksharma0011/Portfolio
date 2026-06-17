import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

const CursorAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const moveTimeoutRef = useRef<number | null>(null);
  const particlesRef = useRef<TrailParticle[]>([]);
  const particleIdRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 });
  const isTouchRef = useRef(false);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      isTouchRef.current = true;
      return;
    }

    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

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
      setIsVisible(true);
      setIsMoving(true);

      // Calculate velocity for particle direction
      const vx = ((e.clientX - prev.x) / dt) * 12;
      const vy = ((e.clientY - prev.y) / dt) * 12;

      // Add trail particles when moving fast enough
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
            maxLife: 1,
            size: 1.5 + Math.random() * 2,
          });
        }
      }

      lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };

      if (moveTimeoutRef.current) {
        window.clearTimeout(moveTimeoutRef.current);
      }
      moveTimeoutRef.current = window.setTimeout(() => {
        setIsMoving(false);
      }, 120);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
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

        const opacity = p.life * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`;
        ctx.fill();

        // Draw line to next particle for trail effect
        const next = particles[i - 1];
        if (next) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.5})`;
          ctx.lineWidth = p.size * 0.5 * p.life;
          ctx.stroke();
        }
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (moveTimeoutRef.current) {
        window.clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [cursorX, cursorY]);

  // Don't render on touch devices
  if (isTouchRef.current) return null;

  return (
    <>
      {/* Trail canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        aria-hidden="true"
      />
      {/* Cursor ring follower */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isMoving ? 0.6 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div
          className={`rounded-full border border-primary/60 transition-all duration-150 ${
            isMoving ? "w-6 h-6" : "w-10 h-10 animate-pulse-glow"
          }`}
          style={{
            boxShadow: isMoving
              ? "0 0 20px -5px hsl(239 84% 67% / 0.4)"
              : "0 0 30px -5px hsl(239 84% 67% / 0.5)",
          }}
        />
      </motion.div>
      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-primary"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
};

export default CursorAnimation;
