import React, { useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from 'motion/react';

/**
 * Curated motion constants for Le R ("The Printed Card, Alive").
 * GPU-only transforms and opacity; settles gracefully without overshoot.
 */
export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export const EDITORIAL_VIEWPORT = {
  once: true,
  amount: 'some',
} as const;

export const editorialContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
};

export const editorialItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EDITORIAL_EASE,
    },
  },
};

/**
 * Subtle fixed hairline reading-depth indicator in Le R maroon & warm gold.
 * Driven purely via useScroll transform (zero React re-renders during scroll).
 */
export function EditorialScrollProgress() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  if (prefersReduced) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 h-[2.5px] z-50 origin-left rtl:origin-right bg-gradient-to-r from-[#8E0F14] via-[#CC0000] to-[#EFCB8C] pointer-events-none"
    />
  );
}

interface EditorialRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  immediate?: boolean;
}

/**
 * Reusable scroll-triggered editorial block reveal.
 * Uses stationary outer ref + amount:'some' so tall sections or scrolled anchors
 * always reveal reliably, and degrades gracefully under prefers-reduced-motion.
 */
export function EditorialReveal({
  children,
  className = '',
  delay = 0,
  y = 14,
  duration = 0.56,
  immediate = false,
}: EditorialRevealProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 'some' });

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  if (immediate) {
    return (
      <motion.div
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay, ease: EDITORIAL_EASE }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface MaskedHeadingRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  immediate?: boolean;
}

/**
 * Text-mask vertical reveal inside an overflow-clipped stationary wrapper.
 * Observing the un-translated outer wrapper guarantees headings trigger 100%
 * reliably when any part enters the viewport.
 */
export function MaskedHeadingReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.64,
  immediate = false,
}: MaskedHeadingRevealProps) {
  const prefersReduced = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(wrapperRef, { once: true, amount: 'some' });

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  if (immediate) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: '0%' }}
          transition={{ duration, delay, ease: EDITORIAL_EASE }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={isInView ? { opacity: 1, y: '0%' } : { opacity: 0, y: '100%' }}
        transition={{ duration, delay, ease: EDITORIAL_EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface EditorialStaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}

/**
 * Staggered reveal container triggered once when entering the viewport.
 */
export function EditorialStaggerGroup({
  children,
  className = '',
  stagger = 0.055,
  delayChildren = 0.04,
}: EditorialStaggerGroupProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 'some' });

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function EditorialStaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={editorialItemVariants} className={className}>
      {children}
    </motion.div>
  );
}
