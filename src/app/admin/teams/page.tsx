"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Search, ChevronRight, CheckCircle, XCircle, Clock, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Team = {
  id: string;
  name: string;
  status: string;
  leader: { name: string; email: string };
  members: { name: string; email: string }[];
  project: { name: string } | null;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [year, setYear] = useState("All");
  const [course, setCourse] = useState("All");
  const [sort, setSort] = useState("Newest");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "20"
      });
      if (search) query.append("search", search);
      if (status !== "All") query.append("status", status);
      if (year !== "All") query.append("year", year);
      if (course !== "All") query.append("course", course);
      if (sort) query.append("sort", sort);

      const res = await fetch(`/api/admin/search?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams || data.data || []);
        setTotalPages(data.totalPages || 1);
      } else {
        throw new Error("Failed to fetch teams");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [search, status, year, course, sort, page]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    setPage(1);
  }, [search, status, year, course, sort]);

  const getStatusIcon = (status: string) => {
    if (status === "ACCEPTED") return <CheckCircle className="text-green-400" size={16} />;
    if (status === "REJECTED") return <XCircle className="text-red-400" size={16} />;
    return <Clock className="text-amber-400" size={16} />;
  };

  const getStatusColor = (status: string) => {
    if (status === "ACCEPTED") return "bg-green-500/10 text-green-400 border-green-500/20";
    if (status === "REJECTED") return "bg-red-500/10 text-red-400 border-red-500/20";
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#D4AF37]">Teams Management</h1>
          <p className="text-gray-400">Review, filter, and manage registered teams</p>
        </div>
      </div>

      <div className="bg-[#111111] glass-panel border border-[#D4AF37]/20 rounded-2xl p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search team, member, or project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all appearance-none"
            >
              <option value="All">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all appearance-none"
            >
              <option value="All">All Courses</option>
              <option value="BTech">B.Tech</option>
              <option value="MTech">M.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
            </select>
          </div>

          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all appearance-none"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Team Name">Team Name</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#111111] glass-panel border border-white/10 rounded-2xl p-6 flex flex-col hover:border-[#D4AF37]/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white truncate pr-2">{team.name}</h3>
                  <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 whitespace-nowrap", getStatusColor(team.status))}>
                    {getStatusIcon(team.status)}
                    {team.status}
                  </div>
                </div>
                
                <div className="space-y-3 flex-1 text-sm text-gray-300">
                  <p><span className="text-gray-500">Leader:</span> {team.leader?.name}</p>
                  <p><span className="text-gray-500">Members:</span> {team.members?.length ? team.members.length + 1 : 1} total</p>
                  <p><span className="text-gray-500">Project:</span> {team.project?.name || "Not submitted"}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                  <Link href={`/admin/teams/${team.id}`}>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg transition-colors text-sm font-medium">
                      Review Details <ChevronRight size={16} />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
            {teams.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-[#111111] glass-panel rounded-2xl border border-white/10">
                No teams found matching your search and filters.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-gray-400 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
