/**
 * ArgusMark.tsx — the Argus mark, redrawn as line art from the original artwork:
 * an almond eye with iris and pupil rings, side ticks, and eight circuit leads ending in nodes.
 * Drawn in currentColor so it takes ink in the light theme and paper in the dark theme
 * (no gradients, glow or effects on marks — kairos-design-handoff §10).
 */

import React from 'react';

interface ArgusMarkProps {
  size?: number;          // rendered height in px; width follows the 456:422 artwork ratio
  title?: string;         // accessible name; omit (decorative) when a visible label sits next to it
  className?: string;
}

const ArgusMark: React.FC<ArgusMarkProps> = ({ size = 96, title, className }) => {
  const w = Math.round(size * (456 / 422));
  const decorative = !title;
  return (
    <svg
      className={className}
      width={w}
      height={size}
      viewBox="172 76 456 422"
      fill="none"
      stroke="currentColor"
      strokeWidth={13}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}
      {/* Eye */}
      <path d="M205 287 Q400 93 595 287 Q400 481 205 287 Z" />
      {/* Iris and pupil */}
      <circle cx="400" cy="287" r="76" />
      <circle cx="400" cy="287" r="34" />
      {/* Side ticks */}
      <path d="M252 287 H288 M302 262 V272 M302 302 V312" />
      <path d="M548 287 H512 M498 262 V272 M498 302 V312" />
      {/* Upper leads */}
      <path d="M345 198 V125 M455 198 V125" />
      <path d="M268 233 V128 H222 M532 233 V128 H578" />
      {/* Lower leads */}
      <path d="M345 376 V449 M455 376 V449" />
      <path d="M268 341 V446 H222 M532 341 V446 H578" />
      {/* Nodes */}
      <circle cx="345" cy="106" r="19" />
      <circle cx="455" cy="106" r="19" />
      <circle cx="203" cy="128" r="19" />
      <circle cx="597" cy="128" r="19" />
      <circle cx="345" cy="468" r="19" />
      <circle cx="455" cy="468" r="19" />
      <circle cx="203" cy="446" r="19" />
      <circle cx="597" cy="446" r="19" />
    </svg>
  );
};

export default ArgusMark;
