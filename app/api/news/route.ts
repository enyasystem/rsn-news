import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all news
export async function GET() {
  const news = await prisma.news.findMany({ include: { category: true, author: true } });
  return NextResponse.json(news);
}

// POST create news
export async function POST(req: Request) {
  const { title, content, imageUrl, categoryId, authorId, slug } = await req.json();
  const news = await prisma.news.create({
    data: { title, content, imageUrl, categoryId, authorId, slug },
  });
  return NextResponse.json(news);
}

// PUT update news
export async function PUT(req: Request) {
  const { id, title, content, imageUrl, categoryId, authorId, slug } = await req.json();
  const news = await prisma.news.update({
    where: { id },
    data: { title, content, imageUrl, categoryId, authorId, slug },
  });
  return NextResponse.json(news);
}

// DELETE news
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.news.delete({ where: { id } });
  return NextResponse.json({ message: 'News deleted' });
}
