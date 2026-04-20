"use client";

import { useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/api";
import ViewEmployeesSkeleton from "./loaders/ViewEmployeesSkeleton";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["Active", "Inactive"];

// 1. Define the Industry Options matching your SQL ENUM
const INDUSTRY_OPTIONS = [
    'NDIS/Age Care',
    'Online Learning',
    'Security Guard',
    'Healthcare & Wellness',
    'Professional Services',
    'Field Services',
    'Education & Training',
    'Specialized Transport'
];

const EditCompanyModal = ({ isOpen, onClose, company, onSuccess }) => {
    const [form, setForm] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        if (!company) {
            setForm(null);
            return;
        }

        setError(null);
        setSuccessMessage(null);

        setForm({
            ...company,
            companyId:
                typeof company.companyId === "bigint"
                    ? company.companyId
                    : BigInt(company.companyId),
            status: company.status || "Active",
            // 2. Ensure industryType has a default value if missing
            industryType: company.industryType || INDUSTRY_OPTIONS[0],
        });
    }, [isOpen, company]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e) => {
            if (e.key === "Escape" && !isSaving) onClose();
        };

        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [isOpen, isSaving, onClose]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const response = await authenticatedFetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/company/update`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(form, (_, value) =>
                        typeof value === "bigint" ? value.toString() : value
                    ),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Update failed: ${response.status} - ${errorText}`);
            }

            toast.success("Company updated successfully!");
            if (onSuccess) await onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl hero-radial-background">
                <div className="flex items-center justify-between border-b border-zinc-100 p-5">
                    <h2 className="text-lg font-bold text-zinc-900">Edit Company Details</h2>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {!form ? (
                    <div className="p-10"><ViewEmployeesSkeleton /></div>
                ) : (
                    <div className="max-h-[80vh] overflow-y-auto p-6">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Field label="Company Code" name="companyCode" value={form.companyCode} onChange={handleChange} />
                            <Field label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} />

                            {/* 3. Specialized Dropdown for Industry Type */}
                            <div className="flex flex-col gap-1">
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Industry Type
                                </label>
                                <select
                                    name="industryType"
                                    value={form.industryType || ""}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 bg-white"
                                >
                                    {INDUSTRY_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 bg-white"
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <Field
                                    label="Description"
                                    name="companyDescription"
                                    value={form.companyDescription}
                                    onChange={handleChange}
                                    isTextArea
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:col-span-2 mt-2">
                                <Checkbox label="Client Booking" name="clientBooking" checked={form.clientBooking} onChange={handleChange} />
                                <Checkbox label="Assigned Schedule" name="employeeAssignedSchedule" checked={form.employeeAssignedSchedule} onChange={handleChange} />
                                <Checkbox label="Log Daily Notes" name="logDailyNote" checked={form.logDailyNote} onChange={handleChange} />
                                <Checkbox label="Travel Claims" name="transportTravelClaim" checked={form.transportTravelClaim} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-end gap-3 border-t border-zinc-100 pt-5">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSaving}
                                className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="rounded-xl bg-[#008080] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#006d6d] disabled:opacity-50 cursor-pointer"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Field = ({ label, name, value, onChange, isTextArea = false }) => (
    <div className="flex flex-col gap-1">
        <label className="mb-1 block text-sm font-semibold text-slate-700">
            {label}
        </label>
        {isTextArea ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
            />
        ) : (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
            />
        )}
    </div>
);

const Checkbox = ({ label, name, checked, onChange }) => (
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 hover:bg-zinc-50 transition cursor-pointer">
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 accent-[#008080]"
        />
        <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
);

export default EditCompanyModal;