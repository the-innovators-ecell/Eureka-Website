"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Shield, ShieldAlert, UserCheck, X } from "lucide-react";
import { toast } from "sonner";


type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchUsers();
  }, []);

  const changeRole = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (res.ok) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update role");
      }
    } catch {
      toast.error("Error updating user role");
    } finally {
      setActionLoading(null);
    }
  };

  const admins = users.filter(u => u.role === "ADMIN");
  const nonAdmins = users.filter(u => u.role !== "ADMIN" && (
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Management</h1>
        <p className="text-gray-400">Manage administrator access for the portal</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Admins Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Shield className="text-[#00d4ff]" size={24} />
            <h2 className="text-xl font-semibold text-white">Current Admins</h2>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="text-gray-500 py-4 text-center">Loading admins...</div>
            ) : admins.map(admin => (
              <div key={admin.id} className="bg-white/5 border border-[#00d4ff]/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">{admin.name}</h3>
                  <p className="text-sm text-gray-400">{admin.email}</p>
                </div>
                <button
                  onClick={() => changeRole(admin.id, "USER")}
                  disabled={actionLoading === admin.id}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                  title="Revoke Admin Access"
                >
                  {actionLoading === admin.id ? (
                    <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <X size={20} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Promote Users Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <UserCheck className="text-[#7c3aed]" size={24} />
              <h2 className="text-xl font-semibold text-white">Promote Users</h2>
            </div>
          </div>
          
          <input
            type="text"
            placeholder="Search users to promote..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7c3aed]/50 transition-colors"
          />

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {search === "" ? (
              <div className="text-gray-500 py-4 text-center text-sm">Search for users by name or email</div>
            ) : nonAdmins.length === 0 ? (
              <div className="text-gray-500 py-4 text-center text-sm">No users found</div>
            ) : nonAdmins.slice(0, 10).map(user => (
              <div key={user.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-colors">
                <div>
                  <h3 className="font-medium text-white">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={() => changeRole(user.id, "ADMIN")}
                  disabled={actionLoading === user.id}
                  className="px-3 py-1.5 bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/30 hover:bg-[#7c3aed]/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {actionLoading === user.id ? (
                    <div className="w-4 h-4 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Promote <ShieldAlert size={14} /></>
                  )}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
