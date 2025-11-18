'use client';

import { useState } from 'react';
import { FaFileUpload } from 'react-icons/fa';

export default function InsertQuestions() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = () => {
    alert('Mock: File would be processed and questions uploaded');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Insert Test Questions</h1>
        <p className="text-sm text-gray-600 mb-6">Upload an Excel file containing test questions for SEC</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Upload an Excel file (.xlsx or .xls) containing test questions</li>
            <li>Excel should have columns: questionId, question, option1, option2, option3, option4, correctAnswer, category</li>
            <li>All existing questions will be replaced</li>
          </ul>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center">
          <FaFileUpload className="mx-auto text-4xl text-gray-400 mb-4" />
          <label className="cursor-pointer inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Select Excel File
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {file && (
            <div className="mt-4 text-gray-700">
              <p className="font-medium">Selected: {file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          )}
        </div>

        {file && (
          <button
            onClick={handleUpload}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <FaFileUpload />
            Upload and Replace Questions
          </button>
        )}
      </div>
    </div>
  );
}
