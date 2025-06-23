import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET: List all admins
export async function GET() {
  const admins = await prisma.admin.findMany({ select: { id: true, name: true, email: true } });
  return NextResponse.json(admins);
}

// POST: Create a new admin
export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({
    data: { name, email, password: hashed },
  });
  return NextResponse.json({ id: admin.id, email: admin.email });
}

// DELETE: Remove an admin by id
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.admin.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
