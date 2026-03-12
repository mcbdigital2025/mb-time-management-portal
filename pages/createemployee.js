"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api';

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const STATUS_OPTIONS = ["Active", "Inactive"];
const ACCESS_LEVEL_OPTIONS = ["Basic", "Administrator", "Supervisor"];

const REQUIRED_FIELDS = [
  "employeeId",
  "firstName",
  "lastName",
  "email",
  "dateOfBirth",
  "hireDate",
  "accessLevel"
];

const CreateEmployee = () => {
  const router = useRouter();

  // ✅ Defined exactly 12 fields for the UI
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
    accessLevel: ACCESS_LEVEL_OPTIONS[0],
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (!parsedUser.jwtToken) router.replace("/login");
    } else {
      router.replace("/login");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!user?.companyId) {
      setError("Session expired. Please log in again.");
      return;
    }

    // Format for Backend (adding ROLE_ prefix)
    const payload = {
      ...formData,
      companyId: user.companyId,
      accessLevel: `ROLE_${formData.accessLevel}`
    };

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to create employee profile.");

      setSuccess("Employee created successfully!");
      setTimeout(() => router.push("/viewemployees"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLabel = (key) => {
    const labels = {
      employeeId: "Employee ID",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phoneNumber: "Phone Number",
      dateOfBirth: "Date of Birth",
      hireDate: "Hire Date",
      gender: "Gender",
      departmentId: "Department ID",
      jobTitle: "Job Title",
      status: "Employment Status",
      accessLevel: "Access Level"
    };
    return labels[key] || key;
  };

  const renderInputField = (key, value) => {
    const commonProps = {
      name: key,
      value: value,
      onChange: handleChange,
      className: "w-full p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none",
      required: REQUIRED_FIELDS.includes(key),
      disabled: isSubmitting,
    };

    if (["gender", "status", "accessLevel"].includes(key)) {
      const options = key === "gender" ? GENDER_OPTIONS :
                      key === "status" ? STATUS_OPTIONS : ACCESS_LEVEL_OPTIONS;
      return (
        <select {...commonProps}>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }

    const type = ["dateOfBirth", "hireDate"].includes(key) ? "date" :
                 key === "email" ? "email" : "text";
    return <input type={type} {...commonProps} />;
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Create Employee Profile</h2>

      {error && <p className="bg-red-50 text-red-600 p-3 rounded mb-4 font-semibold">{error}</p>}
      {success && <p className="bg-green-50 text-green-600 p-3 rounded mb-4 font-semibold">{success}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600">
              {formatLabel(key)} {REQUIRED_FIELDS.includes(key) && <span className="text-red-500">*</span>}
            </label>
            {renderInputField(key, value)}
          </div>
        ))}

        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isSubmitting ? "Creating..." : "Save Employee"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/viewemployees")}
            className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;