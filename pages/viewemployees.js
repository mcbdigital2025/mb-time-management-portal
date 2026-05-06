"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from "../utils/api";
import ReusableTable from "../components/ReusableTable";
import ViewEmployeesSkeleton from "../components/loaders/ViewEmployeesSkeleton";
import {
  Users,
  BookOpen,
  Home,
  Trash2,
  Edit,
  AlertCircle,
  UserPlus,
  Lock,
} from "lucide-react";
import UpdateEmployeeForm from "../components/modal/UpdateEmployeeForm";

const ViewEmployees = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingResetPassword, setLoadingResetPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState("Confirm Action");
  const [confirmVariant, setConfirmVariant] = useState("default");

  // --- PERMISSION CHECK ---
  const hasEditPermission = useMemo(() => {
    return user?.accessLevel === "Administrator";
  }, [user]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.companyId || !storedUser.jwtToken) {
      setError("User session missing. Redirecting to login.");
      setLoading(false);
      setTimeout(() => router.replace("/login"), 500);
      return;
    }
    setUser(storedUser);

    const fetchEmployees = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/${encodeURIComponent(storedUser.companyId)}`,
          { method: "GET" },
        );
        if (!response.ok) throw new Error("Failed to fetch employee data.");

        const text = await response.text();
        const data = JSONbig.parse(text);
        setEmployees(
          data.map((emp) => ({
            ...emp,
            employeeId: emp.employeeId?.toString(),
            companyId: emp.companyId?.toString(),
          })),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [router]);

  const fetchSkills = async (empId) => {
    if (!user?.companyId || !empId) return;
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/skill/${encodeURIComponent(user.companyId)}/${encodeURIComponent(empId)}`,
        { method: "GET" },
      );
      if (response.ok) {
        const data = await response.json();
        setSkills(Array.isArray(data) ? data : []);
      } else {
        setSkills([]);
      }
    } catch (err) {
      setSkills([]);
    }
  };

  const handleRowClick = (emp) => {
    setSelectedEmployeeId(emp.employeeId);
    fetchSkills(emp.employeeId);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCreateEmployee = () => {
    if (!hasEditPermission) return;
    router.push("/createemployee");
  };

  const handleDeleteEmployee = (emp) => {
    if (!hasEditPermission) return;

    setConfirmTitle("Delete Employee");
    setConfirmVariant("danger");
    setConfirmMessage(`Delete employee: ${emp.firstName} ${emp.lastName}?`);

    setConfirmAction(() => async () => {
      try {
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/delete?employeeId=${emp.employeeId}&companyId=${user.companyId}`,
          { method: "POST" },
        );
        if (res.ok) {
          setEmployees((prev) =>
            prev.filter((e) => e.employeeId !== emp.employeeId),
          );
          setSuccessMessage("Employee deleted successfully.");
          if (selectedEmployeeId === emp.employeeId) {
            setSelectedEmployeeId(null);
            setSkills([]);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setConfirmMessage(null);
        setConfirmAction(null);
        setConfirmTitle("Confirm Action");
        setConfirmVariant("default");
      }
    });
  };

  const handleResetPassword = (emp) => {
    if (!hasEditPermission) return;

    setConfirmTitle("Reset Password");
    setConfirmVariant("warning");
    setConfirmMessage(`Reset password for ${emp.firstName} ${emp.lastName}?`);
    console.log("🚀 ~ handleResetPassword ~ Employee Name:", emp.email);
    console.log("🚀 ~ handleResetPassword ~ Company Id:", user.companyId);
    setLoadingResetPassword(true);

    setConfirmAction(() => {
      return async () => {
        try {
          setLoadingResetPassword(true);
          const res = await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/resetPassword`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: emp.email,
                companyId: user.companyId,
              }),
            },
          );
          // mcbtt/api/timesheet/employee/reset-password?employeeId=${emp.employeeId}&companyId=${user.companyId}`,

          if (!res.ok) {
            throw new Error("Failed to reset password.");
          }

          setSuccessMessage(
            `Password reset successfully for ${emp.firstName} ${emp.lastName}.`,
          );
          setError(null);
        } catch (err) {
          setError(err.message || "Unable to reset password.");
          setSuccessMessage(null);
        } finally {
          setLoadingResetPassword(false);
          setConfirmMessage(null);
          setConfirmAction(null);
          setConfirmTitle("Confirm Action");
          setConfirmVariant("default");
        }
      };
    });
    setLoadingResetPassword(false);
  };

  const employeeColumns = [
    {
      header: "ID",
      render: (e) => (
        <span className="text-xs text-gray-400 font-mono">{e.employeeId}</span>
      ),
    },
    {
      header: "Name",
      render: (e) => (
        <span className="font-semibold text-gray-900">
          {e.firstName} {e.lastName}
        </span>
      ),
    },
    { header: "Email", accessor: "email" },
    { header: "Department", accessor: "departmentId" },
    { header: "Job Title", accessor: "jobTitle" },
    {
      header: "Access Level",
      render: (e) => (
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
          {e.accessLevel}
        </span>
      ),
    },
    {
      header: "Status",
      render: (e) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${e.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {e.status}
        </span>
      ),
    },
  ];

  const employeeActions = hasEditPermission
    ? [
        {
          label: "Edit",
          icon: "edit",
          variant: "primary",
          onClick: (e) => {
            setEditingEmployee(e);
            setIsEditModalOpen(true);
          },
        },
        {
          label: "Delete",
          icon: "trash",
          variant: "danger",
          onClick: (e) => handleDeleteEmployee(e),
        },
        {
          label: "Reset Password",
          icon: "key",
          // showLabel: true,
          variant: "outline",
          onClick: (e) => handleResetPassword(e),
        },
      ]
    : [];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] px-4 py-10">
      <div className="relative z-10 w-full max-w-7xl space-y-6">
        {/* HEADER SECTION */}
        <div className="bg-white/70 rounded-2xl shadow-sm border border-teal-400/30 overflow-hidden px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="text-[#008080]" size={24} />
              <h1 className="text-2xl font-semibold text-gray-900">
                Employee Directory
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Role:{" "}
              <span className="font-bold text-[#008080]">
                {user?.accessLevel || "Loading..."}
              </span>
            </p>
          </div>

          <button
            onClick={handleCreateEmployee}
            disabled={!hasEditPermission}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition shadow-sm ${
              hasEditPermission
                ? "bg-[#008080] text-white hover:bg-teal-700 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <UserPlus size={18} /> Add Employee
          </button>
        </div>

        {/* MESSAGES */}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            {successMessage}
          </div>
        )}

        {/* EMPLOYEE TABLE */}
        <div className="bg-white/70 rounded-2xl shadow-sm border border-teal-400/30 overflow-hidden">
          {loading ? (
            <ViewEmployeesSkeleton />
          ) : (
            <ReusableTable
              data={employees}
              columns={employeeColumns}
              actions={employeeActions}
              getRowKey={(e) => e.employeeId}
              onRowClick={(row) => handleRowClick(row)}
              isRowSelected={(e) => selectedEmployeeId === e.employeeId}
              footerLeft={`Showing ${employees.length} employees`}
              footerRight="Select a row to view skills"
            />
          )}
        </div>

        {/* SKILLS SECTION */}
        <div className="bg-white/80 rounded-2xl p-6 border border-teal-100 shadow-sm mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg text-[#008080]">
                <BookOpen size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Skills & Qualifications
              </h2>
            </div>

            {hasEditPermission && selectedEmployeeId && (
              <button
                onClick={() => router.push("/createskill")}
                className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition shadow-sm cursor-pointer"
              >
                + Add Skill
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-teal-100 overflow-hidden">
            {selectedEmployeeId ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">Skill Name</th>
                    <th className="px-6 py-3">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {skills.length > 0 ? (
                    skills.map((s, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-teal-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-700">
                          {s.skillName}
                        </td>
                        <td className="px-6 py-4 text-gray-500 italic">
                          {s.skillLevel}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-6 py-10 text-center text-gray-400 italic"
                      >
                        No skills listed for this employee.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="py-10 text-center text-gray-500 italic text-sm">
                Select an employee from the table above to view skills.
              </div>
            )}
          </div>
        </div>

        {/* HOME NAVIGATION */}
        <div className="flex justify-center pt-6">
          <Link
            href="/home"
            className="flex items-center gap-2 px-10 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
          >
            <Home size={18} /> Home
          </Link>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmMessage && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <AlertCircle
              className={`mx-auto mb-4 ${
                confirmVariant === "danger" ? "text-red-500" : "text-amber-500"
              }`}
              size={48}
            />

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {confirmTitle}
            </h3>

            <p className="text-sm text-gray-600">{confirmMessage}</p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => confirmAction?.()}
                className={`flex-1 py-2.5 text-white cursor-pointer rounded-xl font-bold transition ${
                  confirmVariant === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {loadingResetPassword ? (
                  <div className="   text-red-100 rounded-xl text-sm">
                    Processing...
                  </div>
                ) : (
                  "Confirm"
                )}
              </button>

              <button
                onClick={() => {
                  setConfirmMessage(null);
                  setConfirmAction(null);
                  setConfirmTitle("Confirm Action");
                  setConfirmVariant("default");
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 cursor-pointer rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative hero-radial-background ">
            {/* Close button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-10 bg-slate-400 rounded-xl px-2 py-1 text-gray-900 font-bold cursor-pointer hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 text-center">
              Update Employee Details
            </h2>

            <UpdateEmployeeForm
              employee={editingEmployee}
              onClose={() => setIsEditModalOpen(false)}
              onSuccess={(updatedEmployee) => {
                // update list instantly (no refetch)
                setEmployees((prev) =>
                  prev.map((emp) =>
                    emp.employeeId === updatedEmployee.employeeId
                      ? updatedEmployee
                      : emp,
                  ),
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployees;
