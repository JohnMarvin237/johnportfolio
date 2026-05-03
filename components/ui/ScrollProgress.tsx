'use client';
// Client Component — useScroll requires the browser scroll API

import { motion, useScroll, useReducedMotion } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-1 bg-primary-500 origin-left z-50 pointer-events-none"
    />
  );
}
