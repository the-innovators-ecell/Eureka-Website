'use client';

import { motion } from 'motion/react';
import { Trophy, Sparkles, Clock } from 'lucide-react';

export default function PrizesSection() {
  return (
    <section id="prizes" className="py-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Prize <span className="text-gradient-gold">Pool</span>
          </h2>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto rounded-full shadow-[0_0_15px_rgba(212,175,55,0.6)]"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="glass-panel p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden text-center border border-[#D4AF37]/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-gradient-to-br from-[#111111] via-[#080808] to-[#18160E]"
        >
          {/* Ambient Lighting & Decorative Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FFDF00]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            {/* Glowing Trophy Icon Badge */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.25)] animate-pulse">
                <Trophy size={48} />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-lg">
                <Sparkles size={16} />
              </div>
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black tracking-widest uppercase mb-6 shadow-sm">
              <Clock size={14} /> EXCITING REWARDS & PRIZES
            </div>

            {/* Headline */}
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFDF00] to-[#D4AF37] tracking-tight uppercase mb-4">
              Soon to be Announced
            </h3>

            {/* Description */}
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed mb-6">
              The official prize pool, reward tiers, and exclusive winner perks for <strong>Eureka Campus Ideathon 2026</strong> are currently being finalized with our partners and sponsors.
            </p>

            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full opacity-60" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

