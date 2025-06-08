import db from '@/lib/db';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const title = form.get('title') as string;
  const content = form.get('content') as string;
  const category = form.get('category') as string;
  const author_id = form.get('author_id') as string;
  let image_url = '';

  // Handle image upload (save to /public/images/news/)
  const image = form.get('image') as File | null;
  if (image) {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = image.name.split('.').pop();
    const fileName = `${Date.now()}-${randomUUID()}.${ext}`;
    const filePath = `public/images/news/${fileName}`;
    fs.writeFileSync(filePath, buffer);
    image_url = `/images/news/${fileName}`;
  }

  const stmt = db.prepare('INSERT INTO news (title, content, category, image_url, author_id) VALUES (?, ?, ?, ?, ?)');
  stmt.run(title, content, category, image_url, author_id);

  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const form = await req.formData();
  const id = form.get('id') as string;
  const title = form.get('title') as string;
  const content = form.get('content') as string;
  const category = form.get('category') as string;
  let image_url = form.get('image_url') as string;

  // Handle image upload (optional)
  const image = form.get('image') as File | null;
  if (image) {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = image.name.split('.').pop();
    const fileName = `${Date.now()}-${randomUUID()}.${ext}`;
    const filePath = `public/images/news/${fileName}`;
    fs.writeFileSync(filePath, buffer);
    image_url = `/images/news/${fileName}`;
  }

  const stmt = db.prepare('UPDATE news SET title=?, content=?, category=?, image_url=? WHERE id=?');
  stmt.run(title, content, category, image_url, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const stmt = db.prepare('DELETE FROM news WHERE id=?');
  stmt.run(id);
  return NextResponse.json({ success: true });
}
