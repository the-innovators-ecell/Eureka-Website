'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Camera, Globe, Code } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden border-t border-[#D4AF37]/20 mt-20 pt-24 pb-12 bg-black"
    >
      {/* Background Gold Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 mb-16">
        <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
          <h3 className="text-3xl font-bold text-gradient-gold uppercase tracking-wider">The Innovators</h3>
          <p className="text-[#D4AF37] font-medium text-xs tracking-[0.2em] uppercase">
            &quot;Vision &middot; Value &middot; Venture&quot;
          </p>
          <p className="text-text-secondary text-base mt-2 max-w-md leading-relaxed font-light">
            Empowering students to translate radical ideas into feasible, thriving ventures. Join us in shaping the future of technology and entrepreneurship.
          </p>
        </div>

        <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
          <h4 className="text-sm font-semibold text-white tracking-[0.15em] uppercase">Quick Links</h4>
          <div className="flex flex-col gap-4 text-base text-text-secondary font-light">
            <Link href="/" className="hover:text-accent-gold transition-colors w-fit hover:translate-x-1 duration-300 transform">Home</Link>
            <Link href="/login" className="hover:text-accent-gold transition-colors w-fit hover:translate-x-1 duration-300 transform">Login</Link>
            <Link href="/register" className="hover:text-accent-gold transition-colors w-fit hover:translate-x-1 duration-300 transform">Register</Link>
            <Link href="/terms-and-conditions" className="hover:text-accent-gold transition-colors w-fit hover:translate-x-1 duration-300 transform">Terms & Conditions</Link>
          </div>
        </div>

        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <h4 className="text-sm font-semibold text-white tracking-[0.15em] uppercase">Connect</h4>
          <div className="flex gap-5">
            <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center text-text-secondary hover:text-accent-gold transition-all border border-white/10 hover:border-[#D4AF37]/50 gold-glow hover-lift bg-[#111111]">
              <Camera size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center text-text-secondary hover:text-accent-gold transition-all border border-white/10 hover:border-[#D4AF37]/50 gold-glow hover-lift bg-[#111111]">
              <Globe size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full flex items-center justify-center text-text-secondary hover:text-accent-gold transition-all border border-white/10 hover:border-[#D4AF37]/50 gold-glow hover-lift bg-[#111111]">
              <Code size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 border-t border-[#D4AF37]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-text-secondary text-xs tracking-wider font-light text-center md:text-left uppercase">
          © {currentYear} The Innovators. All rights reserved.
        </p>
        <p className="text-text-secondary text-xs tracking-wider font-light text-center md:text-right uppercase">
          Built with innovation at IIT Bombay.
        </p>
      </div>
    </motion.footer>
  );
}
