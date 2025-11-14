export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-10">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Incentive Wallet</h1>
          <p className="text-neutral-300">Track your earnings and transaction history</p>
        </div>
        <a
          href="/login/role"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-lg"
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
        </a>
      </header>

      {/* Balance Card */}
      <div className="max-w-4xl mb-8">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-3xl p-8 shadow-[0_20px_60px_rgba(5,150,105,0.4)]">
          <p className="text-emerald-100 text-sm font-medium mb-2">Total Available Balance</p>
          <h2 className="text-white text-5xl font-bold mb-6">₹12,450</h2>
          <div className="flex gap-4">
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition">
              Withdraw
            </button>
            <button className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-800 transition">
              View History
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-4xl mb-8">
        <h3 className="text-white text-xl font-semibold mb-4">This Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">Earned</p>
            <p className="text-white text-3xl font-bold">₹8,200</p>
            <p className="text-emerald-400 text-sm mt-2">+15% from last month</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">Withdrawn</p>
            <p className="text-white text-3xl font-bold">₹3,500</p>
            <p className="text-slate-400 text-sm mt-2">2 transactions</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">Pending</p>
            <p className="text-white text-3xl font-bold">₹750</p>
            <p className="text-amber-400 text-sm mt-2">Processing</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="max-w-4xl">
        <h3 className="text-white text-xl font-semibold mb-4">Recent Transactions</h3>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
          {[
            { date: "Nov 14, 2024", desc: "Monthly Incentive", amount: "+₹5,200", status: "completed" },
            { date: "Nov 12, 2024", desc: "Bonus Achievement", amount: "+₹3,000", status: "completed" },
            { date: "Nov 10, 2024", desc: "Withdrawal", amount: "-₹2,000", status: "completed" },
            { date: "Nov 08, 2024", desc: "Weekly Target", amount: "+₹1,500", status: "completed" },
          ].map((txn, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-slate-700 last:border-0 hover:bg-slate-700/30 transition">
              <div>
                <p className="text-white font-medium">{txn.desc}</p>
                <p className="text-slate-400 text-sm">{txn.date}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {txn.amount}
                </p>
                <p className="text-slate-500 text-xs capitalize">{txn.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
