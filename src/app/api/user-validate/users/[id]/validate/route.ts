import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserFromCookies } from '@/lib/auth';

// POST /api/user-validate/users/[id]/validate
// Body: { validation: 'APPROVED' | 'BLOCKED', metadata?: any }
// - If APPROVED: update metadata (if provided), create role-specific model from metadata,
//   set validation=APPROVED and clear metadata on User.
// - If BLOCKED: just set validation=BLOCKED (user can then be deleted from blocked tab).
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: userId } = await params;

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

    const body = await req.json();
    const { validation, metadata } = body ?? {};

    if (!validation || !['APPROVED', 'BLOCKED'].includes(validation)) {
      return NextResponse.json(
        { error: 'validation must be APPROVED or BLOCKED' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!['ABM', 'ASE', 'ZBM', 'ZSE'].includes(user.role as any)) {
      return NextResponse.json(
        { error: 'Only ABM/ASE/ZBM/ZSE users are managed here' },
        { status: 400 },
      );
    }

    // BLOCKED: no role model, just update status
    if (validation === 'BLOCKED') {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { validation: 'BLOCKED' },
      });
      const { password: _pw, ...safeUser } = updated as any;
      return NextResponse.json({ user: safeUser });
    }

    // APPROVED: merge metadata (admin-edited) and create respective role model
    const finalMetadata = {
      ...(user.metadata as any),
      ...(metadata || {}),
    } as any;

    const phone = finalMetadata.phoneNumber || finalMetadata.phone || '';
    const fullName = finalMetadata.fullName || '';

    // storeIds is an array in signup form; we keep the full array
    const storeIds: string[] = Array.isArray(finalMetadata.storeIds)
      ? finalMetadata.storeIds
      : finalMetadata.storeId
      ? [finalMetadata.storeId]
      : [];
    const primaryStoreId = storeIds[0] || '';

    const managerId = finalMetadata.managerId || '';

    // Validate if managerId is a valid MongoDB ObjectId (24 hex chars)
    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
    const validManagerId = managerId && isValidObjectId(managerId) ? managerId : undefined;

    // For ABM/ASE, managerId is required because zbmId/zseId is non-nullable in Prisma schema
    if ((user.role === 'ABM' || user.role === 'ASE') && !validManagerId) {
      return NextResponse.json(
        { error: 'Manager selection is required for ABM/ASE before approval.' },
        { status: 400 },
      );
    }

    // Use a transaction so creation + user update is atomic
    const result = await prisma.$transaction(async (tx) => {
      if (user.role === 'ABM') {
        await tx.aBM.create({
          data: {
            userId: user.id,
            fullName,
            phone,
            storeIds,
            ...(validManagerId ? { zbmId: validManagerId } : {}),
          },
        });
      } else if (user.role === 'ASE') {
        await tx.aSE.create({
          data: {
            userId: user.id,
            fullName,
            phone,
            storeIds,
            ...(validManagerId ? { zseId: validManagerId } : {}),
          },
        });
      } else if (user.role === 'ZBM') {
        await tx.zBM.create({
          data: {
            userId: user.id,
            fullName,
            phone,
            region: finalMetadata.region || null,
          },
        });
      } else if (user.role === 'ZSE') {
        await tx.zSE.create({
          data: {
            userId: user.id,
            fullName,
            phone,
            region: finalMetadata.region || null,
          },
        });
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          validation: 'APPROVED',
          metadata: null, // metadata consumed into role model
        },
      });

      return updatedUser;
    });

    const { password: _pw, ...safeUser } = result as any;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Error in POST /api/user-validate/users/[id]/validate', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
