import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Registrations are now closed. Thank you for your interest!" },
    { status: 403 }
  );
}
