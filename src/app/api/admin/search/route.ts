import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const status = searchParams.get('status');
    const year = searchParams.get('year');
    const course = searchParams.get('course');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    const whereClause: Prisma.TeamWhereInput = {};

    if (status) {
      whereClause.status = status as any;
    }

    if (q) {
      whereClause.OR = [
        { name: { contains: q } },
        { 
          leader: {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } }
            ]
          }
        },
        {
          members: {
            some: {
              OR: [
                { name: { contains: q } },
                { email: { contains: q } }
              ]
            }
          }
        },
        {
          project: {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } }
            ]
          }
        }
      ];
    }

    if (year) {
      whereClause.AND = [
        ...(whereClause.AND as Prisma.TeamWhereInput[] || []),
        {
          OR: [
            { leader: { year: year } },
            { members: { some: { year: year } } }
          ]
        }
      ];
    }

    if (course) {
        whereClause.AND = [
          ...(whereClause.AND as Prisma.TeamWhereInput[] || []),
          {
            OR: [
              { leader: { course: course } },
              { members: { some: { course: course } } }
            ]
          }
        ];
    }

    let orderBy: Prisma.TeamOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'name') {
      orderBy = { name: 'asc' };
    }

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where: whereClause,
        include: {
          leader: {
            select: { id: true, name: true, email: true, phone: true, course: true, year: true, github: true, linkedin: true }
          },
          members: {
            select: { id: true, name: true, email: true, phone: true, course: true, year: true, github: true, linkedin: true }
          },
          project: {
            select: { id: true, name: true, problem: true, description: true, pptName: true, isLocked: true, submittedAt: true }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.team.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      teams,
      total,
      page,
      totalPages
    });

  } catch (error: unknown) {
    console.error('Error fetching search results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 500 }
    );
  }
}
