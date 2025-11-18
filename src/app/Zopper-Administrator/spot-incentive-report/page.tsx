'use client';

import { useState, useMemo } from 'react';
import { FaDownload, FaSignOutAlt } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import Link from 'next/link';

// Mock data
const mockData = [
  {
    id: '1',
    createdAt: '2025-01-15 10:30',
    submittedAt: '2025-01-15 10:25',
    imei: '123456789012345',
    planPrice: 5000,
    incentiveEarned: 500,
    isPaid: true,
    voucherCode: 'VOUCH123',
    secUser: { secId: 'SEC001', phone: '9876543210', name: 'John Doe' },
    store: { id: '1', storeName: 'Samsung Store Delhi', city: 'Delhi' },
    samsungSKU: { id: '1', Category: 'Flagship', ModelName: 'Galaxy S24 Ultra' },
    plan: { id: '1', planType: 'ADLD', price: 5000 }
  },
  {
    id: '2',
    createdAt: '2025-01-15 11:45',
    submittedAt: '2025-01-15 11:40',
    imei: '987654321098765',
    planPrice: 3000,
    incentiveEarned: 300,
    isPaid: false,
    secUser: { secId: 'SEC002', phone: '9876543211', name: 'Jane Smith' },
    store: { id: '2', storeName: 'Samsung Store Mumbai', city: 'Mumbai' },
    samsungSKU: { id: '2', Category: 'Mid-Range', ModelName: 'Galaxy A54' },
    plan: { id: '2', planType: 'Combo', price: 3000 }
  },
  {
    id: '3',
    createdAt: '2025-01-16 09:15',
    submittedAt: '2025-01-16 09:10',
    imei: '456789123456789',
    planPrice: 4500,
    incentiveEarned: 450,
    isPaid: false,
    secUser: { secId: 'SEC003', phone: '9876543212', name: 'Mike Johnson' },
    store: { id: '1', storeName: 'Samsung Store Delhi', city: 'Delhi' },
    samsungSKU: { id: '3', Category: 'Flagship', ModelName: 'Galaxy Z Fold 5' },
    plan: { id: '1', planType: 'ADLD', price: 4500 }
  }
];

function formatDateWithTime(ts: string) {
  const [date, time] = ts.split(' ');
  const [y, m, d] = date.split('-');
  return { date: `${d}-${m}-${y}`, time };
}

