'use client';

import { useState, useEffect } from 'react';
import SECHeader from '@/components/sec/SECHeader';
import SECFooter from '@/components/sec/SECFooter';

export default function SecIncentiveForm({ initialSecId = '' }) {
  const [secId, setSecId] = useState(initialSecId);
  const [dateOfSale, setDateOfSale] = useState('');
  const [storeName, setStoreName] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [planType, setPlanType] = useState('');
  const [imeiNumber, setImeiNumber] = useState('');
  const [imeiError, setImeiError] = useState('');
  const [duplicateError, setDuplicateError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [showSecAlert, setShowSecAlert] = useState(false);
  const [showSecModal, setShowSecModal] = useState(false);
  const [secInput, setSecInput] = useState('');
  const [secError, setSecError] = useState('');

  // Load SEC ID from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('secId');
    if (stored) {
      setSecId(stored);
      setShowSecAlert(false);
    } else if (!initialSecId) {
      setShowSecAlert(true);
    }
  }, [initialSecId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!secId) {
      setShowSecAlert(true);
      setShowSecModal(true);
      return;
    }
    
    // Validate IMEI before submission
    if (imeiError || duplicateError) {
      alert('Please fix the IMEI issues before submitting');
      return;
    }
    if (!imeiNumber || imeiNumber.length !== 15) {
      setImeiError('Invalid IMEI. Please enter a valid 15-digit IMEI number.');
      return;
    }
    
    // Handle form submission
    console.log({
      secId,
      dateOfSale,
      storeName,
      deviceName,
      planType,
      imeiNumber,
    });
  };

  const validateSecId = (value) => {
    if (!value) return 'SEC ID is required';
    // Basic format: starts with SEC and at least 4 more alphanumeric characters
    const pattern = /^SEC[0-9A-Za-z]{4,}$/i;
    if (!pattern.test(value)) {
      return 'Enter a valid SEC ID (e.g., SEC12345)';
    }
    return '';
  };

  const handleSaveSecId = () => {
    const error = validateSecId(secInput.trim());
    if (error) {
      setSecError(error);
      return;
    }

    const cleaned = secInput.trim().toUpperCase();
    setSecId(cleaned);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('secId', cleaned);
    }
    setShowSecAlert(false);
    setShowSecModal(false);
    setSecError('');
  };

  const luhnCheck = (imei) => {
    let sum = 0;
    for (let i = 0; i < imei.length; i++) {
      let digit = parseInt(imei[imei.length - 1 - i], 10);
      if (Number.isNaN(digit)) return false;
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  const checkImeiDuplicate = async (imei) => {
    if (!imei || imei.length !== 15) {
      setDuplicateError('');
      return;
    }

    try {
      setIsCheckingDuplicate(true);
      // Replace this with your real backend API endpoint
      const res = await fetch(`/api/imei/check?imei=${encodeURIComponent(imei)}`);
      if (!res.ok) {
        setDuplicateError('');
        return;
      }
      const data = await res.json();
      if (data?.exists) {
        setDuplicateError('This IMEI has already been submitted.');
      } else {
        setDuplicateError('');
      }
    } catch (err) {
      console.error('IMEI duplicate check failed', err);
      setDuplicateError('');
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  const validateAndSetImei = (rawValue) => {
    const numeric = rawValue.replace(/\D/g, '').slice(0, 15);
    setImeiNumber(numeric);

    if (!numeric) {
      setImeiError('');
      setDuplicateError('');
      return;
    }

    if (numeric.length !== 15) {
      setImeiError('Invalid IMEI. Please enter a valid 15-digit IMEI number.');
      setDuplicateError('');
      return;
    }

    if (!luhnCheck(numeric)) {
      setImeiError('Invalid IMEI. Please enter a valid 15-digit IMEI number.');
      setDuplicateError('');
      return;
    }

    setImeiError('');
    checkImeiDuplicate(numeric);
  };

  const handleImeiChange = (e) => {
    validateAndSetImei(e.target.value);
  };

  const handleScan = async () => {
    setIsScanning(true);
    
    try {
      // Check if browser supports BarcodeDetector API
      if ('BarcodeDetector' in window) {
        // Use native barcode / QR / DataMatrix scanner where supported
        const barcodeDetector = new BarcodeDetector({
          formats: ['ean_13', 'code_128', 'upc_e', 'qr_code', 'data_matrix'],
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        // NOTE: Implementing a full live camera preview + frame capture pipeline
        // is beyond the scope here, so we simulate by asking for IMEI after camera opens.
        alert('Camera scanner would open here on supported devices. For now, please enter IMEI manually.');
        stream.getTracks().forEach((track) => track.stop());

        const scannedImei = prompt('Enter scanned IMEI Number:');
        if (scannedImei) {
          validateAndSetImei(scannedImei);
        }
      } else {
        // Fallback: Use a simple prompt or third-party scanner library
        const scannedImei = prompt('Enter or scan IMEI Number:');
        if (scannedImei) {
          validateAndSetImei(scannedImei);
        }
      }
    } catch (error) {
      console.error('Scanner error:', error);
      // Fallback to manual input
      const manualImei = prompt('Camera access denied or unavailable. Enter IMEI manually:');
      if (manualImei) {
        validateAndSetImei(manualImei);
      }
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <SECHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="px-5 pt-4 pb-6">
          {/* SEC ID Alert */}
          {showSecAlert && (
            <div className="mb-4 rounded-xl bg-[#FFF8C5] px-4 py-3 flex items-center justify-between gap-3 text-[13px] text-black">
              <span className="font-medium">
                Please set up your SEC ID to continue
              </span>
              <button
                type="button"
                onClick={() => {
                  setSecInput(secId || '');
                  setSecError('');
                  setShowSecModal(true);
                }}
                className="shrink-0 px-3 py-1.5 rounded-full bg-black text-white text-xs font-semibold"
              >
                Set Now
              </button>
            </div>
          )}

          {/* Page Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Incentive Form
            </h1>
            <p className="text-sm text-gray-500">
              Submit your plan sales below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SEC ID - Disabled */}
            <div>
              <label htmlFor="secId" className="block text-sm font-medium text-gray-700 mb-2">
                SEC ID
              </label>
              <input
                type="text"
                id="secId"
                value={secId}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-500 text-sm"
                placeholder="SEC ID"
              />
            </div>

            {/* Date of Sale */}
            <div>
              <label htmlFor="dateOfSale" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Sale
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dateOfSale"
                  value={dateOfSale}
                  onChange={(e) => setDateOfSale(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
                  placeholder="dd/mm/yyyy"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('dateOfSale').showPicker()}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Store Name */}
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>
              <select
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem',
                }}
              >
                <option value="">Select Store</option>
                <option value="store1">Store 1</option>
                <option value="store2">Store 2</option>
                <option value="store3">Store 3</option>
              </select>
            </div>

            {/* Device Name */}
            <div>
              <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700 mb-2">
                Device Name
              </label>
              <select
                id="deviceName"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem',
                }}
              >
                <option value="">Select Device</option>
                <option value="iphone">iPhone</option>
                <option value="samsung">Samsung</option>
                <option value="oneplus">OnePlus</option>
              </select>
            </div>

            {/* Plan Type */}
            <div>
              <label htmlFor="planType" className="block text-sm font-medium text-gray-700 mb-2">
                Plan Type
              </label>
              <select
                id="planType"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem',
                }}
              >
                <option value="">Select Plan</option>
                <option value="basic">Basic Plan</option>
                <option value="premium">Premium Plan</option>
                <option value="unlimited">Unlimited Plan</option>
              </select>
            </div>

            {/* IMEI Number */}
            <div>
              <label htmlFor="imeiNumber" className="block text-sm font-medium text-gray-700 mb-2">
                IMEI Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="imeiNumber"
                  value={imeiNumber}
                  onChange={handleImeiChange}
                  placeholder="Enter IMEI Number"
                  inputMode="numeric"
                  maxLength="15"
                  className={`w-full pl-4 pr-24 py-3 bg-white border rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 ${
                    imeiError || duplicateError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleScan}
                  disabled={isScanning}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  {isScanning ? 'Scanning...' : 'Scan'}
                </button>
              </div>
              {(imeiError || duplicateError) && (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  {imeiError || duplicateError}
                </p>
              )}
              {!imeiError && !duplicateError && (
                <p className="mt-2 text-xs text-gray-500">
                  Any incorrect sales reported will impact your future incentives.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 pb-6">
              <button
                type="submit"
                disabled={!!imeiError || !!duplicateError || !imeiNumber || imeiNumber.length !== 15 || isCheckingDuplicate}
                className="w-full bg-black text-white font-semibold py-4 rounded-2xl hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-base"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* SEC ID Modal */}
      {showSecModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-[90%] max-w-sm px-5 py-5 shadow-lg">
            <h2 className="text-base font-semibold text-gray-900 mb-2">Set SEC ID</h2>
            <p className="text-xs text-gray-500 mb-4">
              Enter your SEC ID to continue submitting incentive forms.
            </p>
            <div className="mb-3">
              <label
                htmlFor="secIdInput"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                SEC ID
              </label>
              <input
                id="secIdInput"
                type="text"
                value={secInput}
                onChange={(e) => setSecInput(e.target.value.toUpperCase())}
                placeholder="SEC12345"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {secError && (
                <p className="mt-1 text-[11px] text-red-600">{secError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSecModal(false);
                  setSecError('');
                }}
                className="px-4 py-2 text-xs font-medium text-gray-600 rounded-full hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSecId}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-black text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <SECFooter />
    </div>
  );
}
