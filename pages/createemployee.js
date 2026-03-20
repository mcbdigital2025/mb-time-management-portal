"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from "../utils/api";

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
  "accessLevel",
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

    const payload = {
      ...formData,
      companyId: user.companyId,
      accessLevel: `${formData.accessLevel}`,
    };

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
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
      accessLevel: "Access Level",
    };
    return labels[key] || key;
  };

  const renderInputField = (key, value) => {
    const commonProps = {
      name: key,
      value: value,
      onChange: handleChange,
      className:
        "w-full  px-3 py-2.5 cursor-pointer border border-[#008080]/30 bg-[#008080]/30 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none",
      required: REQUIRED_FIELDS.includes(key),
      disabled: isSubmitting,
    };

    if (["gender", "status", "accessLevel"].includes(key)) {
      const options =
        key === "gender"
          ? GENDER_OPTIONS
          : key === "status"
            ? STATUS_OPTIONS
            : ACCESS_LEVEL_OPTIONS;
      return (
        <select {...commonProps}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    const type = ["dateOfBirth", "hireDate"].includes(key)
      ? "date"
      : key === "email"
        ? "email"
        : "text";
    return <input type={type} {...commonProps} />;
  };

  return (
    <div className="min-h-screen w-full  py-10 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      <div className="max-w-4xl mx-auto mt-6 p-8 pt-4 bg-white/20 backdrop-blur-xl shadow-[0_10px_10px_rgba(0,0,0,0.15)] rounded-xl">
      <div className=" flex items-center justify-center mb-8">

        <h2 className="text-xl md:text-3xl  text-center font-bold bg-linear-to-r from-[#008080] via-cyan-600 to-[#008080] bg-clip-text text-transparent border-b">
          Create Employee Profile
        </h2>
      </div>

        {error && (
          <p className="bg-red-50 text-red-600 p-3 rounded mb-4 font-semibold">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-50 text-green-600 p-3 rounded mb-4 font-semibold">
            {success}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-600">
                {formatLabel(key)}{" "}
                {REQUIRED_FIELDS.includes(key) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              {renderInputField(key, value)}
            </div>
          ))}

          <div className="md:col-span-2 flex gap-4 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#008080] text-white font-bold py-3 rounded-lg hover:bg-[#035f5f] disabled:bg-gray-400 transition-colors cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create Employee"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/viewemployees")}
              className="flex-1 bg-[#F75D42] cursor-pointer text-gray-100 font-bold py-3 rounded-lg hover:bg-[#f53918] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;
