import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/auth/sec/send-otp
// Body: { phoneNumber: string }
// Generates an OTP, stores it in the database against the phone number,
// and logs the OTP to the server console for development.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone: string | undefined = body?.phoneNumber;

    if (!rawPhone) {
      return NextResponse.json({ error: 'phoneNumber is required' }, { status: 400 });
    }

    const normalized = rawPhone.replace(/\D/g, '').slice(0, 10);

    if (!normalized || normalized.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    // Before creating a new OTP, delete any existing OTPs for this phone.
    await prisma.otp.deleteMany({ where: { phone: normalized } });

    const code = generateOtpCode();
    const ttlMs = 5 * 60 * 1000; // 5 minutes
    const expiresAt = new Date(Date.now() + ttlMs);

    await prisma.otp.create({
      data: {
        phone: normalized,
        code,
        expiresAt,
      },
    });

    console.log(`[SEC OTP] Phone ${normalized} -> ${code}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/auth/sec/send-otp', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateOtpCode(): string {
  // 6-digit numeric OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}
