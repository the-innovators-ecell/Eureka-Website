import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { logActivity, Actions } from '@/lib/activity-logger';

export async function GET(request: Request) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    // Query all tables
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        github: true,
        linkedin: true,
        year: true,
        course: true,
        role: true,
        isBlacklisted: true,
        createdAt: true,
        updatedAt: true,
        teamId: true,
      }
    });
    const teams = await prisma.team.findMany();
    const projects = await prisma.project.findMany();
    // Assuming blacklists, sponsors, events, prizes exist based on schema
    // Since Prisma models might vary slightly, using generic approaches or skipping models if they don't exist
    // We will query what we know and handle gracefully
    const blacklists = (prisma as any).blacklist ? await (prisma as any).blacklist.findMany() : [];
    const sponsors = (prisma as any).sponsor ? await (prisma as any).sponsor.findMany() : [];
    const events = (prisma as any).event ? await (prisma as any).event.findMany() : [];
    const prizes = (prisma as any).prize ? await (prisma as any).prize.findMany() : [];
    const activityLogs = await prisma.activityLog.findMany();

    const backupData = {
      timestamp: new Date().toISOString(),
      data: {
        users,
        teams,
        projects,
        blacklists,
        sponsors,
        events,
        prizes,
        activityLogs,
      }
    };

    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `IdeaForge_Backup_${dateStr}.json`;

    await logActivity(session.user.id, Actions.DATABASE_BACKUP, 'Exported database backup as JSON', request);

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: unknown) {
    console.error('Error generating database backup:', error);
    return NextResponse.json(
      { error: 'Failed to generate database backup' },
      { status: 500 }
    );
  }
}
