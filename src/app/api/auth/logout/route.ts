import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/lib/auth';

// POST /api/auth/logout
// Clears auth cookies and returns success.
export async function POST() {
  const res = NextResponse.json({ success: true });

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  };

  res.cookies.set(ACCESS_TOKEN_COOKIE, '', cookieOptions);
  res.cookies.set(REFRESH_TOKEN_COOKIE, '', cookieOptions);

  return res;
}
