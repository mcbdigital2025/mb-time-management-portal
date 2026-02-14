import {
  Building,
  Calendar,
  Laptop,
  Laptop2,
  TimerIcon,
  TimerResetIcon,
  UsersRoundIcon,
} from "lucide-react";
import React from "react";
import { steps } from "../../data";

  type Feature = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

 const features: Feature[] = [
  {
    title: "Smart Scheduling",
    desc: "Plan shifts and jobs across staff and sites with intelligent conflict detection.",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    title: "Timesheets Made Simple",
    desc: "Plan shifts and jobs across staff and sites with intelligent conflict detection.",
    icon: <TimerResetIcon className="h-6 w-6" />,
  },
  {
    title: "Staff & Clients in One Place",
    desc: "Plan shifts and jobs across staff and sites with intelligent conflict detection.",
    icon: <UsersRoundIcon className="h-6 w-6" />,
  },
  {
    title: "Multi-Industry Built",
    desc: "Plan shifts and jobs across staff and sites with intelligent conflict detection.",
    icon: <Laptop className="h-6 w-6" />,
  },
];



export default function HeroHowItWorks() {
  return (
    <section className="w-full bg-white">
      <div className=" w-full   max-h[376px] ">
        {/* Top cards row */}
        <div className="w-full px-28.5 py-25 ">
          <div className="flex max-w-7xl justify-center gap-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="max-w-70 px-3 py-2.5 rounded-[14px] bg-[#008080]  text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
              >
                <div className="flex flex-col items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#008080]">
                    {f.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[20px] font-semibold leading-5">
                      {f.title}
                    </div>
                    <div className="mt-1 text-[14px] leading-4 text-white/90">
                      {f.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div
          className=" flex flex-col gap-6  py-25 px-45 min-h-127.5  bg-linear-to-b from-[#F8FAFC] to-[#FFFFFF]
"
        >
          <div className="text-center">
            <h2 className="text-[48px] font-semibold tracking-[-0.02em] text-black">
              How MaboCore Works
            </h2>
            <p className="gap-2 text-[16px] text-[#595959]">
              Streamline your entire operation in three simple steps.
            </p>
          </div>

          {/* Timeline circles + line */}
          <div className="mx-auto space-y-8 max-w-6xl  overflow-hidden ">
            {/* horizontal line */}
            <div className="mx-auto max-w-232   flex justify-center items-center">
              <div className="flex  border-2 p-5 items-center justify-center rounded-full bg-white border-[#F0F0F0] ring-2 ring-[#E7EEF6]">
                <span className="text-[20px] font-bold text-[#08979C]">01</span>
              </div>
              <div className=" w-85.5 border border-[#F0F0F0]" />
              <div className="flex  border-2 p-5 items-center justify-center rounded-full bg-white border-[#F0F0F0] ring-2 ring-[#E7EEF6]">
                <span className="text-[20px] font-bold text-[#08979C]">02</span>
              </div>
              <div className=" w-85.5 border border-[#F0F0F0]" />
              <div className="flex  border-2 p-5 items-center justify-center rounded-full bg-white border-[#F0F0F0] ring-2 ring-[#E7EEF6]">
                <span className="text-[20px] font-bold text-[#08979C]">03</span>
              </div>
            </div>
          {/* Step text rows */}
          <div className="flex justify-between lg:w-6xl md:w-5xl sm:5xl 4xl text-center">
            {steps.map((s) => (
              <div key={s.num}>
                <div className="text-[18px] font-semibold text-gray-900">
                  {s.title}
                </div>
                <p className="mx-auto mt-2 max-w-65 text-[12px] leading-4 text-[#8C8C8C]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
          </div>

        </div>
      </div>
    </section>
  );
}
