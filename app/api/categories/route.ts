import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all categories
export async function GET() {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}

// POST create category
export async function POST(req: Request) {
  const { name } = await req.json();
  const category = await prisma.category.create({ data: { name } });
  return NextResponse.json(category);
}

// PUT update category
export async function PUT(req: Request) {
  const { id, name } = await req.json();
  const category = await prisma.category.update({ where: { id }, data: { name } });
  return NextResponse.json(category);
}

// DELETE category
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
