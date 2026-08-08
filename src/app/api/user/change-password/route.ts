import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { logActivity, Actions } from '@/lib/activity-logger';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error || !auth.session) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsedData = changePasswordSchema.safeParse(body);
    
    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid data provided', details: parsedData.error }, { status: 400 });
    }

    const { currentPassword, newPassword } = parsedData.data;

    const user = await prisma.user.findUnique({
      where: { id: auth.session.user.id },
      select: { password: true }
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found or no password set' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: auth.session.user.id },
      data: { password: hashedPassword }
    });

    await logActivity(auth.session.user.id, Actions.USER_PASSWORD_CHANGED, "Password successfully changed");

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error changing password:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
