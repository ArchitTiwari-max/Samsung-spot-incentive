import Link from 'next/link';

export default function ASEPage() {
  return (
    <div className="flex-1 relative overflow-hidden bg-gray-900">
      {/* background glow */}
      <div className="pointer-events-none absolute left-40 top-24 h-72 w-[1051px] opacity-10 bg-gradient-to-r from-red-500 to-orange-200 blur-[32px]" />

      {/* Top greeting */}
      <div className="flex justify-between items-center px-10 pt-6">
        <div>
          <p className="text-neutral-50 text-3xl font-semibold leading-[48px]">
            Hello John Doe,
          </p>
          <p className="text-white text-lg leading-7">
            Welcome! Choose your action below
          </p>
        </div>
        
        {/* Logout button */}
        <Link 
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
        </Link>
      </div>

      {/* Hero text */}
      <section className="mt-10 px-10">
        <div className="max-w-xl space-y-3">
          <h1 className="font-[family-name:var(--font-inter)] text-[72px] font-black leading-[61.2px] tracking-[-2px] bg-gradient-to-r from-[#FF6348] via-[#FDCB6E] to-[#FFEAA7] bg-clip-text text-transparent">
            SPOT
          </h1>
          <h1 className="font-[family-name:var(--font-inter)] text-[72px] font-black leading-[61.2px] tracking-[-2px] bg-gradient-to-r from-[#E74C3C] via-[#FF4757] to-[#FF6348] bg-clip-text text-transparent">
            INCENTIVE
          </h1>
          <h1 className="font-[family-name:var(--font-inter)] text-[72px] font-black leading-[61.2px] tracking-[-2px] relative">
            <span className="absolute inset-0 text-[#D9D9D9]">REVOLUTION</span>
            <span className="relative text-[#3AED55]/[0.39]">REVOLUTION</span>
          </h1>
        </div>
      </section>

      {/* Cards row */}
      <section className="mt-12 px-10 pb-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-4xl">
          {/* Incentive Wallet card */}
          <Link href="/ASE/wallet" className="relative h-60 rounded-2xl border border-zinc-100 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.12)] p-6 block hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)] transition-shadow cursor-pointer">
            {/* Arrow button - top right */}
            <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-emerald-600 shadow-[0_2px_8px_rgba(5,150,105,0.3)] flex items-center justify-center">
              <span className="text-white text-lg font-semibold">{">"}</span>
            </div>

            <div className="relative mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-[0_4px_12px_rgba(5,150,105,0.3)] flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="4"
                    y="7"
                    width="16"
                    height="11"
                    rx="2"
                    fill="white"
                  />
                  <path
                    d="M4 9C4 7.89543 4.89543 7 6 7H18C19.1046 7 20 7.89543 20 9V10H4V9Z"
                    fill="white"
                    fillOpacity="0.9"
                  />
                  <circle
                    cx="15"
                    cy="13.5"
                    r="2"
                    fill="rgba(16,185,129,0.3)"
                  />
                  <rect
                    x="7"
                    y="4"
                    width="10"
                    height="3"
                    rx="1"
                    fill="white"
                    fillOpacity="0.6"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-zinc-900 text-xl font-bold leading-8">
              Incentive Wallet
            </h3>
            <p className="text-stone-500 text-base leading-6">
              Track your earnings
            </p>

            <div className="mt-4 inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5">
              <span className="text-white text-xs font-semibold leading-4">
                ₹12,450 Available
              </span>
            </div>
          </Link>

          {/* View Reports card */}
          <Link href="/ASE/report" className="relative h-60 rounded-2xl border border-zinc-100 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.12)] p-6 block hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)] transition-shadow cursor-pointer">
            {/* Arrow button - top right */}
            <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-[#4318D1] shadow-[0_2px_8px_rgba(67,24,209,0.3)] flex items-center justify-center">
              <span className="text-white text-lg font-semibold">{">"}</span>
            </div>

            <div className="relative mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-[#4318D1] to-indigo-500 shadow-[0_4px_12px_rgba(67,24,209,0.3)] flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.6673 2.6665H8.00064C7.2934 2.6665 6.61512 2.94746 6.11502 3.44755C5.61493 3.94765 5.33398 4.62593 5.33398 5.33317V26.6665C5.33398 27.3737 5.61493 28.052 6.11502 28.5521C6.61512 29.0522 7.2934 29.3332 8.00064 29.3332H24.0007C24.7079 29.3332 25.3862 29.0522 25.8863 28.5521C26.3864 28.052 26.6673 27.3737 26.6673 26.6665V10.6665L18.6673 2.6665ZM24.0007 26.6665H8.00064V5.33317H17.334V11.9998H24.0007V26.6665Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-zinc-900 text-xl font-bold leading-8">
              View Reports
            </h3>
            <p className="text-stone-500 text-base leading-6">
              Check your stores performance
            </p>

            <div className="mt-4 inline-flex items-center rounded-md bg-indigo-700 px-3 py-1.5">
              <span className="text-white text-xs font-semibold leading-4">
                Analytics Ready
              </span>
            </div>
          </Link>

          {/* Store Settings card */}
          <Link href="/ASE/profile" className="relative h-60 rounded-2xl border border-zinc-100 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.12)] p-6 block hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)] transition-shadow cursor-pointer">
            {/* Arrow button - top right */}
            <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-amber-600 shadow-[0_2px_8px_rgba(217,119,6,0.3)] flex items-center justify-center">
              <span className="text-white text-lg font-semibold">{">"}</span>
            </div>

            <div className="relative mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_4px_12px_rgba(217,119,6,0.3)] flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.9998 20.6668C14.7621 20.6668 13.5751 20.1751 12.7 19.2999C11.8248 18.4247 11.3331 17.2378 11.3331 16.0001C11.3331 14.7624 11.8248 13.5754 12.7 12.7003C13.5751 11.8251 14.7621 11.3334 15.9998 11.3334C17.2375 11.3334 18.4244 11.8251 19.2996 12.7003C20.1748 13.5754 20.6665 14.7624 20.6665 16.0001C20.6665 17.2378 20.1748 18.4247 19.2996 19.2999C18.4244 20.1751 17.2375 20.6668 15.9998 20.6668ZM25.9065 17.2934C25.9598 16.8668 25.9998 16.4401 25.9998 16.0001C25.9998 15.5601 25.9598 15.1201 25.9065 14.6668L28.7198 12.4934C28.9731 12.2934 29.0398 11.9334 28.8798 11.6401L26.2131 7.02675C26.0531 6.73342 25.6931 6.61342 25.3998 6.73342L22.0798 8.06675C21.3865 7.54675 20.6665 7.09342 19.8265 6.76008L19.3331 3.22675C19.306 3.06971 19.2242 2.92732 19.1022 2.82482C18.9802 2.72232 18.8258 2.66632 18.6665 2.66675H13.3331C12.9998 2.66675 12.7198 2.90675 12.6665 3.22675L12.1731 6.76008C11.3331 7.09342 10.6131 7.54675 9.91979 8.06675L6.59979 6.73342C6.30645 6.61342 5.94645 6.73342 5.78645 7.02675L3.11979 11.6401C2.94645 11.9334 3.02645 12.2934 3.27979 12.4934L6.09312 14.6668C6.03979 15.1201 5.99979 15.5601 5.99979 16.0001C5.99979 16.4401 6.03979 16.8668 6.09312 17.2934L3.27979 19.5068C3.02645 19.7068 2.94645 20.0668 3.11979 20.3601L5.78645 24.9734C5.94645 25.2668 6.30645 25.3734 6.59979 25.2668L9.91979 23.9201C10.6131 24.4534 11.3331 24.9068 12.1731 25.2401L12.6665 28.7734C12.7198 29.0934 12.9998 29.3334 13.3331 29.3334H18.6665C18.9998 29.3334 19.2798 29.0934 19.3331 28.7734L19.8265 25.2401C20.6665 24.8934 21.3865 24.4534 22.0798 23.9201L25.3998 25.2668C25.6931 25.3734 26.0531 25.2668 26.2131 24.9734L28.8798 20.3601C29.0398 20.0668 28.9731 19.7068 28.7198 19.5068L25.9065 17.2934Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-zinc-900 text-xl font-bold leading-8">
              Store Settings
            </h3>
            <p className="text-stone-500 text-base leading-6">
              Manage your store configuration
            </p>

            <div className="mt-4 inline-flex items-center rounded-md bg-amber-600 px-3 py-1.5">
              <span className="text-white text-xs font-semibold leading-4">
                Configure
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
