export const runtime = "nodejs";
import { NextResponse } from 'next/server';

export async function GET() {
  // Redirect to login with a toast message param and clear the cookie
  const response = NextResponse.redirect('/admin-login?logout=1');
  response.headers.set(
    'Set-Cookie',
    'admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
  );
  return response;
}
