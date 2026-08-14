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

    const user = await prisma.user.findUnique({
      where: { id },
      select: { registrationScreenshotUrl: true, registrationScreenshotName: true, name: true }
    });

    if (!user || !user.registrationScreenshotUrl) {
      return NextResponse.json({ error: "Screenshot not found" }, { status: 404 });
    }

    return NextResponse.json({
      screenshotUrl: user.registrationScreenshotUrl,
      screenshotName: user.registrationScreenshotName || `${user.name}_Form_Screenshot.png`
    });
  } catch (error) {
    console.error("Error fetching user screenshot:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
