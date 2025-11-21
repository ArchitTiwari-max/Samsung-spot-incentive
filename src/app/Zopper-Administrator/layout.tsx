'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ZopperAdministratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-black text-white flex flex-col border-r border-neutral-700">
        {/* Logo */}
        <div className="relative w-full h-[69px] bg-black border-b border-[#353535] overflow-hidden">
          <div 
            className="absolute w-[72.83px] h-[69px] top-[-1px] left-[6px] rounded-[20px]"
            style={{
              background: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-14/N8vfr4GWX8.png) no-repeat center',
              backgroundSize: 'cover'
            }}
          />
          
          <div 
            className="absolute flex items-center justify-center h-[26px] top-[21px] left-[23px] text-white font-bold text-[28px] leading-[26px] whitespace-nowrap z-[1]"
            style={{ 
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              width: '36px'
            }}
          >
            S
          </div>
          
          <div 
            className="absolute flex items-start justify-start h-[31px] top-[7px] left-[87.938px] font-bold text-[26px] leading-[31px] whitespace-nowrap z-[3]"
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: 'rgba(0, 0, 0, 0)',
              background: 'linear-gradient(90deg, #1d4ed8, #2563eb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            SalesDost
          </div>
          
          <div 
            className="absolute flex items-start justify-start h-[25px] top-[38px] left-[92.938px] text-white font-medium text-[16px] leading-[25px] whitespace-nowrap z-[2]"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Safalta ka Sathi
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4 text-sm font-normal overflow-y-auto">
          <div className="space-y-1 px-3">
            {/* Home */}
            <Link
              href="/Zopper-Administrator"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"
                  fill="white"
                />
              </svg>
              <span className="text-sm leading-normal">Home</span>
            </Link>

            {/* Monthly Incentive Report */}
            <Link
              href="/Zopper-Administrator/monthly-incentive-report"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/monthly-incentive-report')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">📄</span>
              <span className="text-sm leading-normal">Monthly Incentive Report</span>
            </Link>

            {/* Spot Incentive Report */}
            <Link
              href="/Zopper-Administrator/spot-incentive-report"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/spot-incentive-report')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">📘</span>
              <span className="text-sm leading-normal">Spot Incentive Report</span>
            </Link>

            {/* View Leaderboard */}
            <Link
              href="/Zopper-Administrator/leaderboard"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/leaderboard')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">🏆</span>
              <span className="text-sm leading-normal">View Leaderboard</span>
            </Link>

            {/* User Validation */}
            <Link
              href="/Zopper-Administrator/validate-user"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/validate-user')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">👤</span>
              <span className="text-sm leading-normal">User Validation</span>
            </Link>

            {/* View Referrals */}
            <Link
              href="/Zopper-Administrator/referrals"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/referrals')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">📄</span>
              <span className="text-sm leading-normal">View Referrals</span>
            </Link>

            {/* Process Referral Vouchers */}
            <Link
              href="/Zopper-Administrator/process-referral-vouchers"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/process-referral-vouchers')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">🎟️</span>
              <span className="text-sm leading-normal">Process Referral Vouchers</span>
            </Link>

            {/* Process Voucher Excel */}
            <Link
              href="/Zopper-Administrator/process-voucher-excel"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/process-voucher-excel')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">📊</span>
              <span className="text-sm leading-normal">Process Voucher Excel</span>
            </Link>

            {/* Process Invalid IMEIs */}
            <Link
              href="/Zopper-Administrator/process-invalid-imeis"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/process-invalid-imeis')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0 text-red-500">❌</span>
              <span className="text-sm leading-normal">Process Invalid IMEIs</span>
            </Link>

            {/* View Test Results */}
            <Link
              href="/Zopper-Administrator/test-results"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/test-results')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">📋</span>
              <span className="text-sm leading-normal">View Test Results</span>
            </Link>

            {/* Send Test Invites */}
            <Link
              href="/Zopper-Administrator/send-test-invites"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/send-test-invites')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">📧</span>
              <span className="text-sm leading-normal">Send Test Invites</span>
            </Link>

            {/* Help Requests */}
            <Link
              href="/Zopper-Administrator/help-requests"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/help-requests')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">🆘</span>
              <span className="text-sm leading-normal">Help Requests</span>
            </Link>

            {/* Insert Questions */}
            <Link
              href="/Zopper-Administrator/insert-questions"
              className={`w-full flex items-center space-x-3 rounded-lg py-2.5 px-3 select-none ${
                isActive('/Zopper-Administrator/insert-questions')
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg shrink-0">📝</span>
              <span className="text-sm leading-normal">Insert Questions</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
