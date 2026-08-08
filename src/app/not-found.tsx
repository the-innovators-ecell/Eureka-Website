'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#000000] px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 glass-panel p-12 rounded-3xl max-w-lg w-full border border-white/10"
      >
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFDF00] mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-6">Page Not Found</h2>
        <p className="text-text-secondary mb-10">
          The page you are looking for has drifted into the void. Let&apos;s get you back to the innovation hub.
        </p>
        
        <Link href="/">
          <InteractiveHoverButton
            text="Return Home"
            className="w-full h-12 bg-[#111] border-[#D4AF37]/50 glow-button uppercase tracking-widest text-sm"
          />
        </Link>
      </motion.div>
    </div>
  );
}
