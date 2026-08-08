'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Phone, Mail, Code, Globe, GraduationCap, Users, Folder, Plus, LogIn } from 'lucide-react';
import CreateTeamModal from '@/components/dashboard/CreateTeamModal';
import JoinTeamModal from '@/components/dashboard/JoinTeamModal';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DashboardContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  team: any;
}

export default function DashboardContent({ user, team }: DashboardContentProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFDF00]">{user?.name?.split(' ')[0] || 'Hacker'}!</span>
        </h1>
        <p className="text-gray-400 text-lg">Your Eureka Campus Ideathon command center.</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Profile Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1 rounded-2xl bg-[#111111]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-lg shadow-black/20 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User className="text-[#D4AF37]" size={20} /> My Profile
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={16} className="text-gray-500" />
                <span className="truncate">{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone size={16} className="text-gray-500" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user?.course && (
                <div className="flex items-center gap-3 text-gray-300">
                  <GraduationCap size={16} className="text-gray-500" />
                  <span>{user.course} {user.year && `- Year ${user.year}`}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/10 flex gap-4">
                {user?.github && (
                  <a href={user.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                    <Code size={20} />
                  </a>
                )}
                {user?.linkedin && (
                  <a href={user.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition">
                    <Globe size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1 rounded-2xl bg-[#111111]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-lg shadow-black/20 flex flex-col">
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="text-[#FFDF00]" size={20} /> Team Status
            </h2>
            
            {team ? (
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Current Team</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFDF00]">
                    {team.name}
                  </p>
                </div>
                
                <div className="space-y-2 mb-6 flex-1">
                  <p className="text-sm text-gray-300 flex items-center justify-between">
                    <span>Members:</span>
                    <span className="font-medium text-white">{team.members?.length || 0} / {team.memberCount || 4}</span>
                  </p>
                  <p className="text-sm text-gray-300 flex items-center justify-between">
                    <span>Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/30">
                      Active
                    </span>
                  </p>
                </div>

                <Link
                  href="/dashboard/team"
                  className="w-full rounded-xl bg-white/5 py-2.5 text-center font-medium text-white border border-white/10 hover:bg-white/10 transition-all"
                >
                  View Team Details
                </Link>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-2">
                  <Users size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-white">No Team Yet</p>
                  <p className="text-sm text-gray-400 mt-1">Create or join a team to participate</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full mt-4">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-all"
                  >
                    <Plus size={20} />
                    <span className="text-sm font-medium">Create</span>
                  </button>
                  <button
                    onClick={() => setIsJoinModalOpen(true)}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#FFDF00]/10 text-[#FFDF00] border border-[#FFDF00]/30 hover:bg-[#FFDF00]/20 transition-all"
                  >
                    <LogIn size={20} />
                    <span className="text-sm font-medium">Join</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Project Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1 rounded-2xl bg-[#111111]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-lg shadow-black/20 flex flex-col">
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Folder className="text-[#D4AF37]" size={20} /> Project Status
            </h2>
            
            {team?.project ? (
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Submitted Project</p>
                  <p className="text-lg font-bold text-white truncate">
                    {team.project.name}
                  </p>
                </div>
                
                <p className="text-sm text-gray-300 line-clamp-3 mb-6 flex-1">
                  {team.project.description}
                </p>

                <Link
                  href="/dashboard/project"
                  className="w-full rounded-xl bg-white/5 py-2.5 text-center font-medium text-white border border-white/10 hover:bg-white/10 transition-all"
                >
                  View Submission
                </Link>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4">
                  <Folder size={32} />
                </div>
                
                <p className="text-lg font-medium text-white">No Project Submitted</p>
                <p className="text-sm text-gray-400 mt-1 mb-6">
                  {team ? 'Submit your idea before the deadline' : 'Join a team first to submit'}
                </p>
                
                <Link
                  href="/dashboard/project"
                  className={cn(
                    "w-full rounded-xl py-3 font-semibold text-white shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all",
                    team 
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#FFDF00] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] text-black" 
                      : "bg-white/10 opacity-50 cursor-not-allowed hover:bg-white/10 pointer-events-none"
                  )}
                >
                  Submit Project
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <CreateTeamModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        userName={user?.name || ''} 
        onTeamCreated={() => {
          setIsCreateModalOpen(false);
        }}
      />
      <JoinTeamModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
        onTeamJoined={() => {
          setIsJoinModalOpen(false);
        }}
      />
    </div>
  );
}
