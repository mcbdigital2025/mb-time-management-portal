"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const STATUS_OPTIONS = ["Active", "Inactive"];

const UpdateEmployee = () => {
  const router = useRouter();

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
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Changed from 'success' to 'successMessage'
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const stored = sessionStorage.getItem("selectedEmployee");

    // ✅ Check for user and JWT token immediately on load
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    if (stored) {
      const selectedEmployee = JSON.parse(stored);

      const formatDate = (value) => {
        if (!value) return "";
        return value.split("T")[0]; // remove time portion
      };

      setForm({
        ...selectedEmployee,
        dateOfBirth: formatDate(selectedEmployee.dateOfBirth),
        hireDate: formatDate(selectedEmployee.hireDate),
      });
    } else {
      setError("No employee data found in session storage. Redirecting to employee list.");
      setTimeout(() => {
        router.push("/viewemployees");
      }, 500);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Re-check user and token before submitting
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Please log in again.");
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
      setIsSubmitting(false); // Ensure submission state is reset
      return;
    }

    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      setError("API URL is not configured. Please check your environment variables.");
      setIsSubmitting(false);
      return;
    }

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // Good practice to include Accept header
          },
          body: JSON.stringify(form),
          // ✅ Removed credentials: "include"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update employee:", response.status, response.statusText, errorText);
        throw new Error(`Failed to update employee. Server responded with ${response.status}. ${errorText}`);
      }

      try {
        const responseData = await response.json();
        console.log("Employee updated:", responseData);
      } catch (jsonError) {
        console.log("No JSON returned (OK, or API might return plain text success).", jsonError);
      }

      setSuccessMessage("Employee updated successfully!");
      setTimeout(() => {
        router.push("/viewemployees");
      }, 2000);
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(err.message || "Unexpected error occurred.");
      // If fetching fails due to token issues (e.g., token expired/invalid),
      // consider redirecting to login after a delay.
      if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
           setTimeout(() => {
               router.replace("/login");
           }, 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/viewemployees");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Update Employee</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">First Name:</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="block font-medium">Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Hire Date:</label>
          <input
            type="date"
            name="hireDate"
            value={form.hireDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Gender:</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Department:</label>
          <input
            type="text"
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Job Title:</label>
          <input
            type="text"
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-medium">Employee ID:</label>
            <input
              type="text"
              name="employeeId"
              value={form.employeeId}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>
          <div className="w-1/2">
            <label className="block font-medium">Company ID:</label>
            <input
              type="text"
              name="companyId"
              value={form.companyId}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-2 rounded ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600 text-white"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployee;
