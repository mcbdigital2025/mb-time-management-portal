"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from "../utils/api"; 
import EmployeeProfileSkeleton from "../components/loaders/EmployeeProfileSkeleton";

const EmployeeProfile = () => {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    timeZone: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    jobTitle: "",
    hireDate: "",
    departmentId: "",
    status: "",
    employeeId: "",
    companyId: "",
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.companyId || !storedUser.email || !storedUser.jwtToken) {
      setError("User session or token is missing. Please log in again.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    setUser(storedUser);

    const fetchEmployee = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/email/${encodeURIComponent(storedUser.companyId)}/${encodeURIComponent(storedUser.email)}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch employee data: ${response.status}`);
        }
        const data = await response.json();
        setEmployee(data);
        setFormData({
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          timeZone: data?.timeZone || "",
          phoneNumber: data?.phoneNumber || "",
          email: data?.email || "",
          dateOfBirth: data?.dateOfBirth || "",
          gender: data?.gender || "",
          jobTitle: data?.jobTitle || "",
          hireDate: data?.hireDate || "",
          departmentId: data?.departmentId || "",
          status: data?.status || "",
          employeeId: data?.employeeId || "",
          companyId: data?.companyId || storedUser.companyId || "",
        });
      } catch (err) {
        console.error("Error in fetchEmployee:", err);
        setError(err.message);
        if (err.message.includes("401")) {
          setTimeout(() => router.replace("/login"), 1500);
        }
      }
    };

    fetchEmployee();
  }, [router]);

  const handleChangePassword = () => {
    if (employee && user) {
      const passwordInfo = {
        email: employee.email,
        companyId: user.companyId,
      };
      sessionStorage.setItem("changePasswordEmployee", JSON.stringify(passwordInfo));
      router.push("/changeLoginEmployeePassword");
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  if (!employee) {
    return <EmployeeProfileSkeleton />;
  }

  const defaultImage = formData?.gender === "Male" ? "/male_employee.jpg" : "/female_employee.jpg";

  return (
    <div className="min-h-screen w-full py-10 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white/20 backdrop-blur-xl shadow-[0_10px_10px_rgba(0,0,0,0.15)] rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-10">
              {/* LEFT: Avatar */}
              <div className="md:w-1/3 flex flex-col items-center">
                <img
                  src={employee?.profileImage || defaultImage}
                  alt="Profile"
                  className="w-38 h-38 rounded-full object-cover shadow-sm md:mt-6 border-4 border-white/30"
                />
              </div>

              {/* RIGHT: Profile fields */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base sm:text-2xl font-semibold bg-gradient-to-r from-[#008080] via-cyan-600 to-[#008080] bg-clip-text text-transparent">
                    Employee Profile
                  </h2>

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-teal-500 text-xs sm:text-sm text-white font-semibold rounded-lg hover:bg-teal-600 cursor-pointer transition-all"
                  >
                    Change Password
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ProfileField label="First Name" value={formData.firstName} />
                  <ProfileField label="Last Name" value={formData.lastName} />
                  <ProfileField label="Company Id" value={formData.companyId} />
                  <ProfileField label="Phone Number" value={formData.phoneNumber} />
                </div>

                <div className="mt-6">
                  <ProfileField label="Email Address" value={formData.email} full />
                </div>

                <div className="mt-8 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ProfileField label="Date of Birth" value={formData.dateOfBirth} />
                  <ProfileField label="Gender" value={formData.gender} />
                  <ProfileField label="Job Title" value={formData.jobTitle} />
                  <ProfileField label="Hire Date" value={formData.hireDate} />
                  <ProfileField label="Department Id" value={formData.departmentId} />
                  <ProfileField label="Status" value={formData.status} />
                </div>

                <ProfileField label="Employee Id" value={formData.employeeId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified ProfileField as Read Only
const ProfileField = ({ label, value, full }) => (
  <div className={`flex flex-col ${full ? "col-span-2" : ""}`}>
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      value={value || ""}
      readOnly
      className="w-full rounded-xl border border-gray-200 px-3 py-3 text-gray-800 bg-white/40 cursor-default outline-none"
    />
  </div>
);

export default EmployeeProfile;