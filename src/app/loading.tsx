'use client';

import { motion } from 'motion/react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary z-50">
      <div className="relative w-24 h-24">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-accent-cyan opacity-80"
        />
        {/* Inner rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-b-2 border-l-2 border-accent-purple opacity-80"
        />
        {/* Center pulse */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-8 rounded-full bg-accent-blue shadow-[0_0_20px_#00d4ff]"
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-text-secondary font-medium tracking-widest uppercase text-sm animate-pulse"
      >
        Initializing...
      </motion.p>
    </div>
  );
}
