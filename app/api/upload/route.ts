import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const savedPaths: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      savedPaths.push(`/uploads/projects/${filename}`);
    }

    return NextResponse.json({ paths: savedPaths });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export const config = {
  api: { bodyParser: false },
};
