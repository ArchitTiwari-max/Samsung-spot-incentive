import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/user-validate/abm/[id]
// Body: { storeIds?: string[]; zbmId?: string }
// Updates store / manager mapping for an ABM profile.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: abmId } = await params;

  try {
    const body = await req.json().catch(() => ({}));
    const { storeIds, zbmId } = body as { storeIds?: string[]; zbmId?: string };

    if ((!storeIds || storeIds.length === 0) && !zbmId) {
      return NextResponse.json(
        { error: 'At least one of storeIds or zbmId must be provided' },
        { status: 400 },
      );
    }

    const existing = await prisma.aBM.findUnique({ where: { id: abmId } });
    if (!existing) {
      return NextResponse.json({ error: 'ABM profile not found' }, { status: 404 });
    }

    // Validate if zbmId is a valid MongoDB ObjectId (24 hex chars)
    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
    const validZbmId = zbmId && isValidObjectId(zbmId) ? zbmId : undefined;

    const updated = await prisma.aBM.update({
      where: { id: abmId },
      data: {
        ...(storeIds && storeIds.length ? { storeIds } : {}),
        ...(validZbmId ? { zbmId: validZbmId } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PATCH /api/user-validate/abm/[id]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
