"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api';
import { BookOpen, Save, XCircle, Loader2 } from "lucide-react";

const UpdateClientLearningNeeds = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOGIC FUNCTIONS ---

  const handleCancel = () => {
    router.push("/client");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const currentValues = formData[name] ? formData[name].split(",").filter(Boolean) : [];
      if (checked) {
        currentValues.push(value);
      } else {
        const index = currentValues.indexOf(value);
        if (index > -1) currentValues.splice(index, 1);
      }
      setFormData({ ...formData, [name]: currentValues.join(",") });
    } else if (type === "radio") {
      setFormData({ ...formData, [name]: value === "true" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientLearnNeeds/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSuccessMessage("Learning needs updated successfully!");
        setTimeout(() => router.push("/client"), 1500);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update record.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- EFFECTS ---

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedData = sessionStorage.getItem("selectedClientLearningNeeds");

    if (!storedUser?.jwtToken) {
      setError("Session expired. Redirecting to login...");
      setTimeout(() => router.replace("/login"), 1500);
      return;
    }

    if (storedData) {
      setFormData(JSON.parse(storedData));
    } else {
      setError("No record selected. Returning to directory...");
      setTimeout(() => router.push("/client"), 1500);
    }
  }, [router]);

  // --- STYLING ---

  const inputClasses = "w-full px-3 py-2.5 border border-[#008080]/30 bg-white/50 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-gray-800";
  const labelClasses = "text-sm font-bold text-gray-700 mb-1";

  // --- RENDER ---

  if (!formData && !error) {
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
              <BookOpen size={32} />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#008080] to-teal-600 bg-clip-text text-transparent uppercase tracking-tight">
              Update Learning Needs
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium text-gray-500">Modify existing educational requirements</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border border-red-100">{error}</div>}
          {successMessage && <div className="bg-teal-50 text-teal-700 p-4 rounded-xl mb-6 font-medium border border-teal-100">{successMessage}</div>}

          <form onSubmit={handleUpdate} className="space-y-8">

            {/* IDs Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#008080]/5 p-6 rounded-xl border border-[#008080]/10">
              <div className="flex flex-col">
                <label className={labelClasses}>Learning ID</label>
                <input value={formData?.clientLearningId || ""} readOnly className={`${inputClasses} bg-gray-100/50 cursor-not-allowed text-gray-500`} />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Client ID</label>
                <input value={formData?.clientId || ""} readOnly className={`${inputClasses} bg-gray-100/50 cursor-not-allowed text-gray-500`} />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Company ID</label>
                <input value={formData?.companyId || ""} readOnly className={`${inputClasses} bg-gray-100/50 cursor-not-allowed text-gray-500`} />
              </div>
            </div>

            {/* Core Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className={labelClasses}>Preferred Method</label>
                <select name="preferredLearningMethod" value={formData?.preferredLearningMethod || "Visual"} onChange={handleChange} className={inputClasses}>
                  {["Visual", "Auditory", "Reading/Writing", "Kinesthetic", "Other"].map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Literacy Level</label>
                <select name="literacyLevel" value={formData?.literacyLevel || "Basic"} onChange={handleChange} className={inputClasses}>
                  {["Low", "Basic", "Intermediate", "Advanced"].map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Digital Skills</label>
                <select name="digitalSkillsLevel" value={formData?.digitalSkillsLevel || "Beginner"} onChange={handleChange} className={inputClasses}>
                  {["None", "Beginner", "Intermediate", "Advanced"].map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            {/* Radios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-4 rounded-xl border border-gray-200 bg-white/30">
                <label className={`${labelClasses} block mb-3`}>Assistive Technology Required?</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-600">
                    <input type="radio" name="assistiveTechnologyRequired" value="true" checked={formData?.assistiveTechnologyRequired === true} onChange={handleChange} className="w-4 h-4 accent-[#008080]" /> Yes
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-600">
                    <input type="radio" name="assistiveTechnologyRequired" value="false" checked={formData?.assistiveTechnologyRequired === false} onChange={handleChange} className="w-4 h-4 accent-[#008080]" /> No
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white/30">
                <label className={`${labelClasses} block mb-3`}>Onsite Support Required?</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-600">
                    <input type="radio" name="onsiteSupportRequired" value="true" checked={formData?.onsiteSupportRequired === true} onChange={handleChange} className="w-4 h-4 accent-[#008080]" /> Yes
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-600">
                    <input type="radio" name="onsiteSupportRequired" value="false" checked={formData?.onsiteSupportRequired === false} onChange={handleChange} className="w-4 h-4 accent-[#008080]" /> No
                  </label>
                </div>
              </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-[#008080]/20 bg-[#008080]/5">
                <label className={`${labelClasses} block border-b border-[#008080]/20 pb-2 mb-4 uppercase tracking-widest text-[11px]`}>Preferred Days</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <label key={day} className="flex items-center gap-3 p-2 bg-white/50 rounded-lg hover:bg-white transition-colors cursor-pointer text-sm font-semibold text-gray-600">
                      <input type="checkbox" name="preferredTrainingDays" value={day} checked={formData?.preferredTrainingDays?.includes(day)} onChange={handleChange} className="w-4 h-4 rounded accent-[#008080]" /> {day}
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl border border-[#008080]/20 bg-[#008080]/5">
                <label className={`${labelClasses} block border-b border-[#008080]/20 pb-2 mb-4 uppercase tracking-widest text-[11px]`}>Preferred Times</label>
                <div className="flex flex-col gap-3">
                  {["Morning", "Afternoon", "Evening"].map((time) => (
                    <label key={time} className="flex items-center gap-3 p-2 bg-white/50 rounded-lg hover:bg-white transition-colors cursor-pointer text-sm font-semibold text-gray-600">
                      <input type="checkbox" name="preferredTrainingTimes" value={time} checked={formData?.preferredTrainingTimes?.includes(time)} onChange={handleChange} className="w-4 h-4 rounded accent-[#008080]" /> {time}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Textareas */}
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col">
                <label className={labelClasses}>Primary Training Goal</label>
                <textarea name="trainingGoal" value={formData?.trainingGoal || ""} onChange={handleChange} rows="3" className={inputClasses} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className={labelClasses}>Behavioral Support Notes</label>
                <textarea name="behavioralSupportNotes" value={formData?.behavioralSupportNotes || ""} onChange={handleChange} rows="3" className={inputClasses} />
              </div>
              <div className="flex flex-col">
                <label className={labelClasses}>Communication Support</label>
                <textarea name="communicationSupport" value={formData?.communicationSupport || ""} onChange={handleChange} rows="3" className={inputClasses} />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-[#008080] text-white font-black py-4 rounded-xl hover:bg-[#035f5f] transition-all shadow-lg shadow-teal-100 disabled:bg-gray-400 cursor-pointer"
              >
                <Save size={20} /> {isSubmitting ? "UPDATING..." : "UPDATE RECORDS"}
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

export default UpdateClientLearningNeeds;