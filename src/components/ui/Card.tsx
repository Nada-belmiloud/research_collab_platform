import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', animate = true, hover = true }) => {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true }}
      className={`bg-white rounded-2xl p-6 border border-brand-navy/5 shadow-sm transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
