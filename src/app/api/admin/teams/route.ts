import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teams = await prisma.team.findMany({
      include: {
        leader: { select: { name: true, email: true } },
        members: { select: { name: true, email: true } },
        project: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Teams fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
