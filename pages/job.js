"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const router = useRouter();

  // 1. Initial Load: Fetch Job Types
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.companyId) {
      setError("User information or token is missing. Redirecting to login.");
      setTimeout(() => router.replace("/login"), 500);
      return;
    }

    const fetchJobTypes = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/jobType/${user.companyId}`
        );
        if (response.ok) {
          const text = await response.text();
          const data = JSONbig.parse(text);
          setJobTypes(data);

          if (data.length > 0) {
            // Set the first type as default
            setSelectedJobType(data[0].jobType || data[0].description || "");
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
  }, []);

  // 2. Trigger fetchJobs whenever selectedJobType changes
  useEffect(() => {
    if (selectedJobType) {
      fetchJobs(selectedJobType);
    }
  }, [selectedJobType]); // Dependency array ensures this runs when selection changes

  const fetchJobs = async (type) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.companyId || !type) return;

    try {
      // ✅ FIX: Replaced {jobType} with the dynamic 'type' variable
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/job/type/${type}/${user.companyId}`
      );

      if (response.ok) {
        const text = await response.text();
        setJobs(JSONbig.parse(text));
        setSelectedJob(null); // Clear selection when list changes
      } else {
        setJobs([]); // Clear list if no jobs found for this type
      }
    } catch (err) {
      console.error("Error fetching jobs list:", err);
      setError("Error fetching jobs list.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Job Management</h1>

      <div className="mb-6">
        <label className="font-semibold mr-2">Select Job Type:</label>
        <select
          value={selectedJobType}
          onChange={(e) => setSelectedJobType(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {jobTypes.length > 0 ? (
            jobTypes.map((job, index) => (
              <option key={job?.jobId?.toString() || index} value={job.jobType}>
                {job.jobType} {job.jobCode ? `— ${job.jobCode}` : ""}
              </option>
            ))
          ) : (
            <option value="">Loading types...</option>
          )}
        </select>
      </div>

      <fieldset className="border border-gray-300 rounded p-4 mb-6 bg-white shadow">
        <legend className="font-bold px-2">Job List for {selectedJobType}</legend>
        {jobs.length === 0 ? (
          <p className="text-gray-500 italic p-4">No jobs available for this type.</p>
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
              {jobs.map((job, index) => (
                <tr
                  key={job?.jobId?.toString() || index}
                  className={`cursor-pointer hover:bg-blue-50 ${
                    selectedJob?.jobId === job.jobId ? "bg-blue-100" : ""
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <td className="border p-2">{job?.jobId?.toString() || "N/A"}</td>
                  <td className="border p-2">{job.jobCode}</td>
                  <td className="border p-2">{job.jobType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </fieldset>

      <div className="flex gap-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => router.push("/createJob")}>Create</button>
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => router.push("/home")}>Home</button>
      </div>

      {error && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
    </div>
  );
};

export default Job;