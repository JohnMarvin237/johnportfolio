'use client';
// Client Component — framer-motion hooks require the browser environment

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

type Variant = 'fade-up' | 'fade' | 'slide-left';

interface AnimateInProps {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
}

const hiddenVariants: Record<Variant, { opacity: number; y?: number; x?: number }> = {
  'fade-up': { opacity: 0, y: 30 },
  fade: { opacity: 0 },
  'slide-left': { opacity: 0, x: -30 },
};

const visibleVariant = { opacity: 1, y: 0, x: 0 };

export default function AnimateIn({
  children,
  variant = 'fade-up',
  delay = 0,
  className,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();

  // When prefers-reduced-motion is set, skip the animation entirely by using
  // the same state for both initial and animate — no layout shift, no motion.
  const initial = shouldReduceMotion ? visibleVariant : hiddenVariants[variant];
  const animate = shouldReduceMotion || isInView ? visibleVariant : hiddenVariants[variant];

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.5, ease: 'easeOut', delay: shouldReduceMotion ? 0 : delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
