'use client';

import { useState } from 'react';
import { FaUpload } from 'react-icons/fa';

export default function ProcessInvalidIMEIs() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Process Invalid IMEIs</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc ml-4">
          <li>Upload Excel with invalid IMEIs</li>
          <li>Column should be named "IMEI"</li>
          <li>System will find SEC and deduct plan price</li>
          <li>Notifications sent automatically</li>
        </ul>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
        <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
        <label className="cursor-pointer inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Upload Invalid IMEI Excel
          <input type="file" accept=".xlsx,.xls" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
        </label>
        {file && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Selected: {file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
      </div>

      {file && (
        <button onClick={() => alert('Mock: Processing invalid IMEIs')} className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Process File
        </button>
      )}
    </div>
  );
}
