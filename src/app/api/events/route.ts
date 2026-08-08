import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Assuming an Event model exists, or mock data if not
    const events = await prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Events fetch error:", error);
    // Return mock data if table doesn't exist yet
    return NextResponse.json([
      { 
        id: "1", 
        title: "Opening Ceremony", 
        description: "Kickoff the hackathon with keynote speakers.", 
        date: new Date(Date.now() + 86400000).toISOString(),
        location: "Main Auditorium"
      }
    ]);
  }
}
