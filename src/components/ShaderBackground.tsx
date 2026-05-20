/**
 * ShaderBackground.tsx — Animated 2D canvas background
 * Lightweight plasma blob shader with palette switching and motion intensity control.
 * Listens for tweakchange events from the TweaksPanel to update appearance in real-time.
 */

import React, { useEffect, useRef } from 'react';

export interface ShaderBackgroundProps {
  /** Initial palette name */
  palette?: 'default' | 'aurora' | 'ember' | 'mono';
  /** Initial motion intensity (0-2) */
  motionIntensity?: number;
}

const PALETTES = {
  default: [
    { r: 120, g: 220, b: 250 },  // cyan
    { r: 140, g: 120, b: 245 },  // indigo
    { r: 250, g: 200, b: 110 },  // amber
  ],
  aurora: [
    { r: 110, g: 240, b: 200 },
    { r: 80, g: 180, b: 255 },
    { r: 200, g: 120, b: 255 },
  ],
  ember: [
    { r: 250, g: 130, b: 90 },
    { r: 240, g: 100, b: 160 },
    { r: 250, g: 200, b: 110 },
  ],
  mono: [
    { r: 200, g: 200, b: 220 },
    { r: 140, g: 145, b: 170 },
    { r: 90, g: 100, b: 130 },
  ],
};

const BLOBS = [
  { x: 0.15, y: 0.2, r: 0.55, i: 0, drift: 0.18 },
  { x: 0.85, y: 0.35, r: 0.5, i: 1, drift: 0.22 },
  { x: 0.3, y: 0.85, r: 0.45, i: 2, drift: 0.16 },
  { x: 0.7, y: 0.95, r: 0.4, i: 1, drift: 0.2 },
];

export const ShaderBackground: React.FC<ShaderBackgroundProps> = ({
  palette = 'default',
  motionIntensity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    palette: PALETTES[palette],
    intensity: motionIntensity,
    running: true,
    w: 0,
    h: 0,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    mouseX: 0,
    mouseY: 0,
    tMouseX: 0,
    tMouseY: 0,
    scroll: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = stateRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Resize handler
    const resize = () => {
      state.w = window.innerWidth;
      state.h = window.innerHeight;
      canvas.width = state.w * state.dpr;
      canvas.height = state.h * state.dpr;
      canvas.style.width = `${state.w}px`;
      canvas.style.height = `${state.h}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    };

    resize();
    const resizeListener = () => resize();
    window.addEventListener('resize', resizeListener);

    // Mouse tracking
    const mouseMoveListener = (e: MouseEvent) => {
      state.tMouseX = e.clientX;
      state.tMouseY = e.clientY;
    };
    window.addEventListener('mousemove', mouseMoveListener);

    // Scroll tracking
    const scrollListener = () => {
      state.scroll = window.scrollY;
    };
    window.addEventListener('scroll', scrollListener, { passive: true });

    // Tweak change listener (from TweaksPanel)
    const tweakChangeListener = (e: CustomEvent) => {
      if (e.detail?.motionIntensity !== undefined) {
        state.intensity = e.detail.motionIntensity;
      }
      if (e.detail?.paletteName) {
        state.palette = PALETTES[e.detail.paletteName as keyof typeof PALETTES] || PALETTES.default;
      }
    };
    window.addEventListener('tweakchange', tweakChangeListener as EventListener);

    // Animation loop
    let animId: number;
    const draw = (t: number) => {
      if (!state.running) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Smooth mouse lerp
      state.mouseX += (state.tMouseX - state.mouseX) * 0.06;
      state.mouseY += (state.tMouseY - state.mouseY) * 0.06;

      ctx.clearRect(0, 0, state.w, state.h);

      const baseT = t * 0.00012 * state.intensity;

      // Draw blobs
      BLOBS.forEach((b, idx) => {
        const c = state.palette[b.i];

        // Drift positions
        const ox = Math.sin(baseT * (1 + idx * 0.3)) * b.drift;
        const oy = Math.cos(baseT * (0.8 + idx * 0.25)) * b.drift;

        // Mouse parallax
        const mx =
          ((state.mouseX / state.w - 0.5) * 0.06) *
          (idx % 2 === 0 ? 1 : -1);
        const my =
          ((state.mouseY / state.h - 0.5) * 0.06) *
          (idx % 2 === 0 ? 1 : -1);

        // Scroll shift
        const sy = -state.scroll * 0.0001 * (idx + 1);

        const cx = (b.x + ox + mx) * state.w;
        const cy = (b.y + oy + my + sy) * state.h;
        const rad = b.r * Math.max(state.w, state.h);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        const alpha = 0.18 * state.intensity;
        grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${alpha})`);
        grad.addColorStop(0.5, `rgba(${c.r},${c.g},${c.b},${alpha * 0.35})`);
        grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cursor glow
      if (state.mouseX > 0 && state.mouseY > 0) {
        const cg = ctx.createRadialGradient(
          state.mouseX,
          state.mouseY,
          0,
          state.mouseX,
          state.mouseY,
          220
        );
        const c = state.palette[0];
        cg.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${0.08 * state.intensity})`);
        cg.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(state.mouseX, state.mouseY, 220, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    // Expose debug/control interface
    (window as any).__shaderBG = {
      pause: () => {
        state.running = false;
      },
      resume: () => {
        state.running = true;
      },
      setIntensity: (v: number) => {
        state.intensity = v;
      },
      setPalette: (name: string) => {
        state.palette =
          PALETTES[name as keyof typeof PALETTES] || PALETTES.default;
      },
    };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeListener);
      window.removeEventListener('mousemove', mouseMoveListener);
      window.removeEventListener('scroll', scrollListener);
      window.removeEventListener('tweakchange', tweakChangeListener as EventListener);
      delete (window as any).__shaderBG;
    };
  }, []);

  return (
    <canvas
      id="shader-canvas"
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.9,
      }}
    />
  );
};

export default ShaderBackground;
