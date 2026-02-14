import { ChevronRight, HandHelpingIcon } from "lucide-react";
import Link from "next/link";
import { testimonials } from "../../data";
import { IndustryCard } from "../../types";

const industries: IndustryCard[] = [
  {
    title: "Care Providers",
    desc: "Manage home visits, care plans, and compliance effortlessly.",
    href: "#",
    iconBg: "bg-red-50 text-red-500",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-16 w-16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.65-7 10-7 10Z" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </svg>
    ),
  },
  {
    title: "Security Companies",
    desc: "Coordinate patrols, site checkpoints, and guard reports.",
    href: "#",
    iconBg: "bg-indigo-50 text-indigo-600",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-16 w-16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M12 3l7 4v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4Z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Healthcare Clinics",
    desc: "Manage patient rosters, staffing, and compliance workflows.",
    href: "#",
    iconBg: "bg-emerald-50 text-emerald-600",
    icon: <HandHelpingIcon className="h-10 w-10" />,
  },
];

export default function SocialProofAndIndustries() {
  return (
    <section className="w-full  bg-white">
      <div className="w-full py-25 px-77.5 flex flex-col gap-6 items-center">
        {/* Testimonials (Top)     */}
        <div className="text-center">
          <div className="text-[16px]  text-gray-500">
            Trusted by service teams across Australia
          </div>
          <h2 className=" text-[24px] font-semibold text-[#1F1F1F] ">
            Used by hundreds of managers daily
          </h2>
        </div>
        {/* Light panel */}
        <div className="mx-auto rounded-2xl  w-full flex justify-center  bg-[#F6F9FC] px-4 py-6">
          <div className="grid grid-cols-2 gap-6 justify-center items-center">
            {testimonials.map((t, idx) => (
              <div
                key={`${t.name}-${idx}`}
                className={` rounded-[10px] ${idx === 0 ? "bg-white shadow-[0_8px_18px_rgba(15,23,42,0.06)] ring-1" : "bg-transparent"}  px-4 py-3   ring-black/5`}
              >
                <div className="flex flex-col items-start gap-3">
                  <div className="min-w-0 flex gap-2">
                    {/* Avatar */}
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-[14px] font-bold text-[#08979C] ">
                      SC
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">
                        {t.name}
                      </p>
                      <p className="text-[13px] leading-4 text-gray-500">
                        {t.role}, {t.company}
                      </p>
                    </div>
                  </div>
                  <div className=" text-[14px] leading-4 text-gray-500">
                    {t.quote}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Industries (Bottom)    */}
      <div className="w-full flex flex-col py-25 px-45  gap-6 ">
        <div className="text-center space-y-6">
          <div className="text-[16px] text-[#08979C] ">Industries</div>
          <h3 className=" text-[24px] font-semibold text-[#1F1F1F] ">
            Built for your specific needs
          </h3>
        </div>

        <div className=" grid grid-cols-3 gap-6 ">
          {industries.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl space-y-5 bg-white px-5 py-5 space-x-5 shadow-[0_10px_22px_rgba(15,23,42,0.06)] ring-1 ring-[#D9D9D9]"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.iconBg}`}
              >
                {c.icon}
              </div>
              <div>
                <p className="mt-4 text-[20px] font-semibold text-gray-950">
                  {c.title}
                </p>
                <p className="mt-2 text-[14px] leading-4 text-[#595959]">
                  {c.desc}
                </p>
              </div>

              <Link
                href={c.href}
                className=" inline-flex  items-center gap-2 text-[14px] font-medium text-[#008080] hover:text-[#006666] transition"
              >
                Learn more{" "}
                <span aria-hidden>
                  <ChevronRight className="w-4 h-4" />{" "}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
