import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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
