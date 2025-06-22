import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// PUT: Update admin email or password
export async function PUT(req: Request) {
  const { id, email, password } = await req.json();
  const data: any = {};
  if (email) data.email = email;
  if (password) data.password = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.update({ where: { id }, data });
  return NextResponse.json({ id: admin.id, email: admin.email });
}
