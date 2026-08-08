"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Database, AlertTriangle, Download, ShieldCheck, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function BackupPage() {
  const [downloading, setDownloading] = useState(false);

  const handleBackup = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/admin/backup");
      if (!res.ok) throw new Error("Failed to generate backup");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const dateStr = new Date().toISOString().split("T")[0];
      a.download = `ideaforge_backup_${dateStr}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Backup downloaded successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pt-6">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/20"
        >
          <Database size={36} className="text-[#D4AF37]" />
        </motion.div>
        <h1 className="text-3xl font-bold text-[#D4AF37]">Database Backup</h1>
        <p className="text-gray-400">Download a complete snapshot of the system data.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex gap-4 items-start"
      >
        <AlertTriangle className="text-amber-400 shrink-0 mt-1" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-amber-400 mb-1">Warning</h3>
          <p className="text-amber-200/70 text-sm leading-relaxed">
            Database backups contain sensitive information including user details, hashed passwords, 
            and team project data. Handle with care. Store backups in a secure, encrypted location 
            and do not share them over insecure channels.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#111111] glass-panel border border-[#D4AF37]/20 rounded-2xl p-6 md:p-8 space-y-6 text-center"
      >
        <h2 className="text-xl font-bold text-white">Generate Full Backup</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-3 text-gray-300 bg-[#0a0a1a] p-3 rounded-xl border border-white/5">
            <CheckCircle size={18} className="text-[#D4AF37]" /> Users & Teams
          </div>
          <div className="flex items-center gap-3 text-gray-300 bg-[#0a0a1a] p-3 rounded-xl border border-white/5">
            <CheckCircle size={18} className="text-[#D4AF37]" /> Projects & Submissions
          </div>
          <div className="flex items-center gap-3 text-gray-300 bg-[#0a0a1a] p-3 rounded-xl border border-white/5">
            <CheckCircle size={18} className="text-[#D4AF37]" /> Activity Logs
          </div>
        </div>

        <button
          onClick={handleBackup}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFDF00] text-black rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:hover:scale-100"
        >
          {downloading ? (
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download size={20} />
          )}
          {downloading ? "Generating JSON..." : "Download Full Backup"}
        </button>
        <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
          <ShieldCheck size={14} /> Encrypted transfer via HTTPS
        </p>
      </motion.div>
    </div>
  );
}
