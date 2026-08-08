import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { logActivity, Actions } from '@/lib/activity-logger';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
  year: z.string().optional(),
  course: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error || !auth.session) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.session.user.id },
      select: {
        id: true, name: true, email: true, phone: true,
        github: true, linkedin: true, year: true, course: true,
        teamId: true, role: true, isBlacklisted: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching profile:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error || !auth.session) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsedData = updateProfileSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid data provided', details: parsedData.error }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: auth.session.user.id },
      data: parsedData.data,
      select: {
        id: true, name: true, email: true, phone: true,
        github: true, linkedin: true, year: true, course: true,
      }
    });

    await logActivity(auth.session.user.id, Actions.USER_PROFILE_UPDATED, "Profile fields updated");

    return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating profile:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
