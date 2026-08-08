"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Download, FileSpreadsheet, RefreshCw, Users, CheckCircle, Clock, XCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Stats = {
  totalTeams: number;
  acceptedTeams: number;
  pendingTeams: number;
  rejectedTeams: number;
  blacklistedUsers: number;
};

type TeamPreview = {
  id: string;
  name: string;
  leader: { name: string };
  status: string;
  project: { name: string } | null;
  createdAt: string;
};

export default function ExportDataPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentTeams, setRecentTeams] = useState<TeamPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, teamsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/search?limit=10")
      ]);
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        const items = Array.isArray(teamsData) ? teamsData : (teamsData.teams || teamsData.data || []);
        setRecentTeams(items);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to fetch data: " + error.message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDownloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      const res = await fetch("/api/admin/export/excel");
      if (!res.ok) throw new Error("Failed to export Excel");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "IdeaForge_2026_Teams.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Excel downloaded successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);
    try {
      const res = await fetch("/api/admin/export/csv");
      if (!res.ok) throw new Error("Failed to export CSV");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "IdeaForge_2026_Teams.csv";
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("CSV downloaded successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setDownloadingCsv(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "REJECTED": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const statCards = [
    { label: "Total Teams", value: stats?.totalTeams ?? 0, icon: Users, color: "text-[#D4AF37]" },
    { label: "Accepted", value: stats?.acceptedTeams ?? 0, icon: CheckCircle, color: "text-green-400" },
    { label: "Pending", value: stats?.pendingTeams ?? 0, icon: Clock, color: "text-amber-400" },
    { label: "Rejected", value: stats?.rejectedTeams ?? 0, icon: XCircle, color: "text-red-400" },
    { label: "Blacklisted", value: stats?.blacklistedUsers ?? 0, icon: ShieldAlert, color: "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#D4AF37]">Export Data</h1>
          <p className="text-gray-400">Download system data and statistics</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors glass-panel"
          >
            <RefreshCw size={18} className={cn(refreshing && "animate-spin")} />
            Refresh Data
          </button>
          <button
            onClick={handleDownloadCsv}
            disabled={downloadingCsv}
            className="flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-white/10 text-[#FFDF00] rounded-xl border border-[#FFDF00]/20 transition-colors glass-panel"
          >
            <FileSpreadsheet size={18} />
            {downloadingCsv ? "Exporting..." : "Download CSV"}
          </button>
          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-xl border border-[#D4AF37]/20 transition-colors font-medium glass-panel"
          >
            <Download size={18} />
            {downloadingExcel ? "Exporting..." : "Download Excel"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111111] glass-panel border border-[#D4AF37]/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon size={28} className={cn("mb-3", stat.color)} />
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? <div className="h-9 w-16 bg-white/10 animate-pulse rounded" /> : stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden glass-panel"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-[#D4AF37]">Latest Teams Preview</h2>
          <p className="text-sm text-gray-400">Showing up to 10 most recent teams</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/5 text-[#D4AF37]">
              <tr>
                <th className="px-6 py-4">Team Name</th>
                <th className="px-6 py-4">Leader</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/10">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-white/10 animate-pulse rounded w-full max-w-[120px]"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentTeams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No teams found
                  </td>
                </tr>
              ) : (
                recentTeams.map((team) => (
                  <tr key={team.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{team.name}</td>
                    <td className="px-6 py-4">{team.leader?.name || "N/A"}</td>
                    <td className="px-6 py-4">{team.project?.name || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap", getStatusColor(team.status))}>
                        {team.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{team.createdAt ? new Date(team.createdAt).toLocaleDateString() : "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
