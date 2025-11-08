"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const user = JSON.parse(localStorage.getItem("user"));
    // ✅ Check for JWT token in storedUser
    if (!user || !user.companyId || !user.jwtToken) {
      setError("User information or token is missing from local storage. Redirecting to login.");
      setLoading(false);
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return; // Exit early if user data is incomplete
    }

    const fetchEmployees = async () => {
      try {
        // ✅ Use authenticatedFetch instead of direct fetch
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/${encodeURIComponent(user.companyId)}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            // ✅ Removed credentials: "include"
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch employee data: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const text = await response.text();
        const data = JSONbig.parse(text);
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
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

    fetchEmployees();
  }, []); // Empty dependency array as user is accessed inside the effect

  const handleRowClick = (emp) => {
    setSelectedEmployee(emp);
    setError(null); // Clear errors when selecting a new employee
  };

  const handleUpdateClick = () => {
    if (selectedEmployee) {
      sessionStorage.setItem("selectedEmployee", JSON.stringify(selectedEmployee));
      router.push("/updateemployee");
    } else {
      setError("Please select an employee to update.");
    }
  };

  const thClasses = "border px-4 py-3 text-left whitespace-nowrap";
  const tdClasses = "border px-4 py-3 whitespace-nowrap text-left";

  if (loading) return <div className="text-center mt-10 text-blue-500">Loading employee list...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Employee List</h1>

      {employees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className={thClasses}>Employee ID</th>
                <th className={thClasses}>Company ID</th>
                <th className={thClasses}>Name</th>
                <th className={thClasses}>Email</th>
                <th className={thClasses}>Phone</th>
                <th className={thClasses}>DOB</th>
                <th className={thClasses}>Hire Date</th>
                <th className={thClasses}>Gender</th>
                <th className={thClasses}>Department</th>
                <th className={`${thClasses} w-64`}>Job Title</th>
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
                  <td className={tdClasses}>{emp.employeeId?.toString?.()}</td>
                  <td className={tdClasses}>{emp.companyId?.toString?.()}</td>
                  <td className={tdClasses}>{`${emp.firstName} ${emp.lastName}`}</td>
                  <td className={tdClasses}>{emp.email}</td>
                  <td className={tdClasses}>{emp.phoneNumber}</td>
                  <td className={tdClasses}>{emp.dateOfBirth}</td>
                  <td className={tdClasses}>{emp.hireDate}</td>
                  <td className={tdClasses}>{emp.gender}</td>
                  <td className={tdClasses}>{emp.departmentId}</td>
                  <td className={tdClasses}>{emp.jobTitle}</td>
                  <td className={tdClasses}>
                    {emp.status === "Active" ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No employees found.</p>
      )}

      <div className="flex justify-center items-center gap-4 mt-6">
        <Link href="/createemployee">
          <button className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200">
            Create
          </button>
        </Link>
        <button
          disabled={!selectedEmployee}
          onClick={handleUpdateClick}
          className={`px-6 py-2 rounded transition duration-200 ${
            selectedEmployee
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          }`}
        >
          Edit
        </button>
        <Link href="/home">
          <button className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition duration-200">
            Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ViewEmployees;
