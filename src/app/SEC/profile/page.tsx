'use client';

import { useState, useEffect } from 'react';
import SECHeader from '@/components/sec/SECHeader';
import SECFooter from '@/components/sec/SECFooter';

export default function ProfilePage() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [storeName, setStoreName] = useState('Croma-Motijheel');
  const [agencyName, setAgencyName] = useState('');
  
  const [panNumber, setPanNumber] = useState('');
  const [panImage, setPanImage] = useState<File | null>(null);
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [chequeFile, setChequeFile] = useState<File | null>(null);

  useEffect(() => {
    // Load user data from localStorage
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    setFullName(`${firstName} ${lastName}`.trim());
    setPhoneNumber('+91 98765 43210');
    setEmail('rajesh.kumar@techdotzd.com');
  }, []);

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Personal Info submitted:', { storeName, agencyName });
    alert('Personal info saved successfully!');
  };

  const handleKYCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('KYC Info submitted:', { panNumber, panImage });
    alert('KYC info saved successfully!');
  };

  const handleBankingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountNumber !== confirmAccountNumber) {
      alert('Account numbers do not match!');
      return;
    }
    console.log('Banking Info submitted:', { bankName, accountHolderName, accountNumber, ifscCode });
    alert('Banking info saved successfully!');
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <SECHeader />

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="px-4 pt-4 pb-6">
          {/* Page Title */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Profile</h1>
            <p className="text-sm text-gray-600">
              Please complete your verification & payout details
            </p>
          </div>

          {/* SECTION 1: Personal Info */}
          <section className="mb-5 bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-base font-semibold text-gray-900">Personal Info*</h2>
              </div>
            </div>

            <form onSubmit={handlePersonalInfoSubmit}>
              {/* Personal Details */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Personal Details</span>
                </div>
                <button type="button" className="text-gray-600 hover:text-gray-900">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>

              {/* Full Name */}
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">Full Name</label>
                <div className="text-sm font-medium text-gray-900">{fullName || 'Rajesh Kumar'}</div>
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">Phone Number</label>
                <div className="text-sm font-medium text-gray-900">{phoneNumber}</div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-1">Email</label>
                <div className="text-sm font-medium text-gray-900">{email}</div>
              </div>

              {/* Store Details */}
              <div className="mb-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">Store Details</span>
                  </div>
                  <button type="button" className="text-gray-600 hover:text-gray-900">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 mb-1">Store Name</label>
                  <div className="text-sm font-medium text-gray-900">{storeName}</div>
                </div>
              </div>

              {/* Agency */}
              <div className="mb-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">Agency</span>
                </div>
                <div>
                  <label htmlFor="agencyName" className="block text-xs text-gray-600 mb-1">Agency Name</label>
                  <input
                    type="text"
                    id="agencyName"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="Enter Agency Name"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Submit
              </button>
            </form>
          </section>

          {/* SECTION 2: KYC Info */}
          <section className="mb-5 bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-base font-semibold text-gray-900">KYC Info</h2>
            </div>

            <form onSubmit={handleKYCSubmit}>
              {/* PAN Number */}
              <div className="mb-4">
                <label htmlFor="panNumber" className="block text-xs text-gray-600 mb-1">PAN Number</label>
                <input
                  type="text"
                  id="panNumber"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="Enter PAN Number"
                  maxLength={10}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Upload PAN Image */}
              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-1">Upload PAN Image</label>
                <label
                  htmlFor="panImageUpload"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {panImage ? panImage.name : 'Choose File'}
                </label>
                <input
                  type="file"
                  id="panImageUpload"
                  accept="image/*"
                  onChange={(e) => setPanImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              {/* KYC Status Badge */}
              <div className="mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 border border-yellow-300">
                  <span className="text-xs font-medium text-yellow-800">Pending</span>
                  <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Submit
              </button>
            </form>
          </section>

          {/* SECTION 3: Banking Info */}
          <section className="mb-5 bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h2 className="text-base font-semibold text-gray-900">Banking Info</h2>
            </div>

            <form onSubmit={handleBankingSubmit}>
              {/* Bank Name */}
              <div className="mb-4">
                <label htmlFor="bankName" className="block text-xs text-gray-600 mb-1">Bank Name</label>
                <select
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem',
                  }}
                >
                  <option value="">Select Bank</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                </select>
              </div>

              {/* Account Holder Name */}
              <div className="mb-4">
                <label htmlFor="accountHolderName" className="block text-xs text-gray-600 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  id="accountHolderName"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Enter Account Holder Name"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Account Number */}
              <div className="mb-4">
                <label htmlFor="accountNumber" className="block text-xs text-gray-600 mb-1">Account Number</label>
                <input
                  type="text"
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter Account Number"
                  inputMode="numeric"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Confirm Account Number */}
              <div className="mb-4">
                <label htmlFor="confirmAccountNumber" className="block text-xs text-gray-600 mb-1">Confirm Account Number</label>
                <input
                  type="text"
                  id="confirmAccountNumber"
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                  placeholder="Re-enter Account Number"
                  inputMode="numeric"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* IFSC Code */}
              <div className="mb-4">
                <label htmlFor="ifscCode" className="block text-xs text-gray-600 mb-1">IFSC Code</label>
                <input
                  type="text"
                  id="ifscCode"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="Enter IFSC Code"
                  maxLength={11}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Upload Cancelled Cheque */}
              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-1">Upload Cancelled Cheque / Passbook</label>
                <label
                  htmlFor="chequeUpload"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {chequeFile ? chequeFile.name : 'Choose File'}
                </label>
                <input
                  type="file"
                  id="chequeUpload"
                  accept="image/*,.pdf"
                  onChange={(e) => setChequeFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              {/* Note */}
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-xs text-gray-700">
                  <span className="font-semibold">Note:</span> These details will be used for incentive payout to your account.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Submit
              </button>
            </form>
          </section>
        </div>
      </main>

      <SECFooter />
    </div>
  );
}
