<<<<<<< HEAD
// pages/Company.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Keep useRouter for page-specific navigation (e.g., /editCompany)
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api'; // Keep authenticatedFetch
import { dummyDepartments } from "../utils/data";

const Company = () => {
  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState(dummyDepartments || []); // Use dummy data for initial state to avoid empty table on load
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const router = useRouter();
  // add near your other state:
  const [deptSearch, setDeptSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // optional: simple client-side filtering (name/desc/id)
  const filteredDepartments = departments.filter((d) => {
    const q = deptSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      String(d?.departmentId ?? "").toLowerCase().includes(q) ||
      String(d?.companyId ?? "").toLowerCase().includes(q) ||
      String(d?.departmentName ?? "").toLowerCase().includes(q) ||
      String(d?.departmentDescription ?? "").toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    // User validation and initial redirection is now handled by _app.js.
    // We can assume if Company.js is rendered, a user is logged in.
    const storedUser = localStorage.getItem("user");
    let user = null;

    if (!storedUser) {
      // This case should ideally be caught by _app.js, but as a fallback/safety,
      // if user somehow gets here without a stored user, redirect.
      console.error("User not found in local storage within Company.js. Redirecting to login.");
=======
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from "../utils/api";
import {
  dummyDepartments,
  formatDateTime,
  getCompanyInitials,
} from "../utils/data";
import DepartmentsSection from "../components/DepartmentsSection";
import CompanyHeader from "../components/company/CompanyHeader";
import CompanyDetailsCard from "../components/company/CompanyDetailsCard";
import CompanySidebar from "../components/company/CompanySidebar";
import ConfirmModal from "../components/company/ConfirmModal";

const Company = () => {
  const router = useRouter();

  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState(dummyDepartments || []);
  const [selectedDept, setSelectedDept] = useState(null);

  const [deptSearch, setDeptSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [confirmMessage, setConfirmMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
>>>>>>> main
      router.replace("/login");
      return;
    }

<<<<<<< HEAD
    user = JSON.parse(storedUser);

    if (!user || !user.companyId || !user.jwtToken) {
      // Similar fallback: if user data is incomplete, redirect.
      console.error("Incomplete user information or token missing in Company.js. Redirecting to login.");
      // router.replace("/login");
=======
    let user;
    try {
      user = JSON.parse(storedUser);
    } catch {
      setError("Invalid user session data.");
      return;
    }

    if (!user?.companyId || !user?.jwtToken) {
      setError("Incomplete user information.");
>>>>>>> main
      return;
    }

    const companyId = user.companyId;

    const fetchCompany = async () => {
      try {
        const response = await authenticatedFetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/company/${encodeURIComponent(companyId)}`,
=======
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/company/${encodeURIComponent(
            companyId
          )}`,
>>>>>>> main
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );
<<<<<<< HEAD
        if (!response.ok) {
          const errorText = await response.text();
          // If the error is 401, authenticatedFetch should ideally handle the token refresh/redirect.
          // For other errors (e.g., 404 company not found), display them.
          throw new Error(`Failed to fetch company data: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        data.companyId = companyId;
        setCompany(data);
      } catch (err) {
        console.error("Error fetching company data:", err);
        // Only set local error for display; let global handler redirect for auth issues
=======

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch company data: ${response.status} ${response.statusText} - ${errorText}`
          );
        }

        const data = await response.json();
        setCompany({ ...data, companyId });
      } catch (err) {
        console.error("Error fetching company:", err);
>>>>>>> main
        setError(err.message);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await authenticatedFetch(
<<<<<<< HEAD
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/${encodeURIComponent(companyId)}`,
=======
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/${encodeURIComponent(
            companyId
          )}`,
>>>>>>> main
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );
<<<<<<< HEAD
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch departments: ${response.status} ${response.statusText} - ${errorText}`);
=======

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch departments: ${response.status} ${response.statusText} - ${errorText}`
          );
>>>>>>> main
        }

        const text = await response.text();
        const data = JSONbig.parse(text);
<<<<<<< HEAD
        setDepartments(data);
      } catch (err) {
        console.error("Department fetch error:", err.message);
        // Only set local error for display; let global handler redirect for auth issues
=======
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching departments:", err);
>>>>>>> main
        setError(err.message);
      }
    };

<<<<<<< HEAD
    // fetchCompany();
    // fetchDepartments();
  }, []); // Empty dependency array as user and companyId are accessed inside the effect

  const formatDateTime = (value) => {
    if (!value) return "-";
    try {
      const isoValue = value.replace(" ", "T");
      const date = new Date(isoValue);
      if (isNaN(date.getTime())) return value;
      const pad = (n) => n.toString().padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    } catch {
      return value;
    }
  };

  const handleEditCompany = () => {
=======
    fetchCompany();
    fetchDepartments();
  }, [router]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const filteredDepartments = useMemo(() => {
    const q = deptSearch.trim().toLowerCase();

    if (!q) return departments;

    return departments.filter((d) =>
      [
        d?.departmentId,
        d?.companyId,
        d?.departmentName,
        d?.departmentDescription,
      ].some((value) => String(value ?? "").toLowerCase().includes(q))
    );
  }, [departments, deptSearch]);

  const companyInitials = useMemo(
    () => getCompanyInitials(company?.companyName),
    [company?.companyName]
  );

  const stats = useMemo(
    () => [
      { label: "Departments", value: departments.length },
      { label: "Client Booking", value: company?.clientBooking ? "Yes" : "No" },
      {
        label: "Assigned Schedule",
        value: company?.employeeAssignedSchedule ? "Yes" : "No",
      },
      { label: "Daily Notes", value: company?.logDailyNote ? "Yes" : "No" },
    ],
    [company, departments.length]
  );

  const closeConfirmModal = useCallback(() => {
    setConfirmMessage(null);
    setConfirmAction(null);
  }, []);

  const handleEditCompany = useCallback(() => {
>>>>>>> main
    if (!company) {
      setError("No company data to edit.");
      return;
    }
<<<<<<< HEAD
=======

>>>>>>> main
    sessionStorage.setItem(
      "editCompany",
      JSON.stringify({
        ...company,
<<<<<<< HEAD
        companyId: company.companyId.toString(),
        status: company.status || "Active",
      })
    );
    router.push("/editCompany");
  };

  const handleAddDepartment = () => {
=======
        companyId: String(company.companyId),
        status: company.status || "Active",
      })
    );

    router.push("/editCompany");
  }, [company, router]);

  const handleAddDepartment = useCallback(() => {
>>>>>>> main
    if (!company) {
      setError("Company data not loaded. Cannot add department.");
      return;
    }
<<<<<<< HEAD
    sessionStorage.setItem(
      "companyInfo",
      JSON.stringify({
        companyId: company.companyId.toString(),
        companyCode: company.companyCode,
      })
    );
    router.push("/createDepartment");
  };

  const handleEditDepartment = () => {
=======

    sessionStorage.setItem(
      "companyInfo",
      JSON.stringify({
        companyId: String(company.companyId),
        companyCode: company.companyCode,
      })
    );

    router.push("/createDepartment");
  }, [company, router]);

  const handleEditDepartment = useCallback(() => {
>>>>>>> main
    if (!selectedDept) {
      setError("Please select a department to edit.");
      return;
    }
<<<<<<< HEAD
    sessionStorage.setItem("editDepartment", JSON.stringify(selectedDept));
    router.push("/editDepartment");
  };

  const handleRemoveDepartment = async () => {
=======

    sessionStorage.setItem("editDepartment", JSON.stringify(selectedDept));
    router.push("/editDepartment");
  }, [selectedDept, router]);

  const handleRemoveDepartment = useCallback(() => {
>>>>>>> main
    if (!selectedDept) {
      setError("Please select a department to remove.");
      return;
    }

<<<<<<< HEAD
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.jwtToken) {
      setError(
        "User session or token is missing. Cannot remove department. Redirecting to login."
      );
=======
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user?.jwtToken) {
      setError("User session or token is missing.");
>>>>>>> main
      setTimeout(() => router.replace("/login"), 500);
      return;
    }

    setConfirmMessage(
      `Are you sure you want to remove ${selectedDept.departmentName}?`
    );
<<<<<<< HEAD
=======

>>>>>>> main
    setConfirmAction(() => async () => {
      try {
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/delete/${encodeURIComponent(
            selectedDept.companyId
          )}/${encodeURIComponent(selectedDept.departmentId)}`,
          { method: "DELETE" }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Failed to remove department: ${res.status} ${res.statusText} - ${errorText}`
          );
        }

<<<<<<< HEAD
        setSuccessMessage("Department removed successfully.");
=======
>>>>>>> main
        setDepartments((prev) =>
          prev.filter((d) => d.departmentId !== selectedDept.departmentId)
        );
        setSelectedDept(null);
        setError(null);
<<<<<<< HEAD
      } catch (err) {
        setError("An error occurred while removing the department: " + err.message);
      } finally {
        setConfirmMessage(null);
        setConfirmAction(null);
      }
    });
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
  };

  const companyInitials =
    company?.companyName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0])
      .join("")
      .toUpperCase() || "CO";

  const stats = [
    { label: "Departments", value: departments?.length ?? 0 },
    { label: "Client Booking", value: company?.clientBooking ? "Yes" : "No" },
    {
      label: "Assigned Schedule",
      value: company?.employeeAssignedSchedule ? "Yes" : "No",
    },
    { label: "Daily Notes", value: company?.logDailyNote ? "Yes" : "No" },
  ];

  const handleCancelConfirm = () => {
    setConfirmMessage(null);
    setConfirmAction(null);
  };

  // Error/Loading states for Company.js specific data fetching
  if (error) {
    // If error is present, display it within the content area
    return (
      <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded shadow space-y-10">
        <div className="text-red-600 text-center text-lg font-semibold">Error: {error}</div>
      </div>
    );
  }
  // if (!company) {
  //     // While fetching company data, show loading
  //     return (
  //         <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded shadow space-y-10">
  //             <div className="text-center text-lg font-semibold text-gray-700">Loading company info...</div>
  //         </div>
  //     );
  // }

  return (
    <div className="min-h-[calc(100vh-0px)] w-full hero-radial-background bg-linear-to-b from-zinc-50 via-white to-zinc-50">
      {/* Top bar / page header */}
      <div className="border-b border-zinc-200/60 bg-white/70 backdrop-blur hero-radial-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between ">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-zinc-200 bg-white text-lg font-extrabold text-zinc-900 shadow-sm">
              {companyInitials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold tracking-wide text-zinc-500">
                Company
              </div>
              <h1 className="truncate text-xl font-black text-zinc-900">
                {company?.companyName || "Company Profile"}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5">
                  ID: {company?.companyId?.toString() || "id-12345..."}
                </span>
                {/* <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5">
                  Code: {company?.companyCode || "code-12345..."}
                </span> */}
                <span
                  className={[
                    "rounded-full border px-2 py-0.5",
                    company?.status === "Active"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700",
                  ].join(" ")}
                >
                  {company?.status || "Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row ">
            <button
              onClick={handleEditCompany}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#008080] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#008080] cursor-pointer"
            >
              <span className="text-base">✎</span>
              Edit company
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 ">
        {/* Confirmation Modal */}
        {confirmMessage && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl hero-radial-background">
              <div className="p-5">
                <div className="text-sm font-semibold text-zinc-900">
                  Confirm action
                </div>
                <p className="mt-2 text-sm text-zinc-600">{confirmMessage}</p>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-zinc-200 bg-zinc-50 p-4">
                <button
                  onClick={handleCancelConfirm}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-800 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main layout: left details + right actions/stats */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_0.95fr]">
          {/* LEFT: Company details card */}
          <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/50 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/60 px-5 py-4">
              <div>
                <h2 className="text-sm md:text-lg font-extrabold text-zinc-900">
                  Company details
                </h2>
                <p className="mt-1 text-xs md:text-sm text-zinc-600">
                  Core identifiers and configuration flags.
                </p>
              </div>
              <button
                onClick={handleEditCompany}
                className="hidden rounded-xl border border-zinc-200 bg-[#008080] px-4 py-2 text-sm font-bold text-zinc-100 hover:bg-zinc-50 md:inline-flex"
              >
                Edit
              </button>
            </div>

            <dl className="grid grid-cols-1 gap-0 divide-y divide-zinc-200 md:grid-cols-2 md:divide-y-0 md:divide-x md:divide-zinc-200">
              {/* Left column */}
              <div className="divide-y divide-zinc-200">
                <div className="px-5 py-4 flex justify-between items-center">
                  <dt className="text-xs md:text-sm font-semibold text-zinc-700">
                    Company ID:
                  </dt>
                  <dd className="mt-1 break-all text-sm font-bold text-zinc-900">
                    {company?.companyId?.toString() || "id-12345678901234567890"}
                  </dd>
                </div>
                <div className="px-5 py-4 flex justify-between items-center">
                  <dt className="text-xs md:text-sm font-semibold text-zinc-700">
                    Company code:
                  </dt>
                  <dd className="mt-1 break-all text-sm font-bold text-zinc-900">
                    {company?.companyCode || "CODE1234"}
                  </dd>
                </div>
                <div className="px-5 py-4 flex justify-between items-center">
                  <dt className="text-xs md:text-sm font-semibold text-zinc-700">
                    Company name:
                  </dt>
                  <dd className="mt-1 break-all text-sm font-bold text-zinc-900">
                    {company?.companyName || "Example Company Inc."}
                  </dd>
                </div>
                <div className="px-5 py-4">
                  <dt className="text-xs md:text-base  font-semibold text-zinc-700">
                    Description:
                  </dt>
                  <dd className="mt-1 wrap-break-words text-sm md:text-base text-zinc-700">
                    {company?.companyDescription || "No description provided. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                  </dd>
                </div>
              </div>

              {/* Right column */}
              <div className="divide-y divide-zinc-200">
                <div className="px-5 py-4 flex justify-between items-center">
                  <dt className="text-xs md:text-base  font-semibold text-zinc-700">Status</dt>
                  <dd className="mt-1">
                    <span
                      className={[
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold",
                        company?.status === "Active"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-zinc-200 bg-zinc-50 text-zinc-700",
                      ].join(" ")}
                    >
                      {company?.status || "active"}
                    </span>
                  </dd>
                </div>

                <div className="px-5 py-4 flex justify-between items-center">
                  <dt className="text-xs md:text-base  font-semibold text-zinc-700">
                    Client booking enabled
                  </dt>
                  <dd className="mt-1 text-sm md:text-base font-bold text-zinc-900">
                    {company?.clientBooking ? "Yes" : "No"}
                  </dd>
                </div>

                <div className="px-5 py-4 flex justify-between items-center">
                  <dt className="text-xs md:text-base  font-semibold text-zinc-700">
                    Employee assigned schedule
                  </dt>
                  <dd className="mt-1 text-sm md:text-base font-bold text-zinc-900">
                    {company?.employeeAssignedSchedule ? "Yes" : "No"}
                  </dd>
                </div>

                <div className="px-5 py-4 flex justify-between items-center">
                  <dt className="text-xs md:text-base  font-semibold text-zinc-700">
                    Log daily note
                  </dt>
                  <dd className="mt-1 text-sm md:text-base font-bold text-zinc-900">
                    {company?.logDailyNote ? "Yes" : "No"}
                  </dd>
                </div>

                <div className="px-5 py-4 flex justify-between items-center">
                  <dt className="text-xs md:text-base  font-semibold text-zinc-700">
                    Transport travel claim
                  </dt>
                  <dd className="mt-1 text-sm md:text-base font-bold text-zinc-900">
                    {company?.transportTravelClaim ? "Yes" : "No"}
                  </dd>
                </div>
              </div>
            </dl>
          </section>

          {/* RIGHT: Stats + department actions */}
          <aside className="flex flex-col gap-6">
            {/* Stats card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-extrabold text-zinc-900">Overview</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {stats?.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4"
                  >
                    <div className="text-xs font-semibold text-zinc-500">
                      {s.label}
                    </div>
                    <div className="mt-1 text-sm font-extrabold text-zinc-900">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department actions card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-extrabold text-zinc-900">
                Department actions
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                Select a department in the table, then edit or remove it.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <button
                  onClick={handleAddDepartment}
                  className="rounded-xl bg-[#055c38] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#024228] cursor-pointer"
                >
                  Create department
                </button>

                <button
                  onClick={handleEditDepartment}
                  className="rounded-xl border border-zinc-200 bg-[#008080] px-4 py-2.5 text-sm font-extrabold text-zinc-100 hover:bg-[#054e4e] cursor-pointer"
                >
                  Edit selected
                </button>

                <button
                  onClick={handleRemoveDepartment}
                  className="rounded-xl border border-red-200 bg-[#F75D42] px-4 py-2.5 text-sm font-extrabold text-red-50 hover:bg-red-700 cursor-pointer"
                >
                  Remove selected
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Departments table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-zinc-200 bg-zinc-50/60 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-zinc-900">Departments</h2>
              <p className="mt-1 text-xs text-zinc-600">Click a row to select it.</p>
            </div>

            {/* Search + Filter */}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[320px]">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  🔎
                </span>
                <input
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                  placeholder="Search departments…"
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsFilterOpen((v) => !v)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
              >
                <span>⛭</span>
                Filter
              </button>
            </div>
          </div>

          {/* Optional filter panel (dummy UI for now) */}
          {isFilterOpen && (
            <div className="border-b border-zinc-200 bg-white px-5 py-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-500">Status</label>
                  <select className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-300">
                    <option>All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-500">Sort by</label>
                  <select className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-300">
                    <option>Newest updated</option>
                    <option>Oldest updated</option>
                    <option>Name (A–Z)</option>
                    <option>Name (Z–A)</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    className="h-10 w-full rounded-xl bg-zinc-900 px-4 text-sm font-extrabold text-white hover:bg-zinc-800"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
                    onClick={() => {
                      setDeptSearch("");
                      setIsFilterOpen(false);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            {filteredDepartments.length > 0 ? (
              <table className="min-w-full text-sm">
                <thead className="bg-white">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    <th className="px-5 py-3">Department ID</th>
                    <th className="px-5 py-3">Company ID</th>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Description</th>
                    <th className="px-5 py-3">Created</th>
                    <th className="px-5 py-3">Updated</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-200">
                  {filteredDepartments.map((dept) => {
                    const active = selectedDept?.departmentId === dept.departmentId;
                    return (
                      <tr
                        key={dept?.departmentId}
                        onClick={() => setSelectedDept(dept)}
                        className={[
                          "cursor-pointer transition",
                          active ? "bg-zinc-900/5" : "hover:bg-zinc-50",
                        ].join(" ")}
                      >
                        <td className="px-5 py-3 font-semibold text-zinc-900">
                          {dept?.departmentId}
                        </td>
                        <td className="px-5 py-3 text-zinc-700">
                          {dept?.companyId ? dept.companyId.toString() : "-"}
                        </td>
                        <td className="px-5 py-3 font-semibold text-zinc-900">
                          {dept?.departmentName}
                        </td>
                        <td className="px-5 py-3 text-zinc-700">
                          {dept?.departmentDescription}
                        </td>
                        <td className="px-5 py-3 text-zinc-700">
                          {formatDateTime(dept?.createdDate)}
                        </td>
                        <td className="px-5 py-3 text-zinc-700">
                          {formatDateTime(dept?.updatedDate)}
                        </td>
                        <td className="px-5 py-3 text-zinc-700">
                          <input
                          type="checkbox"
                            checked={selectedDept?.departmentId === dept.departmentId}
                            onChange={() => setSelectedDept(dept)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="px-5 py-8 text-sm text-zinc-500">
                No departments found.
              </div>
            )}
          </div>
        </section>

        {/* Toast */}
=======
        setSuccessMessage("Department removed successfully.");
      } catch (err) {
        setError(`An error occurred while removing the department: ${err.message}`);
      } finally {
        closeConfirmModal();
      }
    });
  }, [selectedDept, router, closeConfirmModal]);

  const handleConfirm = useCallback(() => {
    if (confirmAction) confirmAction();
  }, [confirmAction]);

  const handleResetFilter = useCallback(() => {
    setDeptSearch("");
    setIsFilterOpen(false);
  }, []);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-5xl rounded bg-gray-50 p-6 shadow">
        <div className="text-center text-lg font-semibold text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-0px)] w-full bg-linear-to-b from-zinc-50 via-white to-zinc-50 hero-radial-background">
      <CompanyHeader
        company={company}
        companyInitials={companyInitials}
        onEditCompany={handleEditCompany}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <ConfirmModal
          open={Boolean(confirmMessage)}
          message={confirmMessage}
          onCancel={closeConfirmModal}
          onConfirm={handleConfirm}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_0.95fr]">
          <CompanyDetailsCard
            company={company}
            onEditCompany={handleEditCompany}
          />

          <CompanySidebar
            stats={stats}
            onAddDepartment={handleAddDepartment}
            onEditDepartment={handleEditDepartment}
            onRemoveDepartment={handleRemoveDepartment}
          />
        </div>

        <DepartmentsSection
          departments={filteredDepartments}
          selectedDept={selectedDept}
          onSelectDept={setSelectedDept}
          deptSearch={deptSearch}
          onDeptSearchChange={setDeptSearch}
          isFilterOpen={isFilterOpen}
          onToggleFilter={toggleFilter}
          onResetFilter={handleResetFilter}
          formatDateTime={formatDateTime}
        />

>>>>>>> main
        {successMessage && (
          <div className="fixed bottom-4 right-4 z-50 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Company;