import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/auth/sec/verify-otp
// Body: { phoneNumber: string; otp: string }
// Verifies the OTP stored in the database for the given phone number.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone: string | undefined = body?.phoneNumber;
    const otp: string | undefined = body?.otp;

    if (!rawPhone || !otp) {
      return NextResponse.json({ error: 'phoneNumber and otp are required' }, { status: 400 });
    }

    const normalized = rawPhone.replace(/\D/g, '').slice(0, 10);

    if (!normalized || normalized.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const record = await prisma.otp.findFirst({
      where: { phone: normalized },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    const now = new Date();
    if (record.expiresAt < now || record.code !== otp) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    // Mark as verified and/or delete so it cannot be reused.
    await prisma.otp.delete({ where: { id: record.id } });

    // For now we only confirm OTP success; later you can extend this
    // to issue auth tokens and return user info similar to /api/auth/login.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/auth/sec/verify-otp', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
