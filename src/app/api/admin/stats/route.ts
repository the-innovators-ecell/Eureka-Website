import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const [totalUsers, totalTeams, acceptedTeams, rejectedTeams, pendingTeams, totalProjects, recentUsers, recentTeams, recentProjects, blacklistedUsers, adminCount, sponsorCount] = await Promise.all([
      prisma.user.count(),
      prisma.team.count(),
      prisma.team.count({ where: { status: "ACCEPTED" } }),
      prisma.team.count({ where: { status: "REJECTED" } }),
      prisma.team.count({ where: { status: "PENDING" } }),
      prisma.project.count(),
      prisma.user.groupBy({ by: ['createdAt'], _count: { id: true }, where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.team.groupBy({ by: ['createdAt'], _count: { id: true }, where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.project.groupBy({ by: ['submittedAt'], _count: { id: true }, where: { submittedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.user.count({ where: { isBlacklisted: true } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.sponsor.count()
    ]);
    const formatChartData = (data: { _count: { id: number }, createdAt?: Date, submittedAt?: Date }[]) => {
      const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { date: d.toISOString().split('T')[0], count: 0 }; });
      data.forEach(item => { const dateObj = item.createdAt || item.submittedAt; if (!dateObj) return; const dateStr = dateObj.toISOString().split('T')[0]; const day = days.find(d => d.date === dateStr); if (day) day.count += item._count.id; });
      return days;
    };
    return NextResponse.json({ 
      users: totalUsers, 
      teams: { total: totalTeams, accepted: acceptedTeams, rejected: rejectedTeams, pending: pendingTeams }, 
      projects: totalProjects, 
      registrationsChart: formatChartData(recentUsers), 
      teamsChart: formatChartData(recentTeams), 
      projectsChart: formatChartData(recentProjects),
      blacklistedUsers,
      adminCount,
      sponsorCount
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Admin stats error:", error.message);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
