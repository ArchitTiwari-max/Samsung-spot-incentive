'use client';

import { useState } from 'react';

interface InviteRow {
  secId: string;
  phone: string;
  link?: string;
  status?: 'idle' | 'signed' | 'sending' | 'sent' | 'error';
}

export default function SendTestInvites() {
  const [rows, setRows] = useState<InviteRow[]>([{ secId: '', phone: '' }]);
  const [expiresHours, setExpiresHours] = useState<number>(72);

  const addRow = () => setRows(prev => [...prev, { secId: '', phone: '' }]);
  const removeRow = (idx: number) => setRows(prev => prev.filter((_, i) => i !== idx));
  const updateRow = (idx: number, patch: Partial<InviteRow>) => {
    setRows(prev => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const signLink = (idx: number) => {
    updateRow(idx, { 
      link: `https://test.example.com/test?token=MOCK_${Date.now()}`,
      status: 'signed' 
    });
  };

  const sendInvite = (idx: number) => {
    updateRow(idx, { status: 'sending' });
    setTimeout(() => {
      updateRow(idx, { status: 'sent' });
    }, 1000);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Send Test Invites</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">Expiry (hours)</label>
          <input
            type="number"
            min={1}
            className="w-24 border rounded px-2 py-1"
            value={expiresHours}
            onChange={e => setExpiresHours(Number(e.target.value))}
          />
          <button
            onClick={() => alert('Bulk send functionality (mock)')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">SEC ID</th>
                <th className="px-3 py-2 text-left">Phone</th>
                <th className="px-3 py-2 text-left">Link</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-3 py-2">
                    <input
                      className="border rounded px-2 py-1 w-40"
                      placeholder="SEC123"
                      value={r.secId}
                      onChange={e => updateRow(idx, { secId: e.target.value })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="border rounded px-2 py-1 w-40"
                      placeholder="9876543210"
                      value={r.phone}
                      onChange={e => updateRow(idx, { phone: e.target.value })}
                    />
                  </td>
                  <td className="px-3 py-2 text-blue-600 text-xs truncate max-w-xs" title={r.link}>
                    {r.link || '-'}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => signLink(idx)}
                        className="px-3 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200"
                      >
                        {r.link ? 'Re-sign' : 'Sign Link'}
                      </button>
                      <button
                        onClick={() => sendInvite(idx)}
                        disabled={!r.secId || !r.phone || r.status === 'sending'}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                      >
                        {r.status === 'sending' ? 'Sending...' : r.status === 'sent' ? 'Sent ✓' : 'Send'}
                      </button>
                      <button
                        onClick={() => removeRow(idx)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3">
          <button
            onClick={addRow}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            + Add Row
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded">
        💡 Tip: This is a mock interface. In production, links would be signed and WhatsApp messages sent via configured API.
      </div>
    </div>
  );
}
