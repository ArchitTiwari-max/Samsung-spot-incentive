import { NextRequest, NextResponse } from 'next/server';
import { verifySecOtp } from '@/lib/secOtpStore';

// POST /api/auth/sec/verify-otp
// Body: { phoneNumber: string; otp: string }
// Verifies the OTP stored in the in-memory store for the given phone number.
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

    const isValid = verifySecOtp(normalized, otp);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    // For now we only confirm OTP success; later you can extend this
    // to issue auth tokens and return user info similar to /api/auth/login.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/auth/sec/verify-otp', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
