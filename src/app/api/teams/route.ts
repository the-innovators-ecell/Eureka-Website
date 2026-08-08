import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { generateInviteCode } from '@/lib/utils';
import * as z from 'zod';

const createTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(50),
  memberCount: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  memberNames: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        team: {
          include: {
            members: true,
            project: true,
          }
        }
      }
    });

    if (!user?.team) {
      return NextResponse.json({ team: null });
    }

    return NextResponse.json({ team: user.team });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.teamId) return NextResponse.json({ error: 'You are already in a team' }, { status: 400 });

    const body = await req.json();
    const parsedData = createTeamSchema.safeParse(body);
    if (!parsedData.success) return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });

    const { name, memberCount } = parsedData.data;

    const inviteCode = generateInviteCode();
    const newTeam = await prisma.team.create({
      data: { 
        name, 
        memberCount, 
        inviteCode, 
        leaderId: user.id 
      }
    });

    await prisma.user.update({ where: { id: user.id }, data: { teamId: newTeam.id } });
    
    // Log activity
    const { logActivity, Actions } = await import('@/lib/activity-logger');
    await logActivity(user.id, Actions.TEAM_CREATED, `Created team: ${name}`);

    return NextResponse.json({ message: 'Team created successfully', inviteCode: newTeam.inviteCode, team: newTeam });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating team:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

