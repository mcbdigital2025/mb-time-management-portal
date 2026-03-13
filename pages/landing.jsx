"use client";

import React, { useMemo } from "react";
import { StatCard } from "../components/StatCard";
import LandingOverview from "../components/LandingOverview";
import { badgeClasses, dailySchedules, noticeClasses } from "../utils/data";

const LandingPage = ({ user }) => {
  const today = useMemo(() => new Date().toLocaleDateString("en-GB"), []);

  const summary = useMemo(() => {
    const total = dailySchedules.length;
    const confirmed = dailySchedules.filter(
      (s) => s.status === "Confirmed"
    ).length;
    const postponed = dailySchedules.filter(
      (s) => s.status === "Postponed"
    ).length;
    const canceled = dailySchedules.filter(
      (s) => s.status === "Canceled"
    ).length;

    return { total, confirmed, postponed, canceled };
  }, []);

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

  const notifications = useMemo(() => {
    const items = dailySchedules
      .filter((s) => s.alert)
      .map((s) => ({
        id: s.id,
        title: s.client,
        message: s.alert,
        status: s.status,
      }));

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
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 py-1 flex justify-center">
      <div className="hero-radial-background flex w-[96%] justify-center bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] px-1 md:w-[90%] md:px-8">
        <div className="w-full px-4 py-8 md:px-6">
          <LandingOverview
            user={user}
            today={today}
            notifications={notifications}
          />

          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
              />
            ))}
          </div>

          <div className="relative mt-6 overflow-hidden rounded-3xl bg-linear-to-br from-white/80 via-white/70 to-transparent p-6">
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
                  className="relative rounded-2xl border border-white/40 bg-white/15 p-5 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] transition hover:bg-white/25"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-white/40 via-white/10 to-transparent" />

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
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${badgeClasses(
                          shift.status
                        )}`}
                      >
                        {shift.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-800">
                      ⏰ <span className="font-medium">Shift:</span> {shift.time}
                    </div>

                    {shift.alert && (
                      <div
                        className={`mt-4 flex items-start gap-2 rounded-xl border border-white/40 p-3 text-sm backdrop-blur-md ${noticeClasses(
                          shift.status
                        )}`}
                      >
                        ⚠️
                        <div>
                          <p className="font-semibold">Notice</p>
                          <p>{shift.alert}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

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