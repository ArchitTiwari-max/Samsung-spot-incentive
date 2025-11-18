import Link from 'next/link';

const quickStats = [
  {
    label: 'Referrals Today',
    value: '128',
    helper: '+12% vs yesterday',
  },
  {
    label: 'Pending Help Requests',
    value: '7',
    helper: '3 new since morning',
  },
  {
    label: 'Scheduled Tests',
    value: '24',
    helper: '2 starting in the next hour',
  },
  {
    label: 'Invalid IMEIs',
    value: '5',
    helper: 'Needs attention',
  },
];

export default function ZopperAdministratorPage() {
  return (
    <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Glow accents */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -left-10 bottom-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Top greeting with Logout */}
        <header className="flex items-center justify-between px-10 pt-6">
          <div>
            <p className="text-3xl font-semibold leading-[48px] text-neutral-50">
              Hello Administrator,
            </p>
            <p className="text-sm text-slate-300">
              Monitor incentives, manage referrals, and keep your SalesDost ecosystem healthy.
            </p>
          </div>

          {/* Logout button */}
          <Link
            href="/login/role"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-900/60 transition-transform transition-colors hover:-translate-y-0.5 hover:bg-red-700"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Logout</span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="mt-6 px-10 pb-10">
          <section className="mx-auto max-w-6xl">
            {/* Hero + primary actions */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  Administrator Dashboard
                </h1>
                <p className="mt-2 text-sm text-slate-300">
                  Get a quick overview of reports, testing, support, and data processing in one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/Zopper-Administrator/monthly-incentive-report"
                  className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-sky-900/60 transition-transform transition-colors hover:-translate-y-0.5 hover:bg-sky-400"
                >
                  View Today&apos;s Incentives
                </Link>
                <Link
                  href="/Zopper-Administrator/process-voucher-excel"
                  className="rounded-full border border-slate-500/60 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm transition-transform transition-colors hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Process New Vouchers
                </Link>
              </div>
            </div>

            {/* KPI Row */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 shadow-sm shadow-slate-950/60 transition-transform transition-shadow hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-50">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{stat.helper}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Reports Section */}
              <div className="group rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-sm shadow-slate-950/70 transition-transform transition-shadow hover:-translate-y-1 hover:border-sky-400/60 hover:shadow-xl">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 text-lg">
                    📊
                  </span>
                  <span>Reports</span>
                </h2>
                <p className="mb-3 text-xs text-slate-300">
                  Track incentives and performance across your entire network.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/Zopper-Administrator/monthly-incentive-report"
                    className="flex items-center justify-between rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-sky-900/60 transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>Monthly Incentive Report</span>
                    <span className="text-lg">→</span>
                  </Link>
                  <Link
                    href="/Zopper-Administrator/spot-incentive-report"
                    className="flex items-center justify-between rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-violet-900/60 transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>Spot Incentive Report</span>
                    <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>

              {/* Management Section */}
              <div className="group rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-sm shadow-slate-950/70 transition-transform transition-shadow hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-xl">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-lg">
                    ⚙️
                  </span>
                  <span>Management</span>
                </h2>
                <p className="mb-3 text-xs text-slate-300">
                  Oversee leaderboards, referrals, and voucher approvals from one place.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/Zopper-Administrator/leaderboard"
                    className="flex items-center justify-between rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-900/60 transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>View Leaderboard</span>
                    <span className="text-lg">→</span>
                  </Link>
                  <Link
                    href="/Zopper-Administrator/referrals"
                    className="flex items-center justify-between rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-900/60 transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>View Referrals</span>
                    <span className="text-lg">→</span>
                  </Link>
                  <Link
                    href="/Zopper-Administrator/process-referral-vouchers"
                    className="flex items-center justify-between rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-teal-900/60 transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>Process Vouchers</span>
                    <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>

              {/* Testing Section */}
              <div className="group rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-sm shadow-slate-950/70 transition-transform transition-shadow hover:-translate-y-1 hover:border-violet-400/60 hover:shadow-xl">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-lg">
                    📝
                  </span>
                  <span>Testing</span>
                </h2>
                <p className="mb-3 text-xs text-slate-300">
                  Manage tests, invites, and maintain your question bank.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/Zopper-Administrator/test-results"
                    className="flex items-center justify-between rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-indigo-900/60 transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>View Test Results</span>
                    <span className="text-lg">→</span>
                  </Link>
                  <Link
                    href="/Zopper-Administrator/send-test-invites"
                    className="flex items-center justify-between rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-violet-900/60 transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>Send Test Invites</span>
                    <span className="text-lg">→</span>
                  </Link>
                  <Link
                    href="/Zopper-Administrator/insert-questions"
                    className="flex items-center justify-between rounded-full bg-gradient-to-r from-purple-500 to-pink-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-purple-900/60 transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>Insert Questions</span>
                    <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>

              {/* Support Section */}
              <div className="group rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-sm shadow-slate-950/70 transition-transform transition-shadow hover:-translate-y-1 hover:border-rose-400/60 hover:shadow-xl">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-lg">
                    🆘
                  </span>
                  <span>Support</span>
                </h2>
                <p className="mb-3 text-xs text-slate-300">
                  Resolve field issues quickly and keep partners unblocked.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/Zopper-Administrator/help-requests"
                    className="flex items-center justify-between rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-rose-900/60 transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>Help Requests</span>
                    <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>

              {/* Data Processing */}
              <div className="group rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm shadow-sm shadow-slate-950/70 transition-transform transition-shadow hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-xl">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-lg">
                    🔧
                  </span>
                  <span>Data Processing</span>
                </h2>
                <p className="mb-3 text-xs text-slate-300">
                  Handle voucher files and validate IMEIs at scale.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/Zopper-Administrator/process-voucher-excel"
                    className="flex items-center justify-between rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-amber-900/60 transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>Process Voucher Excel</span>
                    <span className="text-lg">→</span>
                  </Link>
                  <Link
                    href="/Zopper-Administrator/process-invalid-imeis"
                    className="flex items-center justify-between rounded-full bg-gradient-to-r from-orange-500 to-red-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-orange-900/60 transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>Process Invalid IMEIs</span>
                    <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
