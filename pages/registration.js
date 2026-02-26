"use client";

import { useState } from "react";
import { useRouter } from "next/router";

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const Registration = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (
      !formData.companyCode ||
      !formData.companyName ||
      !formData.departmentId ||
      !formData.departmentName ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email
    ) {
      setError("Please fill in all required fields (marked with *).");
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      setError(
        "API URL is not configured. Please check your environment variables.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/compRegistration/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData }),
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

  const handleCancel = () => router.push("/");

  // Reusable “glass pill input” wrapper (same vibe as Login)
  const Field = ({
    label,
    required,
    icon,
    children,
  }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-zinc-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-white/30 bg-white/25 backdrop-blur px-4 py-3 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400">
        {icon}
        {children}
      </div>
    </div>
  );

  const iconStyle = "h-5 w-5 text-zinc-600/80";

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-4 py-8 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#008080]/20 blur-2xl" />
      <div className="pointer-events-none absolute top-16 -right-24 h-80 w-80 rounded-full bg-blue-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-28 left-10 h-96 w-96 rounded-full bg-purple-500/15 blur-2xl" />

      <form
        onSubmit={handleRegister}
        className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/30 bg-white/20 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] px-6 sm:px-8 py-8"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#008080] via-cyan-600 to-[#008080] bg-clip-text text-transparent">
            MCB TimeSheet Management Portal
          </h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-zin bg-linear-to-r from-[#015f5f] via-cyan-600 to-[#014949] bg-clip-text text-transparent">
            Company & User Registration
          </h2>
          <p className="text-sm text-zinc-600/90 mt-1 ">
            Create your company and admin user profile
          </p>
        </div>

        {/* Alerts */}
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

        {/* Sections (kept, but styled like login) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 mb-3">
              Company Details 
            </h3>

            <Field
              label="Company Code"
              required
              icon={
                <svg className={iconStyle} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4.5 20V8.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2V20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 20v-4.5M12 20v-4.5M16 20v-4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              }
            >
              <input
                type="text"
                name="companyCode"
                value={formData.companyCode}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="e.g. MCB001"
                className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80"
              />
            </Field>

            <Field
              label="Company Name"
              required
              icon={
                <svg className={iconStyle} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 20V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5V20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 8h8M8 12h8M8 16h8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              }
            >
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Company name"
                className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80"
              />
            </Field>

            <div className="mb-4">
              <label className="text-sm font-medium text-zinc-800">
                Company Description
              </label>
              <div className="mt-2 rounded-2xl border border-white/30 bg-white/25 backdrop-blur px-4 py-3 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400">
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  rows={3}
                  disabled={isSubmitting}
                  placeholder="Optional"
                  className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Department */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 mb-3">
              Department Details
            </h3>

            <Field
              label="Department ID"
              required
              icon={
                <svg className={iconStyle} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 4h10v16H7V4Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M9.5 8h5M9.5 12h5M9.5 16h5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              }
            >
              <input
                type="text"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="e.g. DPT100"
                className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80"
              />
            </Field>

            <Field
              label="Department Name"
              required
              icon={
                <svg className={iconStyle} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7h16v13H4V7Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M7 7V4h10v3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              }
            >
              <input
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Department name"
                className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80"
              />
            </Field>

            <div className="mb-4">
              <label className="text-sm font-medium text-zinc-800">
                Department Description
              </label>
              <div className="mt-2 rounded-2xl border border-white/30 bg-white/25 backdrop-blur px-4 py-3 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400">
                <textarea
                  name="departmentDescription"
                  value={formData.departmentDescription}
                  onChange={handleChange}
                  rows={3}
                  disabled={isSubmitting}
                  placeholder="Optional"
                  className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Admin User */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-zinc-800 mb-3">
            Your Details (Admin User)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="First Name"
              required
              icon={
                <svg className={iconStyle} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M4 20a8 8 0 0 1 16 0"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              }
            >
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="First name"
                className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80"
              />
            </Field>

            <Field
              label="Last Name"
              required
              icon={
                <svg className={iconStyle} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M4 20a8 8 0 0 1 16 0"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              }
            >
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Last name"
                className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80"
              />
            </Field>

            <Field
              label="Email"
              required
              icon={
                <svg className={iconStyle} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M6.5 7.5 12 12l5.5-4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Email"
                className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80"
              />
            </Field>

            <Field
              label="Phone Number"
              icon={
                <svg className={iconStyle} viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 4h4l2 5-2 1c1 3 3 5 6 6l1-2 5 2v4c0 1-1 2-2 2C10 22 2 14 2 4c0-1 1-2 2-2h3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Optional"
                className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80"
              />
            </Field>

            <div className="md:col-span-2">
              <div className="mb-4">
                <label className="text-sm font-medium text-zinc-800">Gender</label>
                <div className="mt-2 flex items-center gap-3 rounded-full border border-white/30 bg-white/25 backdrop-blur px-4 py-3 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400">
                  <svg className={iconStyle} viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M4 20a8 8 0 0 1 16 0"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-transparent outline-none text-[15px] text-zinc-800"
                  >
                    <option value="">Select Gender</option>
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-full border border-white/40 bg-white/25 backdrop-blur px-6 py-3 text-[15px] font-semibold text-zinc-800 hover:bg-white/30 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-full bg-[#008080] text-white text-[15px] px-8 py-3 font-semibold
                     shadow-[0_10px_25px_rgba(0,128,128,0.25)]
                     hover:bg-[#025050] active:bg-[#00b6b6] transition-colors"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-zinc-700">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-semibold text-base text-zinc-900 underline-offset-2 hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Registration;