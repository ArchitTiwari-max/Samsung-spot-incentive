import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserFromCookies } from '@/lib/auth';

// GET /api/user-validate/users?status=PENDING|APPROVED|BLOCKED
// Lists non-admin users (ABM/ASE/ZBM/ZSE) for the User Validation page.
// It also flattens role-specific profile info and metadata into top-level fields
// so the frontend can easily render name / phone / email / mappings.
export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedUserFromCookies({
      get: (name: string) => {
        const value = (req as any)?.cookies?.get?.(name)?.value || undefined;
        return value ? { value } : undefined;
      },
    });

    if (!authUser || authUser.role !== 'ZOPPER_ADMINISTRATOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = (searchParams.get('status') || 'PENDING').toUpperCase();

    if (!['PENDING', 'APPROVED', 'BLOCKED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Use PENDING, APPROVED, or BLOCKED.' },
        { status: 400 },
      );
    }

    const [users, zbms, zses] = await Promise.all([
      prisma.user.findMany({
        where: {
          validation: status as any,
          role: {
            in: ['ABM', 'ASE', 'ZBM', 'ZSE'],
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          abmProfile: true,
          aseProfile: true,
          zbmProfile: true,
          zseProfile: true,
        },
      } as any),
      prisma.zBM.findMany({ select: { id: true, fullName: true, region: true } }),
      prisma.zSE.findMany({ select: { id: true, fullName: true, region: true } }),
    ]);

    const zbmMap = new Map(
      zbms.map((z) => [z.id, `${z.fullName}${z.region ? ` (${z.region})` : ''}`]),
    );
    const zseMap = new Map(
      zses.map((z) => [z.id, `${z.fullName}${z.region ? ` (${z.region})` : ''}`]),
    );

    const safeUsers = users.map((u: any) => {
      const { password: _pw, ...rest } = u;

      const metadata = (u.metadata || {}) as any;

      // Derive display fields from metadata first (for PENDING users),
      // then from role-specific profile models (for APPROVED users).
      const profile = u.abmProfile || u.aseProfile || u.zbmProfile || u.zseProfile || {};

      const fullName = metadata.fullName || profile.fullName || null;
      const phoneNumber = metadata.phoneNumber || metadata.phone || profile.phone || null;
      const email = metadata.email || null;

      const storeIds: string[] = Array.isArray(metadata.storeIds)
        ? metadata.storeIds
        : metadata.storeId
        ? [metadata.storeId]
        : Array.isArray(profile.storeIds)
        ? profile.storeIds
        : [];

      const managerId =
        metadata.managerId ||
        (u.abmProfile?.zbmId ?? u.aseProfile?.zseId ?? null);

      const managerName = managerId
        ? zbmMap.get(managerId) || zseMap.get(managerId) || null
        : null;

      const roleProfileId =
        u.abmProfile?.id ?? u.aseProfile?.id ?? null;

      return {
        ...rest,
        fullName,
        phoneNumber,
        email,
        storeIds,
        managerId,
        managerName,
        roleProfileId,
      };
    });

    return NextResponse.json({ users: safeUsers });
  } catch (error) {
    console.error('Error in GET /api/user-validate/users', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
