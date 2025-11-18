'use client';

import { useState } from 'react';

const mockRequests = [
  {
    id: '1',
    secName: 'John Doe',
    secPhone: '9876543210',
    storeName: 'Samsung Store Delhi',
    requestType: 'voucher_issue',
    description: 'Voucher code not received for last month',
    status: 'pending' as const,
    createdAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    secName: 'Jane Smith',
    secPhone: '9876543211',
    storeName: 'Samsung Store Mumbai',
    requestType: 'general_assistance',
    description: 'Need help with IMEI submission process',
    status: 'in_progress' as const,
    createdAt: '2025-01-14T14:20:00Z'
  }
];

export default function HelpRequests() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);

  const filtered = mockRequests.filter(r => 
    filterStatus === 'all' || r.status === filterStatus
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Help Requests</h1>
        <button
          onClick={() => alert('Refreshed (mock)')}
          className="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
        >
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(['all', 'pending', 'in_progress', 'resolved'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              filterStatus === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')} ({
              status === 'all' ? mockRequests.length : mockRequests.filter(r => r.status === status).length
            })
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filtered.map((request) => (
          <div
            key={request.id}
            className="p-4 border rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white"
            onClick={() => setSelectedRequest(request)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-500 text-xl">
                  {request.requestType === 'voucher_issue' ? '🎁' : '❓'}
                </span>
                <div>
                  <div className="font-medium text-sm">
                    {request.requestType === 'voucher_issue' ? 'Voucher Issue' : 'General Assistance'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {request.secName} • {request.secPhone} • {request.storeName}
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {request.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2">{request.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Submitted: {new Date(request.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mock modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedRequest(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Request Details (Mock)</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedRequest.description}</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Mark In Progress</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Mark Resolved</button>
              <button onClick={() => setSelectedRequest(null)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
