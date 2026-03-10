"use client";

import React from "react";
import Image from "next/image";
import { badgeClasses } from "../utils/data";

const LandingOverview = ({ user, today, notifications }) => {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-2xl bg-white/90 px-6 py-6 ring-1 ring-slate-200 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              System Status: Active
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:mb-16 md:text-3xl">
              Hi, {user?.firstName || "User"} {user?.lastName}!
            </h1>

            <p className="text-sm text-slate-600 md:text-base">
              Here’s your workforce overview for{" "}
              <span className="font-semibold text-slate-800">{today}</span>.
            </p>
          </div>

          <div className="hidden rounded-2xl bg-white/40 ring-1 ring-white/50 shadow-sm sm:flex">
            <Image
              src="/imag.png"
              alt="Scheduling calendar on laptop"
              width={160}
              height={120}
              className="h-full w-40 object-cover"
            />
          </div>
        </div>
      </div>

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
                  <p className="mt-1 text-xs text-slate-600">{n.message}</p>
                </div>

                <span
                  className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${badgeClasses(
                    n.status
                  )}`}
                >
                  {n.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingOverview;