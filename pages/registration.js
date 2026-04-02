"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import AuthLayout from "../components/auth/AuthLayout";
import FormField from "../components/auth/FormField";
import {
  BriefcaseIcon,
  CompanyIcon,
  DepartmentIcon,
  EmailIcon,
  PhoneIcon,
  UserIcon,
} from "../components/auth/icons";

const GENDER_OPTIONS = [
  { label: "Select Gender", value: "" },
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const initialFormData = {
  companyCode: "",
  companyName: "",
  companyDescription: "",
  departmentId: "",
  departmentName: "",
  departmentDescription: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  gender: "",
};

const Registration = () => {
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const requiredFields = [
      "companyCode",
      "companyName",
      "departmentId",
      "departmentName",
      "firstName",
      "lastName",
      "email",
    ];

    const hasMissingRequiredField = requiredFields.some(
      (field) => !formData[field]?.trim(),
    );

    if (hasMissingRequiredField) {
      return "Please fill in all required fields (marked with *).";
    }

    if (!validateEmail(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      return "API URL is not configured. Please check your environment variables.";
    }

    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/compRegistration/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Registration failed: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      setSuccessMessage("Registration successful! Redirecting to login page...");
      setTimeout(() => router.replace("/login"), 2000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Company & User Registration"
      subtitle="Create your company and admin user profile"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleRegister}>
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-700">
            <span className="font-semibold">Error: </span>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-800">
            <span className="font-semibold">Success: </span>
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-zinc-800">
              Company Details
            </h3>

            <FormField
              label="Company Code"
              name="companyCode"
              value={formData.companyCode}
              onChange={handleChange}
              required
              placeholder="e.g. MCB001"
              icon={<CompanyIcon />}
              className="mb-4"
              disabled={isSubmitting}
            />

            <FormField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Company name"
              icon={<BriefcaseIcon />}
              className="mb-4"
              disabled={isSubmitting}
            />

            <FormField
              label="Company Description"
              name="companyDescription"
              as="textarea"
              value={formData.companyDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Optional"
              className="mb-4"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-zinc-800">
              Department Details
            </h3>

            <FormField
              label="Department ID"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
              placeholder="e.g. DPT100"
              icon={<DepartmentIcon />}
              className="mb-4"
              disabled={isSubmitting}
            />

            <FormField
              label="Department Name"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              required
              placeholder="Department name"
              icon={<BriefcaseIcon />}
              className="mb-4"
              disabled={isSubmitting}
            />

            <FormField
              label="Department Description"
              name="departmentDescription"
              as="textarea"
              value={formData.departmentDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Optional"
              className="mb-4"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold text-zinc-800">
            Your Details (Admin User)
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="First name"
              icon={<UserIcon />}
              disabled={isSubmitting}
            />

            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Last name"
              icon={<UserIcon />}
              disabled={isSubmitting}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              icon={<EmailIcon />}
              disabled={isSubmitting}
            />

            <FormField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Optional"
              icon={<PhoneIcon />}
              disabled={isSubmitting}
            />

            <FormField
              label="Gender"
              name="gender"
              as="select"
              value={formData.gender}
              onChange={handleChange}
              options={GENDER_OPTIONS}
              icon={<UserIcon />}
              className="md:col-span-2"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/")}
            disabled={isSubmitting}
            className="w-full rounded-full border border-white/40 bg-white/25 px-6 py-3 text-[15px] font-semibold text-zinc-800 backdrop-blur transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#008080] px-8 py-3 text-[15px] font-semibold text-white shadow-[0_10px_25px_rgba(0,128,128,0.25)] transition-colors hover:bg-[#025050] active:bg-[#00b6b6] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-700">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="cursor-pointer text-base font-semibold text-zinc-900 underline-offset-2 hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Registration;