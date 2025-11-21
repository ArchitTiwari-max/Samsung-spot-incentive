import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { Role, Validation } from '@prisma/client';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  // In Next.js route handlers this will only log on the server side
  console.warn(
    '[auth] ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set in environment variables.',
  );
}

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'dev-access-secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret';

export interface AuthTokenPayload {
  userId: string;
  role: Role;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: Role;
  validation: Validation;
  metadata: any;
  profile: any | null;
}

export function signAccessToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_TTL_SECONDS });
}

export function signRefreshToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL_SECONDS });
}

export function verifyAccessToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

// Utility used inside API routes to resolve the logged-in user
// It checks access token first; if not valid it falls back to refresh token.
// It does NOT rotate tokens; it only validates them.
export async function getAuthenticatedUserFromCookies(cookies: {
  get(name: string): { value: string } | undefined;
}): Promise<AuthenticatedUser | null> {
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  let payload: AuthTokenPayload | null = null;

  if (accessToken) {
    payload = verifyAccessToken(accessToken);
  }

  if (!payload && refreshToken) {
    payload = verifyRefreshToken(refreshToken);
  }

  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
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

  if (!user || user.validation !== 'APPROVED') return null;

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

  const authUser: AuthenticatedUser = {
    id: rest.id,
    username: rest.username,
    role: rest.role,
    validation: rest.validation,
    metadata: rest.metadata ?? {},
    profile,
  };

  return authUser;
}

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS };
