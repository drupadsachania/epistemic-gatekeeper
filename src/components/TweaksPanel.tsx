/**
 * TweaksPanel.tsx — Interactive theme tweaker UI
 * Allows users to switch color palettes, adjust motion intensity,
 * and control grain opacity. Floats in bottom-right corner.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './TweaksPanel.module.css';

export interface TweaksPanelProps {
  /** Enable the tweaks panel */
  enabled?: boolean;
}

export const TweaksPanel: React.FC<TweaksPanelProps> = ({ enabled = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [palette, setPalette] = useState<'default' | 'aurora' | 'ember' | 'mono'>('default');
  const [motionIntensity, setMotionIntensity] = useState(1);
  const [grainOpacity, setGrainOpacity] = useState(0.5);
  const panelRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 16, y: 16 });
  const dragStartRef = useRef<{ sx: number; sy: number; startX: number; startY: number } | null>(null);

  const PAD = 16;

  // Emit tweakchange event when values change (for ShaderBackground to listen to)
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('tweakchange', {
        detail: {
          paletteName: palette,
          motionIntensity,
          grainOpacity,
        },
      })
    );
  }, [palette, motionIntensity, grainOpacity]);

  // Update grain overlay opacity when grainOpacity changes
  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      const beforeEl = window.getComputedStyle(body, '::before');
      // Note: We can't directly modify ::before opacity via JS, but this could
      // be done via CSS variable or by dynamically creating a style tag
      const style = document.getElementById('grain-opacity-style') || (() => {
        const s = document.createElement('style');
        s.id = 'grain-opacity-style';
        document.head.appendChild(s);
        return s;
      })();
      style.textContent = `body::before { opacity: ${grainOpacity} !important; }`;
    }
  }, [grainOpacity]);

  // Clamp panel position to viewport
  const clampToViewport = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const w = panel.offsetWidth;
    const h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = `${offsetRef.current.x}px`;
    panel.style.bottom = `${offsetRef.current.y}px`;
  }, []);

  // Handle drag to move panel
  const handleDragStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const panel = panelRef.current;
      if (!panel || !isOpen) return;

      const rect = panel.getBoundingClientRect();
      dragStartRef.current = {
        sx: e.clientX,
        sy: e.clientY,
        startX: window.innerWidth - rect.right,
        startY: window.innerHeight - rect.bottom,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!dragStartRef.current) return;
        const dx = moveEvent.clientX - dragStartRef.current.sx;
        const dy = moveEvent.clientY - dragStartRef.current.sy;
        offsetRef.current = {
          x: dragStartRef.current.startX - dx,
          y: dragStartRef.current.startY - dy,
        };
        clampToViewport();
      };

      const handleMouseUp = () => {
        dragStartRef.current = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [isOpen, clampToViewport]
  );

  useEffect(() => {
    if (!isOpen) return;
    clampToViewport();

    const handleResize = () => clampToViewport();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, clampToViewport]);

  if (!enabled || !isOpen) {
    return (
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(true)}
        title="Open tweaks"
        aria-label="Open tweaks"
      >
        ⚙
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className={styles.panel}
      style={{
        right: `${offsetRef.current.x}px`,
        bottom: `${offsetRef.current.y}px`,
      }}
    >
      {/* Header */}
      <div className={styles.header} onMouseDown={handleDragStart}>
        <h3 className={styles.title}>Tweaks</h3>
        <button
          className={styles.closeButton}
          onClick={() => setIsOpen(false)}
          onMouseDown={(e) => e.stopPropagation()}
          aria-label="Close tweaks"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Palette section */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Palette</label>
          <div className={styles.radioGroup}>
            {(['default', 'aurora', 'ember', 'mono'] as const).map((p) => (
              <label key={p} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="palette"
                  value={p}
                  checked={palette === p}
                  onChange={(e) => setPalette(e.target.value as typeof p)}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Motion intensity section */}
        <div className={styles.section}>
          <label className={styles.rowLabel}>
            <span>Motion</span>
            <span className={styles.value}>{motionIntensity.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={motionIntensity}
            onChange={(e) => setMotionIntensity(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>

        {/* Grain opacity section */}
        <div className={styles.section}>
          <label className={styles.rowLabel}>
            <span>Grain</span>
            <span className={styles.value}>{Math.round(grainOpacity * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={grainOpacity}
            onChange={(e) => setGrainOpacity(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>
    </div>
  );
};

export default TweaksPanel;
