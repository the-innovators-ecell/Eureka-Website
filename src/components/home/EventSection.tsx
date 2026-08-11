'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

export default function EventSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const deadline = new Date('2026-08-22T00:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <section id="event" className="py-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Upcoming <span className="text-gradient-gold">Event</span></h2>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto rounded-full shadow-[0_0_15px_#D4AF37]"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring" }}
          className="glass-panel rounded-[3rem] overflow-hidden relative border border-[#D4AF37]/20 shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-float"
        >
          {/* Ambient lighting */}
          <div className="absolute top-0 left-1/4 w-full h-full bg-gradient-to-br from-[#D4AF37]/10 to-transparent blur-[120px] pointer-events-none z-0"></div>

          {/* Animated border line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFDF00] to-[#D4AF37]"></div>
          
          <div className="p-12 md:p-16 flex flex-col lg:flex-row gap-16 justify-between items-center relative z-10">
            <div className="flex-1 space-y-6 w-full">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)] animate-pulse">
                  Registrations Open
                </span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-extrabold text-white">
                Eureka Campus Ideathon & Startup Pitching Competition
              </h3>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-4 text-text-primary">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Main Event Date</p>
                    <p className="font-semibold text-lg text-white">22 August 2026</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-text-primary">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Venue / Place</p>
                    <p className="font-semibold text-lg text-white">Jaypee University Anoopshahr</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-text-primary">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Registration Deadline</p>
                    <p className="font-semibold text-lg text-white">20 August 2026</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/register">
                  <InteractiveHoverButton
                    text="Register for Event"
                    className="w-full md:w-auto bg-[#D4AF37]/10 text-white border-[#D4AF37]/50 glow-button h-14 uppercase tracking-widest text-sm"
                  />
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col items-center glass-panel p-8 rounded-2xl bg-black/40 border border-white/5">
              <h4 className="text-text-primary font-medium mb-6 tracking-widest uppercase text-sm">Time Remaining</h4>
              <div className="flex gap-4 md:gap-6 text-center">
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-black flex items-center justify-center text-3xl md:text-4xl font-light text-[#D4AF37] border border-[#D4AF37]/30 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]">
                    {timeLeft.days.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-[#D4AF37] uppercase tracking-wider">Days</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-black flex items-center justify-center text-3xl md:text-4xl font-light text-[#D4AF37] border border-[#D4AF37]/30 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-[#D4AF37] uppercase tracking-wider">Hours</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-black flex items-center justify-center text-3xl md:text-4xl font-light text-[#D4AF37] border border-[#D4AF37]/30 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-[#D4AF37] uppercase tracking-wider">Mins</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-black flex items-center justify-center text-3xl md:text-4xl font-light text-[#D4AF37] border border-[#D4AF37]/30 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-[#D4AF37] uppercase tracking-wider">Secs</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
