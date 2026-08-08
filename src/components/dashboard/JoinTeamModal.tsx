'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Check } from 'lucide-react';
import { toast } from 'sonner';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import ParticleBackground from '@/components/home/ParticleBackground';

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamJoined: () => void;
}

export default function JoinTeamModal({ isOpen, onClose, onTeamJoined }: JoinTeamModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [joinedTeam, setJoinedTeam] = useState<{ name: string } | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: inviteCode.toUpperCase() }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to join team');
      
      setJoinedTeam(data.team);
      toast.success('Successfully joined the team!');
      onTeamJoined();
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        {/* Full Screen Backdrop with Homepage Particles, Grid & Gold Ambient Orbs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl overflow-hidden"
          onClick={!joinedTeam ? onClose : undefined}
        >
          <ParticleBackground />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E5C158]/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E5C158]/10 rounded-full blur-[140px] pointer-events-none" />
        </motion.div>
        
        {/* Clean Modal Content Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 w-full max-w-md my-auto max-h-[90vh] overflow-y-auto rounded-2xl border border-[#D4AF37]/40 bg-[#0E0E0E] p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)]"
        >
          {!joinedTeam && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          )}

          {!joinedTeam ? (
            <>
              <div className="mb-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/20">
                  <Users size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Join a Team</h2>
                <p className="text-gray-400 text-sm mt-1">Enter your team&apos;s invite code to join</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-4 text-center font-mono text-xl tracking-widest text-white uppercase placeholder-gray-600 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition"
                    placeholder="IDT-XXXXX"
                    maxLength={12}
                  />
                </div>

                <InteractiveHoverButton
                  type="submit"
                  disabled={isLoading}
                  text={isLoading ? "Joining..." : "Join Team"}
                  className="w-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black uppercase tracking-widest text-xs h-13 font-bold"
                />
              </form>
            </>
          ) : (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4 border border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <Check size={32} />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Welcome to the Team!</h3>
                <p className="text-gray-400 text-sm">You are now a member of</p>
                <p className="text-xl font-bold text-[#D4AF37] mt-2">{joinedTeam.name}</p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-black font-extrabold uppercase tracking-wider text-xs hover:bg-[#FFDF00] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

