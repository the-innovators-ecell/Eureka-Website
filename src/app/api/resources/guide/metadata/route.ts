import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const resource = await prisma.systemResource.findUnique({
      where: { key: 'presentation_guide' },
      select: {
        name: true,
        size: true,
        updatedAt: true,
      }
    });

    if (resource) {
      return NextResponse.json({
        name: resource.name,
        size: resource.size,
        updatedAt: resource.updatedAt,
        source: 'database',
      });
    }

    // Fallback to local file metadata
    const filePath = path.join(process.cwd(), 'public', 'resources', 'Ideathon_Presentation_Guide.pptx');
    let size = '0 MB';
    let updatedAt = new Date();
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      size = (stats.size / (1024 * 1024)).toFixed(2) + ' MB';
      updatedAt = stats.mtime;
    }

    return NextResponse.json({
      name: 'Ideathon_Presentation_Guide.pptx',
      size: size,
      updatedAt: updatedAt,
      source: 'local',
    });
  } catch (error) {
    console.error('Error fetching guide metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
