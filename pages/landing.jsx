"use client";
import React, { useMemo } from "react";
import { StatCard } from "../components/StatCard";
import { dailySchedules } from "../utils/data";

const LandingPage = ({ user }) => {

  const today = useMemo(() => new Date(), []);

  const summary = useMemo(() => {
    const total = dailySchedules.length;
    const confirmed = dailySchedules.filter(
      (s) => s.status === "Confirmed",
    ).length;
    const postponed = dailySchedules.filter(
      (s) => s.status === "Postponed",
    ).length;
    const canceled = dailySchedules.filter(
      (s) => s.status === "Canceled",
    ).length;
    return { total, confirmed, postponed, canceled };
  }, [dailySchedules]);

  const stats = [
    {
      title: "Appointments",
      value: summary.total,
      subtitle: "Total today",
    },
    {
      title: "Confirmed",
      value: summary.confirmed,
      subtitle: "Ready to work",
    },
    {
      title: "Postponed",
      value: summary.postponed,
      subtitle: "Needs review",
    },
    {
      title: "Canceled",
      value: summary.canceled,
      subtitle: "Not active",
    },
  ];

  // Pull “notifications” from shifts that have alerts
  const notifications = useMemo(() => {
    const items = dailySchedules
      .filter((s) => s.alert)
      .map((s) => ({
        id: s.id,
        title: s.client,
        message: s.alert,
        status: s.status,
      }));
    // If none, show a friendly placeholder
    return items.length
      ? items
      : [
          {
            id: "none",
            title: "All good",
            message: "No alerts for today.",
            status: "Confirmed",
          },
        ];
  }, [dailySchedules]);

  const badgeClasses = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "Canceled":
        return "bg-rose-50 text-rose-700 ring-rose-200";
      case "Postponed":
      default:
        return "bg-amber-50 text-amber-700 ring-amber-200";
    }
  };

  const noticeClasses = (status) => {
    switch (status) {
      case "Canceled":
        return "bg-rose-50 text-black ring-rose-200";
      case "Postponed":
      default:
        return "bg-amber-50 text-amber-950 ring-amber-200";
    }
  };

  return (
    <div className="min-h-screen w-full py-1 flex justify-center bg-gray-50 ">
      <div className="w-[96%] md:w-[90%] px-1 md:px-8 flex justify-center hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
        <div className=" w-full  px-4 py-8 md:px-6">
          {/* TOP GRID: Greeting box + Notifications box */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Greeting / Overview box */}
            <div className="lg:col-span-2 rounded-2xl bg-white/90 px-6 py-6 ring-1 ring-slate-200 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3 ">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    System Status: Active
                  </div>
                  <h1 className="text-2xl md:text-3xl md:mb-16 font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    Hi, {user?.firstName || "User"}!
                  </h1>

                  <p className="text-sm md:text-base text-slate-600">
                    Here’s your workforce overview for{" "}
                    <span className="font-semibold text-slate-800">
                      {today.toLocaleDateString()}
                    </span>
                    .
                  </p>
                </div>

                {/* Optional illustration / scheduling image */}
                <div className="hidden sm:flex    rounded-2xl bg-white/40 ring-1 ring-white/50 shadow-sm">
                  <img
                    src="imag.png"
                    alt="Scheduling calendar on laptop"
                    className="h-full w-40 object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Notifications box */}
            <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Notifications
                </h2>
                <button className="text-xs font-semibold text-slate-600 hover:text-slate-900">
                  See all
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {n.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          {n.message}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${badgeClasses(n.status)}`}
                      >
                        {n.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KPI BOXES ROW */}
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
              />
            ))}
          </div>

          {/* SCHEDULE LIST (Glass Cards) */}
          <div className="mt-6 rounded-3xl p-6  bg-linear-to-br from-white/80 via-white/70 to-transparent relative overflow-hidden">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Daily Schedule
                </h2>
                <p className="text-sm text-slate-700">
                  Today’s shifts and status updates.
                </p>
              </div>

              <div className="text-xs font-medium text-slate-800">
                {dailySchedules.length} appointments total
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {dailySchedules.map((shift) => (
                <div
                  key={shift.id}
                  className="
    relative
    rounded-2xl
    bg-white/15
    backdrop-blur-2xl
    border border-white/40
    shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
    p-5
    transition
    hover:bg-white/25
  "
                >
                  {/* Glass highlight overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/40 via-white/10 to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                          {shift.type}
                        </p>
                        <h3 className="mt-1 truncate text-lg font-semibold text-slate-900">
                          {shift.client}
                        </h3>
                      </div>

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${badgeClasses(shift.status)}`}
                      >
                        {shift.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-800">
                      ⏰ <span className="font-medium">Shift:</span>{" "}
                      {shift.time}
                    </div>

                    {shift.alert && (
                      <div className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-sm ${noticeClasses(shift.status)} backdrop-blur-md border border-white/40`}>
                        ⚠️
                        <div>
                          <p className="font-semibold">Notice</p>
                          <p className="">{shift.alert}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Quick Actions (optional) */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
              Request Leave
            </button>
            <button className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
              Download Timesheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;