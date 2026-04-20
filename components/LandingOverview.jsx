"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { badgeClasses } from "../utils/data";
import { femaleimg, maleImg } from "./assest/index";

const LandingOverviews = ({ user, week }) => {
  // console.log("🚀 ~ LandingOverview ~ week:", week);

  return (
    <div className="grid gap-4 lg:grid-cols- w-full">
      <AccountAndCalendar user={user} today={week} />
    </div>
  );
};

const AccountAndCalendar = ({
  user,
  weekLabel,
  currentWeekStart,
  onPrevWeek,
  onNextWeek,
}) => {
  console.log("🚀 ~ AccountAndCalendar ~ weekLabel:", weekLabel)
  const defaultImage =
    user?.gender === "Male" ? maleImg.src : femaleimg.src;

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d;
  });

  const today = new Date();

  const isSameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  return (
    <div className="flex">
      <div className="w-full flex flex-col gap-4 lg:flex-row lg:gap-7">
        {/* LEFT: ACCOUNT CARD */}
        <div className="rounded-2xl w-full lg:w-[70%] min-h-64 bg-white p-4 sm:p-6 ring-1 ring-slate-200 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
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
                  <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl leading-snug">
                    Welcome Back, {user?.firstName || "User"} {user?.lastName}!
                  </h1>

                  <h1 className="mb-6 text-sm font-medium text-slate-500 sm:text-base md:text-base leading-snug">
                    Email: {user?.email}
                  </h1>

                  <p className="mb-0 text-sm text-slate-600/70 sm:text-base md:text-lg">
                    Here’s your workforce overview for{" "}
                    <span className="font-semibold text-slate-800">
                      {weekLabel}
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
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,white,transparent)]" />

          <div className="relative space-y-3">
            <h3 className="text-base font-semibold">Calendar</h3>

            <div className="rounded-xl bg-white/10 p-2 sm:p-3 backdrop-blur">
              <div className="mb-2 flex items-center justify-between text-sm">
                <button onClick={onPrevWeek} className="p-1 cursor-pointer">
                  <ChevronLeft size={20} />
                </button>

                <span className="text-sm font-semibold sm:text-base">
                  {weekLabel}
                </span>

                <button onClick={onNextWeek} className="p-1 cursor-pointer">
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-base md:text-base">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (d, i) => (
                    <span
                      key={`${d}-${i}`}
                      className="font-bold text-emerald-200"
                    >
                      {d}
                    </span>
                  ),
                )}

                {weekDates.map((date, i) => {
                  const isToday = isSameDay(date, today);

                  return (
                    <div
                      key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${i}`}
                      className={`rounded-full py-1 sm:py-1.5 ${
                        isToday
                          ? "bg-white font-semibold text-emerald-700"
                          : "text-white/80"
                      }`}
                    >
                      {date.getDate()}
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


const LandingOverview = ({
  user,
  weekLabel,
  currentWeekStart,
  onPrevWeek,
  onNextWeek,
}) => {
  return (
    <div className="grid gap-4 w-full">
      <AccountAndCalendar
        user={user}
        weekLabel={weekLabel}
        currentWeekStart={currentWeekStart}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        />
    </div>
  );
};

export default LandingOverview;