"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const CreateDepartment = () => {
  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [companyCode, setCompanyCode] = useState(null);
  const [error, setError] = useState(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState(null); // State for success messages
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedCompanyInfo = sessionStorage.getItem("companyInfo");

    // ✅ Check for user and JWT token
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    if (storedCompanyInfo) {
      try {
        const parsed = JSON.parse(storedCompanyInfo);
        setCompanyId(parsed.companyId);
        setCompanyCode(parsed.companyCode);
        setDepartmentId(parsed.companyCode + "_")
      } catch (e) {
        setError("Invalid company info in session storage. Redirecting to company page.");
        setTimeout(() => {
          router.push("/company");
        }, 500);
      }
    } else {
      setError("Company info not found in session storage. Redirecting to company page.");
      setTimeout(() => {
        router.push("/company");
      }, 500);
    }
  }, []);

  const handleSave = async () => {
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    if (!departmentName.trim()) {
      setError("Department name is required.");
      return;
    }

    // Ensure companyId is available before proceeding
    if (!companyId) {
        setError("Company ID is missing. Cannot create department.");
        return;
    }

    const now = new Date().toISOString();

    const payload = {
      departmentId: departmentId.trim(),
      companyId: companyId.toString(), // Ensure it's a string for the payload
      departmentName: departmentName.trim(),
      departmentDescription: departmentDescription.trim(),
      createdDate: now,
      updatedDate: now,
    };

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          // ✅ Removed credentials: "include"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to create department:", response.status, response.statusText, errorText);
        throw new Error(`Failed to create department: ${response.status} ${response.statusText} - ${errorText}`);
      }

      setSuccessMessage("Department created successfully!");
      setTimeout(() => {
        router.push("/company");
      }, 1500); // Give user a moment to see the success message
    } catch (err) {
      console.error("Error creating department:", err);
      setError("Error creating department: " + err.message);
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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-center text-blue-700">
        Create Department
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <fieldset className="border border-gray-300 rounded p-6 w-full">
        <legend className="text-lg font-semibold px-2">Department Details</legend>

        {/* Read-only Company ID */}
        <div className="w-full mb-4">
          <label className="block font-semibold text-gray-700 mb-1">
            Company ID
          </label>
          <input
            type="text"
            value={companyId || ""}
            readOnly
            className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="w-full mb-4">
          <label className="block font-semibold text-gray-700 mb-1">
            Department ID
          </label>
          <input
            type="text"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required // Make required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block font-semibold text-gray-700 mb-1">
            Department Name
          </label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required // Make required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block font-semibold text-gray-700 mb-1">
            Department Description
          </label>
          <textarea
            value={departmentDescription}
            onChange={(e) => setDepartmentDescription(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
      </fieldset>

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

export default CreateDepartment;
