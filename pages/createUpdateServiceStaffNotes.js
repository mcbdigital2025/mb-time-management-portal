"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { authenticatedFetch } from '../utils/api';

const CreateUpdateServiceStaffNotes = ({ user }) => {
    const router = useRouter();
    const { scheduleId } = router.query;

    const [formData, setFormData] = useState({
        shiftFeedback: '',
        clientLearningNeeds: '',
        goalProgressNotes: '',
        behavioralNotes: '',
        medicalObservations: '',
    });

    const [serviceStaffNotesId, setServiceStaffNotesId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/staffnotes`;

    // --- Fetch existing notes on load ---
    useEffect(() => {
        if (!scheduleId || !user?.companyId) return;

        const fetchExistingNotes = async () => {
            try {
                const response = await authenticatedFetch(`${API_BASE}/booking/${user.companyId}/${scheduleId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setServiceStaffNotesId(data.serviceStaffNotesId);
                        setFormData({
                            shiftFeedback: data.shiftFeedback || '',
                            clientLearningNeeds: data.clientLearningNeeds || '',
                            goalProgressNotes: data.goalProgressNotes || '',
                            behavioralNotes: data.behavioralNotes || '',
                            medicalObservations: data.medicalObservations || '',
                        });
                    }
                }
            } catch (err) {
                console.log("No existing notes found for this shift.");
            }
        };
        fetchExistingNotes();
    }, [scheduleId, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const formatLabel = (key) => {
        return key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const method = serviceStaffNotesId ? 'PUT' : 'POST';
        const endpoint = serviceStaffNotesId ? `${API_BASE}/update` : `${API_BASE}/create`;

        const payload = {
            ...formData,
            serviceStaffNotesId,
            clientBookingId: scheduleId,
            companyId: user?.companyId,
            createdBy: user?.employeeId
        };

        try {
            const response = await authenticatedFetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Notes saved successfully!");
                router.push("/myshiftsschedule");
            } else {
                setError("Failed to save notes. Please check your connection.");
            }
        } catch (err) {
            setError("An error occurred while saving.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                {serviceStaffNotesId ? "Update Shift Documentation" : "Create Shift Documentation"}
            </h1>

            {error && (
                <p className="bg-red-100 text-red-700 p-3 rounded mb-4 font-semibold">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shift Feedback spans full width like a large textarea */}
                <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-600">
                        {formatLabel('shiftFeedback')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="shiftFeedback"
                        value={formData.shiftFeedback}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] bg-gray-50"
                    />
                </div>

                {/* Other fields in 2-column grid */}
                {Object.entries(formData).map(([key, value]) => {
                    if (key === 'shiftFeedback') return null; // Already rendered above
                    return (
                        <div key={key} className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-gray-600">
                                {formatLabel(key)}
                            </label>
                            <textarea
                                name={key}
                                value={value}
                                onChange={handleChange}
                                rows="3"
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] bg-gray-50"
                            />
                        </div>
                    );
                })}

                {/* Action Buttons using CreateEmployee colors */}
                <div className="md:col-span-2 flex gap-4 mt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#008080] text-white font-bold py-3 rounded-lg hover:bg-[#035f5f] disabled:bg-gray-400 transition-colors cursor-pointer"
                    >
                        {isSubmitting ? "Saving..." : "Save Documentation"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 bg-[#F75D42] text-white font-bold py-3 rounded-lg hover:bg-[#d43f2a] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateUpdateServiceStaffNotes;