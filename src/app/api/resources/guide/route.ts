import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { readFileSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const resource = await prisma.systemResource.findUnique({
      where: { key: 'presentation_guide' },
    });

    if (resource && resource.dataUrl) {
      // Extract the base64 part of the data URL
      const base64Data = resource.dataUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Attempt to guess mime type from dataUrl if needed, but we'll default to pdf
      let mimeType = 'application/pdf';
      if (resource.dataUrl.startsWith('data:')) {
        const match = resource.dataUrl.match(/^data:([^;]+);/);
        if (match && match[1]) {
          mimeType = match[1];
        }
      }
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Disposition': `attachment; filename="${resource.name}"`,
          'Content-Type': mimeType,
          'Content-Length': buffer.length.toString(),
        },
      });
    }

    // Fallback to local file if not found in the database
    const filePath = path.join(process.cwd(), 'public', 'resources', 'Ideathon_Project_Guide.pdf');
    const fileBuffer = readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Disposition': 'attachment; filename="Ideathon_Project_Guide.pdf"',
        'Content-Type': 'application/pdf',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching presentation guide:', error);
    return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
  }
}
