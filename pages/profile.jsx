"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from "../utils/api"; 
import EmployeeProfileSkeleton from "../components/loaders/EmployeeProfileSkeleton";

const EmployeeProfile = () => {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.companyId || !storedUser.email || !storedUser.jwtToken) {
      setError("User session or token is missing. Please log in again.");
      setTimeout(() => router.replace("/login"), 500);
      return;
    }

    setUser(storedUser);

    const fetchData = async () => {
      try {
        // 1. Fetch Full Employee Profile
        const empRes = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/email/${encodeURIComponent(storedUser.companyId)}/${encodeURIComponent(storedUser.email)}`,
          { method: "GET", headers: { Accept: "application/json" } }
        );

        if (!empRes.ok) throw new Error(`Failed to fetch profile: ${empRes.status}`);
        const empData = await empRes.json();
        setEmployee(empData);

        // 2. Fetch Skills using the employeeId from the profile
        if (empData?.employeeId) {
          const skillRes = await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/skill/${encodeURIComponent(storedUser.companyId)}/${encodeURIComponent(empData.employeeId)}`,
            { method: "GET", headers: { Accept: "application/json" } }
          );

          if (skillRes.ok) {
            const skillData = await skillRes.json();
            setSkills(Array.isArray(skillData) ? skillData : []);
          }
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, [router]);

  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (!employee) return <EmployeeProfileSkeleton />;

  const defaultImage = employee?.gender === "Male" ? "/male_employee.jpg" : "/female_employee.jpg";

  return (
    <div className="min-h-screen w-full py-10 bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        {/* TOP CARD: PRIMARY INFO */}
        <div className="bg-white/30 backdrop-blur-2xl shadow-xl rounded-2xl overflow-hidden border border-white/40">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-10 items-start">

              {/* Avatar Section */}
              <div className="md:w-1/4 flex flex-col items-center">
                <img
                  src={employee?.profileImage || defaultImage}
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-bold text-gray-800">{employee.firstName} {employee.lastName}</h2>
                  <p className="text-teal-600 font-medium">{employee.jobTitle}</p>
                </div>
              </div>

              {/* Fields Section */}
              <div className="flex-1 w-full">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Personal & Employment Details</h3>
                  <button
                    onClick={() => router.push("/changeLoginEmployeePassword")}
                    className="text-xs bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
                  >
                    Security Settings
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <DetailItem label="Employee ID" value={employee.employeeId} />
                  <DetailItem label="Company ID" value={employee.companyId} />
                  <DetailItem label="Email" value={employee.email} />
                  <DetailItem label="Phone" value={employee.phoneNumber} />
                  <DetailItem label="Gender" value={employee.gender} />
                  <DetailItem label="Date of Birth" value={employee.dateOfBirth} />
                  <DetailItem label="Hire Date" value={employee.hireDate} />
                  <DetailItem label="Department" value={employee.departmentId} />
                  <DetailItem label="Status" value={employee.status} highlight />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CARD: SKILLS TABLE */}
        <div className="bg-white/50 backdrop-blur-xl shadow-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-teal-900">Professional Skills & Certifications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-teal-50 text-teal-800 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Skill Name</th>
                  <th className="px-6 py-4 font-semibold">Level</th>
                  <th className="px-6 py-4 font-semibold">Experience</th>
                  <th className="px-6 py-4 font-semibold">Certification</th>
                  <th className="px-6 py-4 font-semibold">Expiry Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <tr key={skill.employeeSkillId} className="hover:bg-teal-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">{skill.skillName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${getLevelBadge(skill.skillLevel)}`}>
                          {skill.skillLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{skill.yearsExperience} Years</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{skill.certificationName || "General Practice"}</td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">{skill.expiryDate || "Indefinite"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                      No skills or certifications currently on file.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// UI Helper Components
const DetailItem = ({ label, value, highlight }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{label}</span>
    <span className={`text-sm font-semibold ${highlight ? 'text-teal-600' : 'text-gray-700'}`}>
      {value || "Not Set"}
    </span>
  </div>
);

const getLevelBadge = (level) => {
  switch (level?.toUpperCase()) {
    case 'EXPERT': return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
    case 'ADVANCED': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'INTERMEDIATE': return 'bg-amber-100 text-amber-700 border border-amber-200';
    default: return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};

export default EmployeeProfile;