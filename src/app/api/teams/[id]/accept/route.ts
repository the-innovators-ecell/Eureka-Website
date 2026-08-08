import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logActivity, Actions } from "@/lib/activity-logger";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    
    const team = await prisma.team.update({ 
      where: { id }, 
      data: { 
        status: "ACCEPTED",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acceptedAt: new Date() as any
      } 
    });
    
    await logActivity(session.user.id, Actions.TEAM_ACCEPTED, `Accepted team: ${team.name}`);
    
    return NextResponse.json(team);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Team accept error:", error.message);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
