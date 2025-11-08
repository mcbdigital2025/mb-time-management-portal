"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const STATUS_OPTIONS = ["Active", "Inactive"];
const REQUIRED_FIELDS = [
  "employeeId",
  "firstName",
  "lastName",
  "email",
  "dateOfBirth",
  "hireDate",
];

const CreateEmployee = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    hireDate: "",
    gender: GENDER_OPTIONS[0],
    departmentId: "",
    jobTitle: "",
    status: STATUS_OPTIONS[0],
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let parsedUser = null;

    if (storedUser) {
      parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    // ✅ Check for user and JWT token immediately on load
    if (!parsedUser || !parsedUser.jwtToken) {
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      setError("API URL is not configured. Please check your environment variables.");
      setIsSubmitting(false);
      return;
    }

    // Re-check user and token before submitting
    if (!user || !user.companyId || !user.jwtToken) {
      setError("Company ID or user token is missing. Please log in again.");
      setIsSubmitting(false);
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
      return;
    }

    const payload = {
      ...formData,
      companyId: user.companyId,
    };

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          // ✅ Removed credentials: "include"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to create employee:", response.status, response.statusText, errorText);
        throw new Error(`Failed to create employee. Server responded with ${response.status}. ${errorText}`);
      }

      try {
        const responseData = await response.json();
        console.log("Employee created:", responseData);
      } catch (jsonError) {
        console.log("No JSON body returned (which is okay, or API might return plain text success).", jsonError);
      }

      setSuccess("Employee created successfully!");
      setTimeout(() => {
        router.push("/viewemployees");
      }, 2000);
    } catch (err) {
      console.error("Error creating employee:", err);
      setError(err.message || "An unexpected error occurred.");
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

  const formatLabel = (key) => {
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1) + ":";
  };

  const renderInputField = (key, value) => {
    const commonProps = {
      id: key,
      name: key,
      value: value,
      onChange: handleChange,
      className: "w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500",
      required: REQUIRED_FIELDS.includes(key),
      disabled: isSubmitting,
    };

    if (key === "gender" || key === "status") {
      const options = key === "gender" ? GENDER_OPTIONS : STATUS_OPTIONS;
      return (
        <select {...commonProps}>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    const dateFields = ["dateOfBirth", "hireDate"];
    const type = dateFields.includes(key) ? "date" : key === "email" ? "email" : "text";
    return <input type={type} {...commonProps} />;
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create New Employee
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-5">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label htmlFor={key} className="block font-semibold text-gray-700 mb-1">
                {formatLabel(key)}
              </label>
              {renderInputField(key, value)}
            </div>
          ))}

          <div className="flex justify-between gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-1/2 bg-gray-300 text-black font-bold py-2.5 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;
