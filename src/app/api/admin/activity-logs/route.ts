import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await auth();
    const isEmailAdmin =
      session?.user?.email?.toLowerCase() === "swapnilaryajua@gmail.com" ||
      session?.user?.email?.toLowerCase() === "namanpriyasharmajua@gmail.com";

    const isAdmin = isEmailAdmin || session?.user?.role === "ADMIN";

    if (!session || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    const whereClause: Prisma.ActivityLogWhereInput = {};
    
    if (action) {
      whereClause.action = action;
    }
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt.lte = new Date(endDate);
      }
    }

    try {
      const [logs, total] = await Promise.all([
        prisma.activityLog.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: limit
        }),
        prisma.activityLog.count({
          where: whereClause
        })
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      return NextResponse.json({
        logs,
        total,
        page,
        totalPages
      });
    } catch (dbErr) {
      console.error('Database fetch error for activity logs:', dbErr);
      return NextResponse.json({
        logs: [],
        total: 0,
        page: 1,
        totalPages: 1
      });
    }
  } catch (error: unknown) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json({
      logs: [],
      total: 0,
      page: 1,
      totalPages: 1
    });
  }
}
