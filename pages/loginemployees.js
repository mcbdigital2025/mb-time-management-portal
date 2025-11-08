"use client";

import { useEffect, useState } from "react";
import JSONbig from "json-bigint";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const LoginEmployees = () => {
  const router = useRouter();
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success messages
  const [confirmMessage, setConfirmMessage] = useState(null); // New state for confirmation messages
  const [confirmAction, setConfirmAction] = useState(null); // New state for confirmation action callback
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchLoginData = async () => {
      const storedUserRaw = localStorage.getItem("user");
      let storedUser = null;

      if (!storedUserRaw) {
        setError("User not found in local storage. Redirecting to login.");
        setLoading(false);
        setTimeout(() => {
          router.replace("/login");
        }, 500);
        return;
      }

      storedUser = JSON.parse(storedUserRaw);
      const companyId = storedUser?.companyId;

      // ✅ Check for JWT token in storedUser
      if (!companyId || !storedUser.jwtToken) {
        setError("Company ID or user token is missing. Redirecting to login.");
        setLoading(false);
        setTimeout(() => {
          router.replace("/login");
        }, 500);
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/employeesLogin?companyId=${encodeURIComponent(companyId)}`;

      try {
        // ✅ Use authenticatedFetch instead of direct fetch
        const response = await authenticatedFetch(apiUrl, {
          method: "POST", // Assuming this is a POST request as per your original code
          headers: {
            Accept: "application/json",
            // 'Content-Type': 'application/json' // Add if sending a JSON body
          },
          // ✅ Removed credentials: "include"
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch login data: ${response.status} ${response.statusText} - ${text}`);
        }

        const rawText = await response.text();
        const parsed = JSONbig.parse(rawText);
        setLogins(parsed);
      } catch (err) {
        console.error("Error fetching login data:", err);
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

    fetchLoginData();
  }, []);

  const handleRowClick = (emp) => {
    setSelectedEmployee(emp);
    sessionStorage.setItem("editEmployee", JSON.stringify(emp));
    setError(null); // Clear errors when selecting a new employee
    setSuccessMessage(null); // Clear success messages
  };

  const handleEdit = () => {
    if (selectedEmployee) {
      router.push("/editLoginEmployee");
    } else {
      setError("Please select an employee to edit.");
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    try {
      // Replace space with 'T' for proper ISO format
      const isoValue = value.replace(" ", "T");
      const date = new Date(isoValue);

      if (isNaN(date.getTime())) return value; // fallback if still invalid

      const pad = (n) => n.toString().padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    } catch {
      return value;
    }
  };

  const handleRegister = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // ✅ Check for JWT token before allowing registration
      if (!parsed.jwtToken) {
        setError("User session or token is missing. Cannot register employee.");
        setTimeout(() => { router.replace("/login"); }, 500);
        return;
      }
      sessionStorage.setItem("companyId", parsed.companyId);
      router.push("/registerLoginEmployee");
    } else {
      setError("User information is missing. Cannot register employee.");
      setTimeout(() => { router.replace("/login"); }, 500);
    }
  };

  const handleRemove = async () => {
    if (!selectedEmployee) {
      setError("Please select an employee login to remove.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    // ✅ Check for JWT token in storedUser
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Cannot remove employee login.");
      setTimeout(() => { router.replace("/login"); }, 500);
      return;
    }

    const { email, companyId } = selectedEmployee;

    setConfirmMessage(`Are you sure to delete Employee Login email of ${email}?`);
    setConfirmAction(() => async () => {
      try {
        // ✅ Use authenticatedFetch instead of direct fetch
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/delete?email=${encodeURIComponent(
            email
          )}&companyId=${encodeURIComponent(companyId)}`,
          {
            method: "POST", // Assuming this is a POST request
            headers: {
              Accept: "application/json",
            },
            // ✅ Removed credentials: "include"
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to delete employee login: ${response.status} ${response.statusText} - ${text}`);
        }

        setSuccessMessage("Employee login deleted successfully.");
        // Re-fetch data after successful deletion
        fetchLoginData(); // Call the function to re-fetch
        setSelectedEmployee(null); // Clear selection
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error deleting employee login:", err);
        setError("Error deleting employee login: " + err.message);
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

  const th = "px-4 py-2 border font-medium text-left";
  const td = "px-4 py-2 border text-left";

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold text-center mb-6">Employee Login History</h1>

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

      {loading && <p className="text-blue-500 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

      {!loading && !error && logins.length === 0 && (
        <p className="text-gray-600 text-center">No login records found.</p>
      )}

      {!loading && !error && logins.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className={th}>Email</th>
                  <th className={th}>Company ID</th>
                  <th className={th}>Access Level</th>
                  <th className={th}>Last Login</th>
                  <th className={th}>Failed Attempts</th>
                </tr>
              </thead>
              <tbody>
                {logins.map((emp, idx) => (
                  <tr
                    key={idx}
                    onClick={() => handleRowClick(emp)}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      selectedEmployee?.email === emp.email &&
                      selectedEmployee?.companyId === emp.companyId
                        ? "bg-blue-100"
                        : ""
                    }`}
                  >
                    <td className={td}>{emp.email}</td>
                    <td className={td}>{emp.companyId.toString()}</td>
                    <td className={td}>{emp.accessLevel}</td>
                    <td className={td}>{formatDateTime(emp.lastLogin) || "N/A"}</td>
                    <td className={td}>{emp.failedLoginAttempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              onClick={handleEdit}
              disabled={!selectedEmployee}
              className={`px-6 py-2 rounded text-white transition ${
                selectedEmployee
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Edit
            </button>

            <button
              onClick={handleRemove}
              disabled={!selectedEmployee}
              className={`px-6 py-2 rounded text-white transition ${
                selectedEmployee
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Remove
            </button>

            <button
              onClick={handleRegister}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Register Login Employee
            </button>

            <button
              onClick={() => router.push("/home")}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Home
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginEmployees;
