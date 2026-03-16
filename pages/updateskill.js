"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from "../utils/api";

const UpdateSkill = () => {
  const [formData, setFormData] = useState({
    employeeSkillId: "",
    skillName: "",
    skillLevel: "INTERMEDIATE",
    yearsExperience: 0,
    certificationName: "",
    expiryDate: "",
    companyId: "",
    employeeId: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const skillData = JSON.parse(sessionStorage.getItem("selectedSkill"));
    if (!skillData) {
      router.push("/viewemployees");
      return;
    }
    setFormData(skillData);
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/updateEmployeeSkill/${encodeURIComponent(formData.companyId)}/${encodeURIComponent(formData.employeeId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update skill");

      router.push("/viewemployees");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Employee Skill</h2>

      {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Skill Name</label>
          <input
            type="text"
            name="skillName"
            value={formData.skillName}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Skill Level</label>
            <select
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              step="0.1"
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Certification Name</label>
          <input
            type="text"
            name="certificationName"
            value={formData.certificationName || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-all disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSkill;