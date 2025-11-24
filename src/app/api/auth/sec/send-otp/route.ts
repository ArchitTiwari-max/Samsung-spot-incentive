import { NextRequest, NextResponse } from 'next/server';
import { createSecOtp } from '@/lib/secOtpStore';

// POST /api/auth/sec/send-otp
// Body: { phoneNumber: string }
// Generates an OTP, stores it in an in-memory store against the phone number,
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

    // Use in-memory OTP store (no database dependency for SEC dev login).
    createSecOtp(normalized);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/auth/sec/send-otp', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
