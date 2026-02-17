//     style={{
//   background: `
//     radial-gradient(circle at 10% 90%, #D1E5FF 0%, transparent 60%),
//     radial-gradient(circle at 85% 20%, rgba(110,178,188,0.4) 0%, transparent 60%),
//     linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)
//   `
// }}

import { CircleCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      className=" hero-radial-background w-full bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]"
    >
       <div className="mx-auto w-full max-w-378 px-4 sm:px-8 lg:px-56.5 py-12 sm:py-16 lg:py-25">
        {/* Top text block */}
        <div className="mx-auto flex w-ful max-w-265 max-h-68 flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#B0FFB7] px-3 py-1 text-[#6FC276] text-xs ring-1 ring-black/5 backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            New Feature: AI Scheduling
          </div>
         


          <h1 className="mt-6 text-[28px] md:text-[48px] leading-[1.1] font-semibold tracking-[-0.02em] text-black">
            All-in-one scheduling &<br />
            workforce management
          </h1>

          <p className=" text-sm leading-6 text-[#595959] w-104">
            Built for care providers, security teams, and healthcare clinics
            managing staff across multiple sites.
          </p>

          <div className="mt-4 sm:mt-2 flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F75D42] py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#f13210] transition
                         w-full sm:w-auto"
            >
              Book a demo
            </Link>

            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm ring-1 ring-black/5 hover:bg-gray-50 transition
                         w-full sm:w-auto"
            >
              See how it works <span aria-hidden>›</span>
            </Link>
          </div>
        </div>

        {/* Device / image card */}
        <div className="relative mx-auto mt-10 max-w-265 max-h-144.5 bg-[#6EB2BC40]">
          <div className="rounded-2xl bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.10)] ring-1 ring-black/5">
            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              <Image
                src="/images/Hero-image.png"
                alt="Product dashboard preview"
                width={1400}
                height={900}
                priority
                className="h-auto w-[90%] sm:w-full md:w-full select-none"
              />
            </div>
          </div>

          {/* Left floating chip */}
          <div className="absolute md:-left-18 -left-3 md:top-41.5 top-12.5 -translate-y-1/2">
            <div className="flex items-center md:gap-3 rounded-xl bg-white px-1 md:px-4  py-1 md:py-3 shadow-md ring-1 ring-black/5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                <CircleCheck className="w-3 h-3 md:h-6 md:w-6 text-[#b7f085]" />
              </div>
              <div className="leading-tight">
                <div className="text-[8px] md:text-[12px]  text-[#8C8C8C]">Shift Status</div>
                <div className="text-[10px] md:text-sm font-semibold text-gray-900">
                  All Covered
                </div>
              </div>
            </div>
          </div>

          {/* Right floating chip */}
          <div className="absolute md:left-197.75 lg:left-177.75  xl:left-247.75 top-93.75 -translate-y-1/2">
            <div className="flex items-center gap-3 rounded-xl bg-white px-2 py-3 shadow-md ring-1 ring-black/5">
              <div className="flex -space-x-2 w-18">
                {[
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/68.jpg",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full ring-2 ring-white overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt="User avatar"
                      width={28}
                      height={28}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="leading-tight w-16">
                <div className="text-[12px] font-medium text-[#8C8C8C]">
                  Active Staff
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  24 Online
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-2" />
      </div>
    </section>
  );
}
