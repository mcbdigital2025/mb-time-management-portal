"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';
import ReusableTable from "../components/ReusableTable";

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const router = useRouter();

  const jobColumns = [
    { header: "Job ID", render: (job) => job?.jobId?.toString?.() ?? "N/A" },
    { header: "Job Code", render: (job) => job?.jobCode ?? "-" },
    { header: "Job Type", render: (job) => job?.jobType ?? "-" },
    { header: "Rates/Hr", render: (job) => job?.ratesPerHour ?? "-" },
    { header: "Discount 1", render: (job) => job?.discount1 ?? "0.00" },
    { header: "Discount 2", render: (job) => job?.discount2 ?? "0.00" },
    { header: "Employee %", render: (job) => job?.employeePercent ?? "0.00%" },
    { header: "Currency", render: (job) => job?.currency ?? "-" }
  ];

  // Updated actions: Removed "Remove", kept "Update"
  const jobActions = [
    {
      label: "Update",
      icon: "edit",
      variant: "primary",
      showLabel: true,
      onClick: (job) => {
        localStorage.setItem("selectedJob", JSONbig.stringify(job));
        router.push("/updateJob");
      },
    }
  ];

  // 1. Initial Load: Fetch Job Types from API
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.companyId) {
      setError("User session missing. Redirecting...");
      setTimeout(() => router.replace("/login"), 1500);
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
            setSelectedJobType(data[0].jobType || "");
          }
        } else {
          setError("Failed to fetch job types.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Network error fetching job types.");
      }
    };

    fetchJobTypes();
  }, [router]);

  // 2. Fetch Jobs whenever selection changes
  useEffect(() => {
    if (selectedJobType) {
      fetchJobs(selectedJobType);
    }
  }, [selectedJobType]);

  const fetchJobs = async (type) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.companyId || !type) return;

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/job/type/${type}/${user.companyId}`
      );

      if (response.ok) {
        const text = await response.text();
        setJobs(JSONbig.parse(text));
        setSelectedJob(null);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Error fetching jobs list.");
    }
  };

  return (
    <div className="relative min-h-[90vh] w-full overflow-x-hidden hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] px-3 sm:px-4 md:px-6 py-6 md:py-10 flex flex-col items-center gap-5">

      {/* Decorative background elements */}
      <div className="pointer-events-none absolute top-10 left-6 w-48 h-48 bg-blue-300 opacity-20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-6 w-48 h-48 bg-teal-300 opacity-20 rounded-full blur-3xl" />

      <div className="w-full max-w-7xl">
        {/* Top bar */}
        <div className="bg-white/80 backdrop-blur-sm w-full rounded-xl shadow-lg px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Job Management</h1>

          <div className="w-full md:w-96">
            <label className="font-semibold text-sm text-gray-600 block mb-1">
              Select Job Type:
            </label>
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-teal-500 w-full outline-none"
            >
              {jobTypes.length > 0 ? (
                jobTypes.map((jt, index) => (
                  <option key={jt?.jobId?.toString() || index} value={jt.jobType}>
                    {jt.jobType} {jt.jobCode ? `— ${jt.jobCode}` : ""}
                  </option>
                ))
              ) : (
                <option value="">No types found</option>
              )}
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-xl shadow-lg py-5 px-4 md:px-6 my-4 bg-white">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
            <h2 className="font-bold text-lg md:text-xl text-gray-700">
              Job List: <span className="text-teal-600">{selectedJobType || "None Selected"}</span>
            </h2>

            <div className="flex gap-2">
               <button
                onClick={() => router.push("/home")}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Home
              </button>
              <button
                onClick={() => router.push("/createJob")}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#008080] text-white hover:bg-teal-700 transition"
              >
                + Add New Job
              </button>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic">
              No jobs found for this category.
            </div>
          ) : (
            <ReusableTable
              data={jobs}
              columns={jobColumns}
              actions={jobActions}
              getRowKey={(job, idx) => job?.jobId?.toString?.() || idx}
              onRowClick={(job) => setSelectedJob(job)}
              isRowSelected={(job) => selectedJob?.jobId === job.jobId}
              footerLeft={`Total: ${jobs.length} jobs`}
            />
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Job;