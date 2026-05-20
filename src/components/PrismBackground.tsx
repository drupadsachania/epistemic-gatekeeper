/**
 * PrismBackground.tsx — Refractive light beams canvas.
 * Converted from prism-bg.jsx IIFE to a React component.
 * Fixed canvas sits at z-index 0 with mix-blend-mode: multiply.
 * Listens for `tweakchange` events for palette/intensity control.
 */

import React, { useEffect, useRef } from 'react';

interface Beam {
  angle: number;
  x: number;
  y: number;
  len: number;
  width: number;
  speed: number;
  color: number;
  phase: number;
}

interface PaletteEntry {
  h: number;
  s: number;
  l: number;
  a: number;
}

type PaletteName = 'default' | 'aurora' | 'ember' | 'mono';

const PALETTES: Record<PaletteName, PaletteEntry[]> = {
  default: [
    { h: 252, s: 90, l: 65, a: 0.18 },  // indigo
    { h: 245, s: 85, l: 70, a: 0.14 },  // indigo lighter
    { h: 38,  s: 95, l: 65, a: 0.12 },  // amber
    { h: 270, s: 70, l: 75, a: 0.10 },  // soft violet
  ],
  aurora: [
    { h: 200, s: 85, l: 65, a: 0.16 },
    { h: 165, s: 80, l: 60, a: 0.14 },
    { h: 285, s: 80, l: 70, a: 0.12 },
  ],
  ember: [
    { h: 24,  s: 95, l: 60, a: 0.18 },
    { h: 0,   s: 80, l: 65, a: 0.14 },
    { h: 38,  s: 95, l: 65, a: 0.16 },
  ],
  mono: [
    { h: 240, s: 8,  l: 35, a: 0.14 },
    { h: 240, s: 6,  l: 25, a: 0.10 },
    { h: 240, s: 4,  l: 45, a: 0.08 },
  ],
};

const BEAMS: Beam[] = [
  { angle: -0.55, x: 1.05, y: -0.15, len: 1.8, width: 0.22, speed: 0.18, color: 0, phase: 0.0 },
  { angle: -0.62, x: 0.95, y: -0.10, len: 1.7, width: 0.16, speed: 0.22, color: 1, phase: 0.4 },
  { angle: -0.50, x: 1.10, y:  0.05, len: 1.6, width: 0.28, speed: 0.14, color: 2, phase: 1.2 },
  { angle: -0.45, x: 0.85, y:  0.20, len: 1.5, width: 0.18, speed: 0.20, color: 0, phase: 2.0 },
  { angle: -0.40, x: 1.20, y:  0.35, len: 1.4, width: 0.14, speed: 0.16, color: 1, phase: 2.8 },
  // counter-beams from lower-left
  { angle:  2.65, x: -0.05, y: 1.05, len: 1.5, width: 0.22, speed: 0.20, color: 3, phase: 1.5 },
  { angle:  2.70, x:  0.10, y: 0.95, len: 1.3, width: 0.16, speed: 0.18, color: 0, phase: 3.0 },
];

const PrismBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let mouseX = 0, mouseY = 0, tMouseX = 0, tMouseY = 0;
    let scroll = 0;
    let intensity = 1;
    let running = true;
    let currentPalette: PaletteEntry[] = PALETTES.default;
    let rafId = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width  = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width  = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const onResize   = () => resize();
    const onMouseMove = (e: MouseEvent) => { tMouseX = e.clientX; tMouseY = e.clientY; };
    const onScroll   = () => { scroll = window.scrollY; };
    const onTweak    = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      if (typeof detail.motionIntensity === 'number') intensity = detail.motionIntensity;
      if (detail.palette && PALETTES[detail.palette as PaletteName]) {
        currentPalette = PALETTES[detail.palette as PaletteName];
      }
    };

    window.addEventListener('resize',    onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll',    onScroll, { passive: true });
    window.addEventListener('tweakchange', onTweak);

    function draw(t: number) {
      if (!running) { rafId = requestAnimationFrame(draw); return; }

      mouseX += (tMouseX - mouseX) * 0.04;
      mouseY += (tMouseY - mouseY) * 0.04;

      ctx!.clearRect(0, 0, w, h);

      const mxNorm   = mouseX / w - 0.5;
      const myNorm   = mouseY / h - 0.5;
      const baseTime = t * 0.0001 * intensity;
      const maxDim   = Math.max(w, h);

      BEAMS.forEach((b, i) => {
        const c         = currentPalette[b.color % currentPalette.length];
        const driftX    = Math.sin(baseTime * b.speed + b.phase) * 0.05;
        const driftY    = Math.cos(baseTime * b.speed * 0.8 + b.phase) * 0.04;
        const mx        = mxNorm * 0.03 * (i % 2 === 0 ? 1 : -1);
        const my        = myNorm * 0.03 * (i % 2 === 0 ? 1 : -1);
        const sy        = -scroll * 0.00008 * (i + 1);

        const cx  = (b.x + driftX + mx) * w;
        const cy  = (b.y + driftY + my + sy) * h;
        const len = b.len * maxDim;
        const wid = b.width * maxDim;

        const breath = 0.85 + 0.15 * Math.sin(baseTime * 1.2 + b.phase);
        const alpha  = c.a * breath * intensity;

        ctx!.save();
        ctx!.translate(cx, cy);
        ctx!.rotate(b.angle);

        const grad = ctx!.createLinearGradient(-len / 2, 0, len / 2, 0);
        grad.addColorStop(0,   `hsla(${c.h},${c.s}%,${c.l}%,0)`);
        grad.addColorStop(0.3, `hsla(${c.h},${c.s}%,${c.l}%,${alpha})`);
        grad.addColorStop(0.6, `hsla(${c.h},${c.s}%,${c.l}%,${alpha * 0.9})`);
        grad.addColorStop(1,   `hsla(${c.h},${c.s}%,${c.l}%,0)`);

        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.ellipse(0, 0, len / 2, wid / 2, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      });

      // subtle cursor refraction spot
      if (mouseX > 0 && mouseY > 0 && intensity > 0.1) {
        const cg = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 280);
        const c  = currentPalette[0];
        cg.addColorStop(0,   `hsla(${c.h},${c.s}%,${c.l}%,${0.10 * intensity})`);
        cg.addColorStop(0.5, `hsla(${c.h},${c.s}%,${c.l}%,${0.03 * intensity})`);
        cg.addColorStop(1,   `hsla(${c.h},${c.s}%,${c.l}%,0)`);
        ctx!.fillStyle = cg;
        ctx!.beginPath();
        ctx!.arc(mouseX, mouseY, 280, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafId = requestAnimationFrame(draw);
    }
    rafId = requestAnimationFrame(draw);

    // Expose control API
    (window as any).__prismBG = {
      pause:        () => { running = false; },
      resume:       () => { running = true; },
      setIntensity: (v: number) => { intensity = v; },
      setPalette:   (name: PaletteName) => { currentPalette = PALETTES[name] ?? PALETTES.default; },
    };

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize',     onResize);
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('scroll',     onScroll);
      window.removeEventListener('tweakchange', onTweak);
    };
  }, []);

  return <canvas ref={canvasRef} id="prism-canvas" aria-hidden="true" />;
};

export default PrismBackground;
