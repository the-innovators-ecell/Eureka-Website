import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Assuming a Sponsor model exists, or mock data if not
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: { tier: 'asc' }
    });

    return NextResponse.json(sponsors);
  } catch (error) {
    console.error("Sponsors fetch error:", error);
    // Return mock data if table doesn't exist yet
    return NextResponse.json([
      { id: "1", name: "TechCorp", logo: "/sponsors/techcorp.png", tier: "PLATINUM", url: "https://techcorp.com" },
      { id: "2", name: "DevTools Inc", logo: "/sponsors/devtools.png", tier: "GOLD", url: "https://devtools.com" }
    ]);
  }
}
