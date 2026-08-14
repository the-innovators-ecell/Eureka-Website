"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Code, Globe, Mail, Phone, GraduationCap, CheckCircle, Trash2, XCircle, FileCheck, Download } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  college?: string;
  year?: string;
  github?: string;
  linkedin?: string;
  registrationScreenshotUrl?: string;
  registrationScreenshotName?: string;
};

type TeamDetail = {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  leader: TeamMember;
  members: TeamMember[];
  project: { name: string; problem: string; description: string; pptUrl?: string; pptName?: string } | null;
};

export default function TeamReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch(`/api/teams/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTeam(data);
        }
      } catch {
        toast.error("Failed to fetch team details");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, [id]);

  const handleAccept = async () => {
    try {
      const res = await fetch(`/api/teams/${id}/accept`, { method: "POST" });
      if (res.ok) {
        toast.success("Team accepted successfully");
        setTeam(prev => prev ? { ...prev, status: "ACCEPTED" } : null);
      } else {
        toast.error("Failed to accept team");
      }
    } catch {
      toast.error("Error accepting team");
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      toast.error("Please provide a reason for deletion");
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/teams/${id}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: deleteReason }),
      });
      if (res.ok) {
        toast.success("Team deleted and members blacklisted");
        router.push("/admin/teams");
      } else {
        toast.error("Failed to delete team");
      }
    } catch {
      toast.error("Error deleting team");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading || !team) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const allMembers = [team.leader, ...team.members.filter(m => m.email !== team.leader.email)];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/teams">
          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/10">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            {team.name}
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium border",
              team.status === "ACCEPTED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
              team.status === "REJECTED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
              "bg-amber-500/10 text-amber-400 border-amber-500/20"
            )}>
              {team.status}
            </span>
          </h1>
          <p className="text-gray-400">Created on {new Date(team.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-4">Project Details</h2>
            {team.project ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-400 font-medium mb-1">Project Name</h3>
                  <p className="text-white text-lg">{team.project.name}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 font-medium mb-1">Problem Statement</h3>
                  <p className="text-gray-200">{team.project.problem || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 font-medium mb-1">Description</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{team.project.description || "N/A"}</p>
                </div>
                {team.project.pptUrl && (
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <h3 className="text-sm text-gray-400 font-medium mb-3">Project File Submission</h3>
                    <div className="flex items-center justify-between p-4 bg-[#000000] border border-[#D4AF37]/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                          <Code size={20} />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{team.project.pptName || "Project_File"}</p>
                          <p className="text-xs text-gray-400">Attached File</p>
                        </div>
                      </div>
                      <a
                        href={team.project.pptUrl}
                        download={team.project.pptName || "download"}
                        className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold rounded-lg hover:bg-[#FFDF00] transition-colors uppercase tracking-wider"
                      >
                        Download File
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400 italic">No project submitted yet.</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-4">Team Members</h2>
            <div className="space-y-6">
              {allMembers.map((member, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-white">{member?.name || "Unknown"}</h3>
                      {idx === 0 && <span className="text-xs bg-[#7c3aed]/20 text-[#7c3aed] border border-[#7c3aed]/30 px-2 py-0.5 rounded-full font-medium">Leader</span>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2"><Mail size={14} className="text-gray-500" /> {member?.email}</div>
                      <div className="flex items-center gap-2"><Phone size={14} className="text-gray-500" /> {member?.phone || "N/A"}</div>
                      <div className="flex items-center gap-2"><GraduationCap size={14} className="text-gray-500" /> {member?.course || "N/A"} - Year {member?.year || "N/A"}</div>
                      <div className="flex items-center gap-2"><GraduationCap size={14} className="text-gray-500" /> {member?.college || "N/A"}</div>
                    </div>
                    {member?.registrationScreenshotUrl && (
                      <div className="pt-2 border-t border-white/10 mt-2">
                        <a
                          href={member.registrationScreenshotUrl}
                          download={member.registrationScreenshotName || `${member.name}_Form_Screenshot.png`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg transition-colors text-xs font-medium"
                        >
                          <FileCheck size={14} /> Form Screenshot <Download size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 items-start">
                    {member?.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <Code size={18} />
                      </a>
                    )}
                    {member?.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-[#0a66c2] transition-colors">
                        <Globe size={18} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-4">Actions</h2>
            <div className="space-y-4">
              <button 
                onClick={handleAccept}
                disabled={team.status === "ACCEPTED"}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-medium transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={18} /> {team.status === "ACCEPTED" ? "Already Accepted" : "Accept Team"}
              </button>

              <button 
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/teams/${id}/reject`, { method: "POST" });
                    if (res.ok) {
                      toast.success("Team rejected successfully");
                      setTeam(prev => prev ? { ...prev, status: "REJECTED" } : null);
                    } else {
                      toast.error("Failed to reject team");
                    }
                  } catch {
                    toast.error("Error rejecting team");
                  }
                }}
                disabled={team.status === "REJECTED"}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-medium transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle size={18} /> {team.status === "REJECTED" ? "Already Rejected" : "Reject Team"}
              </button>
              
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                <Trash2 size={18} /> Delete & Blacklist
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0a1a] border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)] rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-white mb-2">Delete & Blacklist Team</h3>
            <p className="text-gray-400 text-sm mb-6">
              This action is permanent. The team and its project will be deleted, and all members will be blacklisted from future events.
            </p>
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-gray-300">Reason for blacklisting</label>
              <textarea 
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Violation of terms..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50 min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isDeleting ? "Processing..." : "Confirm Deletion"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
