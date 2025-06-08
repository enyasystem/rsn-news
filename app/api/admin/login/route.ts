import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }
  const user = db.prepare('SELECT * FROM profile WHERE email = ? AND password = ?').get(email, password) as { id?: string, email?: string, role?: string } | undefined;
  if (!user || !user.id || !user.email || !user.role) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }
  // You can set a session/cookie here if you want
  return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
}
