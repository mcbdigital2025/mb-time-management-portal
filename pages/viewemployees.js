"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.companyId) {
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
          { method: "GET", headers: { Accept: "application/json" } }
        );
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const text = await response.text();
        setEmployees(JSONbig.parse(text));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [router]);

  const handleRowClick = async (emp) => {
    setSelectedEmployee(emp);
    setSelectedSkill(null);
    setError(null);
    setSuccess("");
    setSkillsLoading(true);

    try {
      const skillRes = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/skill/${encodeURIComponent(user.companyId)}/${encodeURIComponent(emp.employeeId)}`,
        { method: "GET", headers: { Accept: "application/json" } }
      );
      if (skillRes.ok) {
        const skillData = await skillRes.json();
        setSkills(Array.isArray(skillData) ? skillData : []);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setSkillsLoading(false);
    }
  };

  // Directly invokes the updateEmployeeSkill endpoint
  const handleAddSkill = async () => {
    if (!selectedEmployee) return;

    // This is a placeholder for the skill object you want to pass.
    // Usually, you would have a modal to collect these details.
    const newSkill = {
      companyId: user.companyId,
      employeeId: selectedEmployee.employeeId,
      skillName: "New Skill", // Placeholder
      skillLevel: "BEGINNER",
      yearsExperience: 0.0
    };

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/updateEmployeeSkill/${encodeURIComponent(user.companyId)}/${encodeURIComponent(selectedEmployee.employeeId)}`,
        {
          method: "POST", // or PUT depending on your backend API design
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSkill),
        }
      );

      if (!response.ok) throw new Error("Failed to add skill");
      setSuccess("Skill added successfully!");
      handleRowClick(selectedEmployee); // Refresh skills list
    } catch (err) {
      setError(err.message);
    }
  };

  const hasEditPermission = user?.accessLevel === "ROLE_Administrator" || user?.accessLevel === "ROLE_SuperAdministrator";

  const thClasses = "border px-4 py-3 text-left whitespace-nowrap bg-gray-100 font-bold text-gray-700 uppercase text-xs";
  const tdClasses = "border px-4 py-3 whitespace-nowrap text-left text-sm";

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
              <th className={thClasses}>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.employeeId}
                className={`hover:bg-blue-50 cursor-pointer ${selectedEmployee?.employeeId === emp.employeeId ? "bg-blue-50 font-semibold" : ""}`}
                onClick={() => handleRowClick(emp)}
              >
                <td className={tdClasses}>{emp.employeeId?.toString()}</td>
                <td className={tdClasses}>{`${emp.firstName} ${emp.lastName}`}</td>
                <td className={tdClasses}>{emp.email}</td>
                <td className={tdClasses}>{emp.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SKILLS SECTION */}
      {selectedEmployee && (
        <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Skills: {selectedEmployee.firstName}</h2>
            <div className="flex gap-2">
              <button
                onClick={handleAddSkill}
                className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700"
              >
                + Add Skill
              </button>
              <button
                disabled={!selectedSkill}
                onClick={() => {
                  sessionStorage.setItem("selectedSkill", JSON.stringify(selectedSkill));
                  router.push("/updateskill");
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded ${selectedSkill ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Update Skill
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-[10px] uppercase font-bold">
                <tr>
                  <th className="px-4 py-2">Skill</th>
                  <th className="px-4 py-2">Level</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((s) => (
                  <tr
                    key={s.employeeSkillId}
                    onClick={(e) => { e.stopPropagation(); setSelectedSkill(s); }}
                    className={`text-sm cursor-pointer hover:bg-slate-50 ${selectedSkill?.employeeSkillId === s.employeeSkillId ? "bg-amber-50" : ""}`}
                  >
                    <td className="px-4 py-2 font-semibold">{s.skillName}</td>
                    <td className="px-4 py-2">{s.skillLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MAIN ACTIONS */}
      <div className="flex justify-center items-center gap-4 mt-10 border-t pt-8">
        <Link href="/createemployee">
          <button disabled={!hasEditPermission} className={`px-6 py-2 text-white rounded font-semibold ${hasEditPermission ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}>
            Create
          </button>
        </Link>
        <button
          disabled={!hasEditPermission || !selectedEmployee}
          onClick={() => { sessionStorage.setItem("selectedEmployee", JSON.stringify(selectedEmployee)); router.push("/updateemployee"); }}
          className={`px-6 py-2 rounded font-semibold ${(hasEditPermission && selectedEmployee) ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`}
        >
          Edit
        </button>
        <button
          disabled={!hasEditPermission || !selectedEmployee}
          onClick={async () => {
             if(confirm("Reset password?")) {
               // ... Reset logic ...
             }
          }}
          className={`px-6 py-2 rounded font-semibold ${(hasEditPermission && selectedEmployee) ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`}
        >
          Reset Password
        </button>
        <Link href="/home">
          <button className="px-6 py-2 text-white bg-slate-600 rounded font-semibold hover:bg-slate-700">Home</button>
        </Link>
      </div>
    </div>
  );
};

export default ViewEmployees;