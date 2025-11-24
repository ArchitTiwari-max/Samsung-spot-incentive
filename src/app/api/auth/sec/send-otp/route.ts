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

    // Generate and store OTP in in-memory store (no database dependency)
    const code = createSecOtp(normalized);

    // Build full phone number with country code (e.g. 91 + 10-digit number)
    const fullPhone = `91${normalized}`;

    const apiKey = process.env.COMMIFY_API_KEY;
    if (!apiKey) {
      console.error('[SEC OTP] COMMIFY_API_KEY is not set; unable to send OTP via Commify');
      return NextResponse.json({
        success: false,
        error: 'OTP sending service is not configured. Please contact support.',
      }, { status: 500 });
    }

    // Call Commify WhatsApp template API
    const commifyRes = await fetch('https://commify.transify.tech/v1/comm', {
      method: 'POST',
      headers: {
        Authorization: `ApiKey ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'zopper_oem_sec_otpverify',
        payload: {
          phone: fullPhone,
          otp: Number(code),
        },
        type: 'whatsappTemplate',
      }),
    });

    if (!commifyRes.ok) {
      const text = await commifyRes.text().catch(() => '');
      console.error('[SEC OTP] Commify API error', commifyRes.status, text);
      // OTP is already generated and stored in memory; allow user to continue
      // (e.g. for local/dev environments or while Commify is misconfigured).
      console.log(`[SEC OTP] Phone ${normalized} -> ${code} (Commify send FAILED)`);
      return NextResponse.json({ success: true, channel: 'fallback' });
    }

    console.log(`[SEC OTP] Phone ${normalized} -> ${code} (sent via Commify)`);

    return NextResponse.json({ success: true, channel: 'whatsapp' });
  } catch (error) {
    console.error('Error in POST /api/auth/sec/send-otp', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
