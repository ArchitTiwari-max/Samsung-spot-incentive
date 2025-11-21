type OtpRecord = {
  code: string;
  expiresAt: number;
};

// Simple in-memory OTP store for SEC login.
// NOTE: This is only suitable for local development. It will NOT work reliably
// in a multi-instance or serverless production environment.
const otpStore = new Map<string, OtpRecord>();

export function createSecOtp(phoneNumber: string, ttlMs: number = 5 * 60 * 1000): string {
  const normalized = normalizePhone(phoneNumber);
  const code = generateOtpCode();
  const expiresAt = Date.now() + ttlMs;

  otpStore.set(normalized, { code, expiresAt });

  // For now we surface the OTP only via server logs so you can see it in the terminal.
  // In the future you can replace this with a WhatsApp/SMS integration.
  console.log(`[SEC OTP] Phone ${normalized} -> ${code}`);

  return code;
}

export function verifySecOtp(phoneNumber: string, code: string): boolean {
  const normalized = normalizePhone(phoneNumber);
  const record = otpStore.get(normalized);

  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalized);
    return false;
  }

  const isMatch = record.code === code;
  if (isMatch) {
    // One-time use
    otpStore.delete(normalized);
  }

  return isMatch;
}

function generateOtpCode(): string {
  // 6-digit numeric OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizePhone(raw: string): string {
  // Keep only digits; this matches the validation logic on the SEC login page.
  return raw.replace(/\D/g, '').slice(0, 10);
}
