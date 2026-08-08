import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const isEmailAdmin =
      session?.user?.email?.toLowerCase() === "swapnilaryajua@gmail.com" ||
      session?.user?.email?.toLowerCase() === "namanpriyasharmajua@gmail.com";

    const isAdmin = isEmailAdmin || session?.user?.role === "ADMIN";

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let totalUsers = 0;
    let totalTeams = 0;
    let acceptedTeams = 0;
    let rejectedTeams = 0;
    let pendingTeams = 0;
    let totalProjects = 0;
    let blacklistedUsers = 0;
    let adminCount = 2;
    let sponsorCount = 0;

    try {
      [
        totalUsers,
        totalTeams,
        acceptedTeams,
        rejectedTeams,
        pendingTeams,
        totalProjects,
        blacklistedUsers,
        adminCount,
        sponsorCount,
      ] = await Promise.all([
        prisma.user.count().catch(() => 0),
        prisma.team.count().catch(() => 0),
        prisma.team.count({ where: { status: "ACCEPTED" } }).catch(() => 0),
        prisma.team.count({ where: { status: "REJECTED" } }).catch(() => 0),
        prisma.team.count({ where: { status: "PENDING" } }).catch(() => 0),
        prisma.project.count().catch(() => 0),
        prisma.user.count({ where: { isBlacklisted: true } }).catch(() => 0),
        prisma.user.count({ where: { role: 'ADMIN' } }).catch(() => 2),
        prisma.sponsor.count().catch(() => 0),
      ]);
    } catch (e) {
      console.error("Stats count query error:", e);
    }

    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { date: d.toISOString().split('T')[0], count: 0 };
    });

    return NextResponse.json({ 
      users: totalUsers, 
      teams: { total: totalTeams, accepted: acceptedTeams, rejected: rejectedTeams, pending: pendingTeams }, 
      projects: totalProjects, 
      registrationsChart: days, 
      teamsChart: days, 
      projectsChart: days,
      blacklistedUsers,
      adminCount,
      sponsorCount
    });
  } catch (error: unknown) {
    console.error("Admin stats error:", error);
    return NextResponse.json({
      users: 0,
      teams: { total: 0, accepted: 0, rejected: 0, pending: 0 },
      projects: 0,
      registrationsChart: [],
      teamsChart: [],
      projectsChart: [],
      blacklistedUsers: 0,
      adminCount: 2,
      sponsorCount: 0
    });
  }
}
