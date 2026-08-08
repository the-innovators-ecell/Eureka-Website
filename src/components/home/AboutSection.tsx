'use client';

import { motion } from 'motion/react';
import { Eye, HeartHandshake, Rocket } from 'lucide-react';

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="py-24 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">About the <span className="text-gradient-gold">Event</span></h2>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto rounded-full shadow-[0_0_15px_#D4AF37]"></div>
        </motion.div>

        <div className="flex flex-col gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            className="glass-panel p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden w-full max-w-5xl border border-[#D4AF37]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float"
          >
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFDF00]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
            
            <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFDF00] to-[#D4AF37] mb-8 tracking-wide relative z-10">
              Eureka! Campus Ideathon & Startup Pitching Competition
            </h3>
            <div className="space-y-6 text-base md:text-lg text-gray-200 leading-relaxed font-light relative z-10">
              <p>
                The <strong className="text-white font-semibold">Eureka! Campus Ideathon & Startup Pitching Competition</strong>, proudly organized by <strong className="text-[#D4AF37] font-semibold">The Innovators . Jua</strong>, is a premier entrepreneurship initiative dedicated to empowering innovators, aspiring founders, and future business leaders to transform impactful ideas into scalable ventures. Through this flagship event, <strong className="text-[#D4AF37] font-semibold">The Innovators . Jua</strong> aims to cultivate a vibrant culture of innovation, problem-solving, and entrepreneurship within the student community.
              </p>
              <p>
                At <strong className="text-[#D4AF37] font-semibold">The Innovators . Jua</strong>, we believe that every great startup begins with a bold idea. This competition is designed to recreate a real-world investor pitching experience, providing participants with a platform to present their startup ideas before a distinguished panel of entrepreneurs, investors, startup mentors, and industry experts. Every shortlisted team will deliver a <strong className="text-[#D4AF37] font-semibold">2-minute investor-style pitch</strong>, followed by a <strong className="text-[#D4AF37] font-semibold">3-minute jury interaction</strong>, where ideas will be evaluated on innovation, market potential, business feasibility, scalability, execution strategy, and overall investment readiness.
              </p>
              <p>
                More than just a competition, this initiative by <strong className="text-[#D4AF37] font-semibold">The Innovators . Jua</strong> is a launchpad for emerging entrepreneurs. Participants will gain valuable insights from experienced judges, receive constructive feedback, expand their professional network, and refine their business ideas through meaningful interactions with the startup ecosystem.
              </p>
              <p>
                As part of <strong className="text-[#D4AF37] font-semibold">The Innovators . Jua&apos;s</strong> commitment to fostering entrepreneurship, outstanding teams will also have the opportunity to be recommended for <strong className="text-[#D4AF37] font-semibold">Eureka! 2026</strong>, India&apos;s largest business model competition organized by <strong className="text-[#D4AF37] font-semibold">E-Cell, IIT Bombay</strong>, subject to the official eligibility criteria.
              </p>
              <p>
                Whether you are building your first startup, validating an innovative solution, or simply passionate about entrepreneurship, <strong className="text-[#D4AF37] font-semibold">The Innovators . Jua</strong> invites you to seize this opportunity to pitch your vision, challenge your ideas, connect with experts, and take the first step toward building the next successful startup.
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
          >
            {/* Vision Card */}
            <motion.div variants={itemVariants} className="glass-panel p-12 rounded-[2rem] flex flex-col items-center text-center gap-6 hover:bg-white/5 transition-colors border-t-4 border-t-[#D4AF37] shadow-[0_15px_40px_rgba(0,0,0,0.4)] animate-float" style={{ animationDelay: "0s" }}>
              <div className="p-5 bg-[#D4AF37]/10 rounded-2xl text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
                <Eye size={40} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-4 tracking-wide">Vision</h4>
                <p className="text-text-secondary text-base font-light leading-relaxed">Foreseeing problems as opportunities and conceiving radical ideas to solve them efficiently.</p>
              </div>
            </motion.div>

            {/* Value Card */}
            <motion.div variants={itemVariants} className="glass-panel p-12 rounded-[2rem] flex flex-col items-center text-center gap-6 hover:bg-white/5 transition-colors border-t-4 border-t-[#D4AF37] shadow-[0_15px_40px_rgba(0,0,0,0.4)] animate-float" style={{ animationDelay: "0.2s" }}>
              <div className="p-5 bg-[#D4AF37]/10 rounded-2xl text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
                <HeartHandshake size={40} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-4 tracking-wide">Value</h4>
                <p className="text-text-secondary text-base font-light leading-relaxed">Building tangible solutions that create a significant positive impact for society and stakeholders.</p>
              </div>
            </motion.div>

            {/* Venture Card */}
            <motion.div variants={itemVariants} className="glass-panel p-12 rounded-[2rem] flex flex-col items-center text-center gap-6 hover:bg-white/5 transition-colors border-t-4 border-t-[#D4AF37] shadow-[0_15px_40px_rgba(0,0,0,0.4)] animate-float" style={{ animationDelay: "0.4s" }}>
              <div className="p-5 bg-[#D4AF37]/10 rounded-2xl text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
                <Rocket size={40} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-4 tracking-wide">Venture</h4>
                <p className="text-text-secondary text-base font-light leading-relaxed">Scaling the created value into a feasible, thriving, and self-sustaining enterprise.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
