"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTypes, setJobTypes] = useState([]); // Dynamic state for remote job types
  const [selectedJobType, setSelectedJobType] = useState(""); // Track selected type
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.companyId) {
      setError("User information or token is missing. Redirecting to login.");
      setTimeout(() => router.replace("/login"), 500);
      return;
    }

    // ✅ 1. Fetch Job Types from remote API
    const fetchJobTypes = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/jobType/${user.companyId}`
        );
        if (response.ok) {
          const text = await response.text();
          const data = JSONbig.parse(text);

          // Assuming the API returns a list of Job objects.
          // We extract unique job types or codes for the dropdown.
          setJobTypes(data);

          // Set initial selection if data exists
          if (data.length > 0) {
            setSelectedJobType(data[0].jobType || data[0].jobId);
          }
        } else {
          setError("Failed to fetch job types from the server.");
        }
      } catch (err) {
        console.error("Error fetching job types:", err);
        setError("Network error fetching job types.");
      }
    };

    fetchJobTypes();
    fetchJobs(); // Existing fetch for the table
  }, []);

  const fetchJobs = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/job/${user.companyId}`
      );
      if (response.ok) {
        const text = await response.text();
        setJobs(JSONbig.parse(text));
      }
    } catch (err) {
      setError("Error fetching jobs list.");
    }
  };

  const handleJobTypeChange = (e) => {
    setSelectedJobType(e.target.value);
  };

  const handleDelete = async () => {
    // ... existing delete logic using authenticatedFetch ...
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Job Management</h1>

      {/* ✅ REPLACED JOB_TYPES MAP WITH DYNAMIC REMOTE DATA */}
      <div className="mb-6">
        <label className="font-semibold mr-2">Select Job Type:</label>
        <select
          value={selectedJobType}
          onChange={handleJobTypeChange}
          className="border border-gray-300 rounded px-2 py-1 bg-white shadow-sm"
        >
          {jobTypes.length > 0 ? (
            jobTypes.map((job) => (
              <option key={job.jobId.toString()} value={job.jobType}>
                {job.jobType} — {job.jobCode}
              </option>
            ))
          ) : (
            <option>Loading types...</option>
          )}
        </select>
      </div>

      <fieldset className="border border-gray-300 rounded p-4 mb-6 bg-white shadow">
        <legend className="font-bold px-2">Job List</legend>
        {jobs.length === 0 ? (
          <p className="text-gray-500 italic">No jobs available for this company.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-2">Job ID</th>
                <th className="border p-2">Job Code</th>
                <th className="border p-2">Job Type</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.jobId.toString()}
                  className={`cursor-pointer hover:bg-blue-50 ${
                    selectedJob?.jobId === job.jobId ? "bg-blue-100" : ""
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <td className="border p-2">{job.jobId.toString()}</td>
                  <td className="border p-2">{job.jobCode}</td>
                  <td className="border p-2">{job.jobType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </fieldset>

      <div className="flex gap-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => router.push("/createJob")}>
          Create
        </button>
        <button
          className={`${selectedJob ? "bg-yellow-500" : "bg-gray-300"} text-white px-4 py-2 rounded`}
          disabled={!selectedJob}
          onClick={() => {
            localStorage.setItem("selectedJob", JSONbig.stringify(selectedJob));
            router.push("/updateJob");
          }}
        >
          Update
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => router.push("/home")}>
          Home
        </button>
      </div>

      {error && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
    </div>
  );
};

export default Job;