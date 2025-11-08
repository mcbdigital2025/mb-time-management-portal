"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const EditDepartment = () => {
  const [department, setDepartment] = useState(null);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [error, setError] = useState(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState(null); // State for success messages
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedDept = sessionStorage.getItem("editDepartment");

    // ✅ Check for user and JWT token immediately on load
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    if (!storedDept) {
      setError("No department selected. Redirecting to company page.");
      setTimeout(() => {
        router.push("/company");
      }, 500);
      return;
    }

    const dept = JSON.parse(storedDept);
    setDepartment(dept);
    setDepartmentName(dept.departmentName || "");
    setDepartmentDescription(dept.departmentDescription || "");
  }, []);

  const handleSave = async () => {
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    if (!departmentName.trim()) {
      setError("Department name is required.");
      return;
    }

    // Re-check user and token before submitting
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Please log in again.");
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
      return;
    }

    const payload = {
      ...department,
      departmentName: departmentName.trim(),
      departmentDescription: departmentDescription.trim(),
      // Assuming createdDate and updatedDate are handled by the backend
      updatedDate: null, // Set to null or remove if backend handles timestamp
      createdDate: null // Set to null or remove if backend handles timestamp
    };

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
          // ✅ Removed credentials: "include"
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update department:", response.status, response.statusText, errorText);
        throw new Error(`Failed to update department: ${response.status} ${response.statusText} - ${errorText}`);
      }

      setSuccessMessage("Department updated successfully!");
      setTimeout(() => {
        router.push("/company");
      }, 1500); // Give user a moment to see the success message
    } catch (err) {
      console.error("Error updating department:", err);
      setError("Error updating department: " + err.message);
      // If fetching fails due to token issues (e.g., token expired/invalid),
      // consider redirecting to login after a delay.
      if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
           setTimeout(() => {
               router.replace("/login");
           }, 1500);
      }
    }
  };

  const handleCancel = () => {
    router.push("/company");
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  if (!department) return <div className="text-center mt-10">Loading department data...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Department</h2>

      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      {/* Error message is already handled by the `if (error)` block above */}

      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1">
          Department Name
        </label>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold text-gray-700 mb-1">
          Department Description
        </label>
        <textarea
          value={departmentDescription}
          onChange={(e) => setDepartmentDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        ></textarea>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditDepartment;
