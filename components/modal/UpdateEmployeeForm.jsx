"use client";

import { useEffect, useState } from "react";
import { authenticatedFetch } from "../../utils/api";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const STATUS_OPTIONS = ["Active", "Inactive"];
const ACCESS_LEVEL_OPTIONS = ["Basic", "Administrator", "Supervisor"];

const UpdateEmployeeForm = ({ employee, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        employeeId: "",
        companyId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        hireDate: "",
        gender: "",
        departmentId: "",
        jobTitle: "",
        status: "",
        accessLevel: "",
    });

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    // 🔥 Populate form from selected employee
    useEffect(() => {
        if (!employee) return;

        const formatDate = (value) =>
            value ? value.toString().split("T")[0] : "";

        setForm({
            employeeId: employee.employeeId || "",
            companyId: employee.companyId || "",
            firstName: employee.firstName || "",
            lastName: employee.lastName || "",
            email: employee.email || "",
            phoneNumber: employee.phoneNumber || "",
            dateOfBirth: formatDate(employee.dateOfBirth),
            hireDate: formatDate(employee.hireDate),
            gender: employee.gender || "",
            departmentId: employee.departmentId || "",
            jobTitle: employee.jobTitle || "",
            status: employee.status || "",
            accessLevel: employee.accessLevel || "",
        });
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await authenticatedFetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/update`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            if (!res.ok) toast.error("Update failed");
            else toast.success("Employee updated successfully");
            setSuccessMessage("Employee updated successfully!");

            onSuccess(form);   // 🔥 update parent state
            onClose();         // 🔥 close modal
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 ">
            {error && (
                <div className="col-span-2 text-red-500 text-sm">{error}</div>
            )}

            {successMessage && <div className="text-green-600 mb-4 bg-green-50 p-3 rounded-lg text-sm font-semibold border border-green-100">{successMessage}</div>}

            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" />
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" />

            <input value={form.employeeId} disabled className="border p-2 rounded bg-gray-100" />
            <input value={form.companyId} disabled className="border p-2 rounded bg-gray-100" />

            <input value={form.email} disabled className="border p-2 rounded bg-gray-100" />
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />

            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="border p-2 rounded" />
            <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange} className="border p-2 rounded" />

            <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded">
                <option value="">Gender</option>
                {GENDER_OPTIONS.map(g => <option key={g}>{g}</option>)}
            </select>

            <select name="accessLevel" value={form.accessLevel} onChange={handleChange} className="border p-2 rounded">
                <option value="">Access</option>
                {ACCESS_LEVEL_OPTIONS.map(a => <option key={a}>{a}</option>)}
            </select>

            <input name="departmentId" value={form.departmentId} onChange={handleChange} placeholder="Department" className="border p-2 rounded" />
            <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Job Title" className="border p-2 rounded" />

            <select name="status" value={form.status} onChange={handleChange} className="col-span-2 border p-2 rounded">
                <option value="">Status</option>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>

            <div className="col-span-2 flex gap-3 mt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex flex-1 bg-teal-600 cursor-pointer hover:bg-teal-800 text-white py-2 justify-center items-center rounded"
                >
                    {isSubmitting && (
                        <Loader2 className="animate-spin" size={18} />
                    )}
                    {isSubmitting ? "Saving..." : "Update"}
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-[#F75D42] text-white cursor-pointer hover:bg-[#fc3b19] py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default UpdateEmployeeForm;