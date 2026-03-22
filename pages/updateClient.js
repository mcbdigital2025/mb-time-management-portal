"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api';
import { User, Save, XCircle, Loader2 } from "lucide-react";

const UpdateClient = () => {
  const [form, setForm] = useState(null);
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedClient = sessionStorage.getItem("selectedClient");

    if (!storedUser || !storedUser.jwtToken) {
      setError("User session expired. Redirecting to login...");
      setTimeout(() => router.replace("/login"), 1500);
      return;
    }

    if (storedClient) {
      const client = JSON.parse(storedClient);
      setForm({
        clientId: client.clientId,
        companyId: client.companyId,
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        email: client.email || "",
        phoneNumber: client.phoneNumber || "",
        address: client.address || "",
        age: client.age || "",
        gender: client.gender || "",
        status: client.status || "Active",
      });
    } else {
      setError("No client data selected. Returning to directory...");
      setTimeout(() => router.push("/client"), 1500);
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (response.ok) {
        setSuccessMessage("Client profile updated successfully!");
        setTimeout(() => router.push("/client"), 1500);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update client.");
      }
    } catch (err) {
      setError(err.message);
      if (err.message.includes("401") || err.message.includes("token")) {
        setTimeout(() => router.replace("/login"), 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-3 py-2.5 border border-[#008080]/30 bg-white/50 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium";
  const labelClasses = "text-sm font-bold text-gray-600 mb-1";

  if (!form && !error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
        <Loader2 className="animate-spin text-[#008080]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full py-10 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/20 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-2xl border border-white/40 p-8">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#008080] via-cyan-700 to-[#008080] bg-clip-text text-transparent border-b border-[#008080]/20 pb-2">
              Update Client Profile
            </h2>
          </div>

          {error && <div className="bg-red-50/80 text-red-600 p-4 rounded-xl mb-6 font-semibold border border-red-200">{error}</div>}
          {successMessage && <div className="bg-teal-50/80 text-teal-700 p-4 rounded-xl mb-6 font-semibold border border-teal-200">{successMessage}</div>}

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Read-Only Identity Section */}
            <div className="flex flex-col">
              <label className={labelClasses}>Client ID</label>
              <input value={form.clientId} disabled className={`${inputClasses} bg-gray-200/50 cursor-not-allowed text-gray-500`} />
            </div>

            <div className="flex flex-col">
              <label className={labelClasses}>Company ID</label>
              <input value={form.companyId} disabled className={`${inputClasses} bg-gray-200/50 cursor-not-allowed text-gray-500`} />
            </div>

            {/* Editable Fields */}
            <div className="flex flex-col">
              <label className={labelClasses}>First Name <span className="text-red-500">*</span></label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required className={inputClasses} />
            </div>

            <div className="flex flex-col">
              <label className={labelClasses}>Last Name <span className="text-red-500">*</span></label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className={inputClasses} />
            </div>

            <div className="flex flex-col">
              <label className={labelClasses}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClasses} />
            </div>

            <div className="flex flex-col">
              <label className={labelClasses}>Phone Number</label>
              <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className={inputClasses} />
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label className={labelClasses}>Residential Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={3} className={`${inputClasses} resize-none`} />
            </div>

            <div className="flex flex-col">
              <label className={labelClasses}>Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} className={inputClasses} />
            </div>

            <div className="flex flex-col">
              <label className={labelClasses}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputClasses}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Nonbinary">Nonbinary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label className={labelClasses}>Account Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClasses}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-[#008080] text-white font-bold py-3.5 rounded-xl hover:bg-[#035f5f] transition-all shadow-lg disabled:bg-gray-400 cursor-pointer"
              >
                <Save size={20} />
                {isSubmitting ? "Updating..." : "Update Client"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/client")}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F75D42] text-white font-bold py-3.5 rounded-xl hover:bg-[#d44b35] transition-all shadow-lg cursor-pointer"
              >
                <XCircle size={20} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateClient;