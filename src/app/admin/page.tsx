"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  UsersRound, 
  FolderOpen, 
  CheckCircle, 
  XCircle, 
  Clock 
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type StatsData = {
  users: number;
  teams: { total: number; accepted: number; rejected: number; pending: number };
  projects: number;
  registrationsChart: { date: string; count: number }[];
  teamsChart: { date: string; count: number }[];
  projectsChart: { date: string; count: number }[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchStats(silent = false) {
      if (!silent) setLoading(true);
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok && isMounted) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        if (!silent && isMounted) setLoading(false);
      }
    }
    
    fetchStats();
    
    const interval = setInterval(() => {
      if (!document.hidden) fetchStats(true);
    }, 15000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const cards = [
    { title: "Total Users", value: stats.users, icon: Users, color: "text-[#00d4ff]", shadow: "shadow-[#00d4ff]/20" },
    { title: "Total Teams", value: stats.teams.total, icon: UsersRound, color: "text-[#7c3aed]", shadow: "shadow-[#7c3aed]/20" },
    { title: "Projects Submitted", value: stats.projects, icon: FolderOpen, color: "text-cyan-400", shadow: "shadow-cyan-400/20" },
    { title: "Accepted Teams", value: stats.teams.accepted, icon: CheckCircle, color: "text-green-400", shadow: "shadow-green-400/20" },
    { title: "Rejected Teams", value: stats.teams.rejected, icon: XCircle, color: "text-red-400", shadow: "shadow-red-400/20" },
    { title: "Pending Teams", value: stats.teams.pending, icon: Clock, color: "text-amber-400", shadow: "shadow-amber-400/20" },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome to the IdeaForge 2026 Admin Portal</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg ${card.shadow} transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 ${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px]"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Registrations (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.registrationsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10, 10, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="count" stroke="#00d4ff" strokeWidth={3} dot={{ fill: '#00d4ff' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px]"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Teams Created (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.teamsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10, 10, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
