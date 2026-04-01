import React, { useEffect, useRef, useState, useCallback } from 'react';

// LLM-inspired token sequences representing different thinking patterns
const TOKEN_SEQUENCES = [
  'confidence grounding contradiction temporal reversibility epistemic warrant signal',
  'decision state ACT ESCALATE DEFER FAIL_SAFE autonomous agent safety',
  'uncertainty observable action understanding gap evidence validation domain',
  'agent drift oversight trust erosion signal noise autonomous systems',
  'reasoning chain token probability attention mechanism transformer architecture',
  'safety gate decision logic framework integration validation testing deployment',
  'epistemic governance autonomous decision making observable uncertainty analysis',
];

interface TextParticle {
  id: string;
  text: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
  vx: number;
  vy: number;
}

const ReactiveTextOverlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasDims, setCanvasDims] = useState({ width: 1200, height: 800 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const particlesRef = useRef<Map<string, TextParticle>>(new Map());
  const animationRef = useRef<number>();

  // Generate random sequence of tokens
  const generateTokenSequence = useCallback(() => {
    const sequence = TOKEN_SEQUENCES[Math.floor(Math.random() * TOKEN_SEQUENCES.length)];
    return sequence.split(' ');
  }, []);

  // Update canvas dimensions on container resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      setCanvasDims({
        width: rect.width,
        height: rect.height,
      });
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Handle mouse movement for reactive cursor behavior
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const container = containerRef.current;
    if (container) {
      document.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvasDims;

    // Define safe zone where content appears (center, for logo and text)
    const safeZone = {
      x: width * 0.2,
      y: height * 0.2,
      width: width * 0.6,
      height: height * 0.6,
    };

    let particleCount = 0;
    const targetParticleCount = 35;
    let tokenSequence = generateTokenSequence();
    let tokenIndex = 0;

    const generateParticle = (): TextParticle => {
      const token = tokenSequence[tokenIndex % tokenSequence.length];
      tokenIndex++;

      // Generate position avoiding safe zone
      let x, y;
      let attempts = 0;
      do {
        x = Math.random() * width;
        y = Math.random() * height;
        attempts++;
      } while (
        attempts < 3 &&
        x > safeZone.x &&
        x < safeZone.x + safeZone.width &&
        y > safeZone.y &&
        y < safeZone.y + safeZone.height
      );

      return {
        id: `particle-${Date.now()}-${Math.random()}`,
        text: token,
        x,
        y,
        opacity: 0,
        scale: 0.8 + Math.random() * 0.4,
        rotation: Math.random() * 360,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.2,
      };
    };

    const animate = () => {
      // Clear canvas with fade trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, width, height);

      const currentParticles = Array.from(particlesRef.current.values());

      // Generate new particles
      if (particleCount < targetParticleCount && Math.random() > 0.75) {
        const newParticle = generateParticle();
        particlesRef.current.set(newParticle.id, newParticle);
        particleCount++;
      }

      // Update and draw particles
      const particlesToRemove: string[] = [];

      currentParticles.forEach((particle) => {
        const updated = { ...particle };

        // Fade in
        if (updated.opacity < 0.5) {
          updated.opacity = Math.min(updated.opacity + 0.01, 0.5);
        }

        // Random fade out
        if (Math.random() > 0.995) {
          updated.opacity -= 0.02;
          if (updated.opacity <= 0) {
            particlesToRemove.push(particle.id);
            return;
          }
        }

        // Apply velocity
        updated.x += updated.vx;
        updated.y += updated.vy;

        // Gentle drift
        updated.vx += (Math.random() - 0.5) * 0.1;
        updated.vy -= 0.05;

        // Mouse repulsion when hovering
        if (isHovering) {
          const dx = updated.x - mousePos.x;
          const dy = updated.y - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repulsionRadius = 120;

          if (distance < repulsionRadius) {
            const force = (repulsionRadius - distance) / repulsionRadius;
            const angle = Math.atan2(dy, dx);
            updated.vx += Math.cos(angle) * force * 3;
            updated.vy += Math.sin(angle) * force * 3;
            updated.scale = Math.min(updated.scale + force * 0.15, 1.2);
            updated.opacity = Math.min(updated.opacity + force * 0.15, 0.8);
          }
        }

        // Slight rotation
        updated.rotation += 1 + (Math.random() - 0.5) * 2;

        // Clamp position to bounds
        if (updated.x < -50) updated.x = width + 50;
        if (updated.x > width + 50) updated.x = -50;
        if (updated.y < -50) {
          particlesToRemove.push(particle.id);
          return;
        }
        if (updated.y > height + 50) {
          particlesToRemove.push(particle.id);
          return;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = updated.opacity;
        ctx.font = '13px Inter';
        ctx.fillStyle = `hsl(234, 85%, ${65 + Math.sin(updated.rotation / 10) * 10}%)`;
        ctx.translate(updated.x, updated.y);
        ctx.rotate((updated.rotation * Math.PI) / 180);
        ctx.scale(updated.scale, updated.scale);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.filter = `blur(${0.3 - updated.opacity * 0.2}px)`;
        ctx.fillText(updated.text, 0, 0);
        ctx.restore();

        particlesRef.current.set(particle.id, updated);
      });

      // Remove dead particles
      particlesToRemove.forEach((id) => {
        particlesRef.current.delete(id);
        particleCount--;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasDims, isHovering, mousePos, generateTokenSequence]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        cursor: isHovering ? 'none' : 'default',
      }}
    >
      {/* Canvas for particle rendering */}
      <canvas
        ref={canvasRef}
        width={canvasDims.width}
        height={canvasDims.height}
        className="absolute inset-0 w-full h-full"
        style={{
          filter: 'blur(0.3px)',
          opacity: 0.65,
        }}
      />

      {/* Hover cursor glow effect - makes text part for cursor */}
      {isHovering && (
        <div
          className="absolute w-24 h-24 pointer-events-none"
          style={{
            left: mousePos.x - 48,
            top: mousePos.y - 48,
            borderRadius: '50%',
            border: '2px solid hsl(234, 85%, 65%)',
            background: 'radial-gradient(circle, rgba(107,114,207,0.15) 0%, transparent 70%)',
            boxShadow: '0 0 30px rgba(107,114,207,0.4), inset 0 0 20px rgba(107,114,207,0.2)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
};

export default ReactiveTextOverlay;
