import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const isEmailAdmin =
      session?.user?.email?.toLowerCase() === "swapnilaryajua@gmail.com" ||
      session?.user?.email?.toLowerCase() === "namanpriyasharmajua@gmail.com";

    const isAdmin = isEmailAdmin || session?.user?.role === "ADMIN";

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const teams = await prisma.team.findMany({
        include: {
          leader: { select: { name: true, email: true } },
          members: { select: { name: true, email: true } },
          project: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json(teams);
    } catch (dbErr) {
      console.error("Teams fetch DB error:", dbErr);
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Teams fetch error:", error);
    return NextResponse.json([]);
  }
}
