import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";
import { logActivity, Actions } from "@/lib/activity-logger";

export async function POST(req: NextRequest) {
  try {
    // ── REGISTRATIONS CLOSED ──
    return NextResponse.json(
      { error: "Registrations are now closed. Thank you for your interest!" },
      { status: 403 }
    );

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data provided", details: parsed.error }, { status: 400 });
    }

    const { name, email, phone, github, linkedin, year, course, college, registrationScreenshotUrl, registrationScreenshotName, password } = parsed.data;

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json({ error: "Phone number already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        github,
        linkedin,
        year,
        course,
        college,
        registrationScreenshotUrl,
        registrationScreenshotName,
        password: hashedPassword,
        role: "USER" // Default role
      }
    });

    await logActivity(newUser.id, Actions.USER_REGISTERED, "Account created");

    return NextResponse.json({ success: true, message: "Account created successfully" }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Register error:", error.message);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
