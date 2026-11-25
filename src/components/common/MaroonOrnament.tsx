import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EDITORIAL_EASE, EDITORIAL_VIEWPORT } from './MotionPrimitives';

interface MaroonOrnamentProps {
  variant?: 'maroon' | 'cream';
  className?: string;
  animate?: boolean;
}

/**
 * Exact vector ornament extracted from the Le R printed menu PDF content stream
 * (symmetric central fleur-de-lis flourish dividing category rules).
 * Supports progressive vector stroke-draw reveal when entering the viewport.
 */
export function MaroonOrnament({
  variant = 'maroon',
  className = '',
  animate = true,
}: MaroonOrnamentProps) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = animate && !prefersReduced;
  const strokeOrFill =
    variant === 'cream' ? 'var(--cream-on-dark)' : 'var(--deep-maroon)';

  if (!shouldAnimate) {
    return (
      <svg
        viewBox="0 0 36 24"
        fill="none"
        aria-hidden="true"
        className={`w-6 h-4 shrink-0 ${className}`}
      >
        <path
          d="M18 3C19.8 6.2 19.8 10.6 18 13.4C16.2 10.6 16.2 6.2 18 3Z"
          fill={strokeOrFill}
        />
        <path
          d="M18.4 12.8C18.7 8.4 22.8 5 25.4 7.8C27 9.6 25.8 12.1 23.8 11.8C22.5 11.6 21.9 10.2 22.8 9.3C20.9 9.9 19.8 12.1 18.4 12.8Z"
          fill={strokeOrFill}
        />
        <path
          d="M19.5 15.6C22.6 15.6 25 13.8 25.5 16.6C26 19.1 23.4 19.7 23.1 18.2"
          stroke={strokeOrFill}
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <path
          d="M17.6 12.8C17.3 8.4 13.2 5 10.6 7.8C9 9.6 10.2 12.1 12.2 11.8C13.5 11.6 14.1 10.2 13.2 9.3C15.1 9.9 16.2 12.1 17.6 12.8Z"
          fill={strokeOrFill}
        />
        <path
          d="M16.5 15.6C13.4 15.6 11 13.8 10.5 16.6C10 19.1 12.6 19.7 12.9 18.2"
          stroke={strokeOrFill}
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <rect x="15.2" y="13.5" width="5.6" height="1.2" fill={strokeOrFill} />
        <path
          d="M18 21C19 19 19 17.4 18 16.6C17 17.4 17 19 18 21Z"
          fill={strokeOrFill}
        />
      </svg>
    );
  }

  return (
    <motion.svg
      viewBox="0 0 36 24"
      fill="none"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={EDITORIAL_VIEWPORT}
      transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
      className={`w-6 h-4 shrink-0 ${className}`}
    >
      <motion.path
        d="M18 3C19.8 6.2 19.8 10.6 18 13.4C16.2 10.6 16.2 6.2 18 3Z"
        fill={strokeOrFill}
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={EDITORIAL_VIEWPORT}
        transition={{ duration: 0.45, delay: 0.06, ease: EDITORIAL_EASE }}
      />
      <motion.path
        d="M18.4 12.8C18.7 8.4 22.8 5 25.4 7.8C27 9.6 25.8 12.1 23.8 11.8C22.5 11.6 21.9 10.2 22.8 9.3C20.9 9.9 19.8 12.1 18.4 12.8Z"
        fill={strokeOrFill}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={EDITORIAL_VIEWPORT}
        transition={{ duration: 0.45, delay: 0.12, ease: EDITORIAL_EASE }}
      />
      <motion.path
        d="M19.5 15.6C22.6 15.6 25 13.8 25.5 16.6C26 19.1 23.4 19.7 23.1 18.2"
        stroke={strokeOrFill}
        strokeWidth="2.1"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={EDITORIAL_VIEWPORT}
        transition={{ duration: 0.65, delay: 0.15, ease: EDITORIAL_EASE }}
      />
      <motion.path
        d="M17.6 12.8C17.3 8.4 13.2 5 10.6 7.8C9 9.6 10.2 12.1 12.2 11.8C13.5 11.6 14.1 10.2 13.2 9.3C15.1 9.9 16.2 12.1 17.6 12.8Z"
        fill={strokeOrFill}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={EDITORIAL_VIEWPORT}
        transition={{ duration: 0.45, delay: 0.12, ease: EDITORIAL_EASE }}
      />
      <motion.path
        d="M16.5 15.6C13.4 15.6 11 13.8 10.5 16.6C10 19.1 12.6 19.7 12.9 18.2"
        stroke={strokeOrFill}
        strokeWidth="2.1"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={EDITORIAL_VIEWPORT}
        transition={{ duration: 0.65, delay: 0.15, ease: EDITORIAL_EASE }}
      />
      <rect x="15.2" y="13.5" width="5.6" height="1.2" fill={strokeOrFill} />
      <path
        d="M18 21C19 19 19 17.4 18 16.6C17 17.4 17 19 18 21Z"
        fill={strokeOrFill}
      />
    </motion.svg>
  );
}

export function OrnamentalCategoryRule({
  variant = 'maroon',
  className = '',
}: {
  variant?: 'maroon' | 'cream';
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const lineColor =
    variant === 'cream' ? 'bg-[#F3E6CB]/55' : 'bg-[#8E0F14]/75';

  if (prefersReduced) {
    return (
      <div
        className={`flex items-center gap-3 w-full ${className}`}
        aria-hidden="true"
      >
        <span className={`h-[1px] flex-1 ${lineColor}`} />
        <MaroonOrnament variant={variant} animate={false} />
        <span className={`h-[1px] flex-1 ${lineColor}`} />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 w-full ${className}`}
      aria-hidden="true"
    >
      <motion.span
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={EDITORIAL_VIEWPORT}
        transition={{ duration: 0.62, ease: EDITORIAL_EASE }}
        className={`h-[1px] flex-1 origin-right rtl:origin-left ${lineColor}`}
      />
      <MaroonOrnament variant={variant} />
      <motion.span
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={EDITORIAL_VIEWPORT}
        transition={{ duration: 0.62, ease: EDITORIAL_EASE }}
        className={`h-[1px] flex-1 origin-left rtl:origin-right ${lineColor}`}
      />
    </div>
  );
}
