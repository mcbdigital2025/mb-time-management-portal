"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [user, setUser] = useState(null); // Store current logged-in user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.companyId || !storedUser.jwtToken) {
      setError("User information or token is missing. Redirecting to login.");
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
          throw new Error(`Failed to fetch data: ${response.status} - ${errorText}`);
        }

        const text = await response.text();
        const data = JSONbig.parse(text);
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError(err.message);
        if (err.message.includes("401")) setTimeout(() => router.replace("/login"), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [router]);

  // Check if the current user has permission to perform admin/sensitive actions
  // Adjust 'Admin' to whatever your specific AccessLevel string is
  const hasEditPermission = user?.accessLevel === "ROLE_Administrator" || user?.accessLevel === "ROLE_SuperAdministrator";

  const handleRowClick = (emp) => {
    setSelectedEmployee(emp);
    setError(null);
  };

  const handleUpdateClick = () => {
    if (selectedEmployee) {
      sessionStorage.setItem("selectedEmployee", JSON.stringify(selectedEmployee));
      router.push("/updateemployee");
    }
  };

  const handleChangePassword = () => {
    if (selectedEmployee && user) {
      const passwordInfo = {
        email: selectedEmployee.email,
        companyId: user.companyId,
      };
      // Store in sessionStorage as expected by ChangeLoginEmployeePassword.js
      sessionStorage.setItem("changePasswordEmployee", JSON.stringify(passwordInfo));
      router.push("/changeLoginEmployeePassword");
    }
  };

  const thClasses = "border px-4 py-3 text-left whitespace-nowrap";
  const tdClasses = "border px-4 py-3 whitespace-nowrap text-left";

  if (loading) return <div className="text-center mt-10 text-blue-500">Loading employee list...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Employee List</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className={thClasses}>Employee ID</th>
              <th className={thClasses}>Name</th>
              <th className={thClasses}>Email</th>
              <th className={thClasses}>Department</th>
              <th className={thClasses}>Job Title</th>
              <th className={thClasses}>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.employeeId}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedEmployee?.employeeId === emp.employeeId ? "bg-blue-100" : ""
                }`}
                onClick={() => handleRowClick(emp)}
              >
                <td className={tdClasses}>{emp.employeeId?.toString()}</td>
                <td className={tdClasses}>{`${emp.firstName} ${emp.lastName}`}</td>
                <td className={tdClasses}>{emp.email}</td>
                <td className={tdClasses}>{emp.departmentId}</td>
                <td className={tdClasses}>{emp.jobTitle}</td>
                <td className={tdClasses}>
                   <span className={emp.status === "Active" ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                    {emp.status}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        {/* Create Button: Enabled only for authorized users */}
        <Link href={hasEditPermission ? "/createemployee" : "#"}>
          <button
            disabled={!hasEditPermission}
            className={`px-6 py-2 text-white rounded transition ${
              hasEditPermission ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
            }`}>
            Create
          </button>
        </Link>

        {/* Edit Button: Enabled only if authorized AND an employee is selected */}
        <button
          disabled={!hasEditPermission || !selectedEmployee}
          onClick={handleUpdateClick}
          className={`px-6 py-2 rounded transition ${
            (hasEditPermission && selectedEmployee)
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          }`}
        >
          Edit
        </button>

        {/* Change Password Button: New Action */}
        <button
          disabled={!hasEditPermission || !selectedEmployee}
          onClick={handleChangePassword}
          className={`px-6 py-2 rounded transition ${
            (hasEditPermission && selectedEmployee)
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          }`}
        >
          Change Password
        </button>

        <Link href="/home">
          <button className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition">
            Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ViewEmployees;