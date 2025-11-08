"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const JOB_TYPES = [
  "Course", "Support", "Service", "Assessment", "Planning", "Transport",
  "Administration", "Community Engagement", "Supervision",
  "Technology Support", "Consultation"
];

const CreateJob = () => {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success messages

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let parsedUser = null;

    if (storedUser) {
      parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    // ✅ Check for user and JWT token immediately on load
    if (!parsedUser || !parsedUser.companyId || !parsedUser.jwtToken) {
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    // Initialize job state with companyId from parsedUser
    setJob({
      jobId: "", // Optional; can be generated on server
      companyId: parsedUser.companyId, // Use companyId from parsedUser
      jobCode: "",
      jobType: "Course",
      ratesPerHour: 0,
      ratesPerHourDiscount_1: 0,
      ratesPerHourDiscount_2: 0,
      employeePercentage: 0,
      currency: "AUD",
    });

  }, []); // Empty dependency array as user is accessed inside the effect

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
    if (!user || !user.companyId || !user.jwtToken) {
      setError("Company ID or user token is missing. Please log in again.");
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
      return;
    }

    // Basic validation for required fields before sending
    if (!job.jobId || !job.jobCode || !job.jobType || !job.companyId) {
        setError("Job ID, Job Code, Job Type, and Company ID are required.");
        return;
    }

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      // Ensure jobId and companyId are part of the URL query parameters if your API expects them there,
      // otherwise, they should be part of the JSON body. Assuming they are in the body based on original code.
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/job/create`,
        {
          method: "POST",
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
        console.error("Failed to create job:", response.status, response.statusText, errorText);
        throw new Error(`Failed to create job: ${response.status} ${response.statusText} - ${errorText}`);
      }

      setSuccessMessage("Job created successfully!");
      setTimeout(() => {
        router.push("/job");
      }, 1500); // Give user a moment to see the success message
    } catch (err) {
      console.error("Error creating job:", err);
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

  if (!job) {
    return <div className="p-6 text-red-600 font-semibold">{error || "Loading job creation form..."}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-50 rounded shadow space-y-6">
      <fieldset className="border border-gray-300 rounded p-5">
        <legend className="text-lg font-semibold px-2">Create Job</legend>

        {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}
        {successMessage && <div className="text-green-600 font-semibold mb-4">{successMessage}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block font-semibold">Company ID</label>
             <input
               type="text"
               name="companyId"
               value={job.companyId}
               readOnly
               className="w-full border rounded p-2 bg-gray-100"
             />
          </div>
          <div>
            <label className="block font-semibold">Job ID</label>
            <input
              type="text"
              name="jobId"
              value={job.jobId}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required // Added required
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
              required // Added required
            />
          </div>
          <div>
            <label className="block font-semibold">Job Type</label>
            <select
              name="jobType"
              value={job.jobType}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required // Added required
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
      </fieldset>

      <div className="flex gap-4 mt-4">
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

export default CreateJob;
