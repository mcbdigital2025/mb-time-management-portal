"use client";

import { useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/api";
import ViewEmployeesSkeleton from "./loaders/ViewEmployeesSkeleton";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["Active", "Inactive"];

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
        setError(null);
        setSuccessMessage(null);

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.jwtToken) {
            setError("User session or token is missing. Please log in again.");
            return;
        }

        setIsSaving(true);

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
                throw new Error(
                    `Update failed: ${response.status} ${response.statusText} - ${errorText}`
                );
            }
            toast.success("Company Details updated successfully!")

            setSuccessMessage("Company updated successfully!");

            if (onSuccess) {
                await onSuccess();
            }

            setTimeout(() => {
                onClose();
            }, 800);
        } catch (err) {
            setError("Error updating company: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4 py-6">
            <div
                className="absolute inset-0"
                onClick={() => !isSaving && onClose()}
                aria-hidden="true"
            />

            <div className="relative z-101 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                            Edit Company
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Update company details and settings.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}



                {!form ? (
                    <div className="py-6">
                        <ViewEmployeesSkeleton />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Field
                            label="Company Code"
                            name="companyCode"
                            value={form.companyCode || ""}
                            onChange={handleChange}
                        />

                        <Field
                            label="Company Name"
                            name="companyName"
                            value={form.companyName || ""}
                            onChange={handleChange}
                        />

                        <Field
                            label="Description"
                            name="companyDescription"
                            value={form.companyDescription || ""}
                            onChange={handleChange}
                            isTextArea
                        />

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-700">
                                Status
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-blue-500"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Checkbox
                                label="Client Booking Enabled"
                                name="clientBooking"
                                checked={!!form.clientBooking}
                                onChange={handleChange}
                            />
                            <Checkbox
                                label="Employee Assigned Schedule"
                                name="employeeAssignedSchedule"
                                checked={!!form.employeeAssignedSchedule}
                                onChange={handleChange}
                            />
                            <Checkbox
                                label="Log Daily Note"
                                name="logDailyNote"
                                checked={!!form.logDailyNote}
                                onChange={handleChange}
                            />
                            <Checkbox
                                label="Transport Travel Claim"
                                name="transportTravelClaim"
                                checked={!!form.transportTravelClaim}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSaving}
                                className="inline-flex items-center justify-center rounded-xl bg-[#F75D42] px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-[#f53918]  disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="inline-flex items-center justify-center rounded-xl bg-[#008080] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#006d6d] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
    <div>
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
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3">
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4"
        />
        <span className="text-sm text-slate-700">{label}</span>
    </label>
);

export default EditCompanyModal;