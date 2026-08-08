import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { logActivity, Actions } from "@/lib/activity-logger";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin();
    if (auth.error || !auth.session) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const updatedTeam = await prisma.team.update({ 
      where: { id }, 
      data: { 
        status: "REJECTED",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rejectedAt: new Date() as any
      } 
    });

    await logActivity(auth.session.user.id, Actions.TEAM_REJECTED, `Rejected team: ${team.name}`);

    return NextResponse.json(updatedTeam);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Team reject error:", error.message);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
