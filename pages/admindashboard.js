"use client";

import React, { useState, useEffect, useMemo } from "react";
import JSONbig from "json-bigint";
import { toast } from "react-toastify";
import {
  format, startOfMonth, endOfMonth, addMonths, subMonths,
  isWithinInterval, parseISO
} from "date-fns";
import { StatCard } from "../components/StatCard";
import EmployeeProfileSkeleton from "../components/loaders/EmployeeProfileSkeleton";
import { authenticatedFetch } from "../utils/api";
import { ChevronLeft, ChevronRight, Calendar, Users, Briefcase } from "lucide-react";

const AdminDashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Real Data State
  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]); // Store real employee objects
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (!user?.companyId) return;

    const loadAdminData = async () => {
      setLoading(true);
      try {
        const companyId = user.companyId.toString();

        // Fetching schedules and the master employee list
        const [schedRes, empRes, clientRes] = await Promise.all([
          authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/${companyId}`),
          authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/${companyId}`),
          authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/${companyId}`)
        ]);

        if (schedRes.ok && empRes.ok && clientRes.ok) {
          const schedData = JSONbig.parse(await schedRes.text());
          const empData = JSONbig.parse(await empRes.text());
          const clientData = JSONbig.parse(await clientRes.text());

          setSchedules(Array.isArray(schedData) ? schedData : []);
          setEmployees(Array.isArray(empData) ? empData : []);
          setClients(Array.isArray(clientData) ? clientData : []);
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

  // --- Helper: Match EmployeeId to Name ---
  const getEmployeeName = (empId) => {
    if (!empId) return "Unassigned";
    // Find employee in the master list where employeeId matches
    const emp = employees.find(e => e.employeeId.toString() === empId.toString());
    return emp ? `${emp.firstName} ${emp.lastName}` : `ID: ${empId}`;
  };

  // Filter schedules for the current navigation month
  const monthlySchedules = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return schedules.filter((s) => {
      const scheduleDate = parseISO(s.workDate);
      return isWithinInterval(scheduleDate, { start, end });
    });
  }, [schedules, currentMonth]);

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED": return "bg-emerald-100 text-emerald-700 ring-emerald-600/20";
      case "SCHEDULED": return "bg-blue-100 text-blue-700 ring-blue-600/20";
      case "POSTPONE": return "bg-amber-100 text-amber-700 ring-amber-600/20";
      case "CANCELED": return "bg-red-100 text-red-700 ring-red-600/20";
      default: return "bg-slate-100 text-slate-700 ring-slate-600/20";
    }
  };

  if (loading) return <div className="p-10"><EmployeeProfileSkeleton /></div>;

  return (
    <div className="min-h-screen w-full bg-slate-50 py-6 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">

        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Admin Command Centre</h1>

          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft size={20}/></button>
            <span className="font-bold text-slate-700 min-w-[120px] text-center">{format(currentMonth, "MMMM yyyy")}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight size={20}/></button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Employees" value={employees.length} subtitle="Active workforce" />
          <StatCard title="Active Clients" value={clients.length} subtitle="Service contracts" />
          <StatCard title="Monthly Bookings" value={monthlySchedules.length} subtitle={format(currentMonth, "MMM yyyy")} />
          <StatCard title="Issues" value={monthlySchedules.filter(s => s.status === 'CANCELED').length} subtitle="Canceled shifts" />
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 overflow-hidden">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Workforce Roster</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 text-center">Date</th>
                  <th className="pb-3">Client / Facility</th>
                  <th className="pb-3">Assigned Staff</th> {/* Logic applied here */}
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {monthlySchedules.map((booking) => (
                  <tr key={booking.clientBookingId} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 text-sm font-medium text-slate-600 text-center">
                      {format(parseISO(booking.workDate), "dd MMM")}
                    </td>
                    <td className="py-4">
                      <div className="font-semibold text-slate-900">{booking.clientId}</div>
                      <div className="text-xs text-slate-400">{booking.facilitiesName}</div>
                    </td>

                    {/* ASSIGNED STAFF COLUMN FIX */}
                    <td className="py-4">
                      <div className="text-sm font-bold text-slate-900">
                        {getEmployeeName(booking.employeeId)}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">
                         {booking.scheduledStartTime} - {booking.scheduledEndTime}
                      </div>
                    </td>

                    <td className="py-4 text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {monthlySchedules.length === 0 && (
              <div className="text-center py-20 text-slate-400 italic">No bookings scheduled for this month.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;