"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const JOB_TYPES = [
  "Course", "Support", "Service", "Assessment", "Planning", "Transport",
  "Administration", "Community Engagement", "Supervision",
  "Technology Support", "Consultation"
];

const UpdateJob = () => {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success messages

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedJob = localStorage.getItem("selectedJob");
    let parsedUser = null;

    if (storedUser) {
      parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    // ✅ Check for user and JWT token immediately on load
    if (!parsedUser || !parsedUser.jwtToken) {
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    if (storedJob) {
      setJob(JSON.parse(storedJob));
    } else {
      setError("Job data not found in session storage. Redirecting to job list.");
      setTimeout(() => {
        router.push("/job"); // Redirect if no job is selected
      }, 500);
    }
  }, []); // Empty dependency array as user and job are accessed inside the effect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: name.includes("rates") || name === "employeePercentage" ? parseFloat(value) : value,
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

    if (!job) { // Ensure job data is loaded before attempting to save
        setError("Job data is not loaded. Cannot save.");
        return;
    }

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/job/update`, // Assuming API expects job object in body for update
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(job), // Send the job object as the body
          // ✅ Removed credentials: "include"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update job:", response.status, response.statusText, errorText);
        throw new Error(`Failed to update job: ${response.status} ${response.statusText} - ${errorText}`);
      }

      setSuccessMessage("Job updated successfully!");
      setTimeout(() => {
        router.push("/job");
      }, 1500); // Give user a moment to see the success message
    } catch (err) {
      console.error("Error updating job:", err);
      setError(err.message || "An unexpected error occurred.");
      // If fetching fails due to token issues (e.g., token expired/invalid),
      // consider redirecting to login after a delay.
      if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
           setTimeout(() => {
               router.replace("/login");
           }, 1500);
      }
    }
  };

  const handleCancel = () => {
    router.push("/job");
  };

  if (error) {
    return <div className="p-6 text-red-600 font-semibold">{error}</div>;
  }

  if (!job) {
    return <div className="p-6 text-blue-600 font-semibold">Loading job data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-50 rounded shadow space-y-6">
      <h1 className="text-2xl font-bold mb-4">Update Job</h1>

      {successMessage && <div className="text-green-600 font-semibold mb-4">{successMessage}</div>}
      {/* Error message is already handled by the `if (error)` block above */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold">Job ID (Read Only)</label>
          <input
            type="text"
            value={job.jobId}
            readOnly
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold">Company ID (Read Only)</label>
          <input
            type="text"
            value={job.companyId}
            readOnly
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold">Job Code</label>
          <input
            type="text"
            name="jobCode"
            value={job.jobCode}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Job Type</label>
          <select
            name="jobType"
            value={job.jobType}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Rates Per Hour</label>
          <input
            type="number"
            name="ratesPerHour"
            step="0.01"
            value={job.ratesPerHour}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Discount 1</label>
          <input
            type="number"
            name="ratesPerHourDiscount_1"
            step="0.01"
            value={job.ratesPerHourDiscount_1}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Discount 2</label>
          <input
            type="number"
            name="ratesPerHourDiscount_2"
            step="0.01"
            value={job.ratesPerHourDiscount_2}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Employee %</label>
          <input
            type="number"
            name="employeePercentage"
            step="0.01"
            value={job.employeePercentage}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Currency</label>
          <input
            type="text"
            name="currency"
            value={job.currency}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateJob;
