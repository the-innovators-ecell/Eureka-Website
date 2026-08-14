import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { logActivity, Actions } from '@/lib/activity-logger';

export async function GET(request: Request) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const teams = await prisma.team.findMany({
      include: {
        leader: { select: { name: true, email: true, phone: true, github: true, linkedin: true, course: true, year: true, college: true } },
        members: { select: { name: true, email: true, phone: true, github: true, linkedin: true, course: true, year: true, college: true } },
        project: true
      },
      orderBy: { createdAt: 'asc' }
    });

    const headers = [
      'Team ID', 'Team Name', 'Status', 
      'Leader Name', 'Leader Email', 'Leader Phone', 'Leader Course', 'Leader Year', 'Leader College', 'Leader GitHub', 'Leader LinkedIn',
      'Member 2 Name', 'Member 2 Email', 'Member 2 Phone', 'Member 2 Course', 'Member 2 Year', 'Member 2 College', 'Member 2 GitHub', 'Member 2 LinkedIn',
      'Member 3 Name', 'Member 3 Email', 'Member 3 Phone', 'Member 3 Course', 'Member 3 Year', 'Member 3 College', 'Member 3 GitHub', 'Member 3 LinkedIn',
      'Member 4 Name', 'Member 4 Email', 'Member 4 Phone', 'Member 4 Course', 'Member 4 Year', 'Member 4 College', 'Member 4 GitHub', 'Member 4 LinkedIn',
      'Project Name', 'Problem Statement', 'Project Description', 
      'Submission Status', 'Registration Date', 'Submission Date'
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '';
      const stringified = String(str);
      if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n') || stringified.includes('\r')) {
        return `"${stringified.replace(/"/g, '""')}"`;
      }
      return stringified;
    };

    let csvContent = headers.map(escapeCsv).join(',') + '\n';

    teams.forEach((team) => {
      const m2 = team.members[0];
      const m3 = team.members[1];
      const m4 = team.members[2];
      
      const row = [
        team.id,
        team.name,
        team.status || 'ACTIVE',
        team.leader?.name || '',
        team.leader?.email || '',
        team.leader?.phone || '',
        team.leader?.course || '',
        team.leader?.year || '',
        team.leader?.college || '',
        team.leader?.github || '',
        team.leader?.linkedin || '',

        m2?.name || '',
        m2?.email || '',
        m2?.phone || '',
        m2?.course || '',
        m2?.year || '',
        m2?.college || '',
        m2?.github || '',
        m2?.linkedin || '',

        m3?.name || '',
        m3?.email || '',
        m3?.phone || '',
        m3?.course || '',
        m3?.year || '',
        m3?.college || '',
        m3?.github || '',
        m3?.linkedin || '',

        m4?.name || '',
        m4?.email || '',
        m4?.phone || '',
        m4?.course || '',
        m4?.year || '',
        m4?.college || '',
        m4?.github || '',
        m4?.linkedin || '',

        team.project?.name || '',
        team.project?.problem || '',
        team.project?.description || '',
        team.project?.isLocked ? 'SUBMITTED' : 'NOT_SUBMITTED',
        team.createdAt.toISOString(),
        team.project?.submittedAt?.toISOString() || ''
      ];

      csvContent += row.map(escapeCsv).join(',') + '\n';
    });

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `IdeaForge_2026_Teams_FullData_${dateStr}.csv`;

    await logActivity(session.user.id, Actions.DATA_EXPORTED, 'Exported Full Team Member Data to CSV', request);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: unknown) {
    console.error('Error generating CSV export:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSV export' },
      { status: 500 }
    );
  }
}

