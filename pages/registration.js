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
    if (!formData.email || !formData.email.includes("@")) return "Valid email is required";
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
        }
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
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-bold">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 font-bold">
            {successMessage}
          </div>
        )}

        {/* Section: Organization (Styled like CompanyDetailsCard) */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 bg-zinc-50/50 px-5 py-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
              Organization Details
            </h3>
          </div>
          <div className="grid grid-cols-1 divide-y divide-zinc-100 md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="divide-y divide-zinc-100">
              <FormField label="Company Code" name="companyCode" value={formData.companyCode} onChange={handleChange} icon={<CompanyIcon />} placeholder="e.g. MCB-01" />
              <FormField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} icon={<CompanyIcon />} placeholder="Legal Business Name" />
            </div>
            <div className="divide-y divide-zinc-100">
              <FormField
                label="Industry Type"
                name="industryType"
                value={formData.industryType}
                onChange={handleChange}
                type="select"
                options={INDUSTRY_OPTIONS}
                icon={<BriefcaseIcon />}
              />
              <FormField label="Description" name="companyDescription" value={formData.companyDescription} onChange={handleChange} icon={<DepartmentIcon />} placeholder="Brief overview" />
            </div>
          </div>
        </div>

        {/* Section: Admin User */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 bg-zinc-50/50 px-5 py-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
              Administrative User
            </h3>
          </div>
          <div className="grid grid-cols-1 divide-y divide-zinc-100 md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="divide-y divide-zinc-100">
              <FormField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} icon={<UserIcon />} />
              <FormField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} icon={<UserIcon />} />
              <FormField label="Gender" name="gender" value={formData.gender} onChange={handleChange} type="select" options={GENDER_OPTIONS} icon={<UserIcon />} />
            </div>
            <div className="divide-y divide-zinc-100">
              <FormField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} icon={<EmailIcon />} />
              <FormField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} icon={<PhoneIcon />} />
              <div className="px-5 py-4 bg-zinc-50/30 flex items-center text-xs text-zinc-500 italic">
                This user will be assigned the Master Admin role.
              </div>
            </div>
          </div>
        </div>

        {/* Section: Primary Department */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 bg-zinc-50/50 px-5 py-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
              Primary Department
            </h3>
          </div>
          <div className="grid grid-cols-1 divide-y divide-zinc-100 md:grid-cols-2 md:divide-x md:divide-y-0">
            <FormField label="Department Name" name="departmentName" value={formData.departmentName} onChange={handleChange} icon={<DepartmentIcon />} placeholder="e.g. Operations" />
            <FormField label="Description" name="departmentDescription" value={formData.departmentDescription} onChange={handleChange} icon={<DepartmentIcon />} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-4 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full rounded-xl border border-zinc-200 bg-white px-8 py-3.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 sm:w-auto cursor-pointer"
          >
            Back to Login
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#008080] px-12 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#006666] active:scale-[0.98] disabled:opacity-50 sm:w-auto cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Complete Registration"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Registration;