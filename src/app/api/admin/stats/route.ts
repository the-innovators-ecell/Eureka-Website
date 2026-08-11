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

    // Run all counts in parallel — single round-trip to DB
    const [
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

    // Chart data: use groupBy for efficient SQL-level aggregation
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    let recentUsers: { createdAt: Date }[] = [];
    let recentTeams: { createdAt: Date }[] = [];
    let recentProjects: { submittedAt: Date }[] = [];

    try {
      [recentUsers, recentTeams, recentProjects] = await Promise.all([
        prisma.user.findMany({
          where: { createdAt: { gte: sevenDaysAgo } },
          select: { createdAt: true }
        }),
        prisma.team.findMany({
          where: { createdAt: { gte: sevenDaysAgo } },
          select: { createdAt: true }
        }),
        prisma.project.findMany({
          where: { submittedAt: { gte: sevenDaysAgo } },
          select: { submittedAt: true }
        })
      ]);
    } catch (e) {
      console.error("Stats chart query error:", e);
    }

    // Build 7-day chart data
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const registrationsChart = days.map(dateStr => ({
      date: dateStr,
      count: recentUsers.filter(u => u.createdAt.toISOString().split('T')[0] === dateStr).length
    }));

    const teamsChart = days.map(dateStr => ({
      date: dateStr,
      count: recentTeams.filter(t => t.createdAt.toISOString().split('T')[0] === dateStr).length
    }));

    const projectsChart = days.map(dateStr => ({
      date: dateStr,
      count: recentProjects.filter(p => p.submittedAt.toISOString().split('T')[0] === dateStr).length
    }));

    return NextResponse.json({ 
      users: totalUsers, 
      teams: { total: totalTeams, accepted: acceptedTeams, rejected: rejectedTeams, pending: pendingTeams }, 
      projects: totalProjects, 
      registrationsChart, 
      teamsChart, 
      projectsChart,
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
