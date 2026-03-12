"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api';

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const STATUS_OPTIONS = ["Active", "Inactive"];
const ACCESS_LEVEL_OPTIONS = ["Basic", "Administrator", "Supervisor"];

const UpdateEmployee = () => {
  const router = useRouter();

  // ✅ All 13 Attributes Initialized
  const [form, setForm] = useState({
    employeeId: "",
    companyId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    hireDate: "",
    gender: "",
    departmentId: "",
    jobTitle: "",
    status: "",
    accessLevel: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const stored = sessionStorage.getItem("selectedEmployee");

    if (!storedUser || !storedUser.jwtToken) {
      setError("User session missing. Redirecting to login.");
      setTimeout(() => router.replace("/login"), 500);
      return;
    }

    if (stored) {
      const selectedEmployee = JSON.parse(stored);

      const formatDate = (value) => {
        if (!value) return "";
        return value.split("T")[0];
      };

      // ✅ Mapping all 13 fields from session storage
      setForm({
        employeeId: selectedEmployee.employeeId || "",
        companyId: selectedEmployee.companyId || "",
        firstName: selectedEmployee.firstName || "",
        lastName: selectedEmployee.lastName || "",
        email: selectedEmployee.email || "",
        phoneNumber: selectedEmployee.phoneNumber || "",
        dateOfBirth: formatDate(selectedEmployee.dateOfBirth),
        hireDate: formatDate(selectedEmployee.hireDate),
        gender: selectedEmployee.gender || "",
        departmentId: selectedEmployee.departmentId || "",
        jobTitle: selectedEmployee.jobTitle || "",
        status: selectedEmployee.status || "",
        accessLevel: selectedEmployee.accessLevel?.replace("ROLE_", "") || "",
      });
    } else {
      router.push("/viewemployees");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // ✅ Re-adding 'ROLE_' prefix for backend compatibility
      const submissionData = {
        ...form,
        accessLevel: form.accessLevel ? `ROLE_${form.accessLevel}` : null
      };

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) throw new Error(`Update failed: ${response.status}`);

      setSuccessMessage("Employee updated successfully!");
      setTimeout(() => router.push("/viewemployees"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Update Employee Details</h2>

      {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg text-sm font-semibold">{error}</p>}
      {successMessage && <p className="text-green-600 mb-4 bg-green-50 p-3 rounded-lg text-sm font-semibold">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Row 1: Names */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-600">First Name</label>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-600">Last Name</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" />
        </div>

        {/* Row 2: Identifiers (Disabled) */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Employee ID (Fixed)</label>
          <input type="text" value={form.employeeId} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Company ID (Fixed)</label>
          <input type="text" value={form.companyId} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
        </div>

        {/* Row 3: Email & Phone */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Email (Read Only)</label>
          <input type="email" value={form.email} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-600">Phone Number</label>
          <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" />
        </div>

        {/* Row 4: Dates */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-600">Date of Birth</label>
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-600">Hire Date</label>
          <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" />
        </div>

        {/* Row 5: Gender & Access Level */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-600">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none">
            <option value="">Select Gender</option>
            {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-600">Access Level</label>
          <select name="accessLevel" value={form.accessLevel} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none">
            <option value="">Select Access</option>
            {ACCESS_LEVEL_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Row 6: Dept & Job Title */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-600">Department</label>
          <input type="text" name="departmentId" value={form.departmentId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-600">Job Title</label>
          <input type="text" name="jobTitle" value={form.jobTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none" />
        </div>

        {/* Row 7: Status (Full Width) */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-bold text-gray-600">Employment Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none">
            <option value="">Select Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 pt-6 md:col-span-2">
          <button type="submit" disabled={isSubmitting} className={`flex-1 py-3 rounded-lg font-bold text-white transition ${isSubmitting ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600 shadow-md"}`}>
            {isSubmitting ? "Processing..." : "UPDATE EMPLOYEE"}
          </button>
          <button type="button" onClick={() => router.push("/viewemployees")} className="flex-1 py-3 rounded-lg font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployee;