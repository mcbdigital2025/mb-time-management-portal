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

// Industry Options matching your SQL ENUM
const INDUSTRY_OPTIONS = [
  { label: "Select Industry Type", value: "" },
  { label: "NDIS/Age Care", value: "NDIS/Age Care" },
  { label: "Online Learning", value: "Online Learning" },
  { label: "Security Guard", value: "Security Guard" },
  { label: "Healthcare & Wellness", value: "Healthcare & Wellness" },
  { label: "Professional Services", value: "Professional Services" },
  { label: "Field Services", value: "Field Services" },
  { label: "Education & Training", value: "Education & Training" },
  { label: "Specialized Transport", value: "Specialized Transport" },
];

const initialFormData = {
  companyCode: "",
  companyName: "",
  companyDescription: "",
  industryType: "",
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

  const validateForm = () => {
    if (!formData.companyCode) return "Company Code is required";
    if (!formData.companyName) return "Company Name is required";
    if (!formData.industryType) return "Please select an Industry Type";
    if (!formData.email || !formData.email.includes("@"))
      return "Valid email is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        setSuccessMessage("Registration successful! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <AuthLayout
    title="Create Organization"
    subtitle="Register your company and administrative profile"
    maxWidth="max-w-3xl"
  >
    <form onSubmit={handleSubmit} autoComplete="off">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900">
        Organization Details
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="Company Code"
          name="companyCode"
          value={formData.companyCode}
          onChange={handleChange}
          icon={<CompanyIcon />}
          placeholder="e.g. MCB-01"
          required
          disabled={isSubmitting}
        />

        <FormField
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          icon={<CompanyIcon />}
          placeholder="Legal Business Name"
          required
          disabled={isSubmitting}
        />

        <FormField
          label="Industry Type"
          name="industryType"
          value={formData.industryType}
          onChange={handleChange}
          as="select"
          options={INDUSTRY_OPTIONS}
          icon={<BriefcaseIcon />}
          required
          disabled={isSubmitting}
        />

        <FormField
          label="Company Description"
          name="companyDescription"
          value={formData.companyDescription}
          onChange={handleChange}
          icon={<DepartmentIcon />}
          placeholder="Brief overview"
          disabled={isSubmitting}
        />
      </div>

      <h3 className="mb-4 mt-8 text-sm font-bold uppercase tracking-wider text-zinc-900">
        Administrative User
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          icon={<UserIcon />}
          disabled={isSubmitting}
        />

        <FormField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          icon={<UserIcon />}
          disabled={isSubmitting}
        />

        <FormField
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          as="select"
          options={GENDER_OPTIONS}
          icon={<UserIcon />}
          disabled={isSubmitting}
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          icon={<EmailIcon />}
          required
          disabled={isSubmitting}
        />

        <FormField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          icon={<PhoneIcon />}
          disabled={isSubmitting}
        />

        <div className="flex items-center rounded-full border border-white/30 bg-white/25 px-4 py-3 text-xs italic text-zinc-500 backdrop-blur">
          This user will be assigned the Master Admin role.
        </div>
      </div>

      <h3 className="mb-4 mt-8 text-sm font-bold uppercase tracking-wider text-zinc-900">
        Primary Department
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="Department Name"
          name="departmentName"
          value={formData.departmentName}
          onChange={handleChange}
          icon={<DepartmentIcon />}
          placeholder="e.g. Operations"
          disabled={isSubmitting}
        />

        <FormField
          label="Department Description"
          name="departmentDescription"
          value={formData.departmentDescription}
          onChange={handleChange}
          icon={<DepartmentIcon />}
          disabled={isSubmitting}
        />
      </div>

      <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => router.push("/login")}
          disabled={isSubmitting}
          className="text-sm text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline disabled:cursor-not-allowed disabled:opacity-70"
        >
          Back to Login
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#008080] py-3 text-[15px] font-semibold text-white shadow-[0_10px_25px_rgba(0,128,128,0.25)] transition-colors hover:bg-[#025050] active:bg-[#00b6b6] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-10 cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Complete Registration"}
        </button>
      </div>

      {successMessage && (
        <p className="mt-4 text-center text-[14px] font-semibold text-emerald-600">
          {successMessage}
        </p>
      )}

      {error && (
        <p className="mt-4 text-center text-[14px] font-semibold text-red-600">
          {error}
        </p>
      )}
    </form>
  </AuthLayout>
);
};

export default Registration;
