import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import * as z from 'zod';

const joinTeamSchema = z.object({
  inviteCode: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.teamId) return NextResponse.json({ error: 'You are already in a team' }, { status: 400 });
    const body = await req.json();
    const parsedData = joinTeamSchema.safeParse(body);
    if (!parsedData.success) return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 });
    const { inviteCode } = parsedData.data;
    const team = await prisma.team.findUnique({ where: { inviteCode }, include: { members: true } });
    if (!team) return NextResponse.json({ error: 'Invalid invite code or team does not exist' }, { status: 404 });
    if (team.members.length >= (team.memberCount || 4)) {
      return NextResponse.json({ error: 'This team has reached its maximum member limit' }, { status: 400 });
    }
    await prisma.user.update({ where: { id: user.id }, data: { teamId: team.id } });
    const updatedTeam = await prisma.team.findUnique({ where: { id: team.id } });

    const { logActivity, Actions } = await import('@/lib/activity-logger');
    await logActivity(user.id, Actions.TEAM_JOINED, `Joined team: ${team.name}`);

    return NextResponse.json({ message: 'Joined team successfully', team: updatedTeam });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error joining team:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
