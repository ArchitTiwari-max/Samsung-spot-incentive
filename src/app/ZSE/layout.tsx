'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function ZSELayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full bg-gray-900 flex">
      {/* Left sidebar */}
      <aside className="w-60 bg-black border-r border-neutral-700 flex flex-col">
        {/* Top brand bar */}
        <div className="relative w-full h-[69px] bg-black border-b border-[#353535] overflow-hidden">
          {/* Rectangle background with image */}
          <div 
            className="absolute w-[72.83px] h-[69px] top-[-1px] left-[6px] rounded-[20px]"
            style={{
              background: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-14/N8vfr4GWX8.png) no-repeat center',
              backgroundSize: 'cover'
            }}
          />
          
          {/* S letter */}
          <div 
            className="absolute flex items-center justify-center h-[26px] top-[21px] left-[23px] text-white font-bold text-[28px] leading-[26px] whitespace-nowrap z-[1]"
            style={{ 
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              width: '36px'
            }}
          >
            S
          </div>
          
          {/* SalesDost with gradient */}
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
          
          {/* Safalta ka Sathi */}
          <div 
            className="absolute flex items-start justify-start h-[25px] top-[38px] left-[92.938px] text-white font-medium text-[16px] leading-[25px] whitespace-nowrap z-[2]"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Safalta ka Sathi
          </div>
        </div>

        {/* Sidebar nav with SVG icons */}
        <nav className="flex-1 pt-4 text-sm font-normal">
          <div className="space-y-1 px-3">
            {/* Home */}
            <Link
              href="/ZSE"
              className={`w-full flex items-center space-x-2 rounded-lg py-2 px-3 select-none ${
                  pathname === '/ZSE'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                <svg
                  width="24"
                  height="24"
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

                <span className="text-sm leading-normal">
                  Home
                </span>
            </Link>

            {/* View Leaderboard */}
            <Link
              href="/ZSE/leaderboard"
              className={`w-full flex items-center space-x-2.5 rounded-lg py-2 px-3 select-none ${
                  pathname === '/ZSE/leaderboard'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                <svg
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <g clipPath="url(#clip0_3962_107281)">
                    <path
                      d="M4.5 7.12508H3.375C2.87772 7.12508 2.40081 6.91656 2.04917 6.5454C1.69754 6.17423 1.5 5.67082 1.5 5.14591C1.5 4.62101 1.69754 4.1176 2.04917 3.74643C2.40081 3.37527 2.87772 3.16675 3.375 3.16675H4.5"
                      stroke="white"
                      strokeWidth="1.875"
                    />
                    <path
                      d="M13.5 7.12508H14.625C15.1223 7.12508 15.5992 6.91656 15.9508 6.5454C16.3025 6.17423 16.5 5.67082 16.5 5.14591C16.5 4.62101 16.3025 4.1176 15.9508 3.74643C15.5992 3.37527 15.1223 3.16675 14.625 3.16675H13.5"
                      stroke="white"
                      strokeWidth="1.875"
                    />
                    <path d="M3 17.4167H15" stroke="white" strokeWidth="1.875" />
                    <path
                      d="M7.5 11.606V13.4585C7.5 13.8939 7.1475 14.2343 6.7725 14.4164C5.8875 14.8439 5.25 16.0235 5.25 17.4168"
                      stroke="white"
                      strokeWidth="1.875"
                    />
                    <path
                      d="M10.5 11.606V13.4585C10.5 13.8939 10.8525 14.2343 11.2275 14.4164C12.1125 14.8439 12.75 16.0235 12.75 17.4168"
                      stroke="white"
                      strokeWidth="1.875"
                    />
                    <path
                      d="M13.5 1.58325H4.5V7.12492C4.5 8.3847 4.97411 9.59288 5.81802 10.4837C6.66193 11.3745 7.80653 11.8749 9 11.8749C10.1935 11.8749 11.3381 11.3745 12.182 10.4837C13.0259 9.59288 13.5 8.3847 13.5 7.12492V1.58325Z"
                      stroke="white"
                      strokeWidth="1.875"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3962_107281">
                      <rect width="18" height="19" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <span className="text-sm leading-normal">
                  View Leaderboard
                </span>
            </Link>

            {/* Wallet */}
            <Link
              href="/ZSE/wallet"
              className={`w-full flex items-center space-x-2.5 rounded-lg py-2 px-3 select-none ${
                  pathname === '/ZSE/wallet'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                <svg
                  width="21"
                  height="19"
                  viewBox="0 0 21 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M1.75 2.375H7C7.92826 2.375 8.8185 2.70863 9.47487 3.3025C10.1313 3.89636 10.5 4.70181 10.5 5.54167V16.625C10.5 15.9951 10.2234 15.391 9.73116 14.9456C9.23887 14.5002 8.57119 14.25 7.875 14.25H1.75V2.375Z"
                    stroke="white"
                    strokeWidth="1.875"
                  />
                  <path
                    d="M19.25 2.375H14C13.0717 2.375 12.1815 2.70863 11.5251 3.3025C10.8687 3.89636 10.5 4.70181 10.5 5.54167V16.625C10.5 15.9951 10.7766 15.391 11.2688 14.9456C11.7611 14.5002 12.4288 14.25 13.125 14.25H19.25V2.375Z"
                    stroke="white"
                    strokeWidth="1.875"
                  />
                </svg>

                <span className="text-sm leading-normal">
                  Wallet
                </span>
            </Link>

            {/* Profile */}
            <Link
              href="/ZSE/profile"
              className={`w-full flex items-center space-x-2.5 rounded-lg py-2 px-3 select-none ${
                  pathname === '/ZSE/profile'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <g clipPath="url(#clip0_3962_107307)">
                    <path
                      d="M10 1C12.2091 1 14 2.79087 14 5C14 7.20913 12.2091 9 10 9C7.79086 9 6 7.20914 6 5C6 2.79086 7.79086 1 10 1Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M10 12.5C4.47715 12.5 0 16.9772 0 22.5H20C20 16.9772 15.5228 12.5 10 12.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3962_107307">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <span className="text-sm leading-normal">Profile</span>
            </Link>

            {/* Report */}
            <Link
              href="/ZSE/report"
              className={`w-full flex items-center space-x-2.5 rounded-lg py-2 px-3 select-none ${
                  pathname === '/ZSE/report'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                <svg
                  width="21"
                  height="19"
                  viewBox="0 0 21 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M13.125 1.58325H7.875C7.39175 1.58325 7 1.93769 7 2.37492V3.95825C7 4.39548 7.39175 4.74992 7.875 4.74992H13.125C13.6082 4.74992 14 4.39548 14 3.95825V2.37492C14 1.93769 13.6082 1.58325 13.125 1.58325Z"
                    stroke="white"
                    strokeWidth="1.875"
                  />
                  <path
                    d="M14 3.16675H15.75C16.2141 3.16675 16.6592 3.33356 16.9874 3.6305C17.3156 3.92743 17.5 4.33016 17.5 4.75008V15.8334C17.5 16.2533 17.3156 16.6561 16.9874 16.953C16.6592 17.2499 16.2141 17.4167 15.75 17.4167H5.25C4.78587 17.4167 4.34075 17.2499 4.01256 16.953C3.68437 16.6561 3.5 16.2533 3.5 15.8334V4.75008C3.5 4.33016 3.68437 3.92743 4.01256 3.6305C4.34075 3.33356 4.78587 3.16675 5.25 3.16675H7"
                    stroke="white"
                    strokeWidth="1.875"
                  />
                  <path d="M10.5 8.70825H14" stroke="white" strokeWidth="1.875" />
                  <path d="M10.5 12.6667H14" stroke="white" strokeWidth="1.875" />
                  <path d="M7 8.70825H7.00875" stroke="white" strokeWidth="1.875" />
                  <path d="M7 12.6667H7.00875" stroke="white" strokeWidth="1.875" />
                </svg>

                <span className="text-sm leading-normal">Report</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
