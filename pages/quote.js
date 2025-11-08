import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  { value: "Consultation", label: "Advisory or professional consulting sessions" }
];

const Quote = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [selectedRates, setSelectedRates] = useState({});
  const [jobType, setJobType] = useState("Course");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      // ✅ Check for JWT token in storedUser
      if (storedUser && storedUser.companyId && storedUser.employeeId && storedUser.jwtToken) {
        setUser(storedUser);
        fetchSchedule("Course", storedUser);
      } else {
        setError("User information or token is missing from local storage. Redirecting to login.");
        setTimeout(() => {
          router.replace("/login");
        }, 500);
      }
    }
  }, []);

  const fetchSchedule = async (type, userData) => {
    setLoading(true);
    setError(null); // Clear previous errors

    // Re-check user and token before fetching
    if (!userData || !userData.companyId || !userData.jwtToken) {
      setError("User information or token is missing. Please log in again.");
      setLoading(false);
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
      return;
    }

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/job/type/${encodeURIComponent(type)}/${encodeURIComponent(userData.companyId)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          // ✅ Removed credentials: "include"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch job data by JobType: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      setSchedule(data);
      setSelectedRates(
        data.reduce((acc, job) => {
          acc[job.jobId] = null;
          return acc;
        }, {})
      );
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError(err.message);
      // If fetching fails due to token issues (e.g., token expired/invalid),
      // consider redirecting to login after a delay.
      if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
           setTimeout(() => {
               router.replace("/login");
           }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJobTypeChange = (e) => {
    const selectedType = e.target.value;
    setJobType(selectedType);
    if (user) {
      fetchSchedule(selectedType, user);
    }
  };

  const handleQuantityChange = (jobId, value) => {
    setQuantities({ ...quantities, [jobId]: value });
  };

  const handleRateSelection = (jobId, rateType) => {
    setSelectedRates({ ...selectedRates, [jobId]: rateType });
  };

  const calculateTotal = (job) => {
    const quantity = quantities[job.jobId] || 0;
    const rate =
      selectedRates[job.jobId] === "ratesPerHourDiscount_1"
        ? job.ratesPerHourDiscount_1
        : selectedRates[job.jobId] === "ratesPerHourDiscount_2"
        ? job.ratesPerHourDiscount_2
        : selectedRates[job.jobId] === "ratesPerHour"
        ? job.ratesPerHour
        : 0;
    return quantity * rate;
  };

  const grandTotal = schedule.reduce((sum, job) => sum + calculateTotal(job), 0);

  if (loading) return <div className="text-center mt-10 text-blue-500">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 space-y-6">
      {/* Job Type Dropdown */}
      <div className="mb-4">
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

      {/* Quote Group Box */}
      <fieldset className="border border-gray-300 rounded p-5">
        <legend className="text-lg font-semibold px-2">Quote</legend>

        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Job Code</th>
              <th className="border p-2">Currency</th>
              <th className="border p-2">Use Rates Per Hour</th>
              <th className="border p-2">Use Discount 1</th>
              <th className="border p-2">Use Discount 2</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((job) => (
              <tr key={job.jobId} className="border">
                <td className="border p-2">{job.jobCode}</td>
                <td className="border p-2">{job.currency}</td>
                <td className="border p-2 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span>{job.ratesPerHour.toFixed(2)}</span>
                    <input
                      type="radio"
                      name={`rate-${job.jobId}`}
                      checked={selectedRates[job.jobId] === "ratesPerHour"}
                      onChange={() => handleRateSelection(job.jobId, "ratesPerHour")}
                    />
                  </div>
                </td>
                <td className="border p-2 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span>{job.ratesPerHourDiscount_1.toFixed(2)}</span>
                    <input
                      type="radio"
                      name={`rate-${job.jobId}`}
                      checked={selectedRates[job.jobId] === "ratesPerHourDiscount_1"}
                      onChange={() => handleRateSelection(job.jobId, "ratesPerHourDiscount_1")}
                    />
                  </div>
                </td>
                <td className="border p-2 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span>{job.ratesPerHourDiscount_2.toFixed(2)}</span>
                    <input
                      type="radio"
                      name={`rate-${job.jobId}`}
                      checked={selectedRates[job.jobId] === "ratesPerHourDiscount_2"}
                      onChange={() => handleRateSelection(job.jobId, "ratesPerHourDiscount_2")}
                    />
                  </div>
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    min="0"
                    value={quantities[job.jobId] || ""}
                    onChange={(e) => handleQuantityChange(job.jobId, parseInt(e.target.value) || 0)}
                    className="w-20 border rounded p-1"
                  />
                </td>
                <td className="border p-2">{calculateTotal(job).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-right font-bold text-lg">
          Grand Total: <span>{grandTotal.toFixed(2)}</span>
        </div>
      </fieldset>

      {/* Home Button */}
      <div className="text-left">
        <button
          onClick={() => router.push("/home")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Quote;
