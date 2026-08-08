import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { logActivity, Actions } from "@/lib/activity-logger";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isBlacklisted: true, createdAt: true }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Users fetch error:", error.message);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authSession = await requireAdmin();
    if (authSession.error || !authSession.session) return NextResponse.json({ error: authSession.error || "Unauthorized" }, { status: 401 });
    const { userId, role } = await req.json();
    if (!userId || (role !== 'ADMIN' && role !== 'USER')) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    
    const action = role === 'ADMIN' ? Actions.ADMIN_PROMOTED : Actions.ADMIN_DEMOTED;
    await logActivity(authSession.session.user.id, action, `Changed role of user ${user.email} to ${role}`);
    
    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Users role update error:", error.message);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authSession = await requireAdmin();
    if (authSession.error || !authSession.session) return NextResponse.json({ error: authSession.error || "Unauthorized" }, { status: 401 });
    const { userId, isBlacklisted, reason } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBlacklisted }
    });

    if (isBlacklisted) {
      await prisma.blacklist.create({
        data: {
          userId,
          reason: reason || "Admin action",
          blacklistedById: authSession.session.user.id
        }
      });
      await logActivity(authSession.session.user.id, Actions.USER_BLACKLISTED, `Blacklisted user ${user.email}`);
    } else {
      await prisma.blacklist.deleteMany({
        where: { userId }
      });
      await logActivity(authSession.session.user.id, Actions.USER_UNBLACKLISTED, `Unblacklisted user ${user.email}`);
    }

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("User blacklist update error:", error.message);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
