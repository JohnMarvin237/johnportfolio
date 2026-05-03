'use client';
// Client Component — framer-motion hooks require the browser environment

import { motion, useReducedMotion } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const containerVariants = (delay: number) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: delay,
    },
  },
});

const charVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

export default function SplitText({ text, className, delay = 0 }: SplitTextProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      variants={containerVariants(delay)}
      initial="hidden"
      animate="visible"
      className={className}
      aria-label={text}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={charVariants}
          style={{ display: 'inline-block' }}
          aria-hidden="true"
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
