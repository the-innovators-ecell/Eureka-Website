import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { projectSchema } from '@/lib/validations';
import { logActivity, Actions } from '@/lib/activity-logger';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { team: { include: { project: true } } } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (!user.teamId || !user.team) return NextResponse.json({ error: 'You must be in a team to submit a project' }, { status: 400 });
    if (user.team.project) return NextResponse.json({ error: 'Your team has already submitted a project' }, { status: 400 });
    const body = await req.json();
    const parsedData = projectSchema.safeParse(body);
    if (!parsedData.success) return NextResponse.json({ error: 'Invalid project data' }, { status: 400 });
    const { name, problem, description, pptUrl, pptName } = parsedData.data;
    const project = await prisma.project.create({ 
      data: { 
        name, 
        problem: problem || "", 
        description: description || "", 
        pptUrl: pptUrl || null,
        pptName: pptName || null,
        teamId: user.teamId, 
        submittedById: user.id, 
        isLocked: true 
      } 
    });
    
    await logActivity(user.id, Actions.PROJECT_SUBMITTED, `Submitted project: ${name}`);

    return NextResponse.json({ message: 'Project submitted successfully', project });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error submitting project:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { projectId, isLocked, name, problem, description, pptUrl, pptName } = body;
    
    if (!projectId) return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    
    const updateData: { isLocked?: boolean, name?: string, problem?: string, description?: string, pptUrl?: string, pptName?: string } = {};
    if (isLocked !== undefined) updateData.isLocked = isLocked;
    if (name) updateData.name = name;
    if (problem) updateData.problem = problem;
    if (description) updateData.description = description;
    if (pptUrl !== undefined) updateData.pptUrl = pptUrl;
    if (pptName !== undefined) updateData.pptName = pptName;

    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData
    });
    
    await logActivity(session.user.id, Actions.PROJECT_UPDATED, `Updated project: ${project.name}`);

    return NextResponse.json({ message: 'Project updated successfully', project });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating project:', error.message);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
