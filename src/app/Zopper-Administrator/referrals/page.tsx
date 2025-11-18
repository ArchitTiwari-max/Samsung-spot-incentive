'use client';

import * as XLSX from 'xlsx';

const mockReferrals = [
  { id: '1', referrerPhone: '9876543210', refereePhone: '9876543211', status: 'joined', createdAt: '2025-01-15T10:30:00Z' },
  { id: '2', referrerPhone: '9876543212', refereePhone: '9876543213', status: 'report_submitted', createdAt: '2025-01-14T14:20:00Z', referrerVoucher: 'VOUCH123', refereeVoucher: 'VOUCH124' }
];

export default function Referrals() {
  const exportExcel = () => {
    const data = mockReferrals.map(r => ({
      'Referrer Phone': r.referrerPhone,
      'Referee Phone': r.refereePhone,
      'Status': r.status,
      'Created At': new Date(r.createdAt).toLocaleString(),
      'Referrer Voucher': r.referrerVoucher || '',
      'Referee Voucher': r.refereeVoucher || ''
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Referrals');
    XLSX.writeFile(wb, `referrals-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        <button onClick={exportExcel} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Export to Excel
        </button>
      </div>
      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Referrer Phone</th>
              <th className="p-3 text-left">Referee Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Vouchers</th>
              <th className="p-3 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {mockReferrals.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-mono">{r.referrerPhone}</td>
                <td className="p-3 font-mono">{r.refereePhone}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3 font-mono text-xs">{r.referrerVoucher || '—'} / {r.refereeVoucher || '—'}</td>
                <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
