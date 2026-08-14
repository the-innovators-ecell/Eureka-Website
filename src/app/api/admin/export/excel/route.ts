import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import ExcelJS from 'exceljs';
import { logActivity, Actions } from '@/lib/activity-logger';

export async function GET(request: Request) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const teams = await prisma.team.findMany({
      include: {
        leader: { select: { name: true, email: true, phone: true, github: true, linkedin: true, course: true, year: true, college: true } },
        members: { select: { name: true, email: true, phone: true, github: true, linkedin: true, course: true, year: true, college: true } },
        project: { select: { name: true, problem: true, description: true, isLocked: true, submittedAt: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    const workbook = new ExcelJS.Workbook();
    
    // -------------------------------------------------------------
    // SHEET 1: All Members (Team-Wise Roster)
    // -------------------------------------------------------------
    const membersSheet = workbook.addWorksheet('All Members (Team Wise)');
    
    const membersHeaders = [
      'Team Name', 'Team ID', 'Role', 'Full Name', 'Email Address', 
      'Phone Number', 'Course / Department', 'Year of Study', 'College Name',
      'GitHub Profile', 'LinkedIn Profile', 'Project Name', 'Problem Statement', 'Submission Status'
    ];

    membersSheet.addRow(membersHeaders);
    const membersHeaderRow = membersSheet.getRow(1);
    membersHeaderRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111111' } };
      cell.font = { color: { argb: 'FFD4AF37' }, bold: true };
    });

    let memberRowIndex = 0;
    teams.forEach((team) => {
      // 1. Leader
      if (team.leader) {
        memberRowIndex++;
        const row = membersSheet.addRow([
          team.name,
          team.id,
          'Team Leader',
          team.leader.name,
          team.leader.email,
          team.leader.phone || 'N/A',
          team.leader.course || 'N/A',
          team.leader.year?.toString() || 'N/A',
          team.leader.college || 'N/A',
          team.leader.github || 'N/A',
          team.leader.linkedin || 'N/A',
          team.project?.name || 'N/A',
          team.project?.problem || 'N/A',
          team.project?.isLocked ? 'SUBMITTED' : 'DRAFT'
        ]);

        if (memberRowIndex % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9F9F9' } };
          });
        }
      }

      // 2. Members
      team.members.forEach((m, idx) => {
        memberRowIndex++;
        const row = membersSheet.addRow([
          team.name,
          team.id,
          `Member ${idx + 2}`,
          m.name,
          m.email,
          m.phone || 'N/A',
          m.course || 'N/A',
          m.year?.toString() || 'N/A',
          m.college || 'N/A',
          m.github || 'N/A',
          m.linkedin || 'N/A',
          team.project?.name || 'N/A',
          team.project?.problem || 'N/A',
          team.project?.isLocked ? 'SUBMITTED' : 'DRAFT'
        ]);

        if (memberRowIndex % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9F9F9' } };
          });
        }
      });
    });

    membersSheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell!({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) maxLength = columnLength;
      });
      column.width = Math.min(maxLength + 3, 45);
    });

    membersSheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: membersHeaders.length } };
    membersSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    // -------------------------------------------------------------
    // SHEET 2: Teams Master Table (Detailed Horizontal View)
    // -------------------------------------------------------------
    const masterSheet = workbook.addWorksheet('Teams Master Table');

    const masterHeaders = [
      'Team ID', 'Team Name', 'Status',
      'Leader Name', 'Leader Email', 'Leader Phone', 'Leader Course', 'Leader Year', 'Leader College', 'Leader GitHub', 'Leader LinkedIn',
      'Member 2 Name', 'Member 2 Email', 'Member 2 Phone', 'Member 2 Course', 'Member 2 Year', 'Member 2 College', 'Member 2 GitHub', 'Member 2 LinkedIn',
      'Member 3 Name', 'Member 3 Email', 'Member 3 Phone', 'Member 3 Course', 'Member 3 Year', 'Member 3 College', 'Member 3 GitHub', 'Member 3 LinkedIn',
      'Member 4 Name', 'Member 4 Email', 'Member 4 Phone', 'Member 4 Course', 'Member 4 Year', 'Member 4 College', 'Member 4 GitHub', 'Member 4 LinkedIn',
      'Project Name', 'Problem Statement', 'Project Description',
      'Submission Status', 'Registration Date', 'Submission Date'
    ];

    masterSheet.addRow(masterHeaders);
    const masterHeaderRow = masterSheet.getRow(1);
    masterHeaderRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111111' } };
      cell.font = { color: { argb: 'FFD4AF37' }, bold: true };
    });

    teams.forEach((team, index) => {
      const m2 = team.members[0];
      const m3 = team.members[1];
      const m4 = team.members[2];

      const row = masterSheet.addRow([
        team.id,
        team.name,
        team.status || 'ACTIVE',
        team.leader?.name || '',
        team.leader?.email || '',
        team.leader?.phone || '',
        team.leader?.course || '',
        team.leader?.year?.toString() || '',
        team.leader?.college || '',
        team.leader?.github || '',
        team.leader?.linkedin || '',
        
        m2?.name || '',
        m2?.email || '',
        m2?.phone || '',
        m2?.course || '',
        m2?.year?.toString() || '',
        m2?.college || '',
        m2?.github || '',
        m2?.linkedin || '',

        m3?.name || '',
        m3?.email || '',
        m3?.phone || '',
        m3?.course || '',
        m3?.year?.toString() || '',
        m3?.college || '',
        m3?.github || '',
        m3?.linkedin || '',

        m4?.name || '',
        m4?.email || '',
        m4?.phone || '',
        m4?.course || '',
        m4?.year?.toString() || '',
        m4?.college || '',
        m4?.github || '',
        m4?.linkedin || '',

        team.project?.name || '',
        team.project?.problem || '',
        team.project?.description || '',
        team.project?.isLocked ? 'SUBMITTED' : 'NOT_SUBMITTED',
        team.createdAt,
        team.project?.submittedAt || ''
      ]);

      if (index % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9F9F9' } };
        });
      }
    });

    masterSheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell!({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) maxLength = columnLength;
      });
      column.width = Math.min(maxLength + 3, 45);
    });

    masterSheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: masterHeaders.length } };
    masterSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `IdeaForge_2026_Teams_FullData_${dateStr}.xlsx`;

    await logActivity(session.user.id, Actions.DATA_EXPORTED, 'Exported Full Team Member Data to Excel', request);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: unknown) {
    console.error('Error generating Excel export:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel export' },
      { status: 500 }
    );
  }
}

