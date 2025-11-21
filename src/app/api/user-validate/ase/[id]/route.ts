import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/user-validate/ase/[id]
// Body: { storeIds?: string[]; zseId?: string }
// Updates store / manager mapping for an ASE profile.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: aseId } = await params;

  try {
    const body = await req.json().catch(() => ({}));
    const { storeIds, zseId } = body as { storeIds?: string[]; zseId?: string };

    if ((!storeIds || storeIds.length === 0) && !zseId) {
      return NextResponse.json(
        { error: 'At least one of storeIds or zseId must be provided' },
        { status: 400 },
      );
    }

    const existing = await prisma.aSE.findUnique({ where: { id: aseId } });
    if (!existing) {
      return NextResponse.json({ error: 'ASE profile not found' }, { status: 404 });
    }

    // Validate if zseId is a valid MongoDB ObjectId (24 hex chars)
    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
    const validZseId = zseId && isValidObjectId(zseId) ? zseId : undefined;

    const updated = await prisma.aSE.update({
      where: { id: aseId },
      data: {
        ...(storeIds && storeIds.length ? { storeIds } : {}),
        ...(validZseId ? { zseId: validZseId } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PATCH /api/user-validate/ase/[id]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
