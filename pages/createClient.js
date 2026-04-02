"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api';
import { UserPlus, Save, XCircle, Loader2 } from "lucide-react";

const CreateClient = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientId: "",
    companyId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    status: "Active",
    address: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedCompanyId = sessionStorage.getItem("companyId");

    if (!storedUser?.jwtToken || !storedCompanyId) {
      setError("User session or company information is missing. Redirecting...");
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
      return;
    }

    setFormData((prev) => ({ ...prev, companyId: storedCompanyId }));
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    router.push("/client");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    // Basic validation
    if (!formData.clientId || !formData.firstName || !formData.email) {
        setError("Please fill in all required fields (Client ID, First Name, Email).");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create client.");
      }

      setSuccessMessage("Client created successfully!");
      setTimeout(() => {
        router.push("/client");
      }, 1500);

    } catch (err) {
      setError(err.message);
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
           setTimeout(() => router.replace("/login"), 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-3 py-2.5 border border-[#008080]/30 bg-white/50 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-400";
  const labelClasses = "text-sm font-bold text-gray-700 mb-1";

  return (
    <div className="min-h-screen w-full py-10 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 p-8">

          {/* Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="p-3 bg-teal-100 rounded-full text-[#008080] mb-4">
              <UserPlus size={32} />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#008080] to-teal-600 bg-clip-text text-transparent uppercase tracking-tight">
              Register New Client
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">Enter personal and account details for the client</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border border-red-100">{error}</div>}
          {successMessage && <div className="bg-teal-50 text-teal-700 p-4 rounded-xl mb-6 font-medium border border-teal-100">{successMessage}</div>}

          <form onSubmit={handleSave} className="space-y-6">

            {/* ID Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#008080]/5 p-6 rounded-xl border border-[#008080]/10">
              <div className="flex flex-col">
                <label className={labelClasses}>Client ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="clientId"
                  placeholder="e.g. CLI-1001"
                  value={formData.clientId}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Company ID</label>
                <input
                  type="text"
                  name="companyId"
                  value={formData.companyId}
                  readOnly
                  className={`${inputClasses} bg-gray-100/50 cursor-not-allowed text-gray-500`}
                />
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className={labelClasses}>First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className={labelClasses}>Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className={labelClasses}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Account Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClasses}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className={labelClasses}>Residential Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className={inputClasses}
                placeholder="Street name, suburb, city..."
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-[#008080] text-white font-black py-4 rounded-xl hover:bg-[#035f5f] transition-all shadow-lg shadow-teal-100 disabled:bg-gray-400 cursor-pointer"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {isSubmitting ? "PROCESSING..." : "CREATE CLIENT"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F75D42] text-white font-black py-4 rounded-xl hover:bg-[#d44b35] transition-all shadow-lg shadow-red-100 cursor-pointer"
              >
                <XCircle size={20} /> CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;