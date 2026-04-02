import Link from "next/link";

export default function Custom404() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f4fb] px-4 py-6 sm:px-6">
      <div className="relative grid w-full max-w-6xl items-center overflow-hidden rounded-2xl bg-[#fcfbff] shadow-[0_16px_40px_rgba(67,43,140,0.08)] md:grid-cols-2">
        {/* image section */}
        <div className="flex items-center justify-center px-4 pt-6 sm:px-6 sm:pt-8 md:px-10 md:py-10 relative">
            <Link
            href="/"
            className="block md:hidden absolute items-center justify-center rounded-[14px] bg-linear-to-b from-[#7b63ff] to-[#6c52f7] px-6 py-3 text-base font-bold text-white shadow-[0_10px_20px_rgba(108,82,247,0.25)] transition hover:opacity-95 sm:w-auto sm:px-7 sm:py-4 sm:text-lg"
          >
            Start Exploring <span className="ml-2 text-center">→</span>
          </Link>
          <img
            src="/imag.png"
            alt="404 illustration"
            className="h-auto w-full max-w-[320px] object-contain sm:max-w-95 md:max-w-115"
          />
        </div>

        {/* text section */}
        <div className="px-5 pb-8 pt-2 text-center sm:px-8 md:px-14 md:py-10 md:text-left">
          <div className="mb-2 text-[48px] font-extrabold leading-none text-[#6b56f6] sm:text-[60px] md:mb-3 md:text-[72px]">
            404
          </div>

          <h1 className="mb-3 text-[28px] font-extrabold leading-[1.15] text-[#22223a] sm:text-[34px] md:mb-2 md:text-[42px]">
            Oops ! Page not Available .
          </h1>

          <p className="mb-6 text-[16px] text-[#6d6a7d] sm:text-[18px] md:mb-7 md:text-[22px]">
            Search for your favourite page
          </p>

          <Link
            href="/"
            className="hidden md:inline-flex w-full items-center justify-center rounded-[14px] bg-linear-to-b from-[#7b63ff] to-[#6c52f7] px-6 py-3 text-base font-bold text-white shadow-[0_10px_20px_rgba(108,82,247,0.25)] transition hover:opacity-95 sm:w-auto sm:px-7 sm:py-4 sm:text-lg"
          >
            Start Exploring <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}