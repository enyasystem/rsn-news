import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the admin_session cookie
  const response = NextResponse.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    'admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
  );
  return response;
}
