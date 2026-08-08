'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import ParticleBackground from '@/components/home/ParticleBackground';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onTeamCreated: () => void;
}

export default function CreateTeamModal({ isOpen, onClose, userName, onTeamCreated }: CreateTeamModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [teamName, setTeamName] = useState('');
  const [memberCount, setMemberCount] = useState<2 | 3 | 4>(4);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Lock body scroll when modal is open to prevent background page from scrolling
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

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }
    if (teamName.trim().length < 3) {
      toast.error('Team name must be at least 3 characters');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName.trim(), memberCount }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to create team');
      
      setInviteCode(data.inviteCode);
      setStep(2);
      toast.success('Team created successfully!');
      onTeamCreated();
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

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success('Invite code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDone = () => {
    onClose();
    window.location.reload();
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
          onClick={step === 1 ? onClose : undefined}
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
          className="relative z-10 w-full max-w-lg my-auto max-h-[90vh] overflow-y-auto rounded-2xl border border-[#D4AF37]/40 bg-[#0E0E0E] p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)]"
        >
          {step === 1 && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          )}

          {step === 1 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-wide">Create Your Team</h2>
                  <p className="text-gray-400 text-xs mt-0.5">As Team Leader: {userName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition"
                    placeholder="e.g. Visionary Builders"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Max Team Capacity</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[2, 3, 4].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setMemberCount(count as 2 | 3 | 4)}
                        className={`py-3 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${
                          memberCount === count
                            ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                            : 'border-white/10 bg-[#141414] text-gray-400 hover:bg-white/5'
                        }`}
                      >
                        {count} Members
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-white/10 text-xs text-gray-300 leading-relaxed flex items-start gap-3">
                  <ShieldCheck size={20} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>
                    Once created, an <strong className="text-[#D4AF37]">Invite Code</strong> will be generated. Your teammates can join your team from their own dashboard by entering this code!
                  </span>
                </div>
              </div>

              <InteractiveHoverButton
                onClick={handleCreateTeam}
                disabled={isLoading}
                text={isLoading ? "Generating Code..." : "Create Team & Generate Code"}
                className="w-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black uppercase tracking-widest text-xs h-13 font-bold"
              />
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-2 border border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <Check size={32} />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Team Created!</h3>
                <p className="text-gray-400 text-sm">Share this unique code with your teammates so they can join.</p>
              </div>

              <div className="p-6 rounded-xl border border-[#D4AF37]/30 bg-[#141414] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Team Invite Code</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFDF00] to-[#D4AF37] tracking-wider">
                    {inviteCode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-3 rounded-xl bg-[#222222] text-white hover:bg-[#D4AF37] hover:text-black transition-all shadow-md"
                    title="Copy Code"
                  >
                    {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleDone}
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-black font-extrabold uppercase tracking-wider text-xs hover:bg-[#FFDF00] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Go To Team Dashboard
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


