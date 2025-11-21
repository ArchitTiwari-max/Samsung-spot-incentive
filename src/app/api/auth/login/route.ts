import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  signAccessToken,
  signRefreshToken,
  AuthTokenPayload,
} from '@/lib/auth';

// POST /api/auth/login
// Body: { username: string; password: string }
// Sets httpOnly cookies for access & refresh tokens and returns a userInfo object
// that the client can store in localStorage.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body ?? {};

    if (!username || !password) {
      return NextResponse.json(
        { error: 'username and password are required' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        abmProfile: true,
        aseProfile: true,
        zbmProfile: true,
        zseProfile: true,
        secProfile: true,
        samsungAdminProfile: true,
        zopperAdminProfile: true,
      },
    } as any);

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.validation !== 'APPROVED') {
      return NextResponse.json(
        { error: 'User is not approved yet. Please contact administrator.' },
        { status: 403 },
      );
    }

    const anyUser = user as any;
    const { password: _pw, ...rest } = anyUser;

    const profile =
      anyUser.abmProfile ||
      anyUser.aseProfile ||
      anyUser.zbmProfile ||
      anyUser.zseProfile ||
      anyUser.secProfile ||
      anyUser.samsungAdminProfile ||
      anyUser.zopperAdminProfile ||
      null;

    const payload: AuthTokenPayload = {
      userId: rest.id,
      role: rest.role,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Only expose role + role-specific profile to the client;
    // do not expose raw User model fields like id, username, metadata, etc.
    const res = NextResponse.json({
      user: {
        role: rest.role,
        profile,
      },
    });

    const isSecure = process.env.NODE_ENV === 'production';

    res.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecure,
      path: '/',
    });

    res.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecure,
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('Error in POST /api/auth/login', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
