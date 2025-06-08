import { NextRequest, NextResponse } from 'next/server';
import db, { createProfile, getProfileByEmail } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }
  // Only allow admin registration if no admin exists
  const adminExists = db.prepare("SELECT 1 FROM profile WHERE role = 'admin' LIMIT 1").get();
  if (adminExists) {
    return NextResponse.json({ error: 'Admin already exists. Please log in.' }, { status: 403 });
  }
  if (getProfileByEmail(email)) {
    return NextResponse.json({ error: 'Email already exists.' }, { status: 409 });
  }
  const id = uuidv4();
  try {
    createProfile({ id, email, password, role: 'admin' });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// User management: get all users and update role
export async function GET() {
  const users = db.prepare('SELECT id, email, role, created_at FROM profile ORDER BY created_at DESC').all();
  return NextResponse.json(users);
}

export async function PUT(req: NextRequest) {
  const { id, role } = await req.json();
  if (!id || !role) {
    return NextResponse.json({ error: 'User ID and role are required.' }, { status: 400 });
  }
  try {
    db.prepare('UPDATE profile SET role = ? WHERE id = ?').run(role, id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
