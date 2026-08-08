import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Crown, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import CopyCodeButton from '@/components/dashboard/CopyCodeButton';

export const metadata = {
  title: 'My Team | Eureka Campus Ideathon',
};

export default async function TeamPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      team: {
        include: {
          members: true,
          project: true,
          leader: true,
        }
      }
    }
  });

  const team = user?.team;

  if (!team) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center max-w-lg mx-auto text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          <ShieldAlert size={40} className="text-[#D4AF37]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">You haven&apos;t joined a team yet</h1>
        <p className="text-gray-400 mb-8 text-lg">
          Head back to the dashboard to create a new team or join an existing one using an invite code.
        </p>
        <Link 
          href="/dashboard"
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFDF00] text-black font-extrabold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all uppercase tracking-wider text-xs"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFDF00] to-[#D4AF37] mb-2">
            {team.name}
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Active Team
            </span>
            <span className="text-gray-400 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {team.members.length} / {team.memberCount || 4} Members
            </span>
          </div>
        </div>

        <div className="bg-[#111111]/90 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl p-4 min-w-[220px] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-bold">Invite Code</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFDF00]">{team.inviteCode}</span>
            <CopyCodeButton code={team.inviteCode} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members List */}
        <div className="lg:col-span-2 bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">Team Roster</h2>
          
          <div className="space-y-4">
            {/* Leader */}
            {team.leader && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#000000] border border-[#D4AF37]/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-transparent opacity-50" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFDF00] flex items-center justify-center text-black font-extrabold text-lg relative z-10 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  {team.leader.name?.charAt(0).toUpperCase()}
                </div>
                <div className="relative z-10 flex-1">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    {team.leader.name} {user.id === team.leaderId && '(You)'}
                  </h3>
                  <p className="text-sm text-gray-400">{team.leader.email}</p>
                </div>
                <div className="relative z-10 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold flex items-center gap-1.5 border border-[#D4AF37]/40">
                  <Crown size={14} /> LEADER
                </div>
              </div>
            )}

            {/* Other Members */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {team.members.filter((m: any) => m.id !== team.leaderId).map((member: any) => (
              <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#000000] border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-gray-200 font-bold text-lg">
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">
                    {member.name} {member.id === user.id && '(You)'}
                  </h3>
                  <p className="text-sm text-gray-400">{member.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Snapshot */}
        <div className="lg:col-span-1 bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <FileText className="text-[#D4AF37]" size={20} /> Project
          </h2>
          
          {team.project ? (
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-medium text-white mb-2">{team.project.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-4 flex-1 mb-6">
                {team.project.description}
              </p>
              <Link 
                href="/dashboard/project"
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center text-sm font-medium hover:bg-white/10 transition"
              >
                View Full Details
              </Link>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4">
                <FileText size={24} />
              </div>
              <p className="text-gray-300 font-medium mb-1">No Project Yet</p>
              <p className="text-sm text-gray-500 mb-6">Your team hasn&apos;t submitted a project.</p>
              
              {user.id === team.leaderId ? (
                <Link 
                  href="/dashboard/project"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFDF00] text-black font-extrabold text-center text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition"
                >
                  Submit Project
                </Link>
              ) : (
                <p className="text-xs text-gray-500 bg-white/5 p-3 rounded-lg border border-white/5">Only the team leader can submit the initial project proposal.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
