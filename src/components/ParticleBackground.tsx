// src/components/ParticleBackground.tsx
import React, { useEffect, useRef } from "react";

/**
 * ParticleBackground
 * - Mobile/performance friendly canvas particle system
 * - Uses typed arrays and pointer events; caps DPR; pauses when not visible
 */
export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Lightweight mobile detection
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth <= 768 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches));

    // Cap DPR to keep fragment shading reasonable on high-dpr phones
    const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);

    // Particle tuning (lower values on mobile)
    const PARTICLE_COUNT = isMobile ? 60 : 100;
    const CONNECTION_DISTANCE = isMobile ? 120 : 150;
    const CONNECTION_DISTANCE_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

    // Typed arrays for performance
    const positions = new Float32Array(PARTICLE_COUNT * 2); // x,y pairs
    const velocities = new Float32Array(PARTICLE_COUNT * 2); // vx,vy pairs
    const radii = new Float32Array(PARTICLE_COUNT); // radius per particle

    // Initialize particles
    const initParticles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 2] = Math.random() * w;
        positions[i * 2 + 1] = Math.random() * h;
        velocities[i * 2] = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.5);
        velocities[i * 2 + 1] = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.5);
        radii[i] = Math.random() * (isMobile ? 1.5 : 2) + (isMobile ? 0.8 : 1);
      }
    };

    // Setup canvas size with DPR scaling to avoid huge fragment work
    const resizeCanvas = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      canvas.width = Math.max(1, Math.floor(cssW * DPR));
      canvas.height = Math.max(1, Math.floor(cssH * DPR));
      // scale the 2D context so drawing works in CSS pixels
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    initParticles();
    resizeCanvas();

    // Pointer (mouse / touch) state
    let pointerX = -9999;
    let pointerY = -9999;
    let pointerActive = false;
    const POINTER_RADIUS = isMobile ? 100 : 150;
    const POINTER_RADIUS_SQ = POINTER_RADIUS * POINTER_RADIUS;

    // Pointer handlers (use pointer events for mouse & touch)
    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      pointerActive = true;
    };
    const onPointerLeave = () => {
      pointerActive = false;
      pointerX = -9999;
      pointerY = -9999;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("pointercancel", onPointerLeave, { passive: true });

    // Pause when tab disabled (save battery)
    const onVisibilityChange = () => {
      visibleRef.current = !document.hidden;
      if (!visibleRef.current && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (visibleRef.current && rafRef.current === null) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Throttle resize using timer
    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        resizeCanvas();
        // re-initialize positions to stay within bounds (optional)
        // We keep particles in bounds by clamping below, so full re-init is optional
        resizeTimeout = null;
      }, 120);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Animation loop (optimized)
    const bgFillStyle = "rgba(16, 12, 31, 0.06)"; // slightly stronger trail for visibility
    const particleFill = "rgba(0,255,255,0.85)";
    const strokeBaseAlpha = 0.28;

    let lastTime = performance.now();
    const animate = (time?: number) => {
      // stop if page hidden
      if (!visibleRef.current) {
        rafRef.current = null;
        return;
      }

      // delta not used heavily here, but kept for future easing
      const now = time ?? performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Fade trail
      ctx.fillStyle = bgFillStyle;
      ctx.fillRect(0, 0, canvas.width / DPR, canvas.height / DPR);

      const w = window.innerWidth;
      const h = window.innerHeight;

      // Update & draw particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 2;
        const x = positions[ix];
        const y = positions[ix + 1];
        let vx = velocities[ix];
        let vy = velocities[ix + 1];

        // Integrate
        let nx = x + vx;
        let ny = y + vy;

        // Boundary bounce
        if (nx < 0) {
          nx = 0;
          vx = -vx;
        } else if (nx > w) {
          nx = w;
          vx = -vx;
        }
        if (ny < 0) {
          ny = 0;
          vy = -vy;
        } else if (ny > h) {
          ny = h;
          vy = -vy;
        }

        // Pointer repulsion (cheap: compare squared distances first)
        if (pointerActive) {
          const dx = pointerX - nx;
          const dy = pointerY - ny;
          const distSq = dx * dx + dy * dy;
          if (distSq < POINTER_RADIUS_SQ) {
            // compute actual distance once (sqrt) and apply a small push
            const dist = Math.sqrt(distSq) || 0.0001;
            const force = (POINTER_RADIUS - dist) / POINTER_RADIUS; // 0..1
            const push = force * (isMobile ? 1.6 : 2.2);
            nx -= (dx / dist) * push;
            ny -= (dy / dist) * push;
          }
        }

        // write back
        positions[ix] = nx;
        positions[ix + 1] = ny;
        velocities[ix] = vx;
        velocities[ix + 1] = vy;

        // draw particle
        ctx.beginPath();
        ctx.arc(nx, ny, radii[i], 0, Math.PI * 2);
        ctx.fillStyle = particleFill;
        ctx.fill();
      }

      // Draw connections (O(n^2) but cheap with early exit using squared distances)
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 2;
        const xi = positions[ix];
        const yi = positions[ix + 1];

        // inner loop starts at i+1 to avoid duplicate lines
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const jx = j * 2;
          const xj = positions[jx];
          const yj = positions[jx + 1];
          const dx = xj - xi;
          const dy = yj - yi;
          const distSq = dx * dx + dy * dy;
          if (distSq < CONNECTION_DISTANCE_SQ) {
            // opacity decreases with distance
            const opacity = 1 - distSq / CONNECTION_DISTANCE_SQ;
            ctx.beginPath();
            ctx.moveTo(xi, yi);
            ctx.lineTo(xj, yj);
            ctx.strokeStyle = `rgba(0,255,255,${opacity * strokeBaseAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Start loop
    rafRef.current = requestAnimationFrame(animate);

    // Visibility initial state
    visibleRef.current = !document.hidden;
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Cleanup on unmount
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, top: 0, left: 0 }}
    />
  );
};

export default ParticleBackground;
