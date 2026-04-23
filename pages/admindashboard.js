"use client";

import {
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
  subWeeks,
} from "date-fns";
import JSONbig from "json-bigint";
import {
  Bell,
  Briefcase,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  LayoutDashboard,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";
import ViewEmployeesSkeleton from "../components/loaders/ViewEmployeesSkeleton";
import { authenticatedFetch } from "../utils/api";

import { useEffect, useMemo, useState } from "react";
import ViewEmployees from "./viewemployees";

const AdminDashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [section, setSection] = useState("dashboard");

  useEffect(() => {
    if (!user?.companyId) return;

    const loadAdminData = async () => {
      setLoading(true);
      try {
        const companyId = user.companyId.toString();

        const [schedRes, empRes, clientRes] = await Promise.all([
          authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/${companyId}`,
          ),
          authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/${companyId}`,
          ),
          authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/${companyId}`,
          ),
        ]);

        if (schedRes.ok && empRes.ok && clientRes.ok) {
          const schedData = JSONbig.parse(await schedRes.text());
          const empData = JSONbig.parse(await empRes.text());
          const clientData = JSONbig.parse(await clientRes.text());

          setSchedules(Array.isArray(schedData) ? schedData : []);
          setEmployees(Array.isArray(empData) ? empData : []);
          setClients(Array.isArray(clientData) ? clientData : []);
        } else {
          toast.error("Failed to load dashboard data.");
        }
      } catch (err) {
        console.error("Admin Fetch Error:", err);
        toast.error("Error connecting to data services.");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user]);

  const getClientName = (clientId) => {
    const client = clients.find(
      (c) => c.clientId.toString() === clientId.toString(),
    );
    return client ? client.name : `ID: ${clientId}`;
  };

  const getEmployeeName = (empId) => {
    if (!empId) return "Unassigned";
    const emp = employees.find(
      (e) => e.employeeId.toString() === empId.toString(),
    );
    return emp ? `${emp.firstName} ${emp.lastName}` : `ID: ${empId}`;
  };

  const weekRangeLabel = useMemo(() => {
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return `${format(currentWeekStart, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  }, [currentWeekStart]);

  const weeklySchedules = useMemo(() => {
    const start = currentWeekStart;
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    return schedules.filter((s) => {
      const scheduleDate = parseISO(s.workDate);
      return isWithinInterval(scheduleDate, { start, end });
    });
  }, [schedules, currentWeekStart]);

  const monthlySchedules = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return schedules.filter((s) => {
      const scheduleDate = parseISO(s.workDate);
      return isWithinInterval(scheduleDate, { start, end });
    });
  }, [schedules, currentMonth]);

  const canceledCount = weeklySchedules.filter(
    (s) => s.status?.toUpperCase() === "CANCELED",
  ).length;

  const completedCount = weeklySchedules.filter(
    (s) => s.status?.toUpperCase() === "COMPLETED",
  ).length;

  const scheduledCount = weeklySchedules.filter(
    (s) => s.status?.toUpperCase() === "SCHEDULED",
  ).length;

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "SCHEDULED":
        return "bg-sky-50 text-sky-700 ring-sky-200";
      case "POSTPONE":
        return "bg-amber-50 text-amber-700 ring-amber-200";
      case "CANCELED":
        return "bg-rose-50 text-rose-700 ring-rose-200";
      default:
        return "bg-slate-100 text-slate-700 ring-slate-200";
    }
  };

  const filteredSchedules = useMemo(() => {
    if (!searchTerm.trim()) return weeklySchedules;

    const term = searchTerm.toLowerCase();

    return monthlySchedules.filter((booking) => {
      const clientName = getClientName(booking?.clientId)?.toLowerCase();
      const employeeName = getEmployeeName(booking?.employeeId)?.toLowerCase();

      return clientName?.includes(term) || employeeName?.includes(term);
    });
  }, [weeklySchedules, searchTerm, employees, clients]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-[#008080] px-5 py-6 text-white lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold">
              M
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">
                ADMIN DASHBOARD
              </p>
              <p className="text-xs text-white/70">Admin Workspace</p>
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={section === "dashboard"}
              onClick={() => setSection("dashboard")}
            />

            <SidebarItem
              icon={Users}
              label="Employees"
              active={section === "employees"}
              onClick={() => setSection("employees")}
            />

            <SidebarItem
              icon={CalendarDays}
              label="Schedules"
              active={section === "schedules"}
              onClick={() => setSection("schedules")}
            />

            <SidebarItem
              icon={Briefcase}
              label="Clients"
              active={section === "clients"}
              onClick={() => setSection("clients")}
            />
            <SidebarItem
              icon={CircleAlert}
              label="Reports"
              active={section === "reports"}
              onClick={() => setSection("reports")}
            />
            <SidebarItem
              icon={Settings}
              label="Settings"
              active={section === "settings"}
              onClick={() => setSection("settings")}
            />
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm font-semibold">
              {user?.firstName || "Admin"} {user?.lastName || ""}
            </p>
            <p className="mt-1 text-xs text-white/70">
              {user?.email || "Signed in"}
            </p>
          </div>
        </aside>

        {/* Main content */}

        {loading ? (
          <div className="p-10">
            <ViewEmployeesSkeleton />
          </div>
        ) : (
          <main className="flex-1 hero-radial-background">
            {/* Top bar */}
            <div className="border-b border-slate-200  px-4 py-4 pb-0 backdrop-blur md:px-6 xl:px-8">
              <div className="flex flex-row gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Admin Command Centre
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Monitor workforce activity, client coverage, and bookings.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <Search size={16} className="text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by client or staff..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 sm:w-56"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="rounded-2xl border border-slate-200 bg-white p-2.5 hover:bg-slate-50">
                      <Bell size={18} className="text-slate-600" />
                    </button>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ede9fe] text-sm font-semibold text-[#6d5bd0]">
                        {(user?.firstName?.[0] || "A").toUpperCase()}
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800">
                          {user?.firstName || "Admin"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {user?.email || "Dashboard user"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-3 xl:p-3">
              {section === "dashboard" && (
                <>
                  {/* Dashboard hero / controls */}
                  <section className="mb-6 rounded-[28px] bg-linear-to-r from-[#008080] to-[#014e4e] px-5 py-3 text-white shadow-sm md:px-6">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                      <div>
                        <p className="text-sm text-white/80">Overview</p>
                        <h2 className="mt-1 text-2xl font-bold">
                          Weekly operations snapshot
                        </h2>
                      </div>

                      <div className="flex items-center justify-end gap-3 rounded-2xl bg-white/10 p-2 backdrop-blur">
                        <button
                          onClick={() =>
                            setCurrentWeekStart((prev) => subWeeks(prev, 1))
                          }
                          className="rounded-xl bg-white/10 p-2 hover:bg-white/20 cursor-pointer"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <span className="min-w-35 text-center text-sm font-semibold">
                          {weekRangeLabel}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentWeekStart((prev) => addWeeks(prev, 1))
                          }
                          className="rounded-xl bg-white/10 p-2 hover:bg-white/20 cursor-pointer"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Stats */}
                  <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardMetric
                      title="Total Employees"
                      value={employees.length}
                      subtitle="Active workforce"
                      icon={<Users size={18} />}
                    />
                    <DashboardMetric
                      title="Active Clients"
                      value={clients.length}
                      subtitle="Service contracts"
                      icon={<Briefcase size={18} />}
                    />
                    <DashboardMetric
                      title="Weekly Bookings"
                      value={weeklySchedules.length}
                      subtitle="Current week"
                      // subtitle={format(currentMonth, "MMM yyyy")}
                      icon={<CalendarDays size={18} />}
                    />
                    <DashboardMetric
                      title="Canceled Shifts"
                      value={canceledCount}
                      subtitle="Needs attention"
                      icon={<CircleAlert size={18} />}
                    />
                  </section>

                  {/* Secondary info row */}
                  <section className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            Workforce Roster
                          </h3>

                          <p className="text-sm text-slate-500">
                            Current week schedules and employee assignments
                          </p>
                        </div>
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {filteredSchedules.length} records
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-180 text-left">
                          <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                              <th className="pb-4 pr-4 text-center">Date</th>
                              <th className="pb-4 pr-4">Client / Facility</th>
                              <th className="pb-4 pr-4">Assigned Staff</th>
                              <th className="pb-4 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredSchedules.map((booking) => (
                              <tr
                                key={booking.clientBookingId}
                                className="transition hover:bg-slate-50"
                              >
                                <td className="py-4 pr-4 text-center">
                                  <div className="inline-flex min-w-[15.5 flex-col rounded-2xl bg-slate-50 px-3 py-2">
                                    <span className="text-sm font-bold text-slate-900">
                                      {format(parseISO(booking.workDate), "dd")}
                                    </span>
                                    <span className="text-[11px] uppercase tracking-wide text-slate-500">
                                      {format(
                                        parseISO(booking.workDate),
                                        "MMM",
                                      )}
                                    </span>
                                  </div>
                                </td>

                                <td className="py-4 pr-4">
                                  <div className="font-semibold text-slate-900">
                                    {booking.clientId}
                                  </div>
                                  <div className="mt-1 text-xs text-slate-500">
                                    {booking.facilitiesName}
                                  </div>
                                </td>

                                <td className="py-4 pr-4">
                                  <div className="font-medium text-slate-900">
                                    {getEmployeeName(booking.employeeId)}
                                  </div>
                                  <div className="mt-1 text-xs text-slate-500">
                                    {booking.scheduledStartTime} -{" "}
                                    {booking.scheduledEndTime}
                                  </div>
                                </td>

                                <td className="py-4 text-right">
                                  <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${getStatusStyle(
                                      booking.status,
                                    )}`}
                                  >
                                    {booking.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {weeklySchedules.length === 0 && (
                          <div className="py-16 text-center text-sm italic text-slate-400">
                            No bookings scheduled for this week.
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </>
              )}

              {section === "schedules" && <div>Schedules section</div>}

              {section === "employees" && <ViewEmployees />}

              {section === "clients" && <div>Clients section</div>}
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

function SidebarItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition cursor-pointer ${
        active
          ? "bg-white text-[#5a49c6] shadow-sm"
          : "text-white/85 hover:bg-white/10"
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );
}

function DashboardMetric({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3f0ff] text-[#6d5bd0]">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
