'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#000000] px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center z-10 glass-panel p-12 rounded-3xl max-w-lg w-full border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]"
      >
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <ShieldAlert size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">
          403
        </h1>
        <h2 className="text-xl font-bold text-red-400 mb-6">Access Denied</h2>
        <p className="text-text-secondary mb-10">
          You do not have the necessary clearance to view this sector. Please return to your designated area.
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
