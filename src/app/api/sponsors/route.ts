import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(sponsors, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Sponsors fetch error:", error);
    return NextResponse.json([
      { id: "1", name: "TechCorp", logo: "/sponsors/techcorp.png", tier: "PLATINUM", url: "https://techcorp.com" },
      { id: "2", name: "DevTools Inc", logo: "/sponsors/devtools.png", tier: "GOLD", url: "https://devtools.com" }
    ], {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  }
}
