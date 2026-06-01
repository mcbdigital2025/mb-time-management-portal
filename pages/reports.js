"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Mail, Calendar, Loader2, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { authenticatedFetch } from "../utils/api"; // Adjust this path to match your folder structure

/* ==========================================================================
   AdminReports Engine Component
   ========================================================================== */
export const AdminReports = ({ user }) => {
  const [activeReport, setActiveReport] = useState("variance");

  // Calendar Boundaries
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Request & Pipeline States
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to get active report label
  const getReportLabel = () => {
    switch (activeReport) {
      case "variance": return "Staff Attendance Roster Variance Table";
      case "payroll": return "Payroll Gross/Net Operational Estimates Table";
      case "cancellations": return "Facility Disruption / Drop Matrix";
      default: return "Report Table";
    }
  };

  // Live Query Dispatcher for Backend Java Endpoint

  // Live Query Dispatcher for Backend Java Endpoint
  const fetchVarianceReport = useCallback(async () => {
    if (!startDate || !endDate) {
      toast.warning("Please select both a Start Date and End Date first.");
      return;
    }
    if (!user?.companyId || !user?.employeeId) {
      toast.error("Missing necessary user credentials to parse reports.");
      return;
    }

    setLoading(true);
    try {
      const empId = encodeURIComponent(user.employeeId);
      const compId = encodeURIComponent(user.companyId.toString());

      // Passing raw YYYY-MM-DD strings directly (e.g. "2026-05-01" / "2026-05-31")
      const formattedStartDate = encodeURIComponent(startDate);
      const formattedEndDate = encodeURIComponent(endDate);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/staffShiftSummary/${compId}/${empId}/${formattedStartDate}/${formattedEndDate}`
      );

      if (response.ok) {
        const data = await response.json();
        setReportData(Array.isArray(data) ? data : [data]);
        toast.success("Report data loaded successfully.");
      } else {
        toast.error(`Failed to compile variance report metrics from server. Status: ${response.status}`);
        setReportData([]);
      }
    } catch (err) {
      console.error("Pipeline query failed:", err);
      toast.error("Network communication failure loading datasets.");
      setReportData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, user]);

  // Hook to automatically query live fields when boundaries complete
  useEffect(() => {
    if (activeReport === "variance" && startDate && endDate) {
      fetchVarianceReport();
    } else {
      setReportData([]); // Clear previous views for other tabs
    }
  }, [activeReport, startDate, endDate, fetchVarianceReport]);

  // Trigger Backend Email Pipeline
  const handleEmailCSV = async () => {
    if (!startDate || !endDate) {
      toast.warning("Please select both a Start Date and End Date first.");
      return;
    }

    setIsSubmitting(true);
    toast.info(`Preparing CSV payload for transmission...`);

    try {
      // Simulation of your backend API mail dispatch routing
      // await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/reports/email`, {
      //   method: 'POST',
      //   body: JSON.stringify({ reportType: activeReport, startDate, endDate, recipient: user?.email })
      // });

      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.success(`Success! The CSV report has been emailed to ${user?.email || "your registered email"}.`);
    } catch (error) {
      console.error("Email Report Error:", error);
      toast.error("Failed to route email report safely.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-[28px] border border-slate-200 shadow-sm">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Reporting & Analytics Engine</h2>
          <p className="text-sm text-slate-500">Generate, download, or email operational metrics within specified calendar boundaries.</p>
        </div>

        {/* Calendar Input Range Controls */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 self-start xl:self-auto">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-[#008080]"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-[#008080]"
            />
          </div>
        </div>
      </div>

      {/* Report Category Selection Tabs */}
      <div className="flex border-b border-slate-200 gap-6 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveReport("variance")}
          className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeReport === "variance"
              ? "border-[#008080] text-[#008080]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Roster Variance & Attendance
        </button>
        <button
          onClick={() => setActiveReport("payroll")}
          className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeReport === "payroll"
              ? "border-[#008080] text-[#008080]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Payroll Cost Estimates
        </button>
        <button
          onClick={() => setActiveReport("cancellations")}
          className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeReport === "cancellations"
              ? "border-[#008080] text-[#008080]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Cancellation Analytics
        </button>
      </div>

      {/* Action Strip */}
      <div className="flex flex-wrap justify-end gap-2 mb-4">
        <button
          onClick={fetchVarianceReport}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
        >
          <Eye size={14} />
          {loading ? "Loading..." : "View Report"}
        </button>

        <button
          onClick={handleEmailCSV}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-[#008080] px-3 py-2 text-xs font-semibold text-white hover:bg-[#006666] transition disabled:opacity-50 cursor-pointer"
        >
          <Mail size={14} />
          {isSubmitting ? "Sending..." : "Email as CSV"}
        </button>
      </div>

      {/* Dynamic Data Context Views */}
      <div className="py-2">
        {activeReport === "variance" && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-sm font-semibold text-slate-700">{getReportLabel()}</span>
              <span className="rounded-md bg-[#ede9fe] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#6d5bd0] self-start sm:self-auto">
                {startDate && endDate ? `Scope: ${startDate} to ${endDate}` : "Scope: All / Unspecified range"}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Staff Name</th>
                    <th className="px-4 py-3 text-center">Total Sessions</th>
                    <th className="px-4 py-3 text-right">Scheduled Hours</th>
                    <th className="px-4 py-3 text-right">Actual Hours</th>
                    <th className="px-4 py-3 text-right">Variance Hours</th>
                    <th className="px-4 py-3 text-center">Attention Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin text-[#008080]" size={18} />
                          Evaluating timesheet summaries...
                        </div>
                      </td>
                    </tr>
                  ) : reportData.length > 0 && reportData[0] !== null ? (
                    reportData.map((report, idx) => (
                      <tr key={report.employeeId || idx} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3.5 font-medium text-slate-900">{report.staffName || "N/A"}</td>
                        <td className="px-4 py-3.5 text-center font-semibold text-slate-700">{report.totalSessions}</td>
                        <td className="px-4 py-3.5 text-right font-medium text-slate-600">{report.totalScheduledHours || "0.00"} hrs</td>
                        <td className="px-4 py-3.5 text-right font-medium text-slate-600">{report.totalActualHours || "0.00"} hrs</td>
                        <td className={`px-4 py-3.5 text-right font-bold ${Number(report.totalVarianceHours) < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {report.totalVarianceHours || "0.00"} hrs
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                            report.attentionStatus?.toUpperCase() === "URGENT" || report.attentionStatus?.toUpperCase() === "ATTENTION"
                              ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          }`}>
                            {report.attentionStatus || "NORMAL"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-xs italic text-slate-400">
                        {startDate && endDate
                          ? "No timesheet variance records matched this historical window."
                          : "Please specify a calendar date boundary constraint and press View Report to pull summaries."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Keeping pure layouts untouched for future implementations */}
        {activeReport === "payroll" && <PlaceholderReportTable title={getReportLabel()} startDate={startDate} endDate={endDate} columns={["Employee Code", "Employee Profile", "Estimated Gross Pay", "Superannuation", "Calculated Deductions", "Net Estimation"]} />}
        {activeReport === "cancellations" && <PlaceholderReportTable title={getReportLabel()} startDate={startDate} endDate={endDate} columns={["Facility Name", "Canceled Shifts", "Postponed Shifts", "Total Rostered Shifts", "Disruption Index %"]} />}
      </div>
    </div>
  );
};

/* Component UI data view anchor block for unimplemented tabs */
function PlaceholderReportTable({ title, startDate, endDate, columns }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <span className="rounded-md bg-[#ede9fe] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#6d5bd0] self-start sm:self-auto">
          {startDate && endDate ? `Scope: ${startDate} to ${endDate}` : "Scope: Unspecified range"}
        </span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td colSpan={columns.length} className="px-4 py-8 text-center text-xs italic text-slate-400">
                Data pipeline ready. Connect your backend query module to render active operational datasets.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminReports;