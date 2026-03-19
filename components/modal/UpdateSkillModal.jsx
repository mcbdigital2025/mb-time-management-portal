"use client";

import React, { useEffect, useState } from "react";
import { authenticatedFetch } from "../../utils/api";
import { toast } from "react-toastify";

const INITIAL_FORM = {
  employeeSkillId: "",
  skillName: "",
  skillLevel: "INTERMEDIATE",
  yearsExperience: 0,
  certificationName: "",
  expiryDate: "",
  companyId: "",
  employeeId: "",
};

const UpdateSkillModal = ({
  isOpen,
  onClose,
  selectedSkill,
  onSuccess,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && selectedSkill) {
      setFormData({
        employeeSkillId: selectedSkill.employeeSkillId || "",
        skillName: selectedSkill.skillName || "",
        skillLevel: selectedSkill.skillLevel || "INTERMEDIATE",
        yearsExperience: selectedSkill.yearsExperience ?? 0,
        certificationName: selectedSkill.certificationName || "",
        expiryDate: selectedSkill.expiryDate
          ? String(selectedSkill.expiryDate).split("T")[0]
          : "",
        companyId: selectedSkill.companyId || "",
        employeeId: selectedSkill.employeeId || "",
      });
      setError("");
    }

    if (!isOpen) {
      setFormData(INITIAL_FORM);
      setError("");
      setLoading(false);
    }
  }, [isOpen, selectedSkill]);

  if (!isOpen || !selectedSkill) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearsExperience" ? value : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/updateEmployeeSkill/${encodeURIComponent(
          formData.companyId
        )}/${encodeURIComponent(formData.employeeId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            yearsExperience:
              formData.yearsExperience === ""
                ? 0
                : Number(formData.yearsExperience),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(
          `Failed to update skill: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Update skill error:", err);
      setError(err.message || "Failed to update skill.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
        <div className="bg-[linear-gradient(135deg,#f0fdfa_0%,#ecfeff_45%,#f8fafc_100%)] border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-teal-700">
                Update Skill
              </div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                Edit Employee Skill
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Update this skill without leaving the current page.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl bg-[#F75D42] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#de4d33] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Selected Skill
            </div>
            <div className="mt-1 text-base font-bold text-slate-900">
              {selectedSkill.skillName}
            </div>
            <div className="text-sm text-slate-500">
              Skill ID: {selectedSkill.employeeSkillId}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Skill Name
              </label>
              <input
                type="text"
                name="skillName"
                value={formData.skillName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Skill Level
                </label>
                <select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Years of Experience
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Certification Name
              </label>
              <input
                type="text"
                name="certificationName"
                value={formData.certificationName || ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate || ""}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#008080] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(0,128,128,0.22)] transition hover:bg-[#026d6d] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSkillModal;