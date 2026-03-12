"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.companyId) {
      setError("User information missing. Redirecting to login.");
      setLoading(false);
      setTimeout(() => router.replace("/login"), 500);
      return;
    }
    setUser(storedUser);

    const fetchEmployees = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/${encodeURIComponent(storedUser.companyId)}`,
          { method: "GET", headers: { Accept: "application/json" } }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const text = await response.text();
        const data = JSONbig.parse(text);
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [router]);

  const hasEditPermission = user?.accessLevel === "ROLE_Administrator" || user?.accessLevel === "ROLE_SuperAdministrator";

  const handleRowClick = (emp) => {
    setSelectedEmployee(emp);
    setError(null);
    setSuccess("");
  };

  const handleUpdateClick = () => {
    if (selectedEmployee) {
      sessionStorage.setItem("selectedEmployee", JSON.stringify(selectedEmployee));
      router.push("/updateemployee");
    }
  };

  const handleResetPassword = async () => {
    if (!selectedEmployee) return;
    setError("");
    setSuccess("");

    if (!confirm(`Reset password for ${selectedEmployee.firstName}?`)) return;

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/resetPassword`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedEmployee),
        }
      );

      if (!response.ok) throw new Error("Failed to reset password.");
      setSuccess(`Password for ${selectedEmployee.firstName} reset successfully!`);
    } catch (err) {
      setError(err.message);
    }
  };

  const thClasses = "border px-4 py-3 text-left whitespace-nowrap bg-gray-100 font-bold";
  const tdClasses = "border px-4 py-3 whitespace-nowrap text-left";

  if (loading) return <div className="text-center mt-10 text-blue-500 font-semibold">Loading employees...</div>;

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Employee Management</h1>

      {error && <p className="text-red-500 text-center mb-4 font-medium bg-red-50 p-2 rounded">{error}</p>}
      {success && <p className="text-green-600 text-center mb-4 font-medium bg-green-50 p-2 rounded">{success}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr>
              <th className={thClasses}>ID</th>
              <th className={thClasses}>Name</th>
              <th className={thClasses}>Email</th>
              <th className={thClasses}>Access Level</th> {/* New Column Header */}
              <th className={thClasses}>Department</th>
              <th className={thClasses}>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.employeeId}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedEmployee?.employeeId === emp.employeeId ? "bg-blue-50" : ""
                }`}
                onClick={() => handleRowClick(emp)}
              >
                <td className={tdClasses}>{emp.employeeId?.toString()}</td>
                <td className={tdClasses}>{`${emp.firstName} ${emp.lastName}`}</td>
                <td className={tdClasses}>{emp.email}</td>
                {/* Access Level Display with basic formatting */}
                <td className={tdClasses}>
                  <span className="px-2 py-1 rounded bg-gray-200 text-xs font-bold text-gray-700">
                    {emp.accessLevel?.replace("ROLE_", "") || "User"}
                  </span>
                </td>
                <td className={tdClasses}>{emp.departmentId}</td>
                <td className={tdClasses}>
                   <span className={emp.status === "Active" ? "text-green-600 font-semibold" : "text-red-400"}>
                    {emp.status}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <Link href={hasEditPermission ? "/createemployee" : "#"}>
          <button
            disabled={!hasEditPermission}
            className={`px-6 py-2 text-white rounded font-semibold transition ${
              hasEditPermission ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
            }`}>
            Create
          </button>
        </Link>

        <button
          disabled={!hasEditPermission || !selectedEmployee}
          onClick={handleUpdateClick}
          className={`px-6 py-2 rounded font-semibold transition ${
            (hasEditPermission && selectedEmployee)
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          }`}
        >
          Edit
        </button>

        <button
          disabled={!hasEditPermission || !selectedEmployee}
          onClick={handleResetPassword}
          className={`px-6 py-2 rounded font-semibold transition ${
            (hasEditPermission && selectedEmployee)
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          }`}
        >
          Reset Password
        </button>

        <Link href="/home">
          <button className="px-6 py-2 text-white bg-slate-600 rounded font-semibold hover:bg-slate-700 transition">
            Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ViewEmployees;