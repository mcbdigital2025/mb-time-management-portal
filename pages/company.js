// pages/Company.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Keep useRouter for page-specific navigation (e.g., /editCompany)
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api'; // Keep authenticatedFetch

const Company = () => {
  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const router = useRouter(); // Still needed for actions like router.push("/editCompany")

  useEffect(() => {
    // User validation and initial redirection is now handled by _app.js.
    // We can assume if Company.js is rendered, a user is logged in.
    const storedUser = localStorage.getItem("user");
    let user = null;

    if (!storedUser) {
        // This case should ideally be caught by _app.js, but as a fallback/safety,
        // if user somehow gets here without a stored user, redirect.
        console.error("User not found in local storage within Company.js. Redirecting to login.");
        router.replace("/login");
        return;
    }

    user = JSON.parse(storedUser);

    if (!user || !user.companyId || !user.jwtToken) {
        // Similar fallback: if user data is incomplete, redirect.
        console.error("Incomplete user information or token missing in Company.js. Redirecting to login.");
        router.replace("/login");
        return;
    }

    const companyId = user.companyId;

    const fetchCompany = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/company/${encodeURIComponent(companyId)}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          // If the error is 401, authenticatedFetch should ideally handle the token refresh/redirect.
          // For other errors (e.g., 404 company not found), display them.
          throw new Error(`Failed to fetch company data: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        data.companyId = companyId;
        setCompany(data);
      } catch (err) {
        console.error("Error fetching company data:", err);
        // Only set local error for display; let global handler redirect for auth issues
        setError(err.message);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/${encodeURIComponent(companyId)}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch departments: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const text = await response.text();
        const data = JSONbig.parse(text);
        setDepartments(data);
      } catch (err) {
        console.error("Department fetch error:", err.message);
        // Only set local error for display; let global handler redirect for auth issues
        setError(err.message);
      }
    };

    fetchCompany();
    fetchDepartments();
  }, []); // Empty dependency array as user and companyId are accessed inside the effect

  const formatDateTime = (value) => {
    if (!value) return "-";
    try {
      const isoValue = value.replace(" ", "T");
      const date = new Date(isoValue);
      if (isNaN(date.getTime())) return value;
      const pad = (n) => n.toString().padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    } catch {
      return value;
    }
  };

  const handleEditCompany = () => {
    if (!company) {
      setError("No company data to edit.");
      return;
    }
    sessionStorage.setItem(
      "editCompany",
      JSON.stringify({
        ...company,
        companyId: company.companyId.toString(),
        status: company.status || "Active",
      })
    );
    router.push("/editCompany");
  };

  const handleAddDepartment = () => {
    if (!company) {
      setError("Company data not loaded. Cannot add department.");
      return;
    }
    sessionStorage.setItem("companyInfo", JSON.stringify({
      companyId: company.companyId.toString(),
      companyCode: company.companyCode
    }));
    router.push("/createDepartment");
  };

  const handleEditDepartment = () => {
    if (!selectedDept) {
      setError("Please select a department to edit.");
      return;
    }
    sessionStorage.setItem("editDepartment", JSON.stringify(selectedDept));
    router.push("/editDepartment");
  };

  const handleRemoveDepartment = async () => {
    if (!selectedDept) {
      setError("Please select a department to remove.");
      return;
    }

    // While _app.js handles initial authentication, for critical actions,
    // it's good practice to re-verify token presence, though authenticatedFetch should handle it.
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.jwtToken) {
      setError("User session or token is missing. Cannot remove department. Redirecting to login.");
      setTimeout(() => { router.replace("/login"); }, 500);
      return;
    }

    setConfirmMessage(`Are you sure you want to remove ${selectedDept.departmentName}?`);
    setConfirmAction(() => async () => {
      try {
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/delete/${encodeURIComponent(selectedDept.companyId)}/${encodeURIComponent(selectedDept.departmentId)}`,
          { method: "DELETE" }
        );
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to remove department: ${res.status} ${res.statusText} - ${errorText}`);
        }

        setSuccessMessage("Department removed successfully.");
        setDepartments(departments.filter((d) => d.departmentId !== selectedDept.departmentId));
        setSelectedDept(null);
        setError(null);
      } catch (err) {
        console.error("Delete department error:", err);
        setError("An error occurred while removing the department: " + err.message);
        // Do not force redirect for auth errors here; let authenticatedFetch or _app.js handle.
      } finally {
        setConfirmMessage(null);
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

  // Error/Loading states for Company.js specific data fetching
  if (error) {
      // If error is present, display it within the content area
      return (
          <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded shadow space-y-10">
              <div className="text-red-600 text-center text-lg font-semibold">Error: {error}</div>
          </div>
      );
  }
  if (!company) {
      // While fetching company data, show loading
      return (
          <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded shadow space-y-10">
              <div className="text-center text-lg font-semibold text-gray-700">Loading company info...</div>
          </div>
      );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded shadow space-y-10">
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

      {/* Company Profile Group Box */}
      <fieldset className="border border-gray-300 rounded p-5">
        <legend className="text-lg font-semibold px-2">Company Profile</legend>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <label className="w-40 font-semibold text-gray-700">Company ID:</label>
            <span className="text-gray-900 break-all">{company.companyId.toString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-40 font-semibold text-gray-700">Company Code:</label>
            <span className="text-gray-900 break-all">{company.companyCode}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-40 font-semibold text-gray-700">Company Name:</label>
            <span className="text-gray-900 break-all">{company.companyName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-40 font-semibold text-gray-700">Company Description:</label>
            <span className="text-gray-900 break-all">{company.companyDescription}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-40 font-semibold text-gray-700">Status:</label>
            <span className="text-gray-900 break-all">{company.status}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-40 font-semibold text-gray-700">Client Booking Enabled:</label>
            <span className="text-gray-900 break-all">{company.clientBooking ? "Yes" : "No"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-40 font-semibold text-gray-700">Employee Assigned Schedule:</label>
            <span className="text-gray-900 break-all">{company.employeeAssignedSchedule ? "Yes" : "No"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-40 font-semibold text-gray-700">Log Daily Note:</label>
            <span className="text-gray-900 break-all">{company.logDailyNote ? "Yes" : "No"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="w-40 font-semibold text-gray-700">Transport Travel Claim:</label>
            <span className="text-gray-900 break-all">{company.transportTravelClaim ? "Yes" : "No"}</span>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleEditCompany}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Company
          </button>
        </div>
      </fieldset>

      {/* Departments Group Box */}
      <fieldset className="border border-gray-300 rounded p-5">
        <legend className="text-lg font-semibold px-2">Departments</legend>

        <div className="overflow-x-auto mt-4">
          {departments.length > 0 ? (
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Department Id</th>
                  <th className="border px-3 py-2 text-left">Company Id</th>
                  <th className="border px-3 py-2 text-left">Name</th>
                  <th className="border px-3 py-2 text-left">Description</th>
                  <th className="border px-3 py-2 text-left">Created</th>
                  <th className="border px-3 py-2 text-left">Updated</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr
                    key={dept.departmentId}
                    onClick={() => setSelectedDept(dept)}
                    className={`cursor-pointer ${
                      selectedDept?.departmentId === dept.departmentId
                        ? "bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="border px-3 py-2">{dept.departmentId}</td>
                    <td className="border px-3 py-2">{dept.companyId ? dept.companyId.toString() : "-"}</td>
                    <td className="border px-3 py-2">{dept.departmentName}</td>
                    <td className="border px-3 py-2">{dept.departmentDescription}</td>
                    <td className="border px-3 py-2">{formatDateTime(dept.createdDate)}</td>
                    <td className="border px-3 py-2">{formatDateTime(dept.updatedDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No departments found.</p>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleAddDepartment}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create
          </button>
          <button
            onClick={handleEditDepartment}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Edit
          </button>
          <button
            onClick={handleRemoveDepartment}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </fieldset>

      {/* The global error/success messages can still be handled here for component-specific feedback,
          or you could propagate them to a global state/context if desired for _app.js to display. */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg z-50">
          {successMessage}
        </div>
      )}
      {/* Note: The main `error` state in Company.js is now rendered within the content div itself,
               so removing the fixed error display here if you prefer that */}
    </div>
  );
};

export default Company;