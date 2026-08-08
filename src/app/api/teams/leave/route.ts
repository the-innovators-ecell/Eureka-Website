import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { logActivity, Actions } from '@/lib/activity-logger';

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error || !auth.session) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.session.user.id },
      include: { team: true }
    });

    if (!user || !user.teamId || !user.team) {
      return NextResponse.json({ error: 'You are not in a team' }, { status: 400 });
    }

    if (user.team.leaderId === user.id) {
      return NextResponse.json({ error: 'Team leader cannot leave the team. Please delete the team instead.' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { teamId: null }
    });

    await logActivity(user.id, Actions.TEAM_LEFT, `Left team: ${user.team.name}`);

    return NextResponse.json({ message: 'Successfully left the team' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error leaving team:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
