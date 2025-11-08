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
    gender: "", // Default to empty, user must select
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    // Basic email regex for format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    // Client-side validation
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

    // Ensure API base URL is configured
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      setError("API URL is not configured. Please check your environment variables.");
      setIsSubmitting(false);
      return;
    }

    const payload = { ...formData };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/compRegistration/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          // For a public registration endpoint, credentials: "include" is typically not needed
          // as no prior authentication (like JWT) is involved.
          // credentials: "include", // Removed as per discussion
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Registration failed:", response.status, response.statusText, errorText);
        throw new Error(`Registration failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      setSuccessMessage("Registration successful! Redirecting to login page...");
      // On successful save, route to login.js page
      setTimeout(() => {
        router.replace("/login");
      }, 2000); // Redirect after 2 seconds to show success message
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "An unexpected error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/"); // Route to login page on cancel
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Company & User Registration
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleRegister}>
        {/* Company Details */}
        <fieldset className="border border-gray-300 p-4 rounded-lg mb-6">
          <legend className="text-lg font-semibold px-2">Company Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="companyCode" className="block text-sm font-medium text-gray-700">Company Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="companyCode"
                id="companyCode"
                value={formData.companyCode}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700">Company Description</label>
              <textarea
                name="companyDescription"
                id="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>
        </fieldset>

        {/* Department Details */}
        <fieldset className="border border-gray-300 p-4 rounded-lg mb-6">
          <legend className="text-lg font-semibold px-2">Department Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">Department ID <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="departmentId"
                id="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">Department Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="departmentName"
                id="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="departmentDescription" className="block text-sm font-medium text-gray-700">Department Description</label>
              <textarea
                name="departmentDescription"
                id="departmentDescription"
                value={formData.departmentDescription}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>
        </fieldset>

        {/* User (Employee) Details */}
        <fieldset className="border border-gray-300 p-4 rounded-lg mb-6">
          <legend className="text-lg font-semibold px-2">Your Details (Admin User)</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled={isSubmitting}
              >
                <option value="">Select Gender</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
