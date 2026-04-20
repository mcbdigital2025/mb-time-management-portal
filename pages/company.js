"use client";

import JSONbig from "json-bigint";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CompanyDetailsCard from "../components/company/CompanyDetailsCard";
import CompanyHeader from "../components/company/CompanyHeader";
import ConfirmModal from "../components/company/ConfirmModal";
import DepartmentFormModal from "../components/DepartmentFormModal";
import DepartmentsSection from "../components/DepartmentsSection";
import EditCompanyModal from "../components/EditCompanyModal";
import { authenticatedFetch } from "../utils/api";
import {
  formatDateTime,
  getCompanyInitials
} from "../utils/data";

const Company = () => {
  const router = useRouter();

  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deptSearch, setDeptSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);

  // --- FIX: Restore companyInitials calculation ---
  const companyInitials = useMemo(
    () => getCompanyInitials(company?.companyName),
    [company?.companyName]
  );

  const fetchCompany = useCallback(async () => {
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

    if (!user?.companyId) {
      setError("Incomplete user information.");
      return;
    }

    const companyId = user.companyId;

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
        toast.error(`Failed to fetch company: ${response.status}`);
      }

      const text = await response.text();
      // Handle BigInt precision for companyId
      const data = JSONbig.parse(text);

      setCompany({
        ...data,
        companyId,
        // Map industryType from backend model
        industryType: data.industryType || ''
      });
    } catch (err) {
      console.error("Error fetching company:", err);
      setError(err.message);
    }
  }, [router]);

  const fetchDepartments = useCallback(async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const user = JSON.parse(storedUser);
    const companyId = user.companyId;

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/${encodeURIComponent(companyId)}`,
        { method: "GET", headers: { Accept: "application/json" } }
      );

      if (response.ok) {
        const text = await response.text();
        const data = JSONbig.parse(text);
        setDepartments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  }, []);

  useEffect(() => {
    fetchCompany();
    fetchDepartments();
  }, [fetchCompany, fetchDepartments]);

  const handleEditCompany = useCallback(() => {
    if (!company) return;
    setIsEditCompanyOpen(true);
  }, [company]);

  const handleResetFilter = useCallback(() => {
    setDeptSearch("");
    setIsFilterOpen(false);
  }, []);

  // Filtered Departments Logic
  const filteredDepartments = useMemo(() => {
    const q = deptSearch.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter((d) =>
      [d?.departmentName, d?.departmentDescription].some((val) =>
        String(val ?? "").toLowerCase().includes(q)
      )
    );
  }, [departments, deptSearch]);

  if (error) {
    return (
      <div className="mx-auto h-screen mt-10 max-w-5xl rounded bg-gray-50 p-6 shadow">
        <div className="text-center text-lg font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-zinc-50 via-white to-zinc-50 hero-radial-background">
      <ToastContainer />
      <CompanyHeader
        company={company}
        companyInitials={companyInitials}
        onEditCompany={handleEditCompany}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <ConfirmModal
          open={Boolean(confirmMessage)}
          message={confirmMessage}
          isLoading={isLoading}
          onCancel={() => setConfirmMessage(null)}
          onConfirm={() => {}} // Implementation for delete
        />

        <div className="grid grid-cols-1 gap-6 ">
          <CompanyDetailsCard
            company={company}
            onEditCompany={handleEditCompany}
          />
        </div>

        <DepartmentsSection
          departments={filteredDepartments}
          onEditDepartment={(dept) => { setSelectedDept(dept); setIsEditOpen(true); }}
          onRemoveDepartment={(dept) => { setSelectedDept(dept); setConfirmMessage(`Remove ${dept.departmentName}?`); }}
          onAddDepartment={() => { setSelectedDept(null); setIsCreateOpen(true); }}
          deptSearch={deptSearch}
          onDeptSearchChange={setDeptSearch}
          isFilterOpen={isFilterOpen}
          onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
          onResetFilter={handleResetFilter}
          formatDateTime={formatDateTime}
        />

        <DepartmentFormModal
          isOpen={isCreateOpen}
          mode="create"
          companyId={company?.companyId}
          companyCode={company?.companyCode}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={fetchDepartments}
        />

        <DepartmentFormModal
          isOpen={isEditOpen}
          mode="edit"
          department={selectedDept}
          companyId={company?.companyId}
          companyCode={company?.companyCode}
          onClose={() => setIsEditOpen(false)}
          onSuccess={fetchDepartments}
        />

        <EditCompanyModal
          isOpen={isEditCompanyOpen}
          company={company}
          onClose={() => setIsEditCompanyOpen(false)}
          onSuccess={async () => {
            await fetchCompany();
            setSuccessMessage("Company updated successfully.");
          }}
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