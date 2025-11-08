"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const JOB_TYPES = [
  { value: "Course", label: "Educational or training sessions" },
  { value: "Support", label: "Assistance provided to clients" },
  { value: "Service", label: "General service tasks" },
  { value: "Assessment", label: "Skills or needs assessments" },
  { value: "Planning", label: "Session for goal or schedule planning" },
  { value: "Transport", label: "Travel or transportation jobs" },
  { value: "Administration", label: "Administrative and clerical work" },
  { value: "Community Engagement", label: "Activities that involve the community" },
  { value: "Supervision", label: "Monitoring or oversight tasks" },
  { value: "Technology Support", label: "Help with devices or digital systems" },
  { value: "Consultation", label: "Advisory or professional consulting sessions" },
];

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [jobType, setJobType] = useState("Course");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success messages
  const [confirmMessage, setConfirmMessage] = useState(null); // New state for confirmation messages
  const [confirmAction, setConfirmAction] = useState(null); // New state for confirmation action callback
  const [user, setUser] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      // ✅ Check for JWT token in storedUser
      if (storedUser && storedUser.companyId && storedUser.jwtToken) {
        setUser(storedUser);
        fetchJobs("Course", storedUser.companyId);
      } else {
        setError("User information or token is missing. Redirecting to login.");
        setTimeout(() => {
          router.replace("/login");
        }, 500);
      }
    }
  }, []);

  const fetchJobs = async (selectedType, companyId) => {
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/job/type/${encodeURIComponent(selectedType)}/${encodeURIComponent(companyId)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          // ✅ Removed credentials: "include"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const text = await response.text();
      const data = JSONbig.parse(text);
      setJobs(data);
      setSelectedJob(null);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message);
      // If fetching fails due to token issues (e.g., token expired/invalid),
      // consider redirecting to login after a delay.
      if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
           setTimeout(() => {
               router.replace("/login");
           }, 1500);
      }
    }
  };

  const handleJobTypeChange = (e) => {
    const selected = e.target.value;
    setJobType(selected);
    if (user?.companyId) {
      fetchJobs(selected, user.companyId);
    }
  };

  const handleDelete = async () => {
    if (!selectedJob) {
      setError("Please select a job to delete.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Cannot delete job.");
      setTimeout(() => { router.replace("/login"); }, 500);
      return;
    }

    setConfirmMessage(`Are you sure you want to delete the selected Job Code: ${selectedJob.jobCode}?`);
    setConfirmAction(() => async () => {
      try {
        // ✅ Use authenticatedFetch instead of direct fetch
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/job/delete?jobId=${encodeURIComponent(
            selectedJob.jobId
          )}&companyId=${encodeURIComponent(user.companyId)}`,
          {
            method: "POST",
            headers: { Accept: "application/json" },
            // ✅ Removed credentials: "include"
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete job: ${response.status} ${response.statusText} - ${errorText}`);
        }
        setSuccessMessage("Job deleted successfully.");
        fetchJobs(jobType, user.companyId); // Re-fetch jobs after deletion
        setSelectedJob(null); // Clear selected job
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error deleting job:", err);
        setError("Error deleting job: " + err.message);
        // If fetching fails due to token issues (e.g., token expired/invalid),
        // consider redirecting to login after a delay.
        if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
             setTimeout(() => {
                 router.replace("/login");
             }, 1500);
        }
      } finally {
        setConfirmMessage(null); // Close confirmation modal
        setConfirmAction(null);
      }
    });
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
  };

  const handleCancelConfirm = () => {
    setConfirmMessage(null);
    setConfirmAction(null);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 space-y-6">
      {/* Confirmation Modal */}
      {confirmMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <p className="text-lg font-semibold mb-4">{confirmMessage}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="font-semibold mr-2">Select Job Type:</label>
        <select
          value={jobType}
          onChange={handleJobTypeChange}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {JOB_TYPES.map((jt) => (
            <option key={jt.value} value={jt.value}>
              {jt.value} — {jt.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="border border-gray-300 rounded p-5">
        <legend className="text-lg font-semibold px-2">Jobs</legend>

        {error && (
          <div className="text-red-600 font-semibold mb-4">{error}</div>
        )}
        {successMessage && (
          <div className="text-green-600 font-semibold mb-4">{successMessage}</div>
        )}

        {jobs.length === 0 ? (
          <div className="text-gray-600">No jobs found for this Job Type.</div>
        ) : (
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Job Id</th>
                <th className="border p-2">Job Code</th>
                <th className="border p-2">Job Type</th>
                <th className="border p-2">Company Id</th>
                <th className="border p-2">Rates Per Hour</th>
                <th className="border p-2">Discount 1</th>
                <th className="border p-2">Discount 2</th>
                <th className="border p-2">Employee %</th>
                <th className="border p-2">Currency</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.jobId?.toString()}
                  className={
                    selectedJob?.jobId === job.jobId
                      ? "bg-yellow-100 cursor-pointer"
                      : "hover:bg-gray-100 cursor-pointer"
                  }
                  onClick={() => setSelectedJob(job)}
                >
                  <td className="border p-2">{job.jobId?.toString()}</td>
                  <td className="border p-2">{job.jobCode}</td>
                  <td className="border p-2">{job.jobType}</td>
                  <td className="border p-2">{job.companyId?.toString()}</td>
                  <td className="border p-2">
                    {Number(job.ratesPerHour).toFixed(2)}
                  </td>
                  <td className="border p-2">
                    {Number(job.ratesPerHourDiscount_1).toFixed(2)}
                  </td>
                  <td className="border p-2">
                    {Number(job.ratesPerHourDiscount_2).toFixed(2)}
                  </td>
                  <td className="border p-2">
                    {Number(job.employeePercentage).toFixed(2)}%
                  </td>
                  <td className="border p-2">{job.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </fieldset>

      <div className="flex gap-4 justify-start">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          onClick={() => router.push("/createJob")}
        >
          Create
        </button>

        <button
          className={`${
            selectedJob
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-300 cursor-not-allowed"
          } text-white px-4 py-2 rounded shadow`}
          onClick={() => {
            if (selectedJob) {
              localStorage.setItem("selectedJob", JSON.stringify(selectedJob));
              router.push("/updateJob");
            } else {
              setError("Please select a job to update.");
            }
          }}
          disabled={!selectedJob}
        >
          Update
        </button>

        <button
          className={`${
            selectedJob
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-300 cursor-not-allowed"
          } text-white px-4 py-2 rounded shadow`}
          onClick={handleDelete}
          disabled={!selectedJob}
        >
          Delete
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          onClick={() => router.push("/home")}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Job;
