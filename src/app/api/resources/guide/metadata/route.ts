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
    const filePath = path.join(process.cwd(), 'public', 'resources', 'Ideathon_Project_Guide.pdf');
    let size = '0 KB';
    let updatedAt = new Date();
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeInKB = stats.size / 1024;
      size = sizeInKB >= 1024
        ? (sizeInKB / 1024).toFixed(2) + ' MB'
        : Math.round(sizeInKB) + ' KB';
      updatedAt = stats.mtime;
    }

    return NextResponse.json({
      name: 'Ideathon_Project_Guide.pdf',
      size: size,
      updatedAt: updatedAt,
      source: 'local',
    });
  } catch (error) {
    console.error('Error fetching guide metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
