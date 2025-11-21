import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserFromCookies } from '@/lib/auth';

// DELETE /api/zopper-administrator/users/[id]
// Deletes a user; role-specific profiles are removed via onDelete: Cascade in Prisma.
export async function DELETE(
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
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/zopper-administrator/users/[id]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
