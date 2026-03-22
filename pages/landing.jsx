"use client";

import React, { useState, useEffect, useMemo } from "react";
import JSONbig from "json-bigint";
import { toast } from "react-toastify";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isWithinInterval,
  parseISO
} from "date-fns";
import { StatCard } from "../components/StatCard";
import LandingOverview from "../components/LandingOverview";
import EmployeeProfileSkeleton from "../components/loaders/EmployeeProfileSkeleton";
import { authenticatedFetch } from "../utils/api";
import { badgeClasses } from "../utils/data";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"; // Icons for navigation

const LandingPage = ({ user }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Navigation State ---
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekRangeLabel = useMemo(() => {
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return `${format(currentWeekStart, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  }, [currentWeekStart]);

  useEffect(() => {
    if (!user?.companyId || !user?.employeeId) return;

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const companyId = user.companyId.toString();
        const empId = user.employeeId.toString();

        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/staffid/${companyId}/${encodeURIComponent(empId)}`
        );

        if (response.ok) {
          const text = await response.text();
          const data = JSONbig.parse(text);
          setSchedules(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Session Fetch Error:", err);
        toast.error("Network error connecting to schedule service.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // --- Filtering Logic for Current Week ---
  const filteredSchedules = useMemo(() => {
    const start = currentWeekStart;
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    return schedules.filter((s) => {
      const scheduleDate = parseISO(s.workDate);
      return isWithinInterval(scheduleDate, { start, end });
    });
  }, [schedules, currentWeekStart]);

  // --- Stats Logic (Based on Filtered Data) ---
  const summary = useMemo(() => {
    return {
      total: filteredSchedules.length,
      confirmed: filteredSchedules.filter(s => ["CONFIRM", "SCHEDULED", "COMPLETED"].includes(s.status?.toUpperCase())).length,
      postponed: filteredSchedules.filter(s => s.status?.toUpperCase() === "POSTPONE").length,
      canceled: filteredSchedules.filter(s => ["CANCELED", "CANCELLED"].includes(s.status?.toUpperCase())).length,
    };
  }, [filteredSchedules]);

  const stats = [
    { title: "Weekly Appointments", value: summary.total, subtitle: "Current view" },
    { title: "Confirmed", value: summary.confirmed, subtitle: "Ready to work" },
    { title: "Postponed", value: summary.postponed, subtitle: "Rescheduled" },
    { title: "Canceled", value: summary.canceled, subtitle: "Inactive" },
  ];

  // --- Handlers ---
  const nextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
  const prevWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
  const goToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 py-8 flex justify-center">
        <div className="w-[90%]"><EmployeeProfileSkeleton /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-1 flex justify-center">
      <div className="hero-radial-background flex w-[96%] justify-center bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC)] px-1 md:w-[90%] md:px-8">
        <div className="w-full px-4 py-8 md:px-6">

          <LandingOverview user={user} Week={format(new Date(), "dd/MM/yyyy")} notifications={[]} />

          {/* Navigation Bar */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between bg-white/40 p-4 rounded-2xl backdrop-blur-sm border border-white/60 shadow-sm gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-emerald-600 w-5 h-5" />
              <h2 className="text-lg font-bold text-slate-800">{weekRangeLabel}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={goToday} className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">Week</button>
              <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                <button onClick={prevWeek} className="p-2 hover:bg-slate-50 border-r border-slate-200"><ChevronLeft size={18} /></button>
                <button onClick={nextWeek} className="p-2 hover:bg-slate-50"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} title={stat.title} value={stat.value} subtitle={stat.subtitle} />
            ))}
          </div>

          <div className="relative mt-6 overflow-hidden rounded-3xl bg-white/80 p-6 shadow-sm border border-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Weekly Shift Details</h2>
              <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">
                {filteredSchedules.length} shifts this week
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredSchedules.length > 0 ? (
                filteredSchedules.sort((a,b) => new Date(a.workDate) - new Date(b.workDate)).map((shift) => (
                <div key={shift.clientBookingId} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{format(parseISO(shift.workDate), "EEEE, MMM d")}</p>
                      <h3 className="text-md font-bold text-slate-900 mt-1">{shift.facilitiesName}</h3>
                      <p className="text-xs text-slate-500">{shift.jobCode}</p>
                    </div>
                    <span className={`h-fit px-2.5 py-1 rounded-full text-[10px] font-bold ring-1 ring-inset ${badgeClasses(shift.status)}`}>
                      {shift.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-1 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><span>⏰</span> {shift.scheduledStartTime} - {shift.scheduledEndTime}</div>
                    <div className="flex items-center gap-2"><span>📍</span> {shift.workLocation}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-16 text-center">
                <div className="text-4xl mb-2">🍃</div>
                <p className="text-slate-400 font-medium">No shifts scheduled for this week.</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;