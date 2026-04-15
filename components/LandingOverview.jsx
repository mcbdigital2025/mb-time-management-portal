"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { badgeClasses } from "../utils/data";

const LandingOverview = ({ user, week }) => {
  console.log("🚀 ~ LandingOverview ~ week:", week);
  const [currentDate, setCurrentDate] = useState(new Date());
  const defaultImage =
    user?.gender !== "Male" ? "/male_employee.jpg" : "/female_employee.jpg";
  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  return (
    <div className="grid gap-4 lg:grid-cols- w-full">
      <AccountAndCalendar user={user} today={week} />
    </div>
  );
};

export default LandingOverview;

const AccountAndCalendar = ({ user, today }) => {
  console.log("🚀 ~ AccountAndCalendar ~ user:", user);
  // const defaultImage = user?.gender === "Male" ? "/male_employee.jpg" : "/female_employee.jpg";
  const defaultImage = "/male_employee.jpg";

  const [currentDate, setCurrentDate] = useState(new Date());
  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  // const imageSrc =
  // user?.profileImage && user.profileImage.trim() !== ""
  //   ? user.profileImage
  //   : defaultImage;
  return (
    <div className="flex">
      <div className="w-full flex flex-col gap-4 lg:flex-row lg:gap-7">
        {/* LEFT: ACCOUNT CARD */}
        <div className="rounded-2xl w-full lg:w-[70%] min-h-64 bg-white p-4 sm:p-6 ring-1 ring-slate-200 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Account Info */}
            <div className="w-full space-y-2">
              <p className="pl-0 text-xl text-slate-500 sm:pl-5 font-semibold sm:text-2xl">
                My account
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
                <div className="mx-auto flex rounded-2xl bg-white/40 ring-1 ring-white/50 shadow-sm sm:mx-0">
                  <img
                    src={defaultImage}
                    alt="Profile"
                    
                    className="h-24 w-24 rounded-2xl border-4 border-white object-cover object-top shadow-lg sm:h-32 sm:w-32 md:h-36 md:w-36"
                  />
                </div>

                <div className="w-full min-w-0">
                  <h1 className=" text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl leading-snug">
                    Welcome Back, {user?.firstName || "User"} {user?.lastName}!
                  </h1>
                  <h1 className=" mb-6 text-sm font-medium  text-slate-500 sm:text-base md:text-base leading-snug">
                    Email: {user?.email}
                  </h1>

                  <p className="mb-0 text-sm text-slate-600/70 sm:text-base md:text-lg">
                    Here’s your workforce overview for{" "}
                    <span className="font-semibold text-slate-800">
                      {today}
                    </span>
                    .
                  </p>

                  <div className="flex flex-wrap gap-3 pt-1 sm:pt-0">
                    <button className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 sm:w-auto sm:min-w-55 md:text-lg lg:text-xl">
                      {user?.accessLevel || "BASIC"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CALENDAR CARD */}
        <div className="hidden md:block relative w-full overflow-hidden rounded-2xl bg-emerald-700 px-4 py-4 text-white shadow-sm sm:px-6 lg:w-[30%] min-h-64">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,white,transparent)]" />

          <div className="relative space-y-3">
            <h3 className="text-base font-semibold">Calender</h3>

            {/* MINI CALENDAR */}
            <div className="rounded-xl bg-white/10 p-2 sm:p-3 backdrop-blur">
              {/* Header */}
              <div className="mb-2 flex items-center justify-between text-sm">
                <button onClick={prevMonth} className="p-1">
                  <ChevronLeft size={16} />
                </button>

                <span className="text-sm font-semibold sm:text-base">
                  {monthYear}
                </span>

                <button onClick={nextMonth} className="p-1">
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs">
                {/* Week Labels */}
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <span key={d} className="font-bold text-emerald-200">
                    {d}
                  </span>
                ))}

                {/* Empty spaces before first day */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Actual days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;

                  const isToday =
                    day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={day}
                      className={`rounded-md py-1 sm:py-1.5 ${
                        isToday
                          ? "bg-white font-semibold text-emerald-700"
                          : "text-white/80"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
