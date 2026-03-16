"use client";

import { useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/api";
import { toast } from "react-toastify";
import Modal from "./Modal";

const DepartmentFormModal = ({
  isOpen,
  mode = "create", // "create" | "edit"
  department = null,
  companyId,
  companyCode,
  onClose,
  onSuccess,
}) => {
  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && department) {
      setDepartmentId(department.departmentId || "");
      setDepartmentName(department.departmentName || "");
      setDepartmentDescription(department.departmentDescription || "");
    } else {
      setDepartmentId(companyCode ? `${companyCode}_` : "");
      setDepartmentName("");
      setDepartmentDescription("");
    }

    setError("");
  }, [isOpen, mode, department, companyCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!departmentName.trim()) {
      setError("Department name is required.");
      return;
    }

    if (!companyId) {
      setError("Company ID is missing.");
      return;
    }

    setIsSubmitting(true);

    const now = new Date().toISOString();

    const payload = {
      departmentId: departmentId.trim(),
      companyId: String(companyId),
      departmentName: departmentName.trim(),
      departmentDescription: departmentDescription.trim(),
      createdDate:
        mode === "edit"
          ? department?.createdDate || now
          : now,
      updatedDate: now,
    };

    const endpoint =
      mode === "edit"
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/update`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/group/create`;

    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const response = await authenticatedFetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${mode} department`);
      }

      toast.success(
        mode === "edit"
          ? "Department updated successfully"
          : "Department created successfully"
      );

      onSuccess?.();
      onClose?.();
    } catch (err) {
      const message = err?.message || `Failed to ${mode} department`;
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "edit" ? "Edit Department" : "Create Department"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-700">
            Company ID
          </label>
          <input
            type="text"
            value={companyId || ""}
            readOnly
            className="w-full rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2.5 text-sm text-zinc-700"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-700">
            Department ID
          </label>
          <input
            type="text"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            readOnly={mode === "edit"}
            className={`w-full rounded-xl border border-zinc-200 ${mode === "edit" ? "bg-zinc-100" : "bg-white"} px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-300`}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-700">
            Department Name
          </label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-300"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-700">
            Department Description
          </label>
          <textarea
            value={departmentDescription}
            onChange={(e) => setDepartmentDescription(e.target.value)}
            className="min-h-30 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-300"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-zinc-200 bg-[#F75D42] px-4 py-2.5 text-sm font-bold text-zinc-100 hover:bg-red-700 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#055c38] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#024228] disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting
              ? mode === "edit"
                ? "Updating..."
                : "Saving..."
              : mode === "edit"
              ? "Update Department"
              : "Save Department"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DepartmentFormModal;