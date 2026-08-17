"use client";

import { motion } from "motion/react";
import { ShieldClose } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#000000] relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[#FFDF00]/5 rounded-full blur-[120px]" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg p-10 rounded-2xl backdrop-blur-xl bg-[#111111]/80 border border-[#D4AF37]/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative z-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.15)]">
            <ShieldClose className="text-red-400 w-8 h-8" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-[#D4AF37] via-[#FFDF00] to-[#D4AF37] bg-clip-text text-transparent tracking-wide">
          Registrations Closed
        </h1>
        <p className="text-gray-400 mb-8 text-base leading-relaxed">
          We have received enough registrations for Eureka Campus Ideathon &amp; Startup Pitching Competition. Thank you for your interest!
        </p>

        <div className="space-y-3">
          <Link href="/login">
            <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFDF00] text-black font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              Already Registered? Sign In
            </button>
          </Link>
          <Link href="/">
            <button className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all mt-3">
              Back to Home
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
