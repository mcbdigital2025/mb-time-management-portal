"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api';
import ViewEmployeesSkeleton from "../components/loaders/ViewEmployeesSkeleton";

const STATUS_OPTIONS = ["Active", "Inactive"];

// Add the industry options matching your SQL ENUM
const INDUSTRY_OPTIONS = [
  'NDIS/Age Care',
  'Online Learning',
  'Security Guard',
  'Healthcare & Wellness',
  'Professional Services',
  'Field Services',
  'Education & Training',
  'Specialized Transport'
];

const EditCompany = () => {
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedCompany = sessionStorage.getItem("editCompany");

    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    if (!storedCompany) {
      setError("No company data found in session storage. Redirecting to company list.");
      setTimeout(() => {
        router.replace("/company");
      }, 500);
      return;
    }

    const parsed = JSON.parse(storedCompany);
    // Keep as BigInt for precision
    parsed.companyId = BigInt(parsed.companyId);

    if (!parsed.status) parsed.status = "Active";
    // Ensure a default industryType if it's missing from the session data
    if (!parsed.industryType) parsed.industryType = INDUSTRY_OPTIONS[0];

    setForm(parsed);
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccessMessage(null);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Please log in again.");
      return;
    }

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/company/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(form, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
          ),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      setSuccessMessage("Company updated successfully!");
      setTimeout(() => {
        router.push("/company");
      }, 1500);
    } catch (err) {
      setError("Error updating company: " + err.message);
    }
  };

  if (error) {
    return <div className="text-red-500 h-screen text-center mt-10">Error: {error}</div>;
  }

  if (!form) {
    return <div className="text-center mt-10"><ViewEmployeesSkeleton/></div>;
  }

  return (
    <div className="hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white/20 backdrop-blur-xl shadow-[0_10px_10px_rgba(0,0,0,0.15)] rounded-xl ">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Company</h2>

        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <div className="space-y-4">
          <Field label="Company Code:" name="companyCode" value={form.companyCode} onChange={handleChange} />
          <Field label="Company Name:" name="companyName" value={form.companyName} onChange={handleChange} />
          <div>
            <label className="block text-sm font-semibold mb-1">Industry Type:</label>
            <select
              name="industryType"
              value={form.industryType || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <Field
            label="Description:"
            name="companyDescription"
            value={form.companyDescription}
            onChange={handleChange}
            isTextArea
          />

          <div>
            <label className="block text-sm font-semibold mb-1">Status:</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <Checkbox label="Client Booking Enabled" name="clientBooking" checked={form.clientBooking} onChange={handleChange} />
          <Checkbox label="Employee Assigned Schedule" name="employeeAssignedSchedule" checked={form.employeeAssignedSchedule} onChange={handleChange} />
          <Checkbox label="Log Daily Note" name="logDailyNote" checked={form.logDailyNote} onChange={handleChange} />
          <Checkbox label="Transport Travel Claim" name="transportTravelClaim" checked={form.transportTravelClaim} onChange={handleChange} />

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => router.push("/company")}
              className="px-4 py-2 bg-[#F75D42] cursor-pointer text-gray-100 font-bold rounded-lg hover:bg-[#f53918]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ... (Rest of component helpers Field and Checkbox)