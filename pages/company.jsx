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
      router.replace("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch {
      setError("Invalid user session data.");
      return;
    }

    if (!user?.companyId || !user?.jwtToken) {
      setError("Incomplete user information.");
      return;
    }

    const companyId = user.companyId;

    const fetchCompany = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/company/${encodeURIComponent(
            companyId
          )}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );

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
        setError(err.message);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/${encodeURIComponent(
            companyId
          )}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch departments: ${response.status} ${response.statusText} - ${errorText}`
          );
        }

        const text = await response.text();
        const data = JSONbig.parse(text);
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError(err.message);
      }
    };

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
    if (!company) {
      setError("No company data to edit.");
      return;
    }

    sessionStorage.setItem(
      "editCompany",
      JSON.stringify({
        ...company,
        companyId: String(company.companyId),
        status: company.status || "Active",
      })
    );

    router.push("/editCompany");
  }, [company, router]);

  const handleAddDepartment = useCallback(() => {
    if (!company) {
      setError("Company data not loaded. Cannot add department.");
      return;
    }

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
    if (!selectedDept) {
      setError("Please select a department to edit.");
      return;
    }

    sessionStorage.setItem("editDepartment", JSON.stringify(selectedDept));
    router.push("/editDepartment");
  }, [selectedDept, router]);

  const handleRemoveDepartment = useCallback(() => {
    if (!selectedDept) {
      setError("Please select a department to remove.");
      return;
    }

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user?.jwtToken) {
      setError("User session or token is missing.");
      setTimeout(() => router.replace("/login"), 500);
      return;
    }

    setConfirmMessage(
      `Are you sure you want to remove ${selectedDept.departmentName}?`
    );

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

        setDepartments((prev) =>
          prev.filter((d) => d.departmentId !== selectedDept.departmentId)
        );
        setSelectedDept(null);
        setError(null);
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