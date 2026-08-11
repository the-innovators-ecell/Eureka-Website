"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ActivityLog = {
  id: string;
  createdAt: string;
  action: string;
  details: string;
  ip: string;
  user: { name: string; email: string } | null;
};

const ACTIONS = [
  "REGISTERED", "CREATED", "SUBMITTED", "ACCEPTED", "PROMOTED",
  "DELETED", "REJECTED", "BLACKLISTED", "DEMOTED",
  "LOGGED_IN", "UPDATED", "JOINED", "LEFT", "EXPORTED", "BACKUP"
];

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "15"
      });
      if (search) query.append("search", search);
      if (actionFilter) query.append("action", actionFilter);
      if (startDate) query.append("startDate", startDate);
      if (endDate) query.append("endDate", endDate);

      const res = await fetch(`/api/admin/activity-logs?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || data.data || []);
        setTotalPages(data.totalPages || 1);
      } else {
        throw new Error("Failed to fetch logs");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, actionFilter, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const resetFilters = () => {
    setSearch("");
    setActionFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const getActionColor = (action: string) => {
    const positive = ["REGISTERED", "CREATED", "SUBMITTED", "ACCEPTED", "PROMOTED"];
    const negative = ["DELETED", "REJECTED", "BLACKLISTED", "DEMOTED"];
    
    if (positive.includes(action)) return "bg-green-500/10 text-green-400 border-green-500/20";
    if (negative.includes(action)) return "bg-red-500/10 text-red-400 border-red-500/20";
    return "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#D4AF37]">Activity Logs</h1>
        <p className="text-gray-400">Monitor system events and user actions</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111111] glass-panel border border-[#D4AF37]/20 rounded-2xl p-4 md:p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search user name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
          
          <div>
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all appearance-none"
            >
              <option value="">All Actions</option>
              {ACTIONS.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <div>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-2 px-4 text-gray-400 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
          <div>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-2 px-4 text-gray-400 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#D4AF37] hover:text-[#FFDF00] transition-colors"
          >
            <X size={16} /> Reset Filters
          </button>
        </div>
      </motion.div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-white/5 text-[#D4AF37]">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-4 bg-white/10 animate-pulse rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {log.user ? `${log.user.name} (${log.user.email})` : "System/Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider", getActionColor(log.action))}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={log.details}>
                      {log.details || "-"}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {log.ip || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading || totalPages === 0}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
