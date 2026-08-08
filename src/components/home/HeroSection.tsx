'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import ParticleBackground from './ParticleBackground';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  // Countdown Timer Target Date: 22 August 2026
  const targetDate = new Date('2026-08-22T00:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: d < 10 ? `0${d}` : `${d}`,
          hours: h < 10 ? `0${h}` : `${h}`,
          minutes: m < 10 ? `0${m}` : `${m}`,
          seconds: s < 10 ? `0${s}` : `${s}`,
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-16 px-4">
      {/* Particle & Grid Network Background */}
      <ParticleBackground />
      
      {/* Ambient Gold Radial Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#E5C158]/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
          }
        }}
        className="max-w-6xl mx-auto text-center flex flex-col items-center relative z-10"
      >
        {/* Top Presenter Pill Badge (Matching Reference) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          className="bg-[#18160E] border border-[#E5C158]/40 text-[#E5C158] px-5 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase flex items-center gap-2 mb-8 shadow-[0_0_20px_rgba(229,193,88,0.2)]"
        >
          <div className="w-5 h-5 rounded-full relative overflow-hidden border border-[#E5C158]">
            <Image src="/images/logo.png" alt="Emblem" fill className="object-cover" />
          </div>
          <span>THE INNOVATORS CLUB PRESENTS</span>
        </motion.div>

        {/* Dual Line Heavy Typography Title (Matching Reference) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 25, scale: 0.98 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="mb-6 flex flex-col items-center"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl">
            Eureka Campus Ideathon &
          </h1>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#E5C158] via-[#FCE38A] to-[#C99C2B] drop-shadow-[0_0_35px_rgba(229,193,88,0.3)] max-w-4xl">
            Startup Pitching Competition
          </h1>
        </motion.div>
        
        {/* Subtitle (Matching Reference) */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-medium mb-8 tracking-wide"
        >
          Meet. Connect. <span className="text-[#E5C158] font-bold">Innovate Together.</span>
        </motion.p>
        
        {/* Event Date & Location Info Badges (Matching Reference) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <div className="bg-[#0D0D0D]/90 backdrop-blur-md border border-[#E5C158]/30 px-5 py-2.5 rounded-full text-xs sm:text-sm text-gray-200 font-semibold flex items-center gap-2.5 shadow-lg">
            <Calendar size={16} className="text-[#E5C158]" />
            <span>22 August 2026</span>
          </div>

          <div className="bg-[#0D0D0D]/90 backdrop-blur-md border border-[#E5C158]/30 px-5 py-2.5 rounded-full text-xs sm:text-sm text-gray-200 font-semibold flex items-center gap-2.5 shadow-lg">
            <MapPin size={16} className="text-[#E5C158]" />
            <span>Jaypee University Anoopshahr</span>
          </div>
        </motion.div>

        {/* Live Countdown Timer Boxes (Matching Reference Image) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
          }}
          className="flex items-center justify-center gap-2 sm:gap-4 mb-12"
        >
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="bg-[#0D0D0D] border border-[#E5C158]/35 rounded-2xl w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.9)]">
              <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wider">
                {timeLeft.days}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase mt-3">DAYS</span>
          </div>

          <span className="text-2xl sm:text-4xl font-extrabold text-[#E5C158] pb-6 animate-pulse">:</span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="bg-[#0D0D0D] border border-[#E5C158]/35 rounded-2xl w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.9)]">
              <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wider">
                {timeLeft.hours}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase mt-3">HOURS</span>
          </div>

          <span className="text-2xl sm:text-4xl font-extrabold text-[#E5C158] pb-6 animate-pulse">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="bg-[#0D0D0D] border border-[#E5C158]/35 rounded-2xl w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.9)]">
              <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wider">
                {timeLeft.minutes}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase mt-3">MINUTES</span>
          </div>

          <span className="text-2xl sm:text-4xl font-extrabold text-[#E5C158] pb-6 animate-pulse">:</span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="bg-[#0D0D0D] border border-[#E5C158]/35 rounded-2xl w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.9)]">
              <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wider">
                {timeLeft.seconds}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase mt-3">SECONDS</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          <Link href="/register">
            <button className="bg-[#E5C158] hover:bg-[#F3CE63] text-black font-extrabold px-8 py-4 rounded-full text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(229,193,88,0.4)] transition-all flex items-center gap-2.5 hover:scale-105">
              <span>REGISTRATION</span>
              <ArrowRight size={18} />
            </button>
          </Link>

          <Link href="#event">
            <button className="bg-[#161616] hover:bg-white/10 border border-white/15 text-white font-extrabold px-8 py-4 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all hover:scale-105">
              EXPLORE COMPETITIONS
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

