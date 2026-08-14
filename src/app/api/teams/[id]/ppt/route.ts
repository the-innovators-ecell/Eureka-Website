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

    const project = await prisma.project.findUnique({
      where: { teamId: id },
      select: { pptUrl: true, pptName: true }
    });

    if (!project || !project.pptUrl) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({
      pptUrl: project.pptUrl,
      pptName: project.pptName || "Project_File"
    });
  } catch (error) {
    console.error("Error fetching PPT file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
