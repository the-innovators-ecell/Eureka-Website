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
          select: { id: true, name: true, email: true, phone: true, github: true, linkedin: true, year: true, course: true, college: true, registrationScreenshotName: true, registrationScreenshotUrl: true }
        },
        members: {
          select: { id: true, name: true, email: true, phone: true, github: true, linkedin: true, year: true, course: true, college: true, registrationScreenshotName: true, registrationScreenshotUrl: true }
        },
        project: {
          select: { name: true, problem: true, description: true, pptName: true, pptUrl: true, isLocked: true, submittedAt: true }
        }
      }
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Map light response with boolean indicators to keep payload lightweight & fast
    const formattedTeam = {
      ...team,
      project: team.project ? {
        ...team.project,
        hasPpt: Boolean(team.project.pptUrl || team.project.pptName),
        pptUrl: undefined // stripped from initial payload for instant load
      } : null,
      leader: {
        ...team.leader,
        hasScreenshot: Boolean(team.leader.registrationScreenshotUrl || team.leader.registrationScreenshotName),
        registrationScreenshotUrl: undefined // stripped from initial payload
      },
      members: team.members.map(m => ({
        ...m,
        hasScreenshot: Boolean(m.registrationScreenshotUrl || m.registrationScreenshotName),
        registrationScreenshotUrl: undefined // stripped from initial payload
      }))
    };

    return NextResponse.json(formattedTeam);
  } catch (error) {
    console.error("Team fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
