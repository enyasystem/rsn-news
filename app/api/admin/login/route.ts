import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  // Generate JWT (store secret in .env)
  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );
  // Set cookie with best practices, Secure only in production
  const isProd = process.env.NODE_ENV === 'production';
  const cookie = `admin_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${
    isProd ? '; Secure' : ''
  }`;
  const response = NextResponse.json({
    user: { id: admin.id, name: admin.name, email: admin.email },
    token
  });
  response.headers.append('Set-Cookie', cookie);
  return response;
}
