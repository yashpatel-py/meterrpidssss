import React from 'react';
import { motion } from 'framer-motion';

const defaultVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 0.84, 0.44, 1],
    },
  },
};

function Reveal({ children, delay = 0, variants = defaultVariants, className }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: { ...variants.visible.transition, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
