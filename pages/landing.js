"use client";

import {
  addWeeks,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfWeek,
  subWeeks,
} from "date-fns";
import JSONbig from "json-bigint";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"; // Icons for navigation
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import LandingOverview from "../components/LandingOverview";
import ViewEmployeesSkeleton from "../components/loaders/ViewEmployeesSkeleton";
import { StatCard } from "../components/StatCard";
import { authenticatedFetch } from "../utils/api";
import { badgeClasses } from "../utils/data";

const LandingPage = ({ user }) => {
  console.log("🚀 ~ LandingPage ~ user:", user)
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Navigation State ---
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/staffid/${companyId}/${encodeURIComponent(empId)}`,
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
      confirmed: filteredSchedules.filter((s) =>
        ["CONFIRM", "SCHEDULED", "COMPLETED"].includes(s.status?.toUpperCase()),
      ).length,
      postponed: filteredSchedules.filter(
        (s) => s.status?.toUpperCase() === "POSTPONE",
      ).length,
      canceled: filteredSchedules.filter((s) =>
        ["CANCELED", "CANCELLED"].includes(s.status?.toUpperCase()),
      ).length,
    };
  }, [filteredSchedules]);

  const stats = [
    {
      title: "Weekly Appointments",
      value: summary.total,
      subtitle: "Current view",
    },
    { title: "Confirmed", value: summary.confirmed, subtitle: "Ready to work" },
    { title: "Postponed", value: summary.postponed, subtitle: "Rescheduled" },
    { title: "Canceled", value: summary.canceled, subtitle: "Inactive" },
  ];

  // --- Handlers ---
  const nextWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, 1));
  const prevWeek = () => setCurrentWeekStart((prev) => subWeeks(prev, 1));
  const goToday = () =>
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 py-8 flex justify-center">
        <div className="w-[90%]">
          <ViewEmployeesSkeleton />
        </div>
      </div>
    );
  }

return (
  <div className="min-h-screen w-full hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC)] py-2 flex justify-center">
    <div className="flex w-full max-w-screen-2xl justify-center px-2 sm:w-[96%] sm:px-3 md:w-[90%] md:px-8">
      <div className="w-full px-3 py-6 sm:px-4 sm:py-8 md:px-6">
        <LandingOverview
          user={user}
          // week={format(new Date(), "dd/MM/yyyy")}
          week={weekRangeLabel}
          notifications={[]}
        />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
            />
          ))}
        </div>

        {/* Navigation Bar */}
        <div className="relative mt-6 overflow-hidden rounded-2xl sm:rounded-3xl bg-emerald-700 px-3 py-4 sm:px-6 sm:py-3 sm:pb-6 shadow-sm border border-white">
          <div className="flex flex-col gap-4 rounded-2xl backdrop-blur-sm px-1 sm:px-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-emerald-100 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-50 leading-snug">
                {weekRangeLabel}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={goToday}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Week
              </button>
              <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={prevWeek}
                  className="p-2 hover:bg-slate-50 border-r border-slate-200"
                >
                  <ChevronLeft size={18} />
                </button>
                <button onClick={nextWeek} className="p-2 hover:bg-slate-50">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:mr-3">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-100 leading-snug">
              Weekly Shift Details
            </h2>
            <span className="w-fit text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">
              {filteredSchedules.length} shifts this week
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredSchedules.length > 0 ? (
              filteredSchedules
                .sort((a, b) => new Date(a.workDate) - new Date(b.workDate))
                .map((shift) => (
                  <div
                    key={shift.clientBookingId}
                    className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                          {format(parseISO(shift.workDate), "EEEE, MMM d")}
                        </p>
                        <h3 className="mt-1 text-sm sm:text-md font-bold text-slate-900 wrap-break-words">
                          {shift.facilitiesName}
                        </h3>
                        <p className="text-xs text-slate-500 wrap-break-words">
                          {shift.jobCode}
                        </p>
                      </div>
                      <span
                        className={`h-fit w-fit px-2.5 py-1 rounded-full text-[10px] font-bold ring-1 ring-inset ${badgeClasses(
                          shift.status
                        )}`}
                      >
                        {shift.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
                      <div className="flex items-start gap-2 wrap-break-words">
                        <span>⏰</span>
                        <span>
                          {shift.scheduledStartTime} - {shift.scheduledEndTime}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 wrap-break-words">
                        <span>📍</span>
                        <span>{shift.workLocation}</span>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-1 md:col-span-2 py-12 sm:py-16 text-center">
                <div className="text-4xl sm:text-5xl mb-3">🍃</div>
                <p className="text-slate-50 text-xl sm:text-2xl font-medium">
                  No shifts scheduled for this week.
                </p>
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
