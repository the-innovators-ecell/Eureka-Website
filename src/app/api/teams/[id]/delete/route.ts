import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logActivity, Actions } from "@/lib/activity-logger";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await request.json();
    const reason = body.reason || "Violated terms and conditions";
    const team = await prisma.team.findUnique({ where: { id }, include: { members: true, leader: true } });
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
    const memberIds = [team.leaderId, ...team.members.map(m => m.id)];
    
    await prisma.$transaction(async (tx) => {
      await Promise.all(memberIds.map(userId => tx.blacklist.create({ data: { userId, reason, blacklistedById: session.user.id } })));
      await tx.user.updateMany({ where: { id: { in: memberIds } }, data: { isBlacklisted: true } });
      await tx.team.delete({ where: { id } });
    });
    
    await logActivity(session.user.id, Actions.TEAM_DELETED, `Deleted team: ${team.name}`);
    
    for (const userId of memberIds) {
      await logActivity(userId, Actions.USER_BLACKLISTED, `Blacklisted due to team deletion: ${reason}`);
    }

    return NextResponse.json({ success: true, message: "Team deleted and members blacklisted" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Team delete error:", error.message);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
