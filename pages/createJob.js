"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api';
import { Briefcase, Save, XCircle, Loader2 } from "lucide-react";

const JOB_TYPES = [
  "Course", "Support", "Service", "Assessment", "Planning", "Transport",
  "Administration", "Community Engagement", "Supervision",
  "Technology Support", "Consultation"
];

const CreateJob = () => {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let parsedUser = null;

    if (storedUser) {
      parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    if (!parsedUser || !parsedUser.companyId || !parsedUser.jwtToken) {
      setError("User session or token is missing. Redirecting...");
      setTimeout(() => router.replace("/login"), 1500);
      return;
    }

    setJob({
      jobId: "",
      companyId: parsedUser.companyId,
      jobCode: "",
      jobType: "Course",
      ratesPerHour: 0,
      ratesPerHourDiscount_1: 0,
      ratesPerHourDiscount_2: 0,
      employeePercentage: 0,
      currency: "AUD",
    });
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: name.includes("rates") || name === "employeePercentage" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (!job.jobId || !job.jobCode || !job.jobType) {
        setError("Job ID, Job Code, and Job Type are required.");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/job/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create job.");
      }

      setSuccessMessage("Job created successfully!");
      setTimeout(() => router.push("/job"), 1500);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
           setTimeout(() => router.replace("/login"), 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/job");
  };

  const inputClasses = "w-full px-3 py-2.5 border border-[#008080]/30 bg-white/50 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-gray-800 placeholder-gray-400";
  const labelClasses = "text-sm font-bold text-gray-700 mb-1";

  if (!job && !error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-[#008080]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full py-10 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white/40 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 p-8">

          {/* Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="p-3 bg-teal-100 rounded-full text-[#008080] mb-4">
              <Briefcase size={32} />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#008080] to-teal-600 bg-clip-text text-transparent uppercase tracking-tight">
              Create New Job
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium text-gray-500">Define job codes and billing rates</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border border-red-100">{error}</div>}
          {successMessage && <div className="bg-teal-50 text-teal-700 p-4 rounded-xl mb-6 font-medium border border-teal-100">{successMessage}</div>}

          <form onSubmit={handleSave} className="space-y-6">

            {/* Core Identification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#008080]/5 p-6 rounded-xl border border-[#008080]/10">
              <div className="flex flex-col">
                <label className={labelClasses}>Company ID</label>
                <input
                  type="text"
                  name="companyId"
                  value={job.companyId}
                  readOnly
                  className={`${inputClasses} bg-gray-100/50 cursor-not-allowed text-gray-500`}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Job ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="jobId"
                  value={job.jobId}
                  onChange={handleChange}
                  placeholder="e.g. JOB-001"
                  className={inputClasses}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Job Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="jobCode"
                  value={job.jobCode}
                  onChange={handleChange}
                  placeholder="Internal Code"
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            {/* Type & Rates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className={labelClasses}>Job Type <span className="text-red-500">*</span></label>
                <select
                  name="jobType"
                  value={job.jobType}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Base Rate Per Hour</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-bold">$</span>
                  <input
                    type="number"
                    name="ratesPerHour"
                    step="0.01"
                    value={job.ratesPerHour}
                    onChange={handleChange}
                    className={`${inputClasses} pl-7`}
                  />
                </div>
              </div>
            </div>

            {/* Discounts & Payroll */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className={labelClasses}>Discount Tier 1</label>
                <input
                  type="number"
                  name="ratesPerHourDiscount_1"
                  step="0.01"
                  value={job.ratesPerHourDiscount_1}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Discount Tier 2</label>
                <input
                  type="number"
                  name="ratesPerHourDiscount_2"
                  step="0.01"
                  value={job.ratesPerHourDiscount_2}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Employee Payout %</label>
                <div className="relative">
                  <input
                    type="number"
                    name="employeePercentage"
                    step="0.01"
                    value={job.employeePercentage}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400 font-bold">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col md:col-start-1">
                    <label className={labelClasses}>Currency</label>
                    <input
                    type="text"
                    name="currency"
                    value={job.currency}
                    onChange={handleChange}
                    className={inputClasses}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-[#008080] text-white font-black py-4 rounded-xl hover:bg-[#035f5f] transition-all shadow-lg shadow-teal-100 disabled:bg-gray-400 cursor-pointer"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {isSubmitting ? "SAVING..." : "SAVE JOB"}
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

export default CreateJob;