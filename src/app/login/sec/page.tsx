'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SECLogin() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isValidNumber, setIsValidNumber] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Keep only digits and enforce a maximum of 10
    const digitsOnly = inputValue.replace(/\D/g, '').slice(0, 10);

    setPhoneNumber(digitsOnly);

    if (!digitsOnly) {
      setValidationMessage('');
      setIsValidNumber(null);
    } else if (digitsOnly.length < 10) {
      setValidationMessage('Invalid number');
      setIsValidNumber(false);
    } else if (digitsOnly.length === 10) {
      setValidationMessage('Valid number');
      setIsValidNumber(true);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const digitsOnly = phoneNumber.replace(/\D/g, '').slice(0, 10);

    if (!digitsOnly || digitsOnly.length < 10) {
      setPhoneNumber(digitsOnly);
      setValidationMessage('Invalid number');
      setIsValidNumber(false);
      alert('Please enter a 10-digit phone number');
      return;
    }

    if (!agreed) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setPhoneNumber(digitsOnly);
    setValidationMessage('Valid number');
    setIsValidNumber(true);

    try {
      setLoading(true);
      const res = await fetch('/api/auth/sec/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: digitsOnly }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(data?.error || 'Failed to send OTP');
        return;
      }

      // OTP will be visible in the terminal logs on the server.
      setOtpSent(true);
    } catch (err) {
      console.error('Error sending OTP', err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp) {
      alert('Please enter your OTP');
      return;
    }

    const digitsOnly = phoneNumber.replace(/\D/g, '').slice(0, 10);

    try {
      setLoading(true);
      const res = await fetch('/api/auth/sec/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: digitsOnly, otp }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(data?.error || 'Invalid OTP');
        return;
      }

      // OTP verified successfully; redirect to SEC landing page.
      router.push('/SEC/home');
    } catch (err) {
      console.error('Error verifying OTP', err);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            SC+ Engagement Portal
          </h1>
          <h2 className="text-gray-500">SEC Login</h2>
        </div>

        <form
          onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}
          className="space-y-6"
          autoComplete="off"
        >
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <input
                type="tel"
                id="phone"
                name="sec-phone"
                autoComplete="off"
                inputMode="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
                className="w-full pl-14 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-black placeholder:text-gray-500"
              />
            </div>
            {validationMessage && (
              <p
                className={`mt-2 text-sm ${
                  isValidNumber ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {validationMessage}
              </p>
            )}
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer"
              />
            </div>
            <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
              I have read and agree to the{' '}
              <Link
                href="/terms"
                className="text-blue-600 hover:underline font-medium"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-blue-600 hover:underline font-medium"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {otpSent && (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                autoComplete="off"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter your OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            {otpSent ? 'Verify & Continue' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Different Role?{' '}
            <Link
              href="/login/role"
              className="text-blue-600 hover:underline font-medium"
            >
              Go to Role Login
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Need an account?{' '}
            <Link
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up for different roles
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center text-gray-500 gap-1">
            <span className="text-base">Powered by</span>
            <Image
              src="/zopper-icon.png"
              alt="Zopper icon"
              width={24}
              height={24}
              className="inline-block"
            />
            <span className="text-base font-semibold text-gray-900">Zopper</span>
          </div>
        </div>
      </div>
    </div>
  );
}
