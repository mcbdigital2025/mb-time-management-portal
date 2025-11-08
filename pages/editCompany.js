"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const STATUS_OPTIONS = ["Active", "Inactive"];

const EditCompany = () => {
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Changed from 'success' to 'successMessage' for clarity
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedCompany = sessionStorage.getItem("editCompany");

    // ✅ Check for user and JWT token immediately on load
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
    parsed.companyId = BigInt(parsed.companyId); // Keep as BigInt

    // Ensure fallback status if undefined
    if (!parsed.status) parsed.status = "Active";

    setForm(parsed);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    // Re-check user and token before submitting
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Please log in again.");
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
      return;
    }

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/company/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // Good practice to include Accept header
          },
          body: JSON.stringify(form, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
          ),
          // ✅ Removed credentials: "include"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update company:", response.status, response.statusText, errorText);
        throw new Error(`Update failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      setSuccessMessage("Company updated successfully!");
      setTimeout(() => {
        router.push("/company");
      }, 1500); // Give user a moment to see the success message
    } catch (err) {
      console.error("Error updating company:", err);
      setError("Error updating company: " + err.message);
      // If fetching fails due to token issues (e.g., token expired/invalid),
      // consider redirecting to login after a delay.
      if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
           setTimeout(() => {
               router.replace("/login");
           }, 1500);
      }
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  if (!form) {
    return <div className="text-center mt-10">Loading company data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Company</h2>

      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      {/* Error message is already handled by the `if (error)` block above */}

      <div className="space-y-4">
        <Field
          label="Company Code:"
          name="companyCode"
          value={form.companyCode}
          onChange={handleChange}
        />
        <Field
          label="Company Name:"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
        />
        <Field
          label="Description:"
          name="companyDescription"
          value={form.companyDescription}
          onChange={handleChange}
          isTextArea
        />

        {/* ✅ Status Dropdown */}
        <div>
          <label className="block text-sm font-semibold mb-1">Status:</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <Checkbox
          label="Client Booking Enabled"
          name="clientBooking"
          checked={form.clientBooking}
          onChange={handleChange}
        />
        <Checkbox
          label="Employee Assigned Schedule"
          name="employeeAssignedSchedule"
          checked={form.employeeAssignedSchedule}
          onChange={handleChange}
        />
        <Checkbox
          label="Log Daily Note"
          name="logDailyNote"
          checked={form.logDailyNote}
          onChange={handleChange}
        />
        <Checkbox
          label="Transport Travel Claim"
          name="transportTravelClaim"
          checked={form.transportTravelClaim}
          onChange={handleChange}
        />

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => router.push("/company")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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
  );
};

const Field = ({ label, name, value, onChange, isTextArea = false }) => (
  <div>
    <label className="block text-sm font-semibold mb-1">{label}</label>
    {isTextArea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full border px-3 py-2 rounded resize-y"
      />
    ) : (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded"
      />
    )}
  </div>
);

const Checkbox = ({ label, name, checked, onChange }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="mr-2"
    />
    <label className="text-sm">{label}</label>
  </div>
);

export default EditCompany;
