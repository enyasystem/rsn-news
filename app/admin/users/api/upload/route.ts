import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  const url = `/uploads/${fileName}`;
  return NextResponse.json({ url });
}