function StatCard({ title, value }: { title: string; value: string }) {
  const gradientMap: Record<string, string> = {
    'Active Stores': 'from-indigo-600 to-purple-600 shadow-[0_10px_40px_rgba(79,70,229,0.4)]',
    'SECs Active': 'from-emerald-600 to-teal-600 shadow-[0_10px_40px_rgba(16,185,129,0.4)]',
    'Reports Submitted': 'from-blue-600 to-cyan-600 shadow-[0_10px_40px_rgba(37,99,235,0.4)]',
    'Incentive Earned': 'from-amber-500 to-orange-600 shadow-[0_10px_40px_rgba(245,158,11,0.4)]',
    'Incentive Paid': 'from-rose-600 to-pink-600 shadow-[0_10px_40px_rgba(244,63,94,0.4)]',
  };

  const gradient = gradientMap[title] || 'from-slate-700 to-slate-900 shadow-[0_10px_40px_rgba(15,23,42,0.5)]';

  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 md:p-6 text-white transition-transform hover:translate-y-[-1px]`}
    >
      <div className="text-xs md:text-sm text-slate-100/80 mb-1">{title}</div>
      <div className="text-2xl md:text-3xl font-bold leading-tight">{value}</div>
    </div>
  );
}

export default function MonthlyIncentiveReport() {
  const [query, setQuery] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const stores = useMemo(() => Array.from(new Set(mockData.map(d => d.store.storeName))), []);
  const plans = useMemo(() => Array.from(new Set(mockData.map(d => d.plan.planType))), []);

  const filtered = useMemo(() => {
    return mockData.filter(r => {
      const matchesQuery = [
        r.secUser.secId || r.secUser.phone,
        r.store.storeName,
        r.samsungSKU.ModelName,
        r.imei
      ].some(v => v.toLowerCase().includes(query.toLowerCase()));
      const matchesStore = !storeFilter || r.store.storeName === storeFilter;
      const matchesPlan = !planFilter || r.plan.planType === planFilter;
      const matchesPayment = paymentFilter === 'all' || (paymentFilter === 'paid' ? r.isPaid : !r.isPaid);
      return matchesQuery && matchesStore && matchesPlan && matchesPayment;
    });
  }, [query, storeFilter, planFilter, paymentFilter]);

  const totals = useMemo(() => {
    const totalIncentive = filtered.reduce((s, r) => s + r.incentiveEarned, 0);
    const totalPaid = filtered.filter(r => r.isPaid).reduce((s, r) => s + r.incentiveEarned, 0);
    const totalSECs = new Set(filtered.map(r => r.secUser.secId || r.secUser.phone)).size;
    const activeStores = new Set(filtered.map(r => r.store.id)).size;
    return { totalSECs, totalReports: filtered.length, totalIncentive, totalPaid, activeStores };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportExcel = () => {
    const exportData = filtered.map(report => ({
      'Report ID': report.id,
      'SEC ID': report.secUser.secId || 'Not Set',
      'SEC Phone': report.secUser.phone,
      'SEC Name': report.secUser.name || 'Not Set',
      'Store Name': report.store.storeName,
      'Store City': report.store.city,
      'Device Category': report.samsungSKU.Category,
      'Device Model': report.samsungSKU.ModelName,
      'Plan Type': report.plan.planType.replace(/_/g, ' '),
      'Plan Price': `₹${report.planPrice}`,
      'IMEI': report.imei,
      'Incentive Earned': `₹${report.incentiveEarned}`,
      'Payment Status': report.isPaid ? 'Paid' : 'Pending',
      'Submitted Date': formatDateWithTime(report.submittedAt).date,
      'Submitted Time': formatDateWithTime(report.submittedAt).time,
      'Voucher Code': report.voucherCode || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report');
    XLSX.writeFile(wb, `spot-incentive-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Spot Incentive Report</h1>
            <p className="text-sm text-neutral-400">
              Paid: {filtered.filter(r => r.isPaid).length} | Unpaid: {
                filtered.filter(r => !r.isPaid).length
              }
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live
              </span>
            </div>
          </div>

          <Link
            href="/login/role"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-lg self-start"
          >
            <FaSignOutAlt size={12} />
            Logout
          </Link>
        </header>

        {/* Key metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Active Stores" value={totals.activeStores.toString()} />
          <StatCard title="SECs Active" value={totals.totalSECs.toString()} />
          <StatCard title="Reports Submitted" value={totals.totalReports.toString()} />
          <StatCard title="Incentive Earned" value={`₹${totals.totalIncentive}`} />
          <StatCard title="Incentive Paid" value={`₹${totals.totalPaid}`} />
        </section>

        {/* Filters */}
        <section className="flex flex-wrap items-center gap-3">
          <input
            className="flex-1 min-w-[220px] px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search SEC / Store / Device / IMEI"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="appearance-none bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-neutral-800"
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
          >
            <option value="">All Stores</option>
            {stores.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="appearance-none bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-neutral-800"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="">All Plans</option>
            {plans.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            className="appearance-none bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-neutral-800"
            value={paymentFilter}
            onChange={(e) =>
              setPaymentFilter(e.target.value as 'all' | 'paid' | 'unpaid')
            }
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <button
            onClick={exportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-[0_10px_30px_rgba(16,185,129,0.4)]"
          >
            <FaDownload size={14} />
            Export
          </button>
        </section>

        {/* Table */}
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr className="text-left">
                <th className="p-3 md:p-4 text-neutral-600 text-xs font-medium uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="p-3 md:p-4 text-neutral-600 text-xs font-medium uppercase tracking-wider">
                  Date of Sale
                </th>
                <th className="p-3 md:p-4 text-neutral-600 text-xs font-medium uppercase tracking-wider">
                  SEC ID
                </th>
                <th className="p-3 md:p-4 text-neutral-600 text-xs font-medium uppercase tracking-wider">
                  Store Name
                </th>
                <th className="p-3 md:p-4 text-neutral-600 text-xs font-medium uppercase tracking-wider">
                  Device Name
                </th>
                <th className="p-3 md:p-4 text-neutral-600 text-xs font-medium uppercase tracking-wider">
                  Plan Type
                </th>
                <th className="p-3 md:p-4 text-neutral-600 text-xs font-medium uppercase tracking-wider">
                  IMEI
                </th>
                <th className="p-3 md:p-4 text-neutral-600 text-xs font-medium uppercase tracking-wider">
                  Incentive
                </th>
                <th className="p-3 md:p-4 text-neutral-600 text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {pageData.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 transition">
                  <td className="p-3 md:p-4 text-neutral-900 text-sm">
                    <div>{formatDateWithTime(r.createdAt).date}</div>
                    <div className="text-neutral-500 text-xs">
                      {formatDateWithTime(r.createdAt).time}
                    </div>
                  </td>
                  <td className="p-3 md:p-4 text-neutral-700 text-sm">
                    <div>{formatDateWithTime(r.submittedAt).date}</div>
                    <div className="text-neutral-500 text-xs">
                      {formatDateWithTime(r.submittedAt).time}
                    </div>
                  </td>
                  <td className="p-3 md:p-4 text-neutral-900 text-sm font-medium">
                    {r.secUser.secId}
                  </td>
                  <td className="p-3 md:p-4 text-neutral-900 text-sm">{r.store.storeName}</td>
                  <td className="p-3 md:p-4 text-neutral-700 text-sm">
                    {r.samsungSKU.ModelName}
                  </td>
                  <td className="p-3 md:p-4 text-neutral-700 text-sm">{r.plan.planType}</td>
                  <td className="p-3 md:p-4 text-neutral-500 text-xs font-mono">
                    {r.imei}
                  </td>
                  <td className="p-3 md:p-4 text-emerald-600 text-sm font-semibold">
                    ₹{r.incentiveEarned}
                  </td>
                  <td className="p-3 md:p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.isPaid
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {r.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4 text-sm text-neutral-200">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-neutral-700 rounded-lg disabled:opacity-40 text-neutral-100 bg-neutral-900 hover:bg-neutral-800"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-neutral-700 rounded-lg disabled:opacity-40 text-neutral-100 bg-neutral-900 hover:bg-neutral-800"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
