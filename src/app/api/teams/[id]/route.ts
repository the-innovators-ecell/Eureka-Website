import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        leader: {
          select: { id: true, name: true, email: true, phone: true, github: true, linkedin: true, year: true, course: true }
        },
        members: {
          select: { id: true, name: true, email: true, phone: true, github: true, linkedin: true, year: true, course: true }
        },
        project: {
          select: { name: true, problem: true, description: true, pptUrl: true, pptName: true, isLocked: true, submittedAt: true }
        }
      }
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Team fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
