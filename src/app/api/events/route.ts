import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' }
    });

    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Events fetch error:", error);
    return NextResponse.json([
      { 
        id: "1", 
        title: "Opening Ceremony", 
        description: "Kickoff the ideathon with keynote speakers.", 
        date: new Date(Date.now() + 86400000).toISOString(),
        location: "Main Auditorium"
      }
    ], {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  }
}
