"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';
import { dummyJobs, dummyJobTypes } from "../utils/data";
import ReusableTable from "../components/ReusableTable";

const jobColumns = [
  { header: "Job ID", render: (job) => job?.jobId?.toString?.() ?? "N/A" },
  { header: "Job Code", render: (job) => job?.jobCode ?? "-" },
  { header: "Job Type", render: (job) => job?.jobType ?? "-" },
  { header: "Company ID", render: (job) => job?.companyId ?? "-" },
  { header: "Rates Per Hour", render: (job) => job?.ratesPerHour ?? "-" },
  { header: "Discount 1", render: (job) => job?.discount1 ?? "0.00" },
  { header: "Discount 2", render: (job) => job?.discount2 ?? "0.00" },
  { header: "Employee %", render: (job) => job?.employeePercent ?? "0.00%" },
  { header: "Currency", render: (job) => job?.currency ?? "-" }
]

const jobActions = [
  {
    label: "Update",
    icon: "edit",
    variant: "primary",
    showLabel: true,
    onClick: (job) => {
      setSelectedJob(job);
      localStorage.setItem("selectedJob", JSONbig.stringify(job));
      router.push("/updateJob");
    },

  },
  {
    label: "Remove",
    icon: "trash",
    variant: "danger",
    showLabel: false,
    onClick: (emp) => {
      setSelectedEmployee(emp);
      sessionStorage.setItem("editEmployee", JSON.stringify(emp));
      handleRemove();
    },
  },
];

const Job = () => {
  const [jobs, setJobs] = useState(dummyJobs || []); // Start with dummy data for immediate display
  const [jobTypes, setJobTypes] = useState(dummyJobTypes || []);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const router = useRouter();

  // 1. Initial Load: Fetch Job Types
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.companyId) {
      setError("User information or token is missing. Redirecting to login.");
      // setTimeout(() => router.replace("/login"), 500);
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

    // fetchJobTypes();
  }, []);

  // 2. Trigger fetchJobs whenever selectedJobType changes
  useEffect(() => {
    if (selectedJobType) {
      // fetchJobs(selectedJobType);
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
  <div className="relative min-h-[90vh] w-full overflow-x-hidden hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] px-3 sm:px-4 md:px-6 py-6 md:py-10 flex flex-col items-center gap-5">

    {/* decorative blobs */}
    <div className="pointer-events-none absolute top-10 left-6 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-300 opacity-20 rounded-full blur-3xl" />
    <div className="pointer-events-none absolute bottom-10 right-6 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 bg-teal-300 opacity-20 rounded-full blur-3xl" />
    <div className="pointer-events-none absolute top-1/2 left-1/3 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-300 opacity-10 rounded-full blur-3xl" />

    {/* page container */}
    <div className="w-full max-w-7xl">
      {/* top bar */}
      <div className="bg-white/80 backdrop-blur-sm w-full rounded-xl shadow-lg px-4 sm:px-6 md:px-8 py-4 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Job Management</h1>

        <div className="w-full md:w-105">
          <label className="font-semibold text-sm sm:text-base mr-2 block md:inline">
            Select Job Type:
          </label>
          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            className="mt-2 md:mt-0 border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            {jobTypes.length > 0 ? (
              jobTypes.map((job, index) => (
                <option key={job?.jobId?.toString() || index} value={job.jobType}>
                  {job.jobType} {job.jobCode ? `— ${job.description}` : ""}
                </option>
              ))
            ) : (
              <option value="">Loading types...</option>
            )}
          </select>
        </div>
      </div>

      {/* list card */}
      <div className="rounded-xl shadow-lg py-3 px-2 sm:px-4 md:px-6 my-4 bg-white">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <div className="font-bold text-lg sm:text-xl md:text-2xl">
            Job List for {selectedJobType}
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end">
            <button
              className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-[#008080] text-white hover:bg-teal-700 transition"
            >
              + Add New Job
            </button>
          </div>
        </div>

        {jobs.length === 0 ? (
          <p className="text-gray-500 italic p-4">No jobs available for this type.</p>
        ) : (
          <ReusableTable
            data={jobs}
            columns={jobColumns}
            actions={jobActions}
            getRowKey={(job, idx) => job?.jobId?.toString?.() || idx}
            onRowClick={(job) => setSelectedJob(job)}
            isRowSelected={(job) => selectedJob?.jobId === job.jobId}
            footerLeft={`Showing ${jobs.length} records`}
            footerRight=""
          />
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  </div>
);
};

export default Job;