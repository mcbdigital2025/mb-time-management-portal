"use client";

import JSONbig from "json-bigint";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import CompanyDetailsCard from "../components/company/CompanyDetailsCard";
import CompanyHeader from "../components/company/CompanyHeader";
import ConfirmModal from "../components/company/ConfirmModal";
import DepartmentFormModal from "../components/DepartmentFormModal";
import DepartmentsSection from "../components/DepartmentsSection";
import { authenticatedFetch } from "../utils/api";
import {
  dummyDepartments,
  formatDateTime,
  getCompanyInitials,
} from "../utils/data";
import { toast } from "react-toastify";

const Company = () => {
  const router = useRouter();

  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState(dummyDepartments || []);
  const [selectedDept, setSelectedDept] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deptSearch, setDeptSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [confirmMessage, setConfirmMessage] = useState(null);

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

    fetchCompany();
    fetchDepartments();
  }, [router]);


  const fetchDepartments = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
      console.log("🚀 ~ Company ~ user:", user)
    } catch {
      setError("Invalid user session data.");
      return;
    }

    if (!user?.companyId || !user?.jwtToken) {
      setError("Incomplete user information.");
      return;
    }

    const companyId = user.companyId;

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


  const closeConfirmModal = useCallback(() => {
    setConfirmMessage(null);
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


  const handleAddDepartment = () => {
    setSelectedDept(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (dept) => {
    setSelectedDept(dept);
    setIsEditOpen(true);
  };
  const openConfirmationModal = useCallback((dept) => {
    setSelectedDept(dept);
    setConfirmMessage(`Are you sure you want to remove ${dept?.departmentName}?`);
  }, []);

  const handleRemoveDepartment = useCallback(async () => {
    setIsLoading(true);
    if (!selectedDept) {
      setError("Please select a department to remove.");
      return;
    }

    try {
      const res = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/delete/${encodeURIComponent(
          selectedDept.companyId
        )}/${encodeURIComponent(selectedDept.departmentId)}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const errorText = await res.text();
        toast.error(`Failed to remove department: ${res.status} ${res.statusText} - ${errorText}`);

      }

      setDepartments((prev) =>
        prev.filter((d) => d.departmentId !== selectedDept.departmentId)
      );
      setSelectedDept(null);
      setError(null);
      setIsLoading(false);
      closeConfirmModal();
      toast.success("Department removed successfully.");
      setSuccessMessage("Department removed successfully.");
    } catch (err) {
      toast.error(`An error occurred while removing the department: ${err.message}`);
      setError(`An error occurred while removing the department: ${err.message}`);
    } finally {
      setIsLoading(false);
    }

  }, [selectedDept, closeConfirmModal]);


  const handleResetFilter = useCallback(() => {
    setDeptSearch("");
    setIsFilterOpen(false);
  }, []);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  if (error) {
    return (
      <div className="mx-auto h-screen mt-10 max-w-5xl rounded bg-gray-50 p-6 shadow">
        <div className="text-center text-lg font-semibold text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-zinc-50 via-white to-zinc-50 hero-radial-background">
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
          onCancel={closeConfirmModal}
          onConfirm={handleRemoveDepartment}
        />

        <div className="grid grid-cols-1 gap-6 ">
          <CompanyDetailsCard
            company={company}
            onEditCompany={handleEditCompany}
          />

          {/* <CompanySidebar
            stats={stats}
            onAddDepartment={handleAddDepartment}
            onEditDepartment={handleEditDepartment}
            onRemoveDepartment={handleRemoveDepartment}
          /> */}
        </div>

        <DepartmentsSection
          departments={departments}
          selectedDept={selectedDept}
          onSelectDept={setSelectedDept}
          onEditDepartment={openEditModal}
          onRemoveDepartment={openConfirmationModal}
          onAddDepartment={handleAddDepartment}
          deptSearch={deptSearch}
          onDeptSearchChange={setDeptSearch}
          isFilterOpen={isFilterOpen}
          onToggleFilter={() => setIsFilterOpen((prev) => !prev)}
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