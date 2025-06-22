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
