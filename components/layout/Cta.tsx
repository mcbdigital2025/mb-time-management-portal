import Link from "next/link";

export default function Cta() {
  return (
    <section className="w-full bg-[#070B16]">
      <div
        className="w-full
                   py-12 sm:py-16 lg:py-25
                   px-4 sm:px-8 lg:px-45
                   bg-[radial-gradient(14.53%_77.87%_at_9.36%_50%,#21275D_0%,#0F172B_100%),radial-gradient(11.21%_55.86%_at_88.39%_51.48%,rgba(13,107,108,0.2)_0%,rgba(14,22,41,0.2)_100%)]"
        // style={{
        //   background:
        //     "radial-gradient(70% 120% at 50% 0%, rgba(120,140,255,0.16) 0%, rgba(0,0,0,0) 60%), linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.00) 70%)",
        // }}
      >
        <div className="mx-auto w-full">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-[15px] sm:text-[16px] leading-6 text-white/80">
              Join thousands of managers who save 15+ hours a week with
              <br className="hidden sm:block" />
              MaboCore.
            </p>

            <div className="mt-10 sm:mt-5 flex flex-col sm:flex-row items-center gap-3 w-full px-8 sm:px-1 sm:w-auto">
              <Link
                href="#"
                className="inline-flex py-3 px-4 items-center justify-center rounded-[77px]
                           bg-[#F75D42] text-[14px] font-medium text-white hover:bg-[#f13716] transition
                           w-full sm:w-auto"
              >
                Start free trial
              </Link>

              <Link
                href="##"
                className="inline-flex py-3 px-5 items-center justify-center rounded-[77px]
                           border border-white/30 bg-transparent text-[14px] font-medium text-white hover:border-white/45 transition
                           w-full sm:w-auto"
              >
                Book a demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
