import { NextRequest, NextResponse } from 'next/server';
import db, { createProfile, getProfileByEmail } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
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
