"use client";

import React, { useMemo } from "react";
import { StatCard } from "../components/StatCard";
// Assuming you have a generic Header/Overview component
import LandingOverview from "../components/LandingOverview";

/**
 * MOCK DATA: In a real app, this would be fetched from
 * endpoints like /api/admin/dashboard-stats
 */
const mockDashboardData = {
  stats: [
    { title: "Total Employees", value: 42, subtitle: "Across 4 Departments" },
    { title: "Active Clients", value: 128, subtitle: "MCBTimeSheetSystem" },
    { title: "Today's Bookings", value: 18, subtitle: "6 In Progress" },
    { title: "Compliance Alerts", value: 5, subtitle: "Expired Qualifications" },
  ],
  recentBookings: [
    { id: 101, client: "John Doe", employee: "Sarah Smith", time: "09:00 - 11:00", status: "COMPLETED", location: "Onsite" },
    { id: 102, client: "Alice Johnson", employee: "Mike Ross", time: "13:00 - 15:00", status: "SCHEDULED", location: "Remote" },
    { id: 103, client: "Robert Brown", employee: "Sarah Smith", time: "15:30 - 17:30", status: "IN_PROGRESS", location: "Onsite" },
  ],
  alerts: [
    { id: "a1", type: "Qualification", entity: "Mike Ross", message: "First Aid Certificate expires in 3 days", severity: "High" },
    { id: "a2", type: "Incident", entity: "John Doe", message: "Low severity incident reported yesterday", severity: "Medium" },
    { id: "a3", type: "Compliance", entity: "Tech Services", message: "Department audit due", severity: "Low" },
  ]
};

const AdminDashboard = ({ user }) => {
  const today = useMemo(() => new Date().toLocaleDateString("en-AU"), []);

  // Helper for status colors based on schema ENUMS
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED": return "bg-emerald-100 text-emerald-700 ring-emerald-600/20";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700 ring-blue-600/20";
      case "SCHEDULED": return "bg-amber-100 text-amber-700 ring-amber-600/20";
      default: return "bg-gray-100 text-gray-700 ring-gray-600/20";
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 py-6 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Admin Command Centre</h1>
          <p className="text-slate-500">System: MCBTimeSheetSystem | {today}</p>
        </header>

        {/* 1. Global Stats - derived from Company/Employee/Client tables */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mockDashboardData.stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* 2. Scheduling Oversight - from ClientBookingSchedule */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Workforce Schedule</h2>
              <button className="text-sm font-medium text-blue-600 hover:underline">View All Roster</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Assigned Staff</th>
                    <th className="pb-3">Time / Location</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockDashboardData.recentBookings.map((booking) => (
                    <tr key={booking.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-medium text-slate-900">{booking.client}</td>
                      <td className="py-4 text-slate-600">{booking.employee}</td>
                      <td className="py-4 text-slate-500 text-sm">
                        {booking.time} <br />
                        <span className="text-xs text-slate-400">{booking.location}</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Alerts & Compliance - from IncidentReport & EmployeeQualification */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Critical Alerts</h2>
            <div className="space-y-4">
              {mockDashboardData.alerts.map((alert) => (
                <div key={alert.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    alert.severity === "High" ? "bg-red-500" : alert.severity === "Medium" ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">{alert.type}</p>
                    <p className="text-sm font-semibold text-slate-900">{alert.entity}</p>
                    <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 px-4 rounded-xl border border-dashed border-slate-300 text-sm font-medium text-slate-500 hover:bg-slate-50 transition">
              Run Compliance Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;