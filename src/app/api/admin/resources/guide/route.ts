import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const isEmailAdmin =
      session?.user?.email?.toLowerCase() === 'swapnilaryajua@gmail.com' ||
      session?.user?.email?.toLowerCase() === 'namanpriyasharmajua@gmail.com' ||
      session?.user?.email?.toLowerCase() === 'admin@ideathon.com';

    const isAdmin = isEmailAdmin || session?.user?.role === 'ADMIN';

    if (!session || !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, dataUrl, size } = data;

    if (!name || !dataUrl || !size) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resource = await prisma.systemResource.upsert({
      where: { key: 'presentation_guide' },
      update: {
        name,
        dataUrl,
        size,
      },
      create: {
        key: 'presentation_guide',
        name,
        dataUrl,
        size,
      },
    });

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error('Error updating presentation guide:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
