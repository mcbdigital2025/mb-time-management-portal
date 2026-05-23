"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { authenticatedFetch } from '../../utils/api';
import { Loader2 } from 'lucide-react';

const CreateUpdateServiceStaffNotesModal = ({ user,
    clientBookingId,
    onClose,
    onSaved, }) => {

    // 1. Change state to track the ID from session or URL
    const [activeBookingId, setActiveBookingId] = useState(null);
    const [formData, setFormData] = useState({
        shiftFeedback: '',
        clientLearningNeeds: '',
        goalProgressNotes: '',
        behavioralNotes: '',
        medicalObservations: '',
    });

    const [serviceStaffNotesId, setServiceStaffNotesId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/staffAction/notes`;

    useEffect(() => {
        if (clientBookingId) {
            setActiveBookingId(clientBookingId);
        } else {
            setIsPageLoading(false);
            setError("No clientBookingId reference found. Please select a shift.");
        }
    }, [clientBookingId]);

    // --- EFFECT: Fetch existing notes once activeBookingId is set ---
    useEffect(() => {
        if (!activeBookingId || !user?.companyId) return;

        const fetchExistingNotes = async () => {
            try {
                const response = await authenticatedFetch(`${API_BASE}/booking/${user.companyId}/${activeBookingId}`);
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
                console.log("No existing notes found.");
            } finally {
                setIsPageLoading(false);
            }
        };
        fetchExistingNotes();
    }, [activeBookingId, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!activeBookingId) {
            toast.error("Shift reference lost. Please return to the schedule.");
            return;
        }

        setIsSubmitting(true);
        const method = serviceStaffNotesId ? 'PUT' : 'POST';
        const endpoint = serviceStaffNotesId ? `${API_BASE}/update` : `${API_BASE}/create`;

        const payload = {
            ...formData,
            serviceStaffNotesId: serviceStaffNotesId,
            clientBookingId: activeBookingId, // Using our stable session/URL ID
            companyId: user?.companyId,
            employeeId: user?.employeeId
        };

        try {
            const response = await authenticatedFetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Notes saved successfully!");
                onSaved?.();
            } else {
                setError("Failed to save notes.");
            }
        } catch (err) {
            setError("An error occurred while saving.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Standard formatting and JSX helpers
    const formatLabel = (key) => key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

    if (isPageLoading) {
        return (
            <div className=" min-h-[85vh] p-8 flex flex-col items-center justify-center gap-3 text-slate-500 font-bold">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="animate-pulse">Loading...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                {serviceStaffNotesId ? "Update Shift Notes" : "Create Shift Notes"}
            </h1>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-600">Shift Feedback *</label>
                    <textarea
                        name="shiftFeedback"
                        value={formData.shiftFeedback}
                        onChange={handleChange}
                        required
                        className="p-3 border rounded-lg bg-gray-50"
                    />
                </div>

                {Object.entries(formData).map(([key, value]) => {
                    if (key === 'shiftFeedback') return null;
                    return (
                        <div key={key} className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-gray-600">{formatLabel(key)}</label>
                            <textarea
                                name={key}
                                value={value}
                                onChange={handleChange}
                                className="p-3 border rounded-lg bg-gray-50"
                            />
                        </div>
                    );
                })}

                <div className="md:col-span-2 flex gap-4 mt-6">
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#008080] text-white py-3 rounded-lg font-bold disabled:bg-gray-400">
                        {isSubmitting ? "Saving..." : "Save Documentation"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-[#F75D42] text-white py-3 rounded-lg font-bold"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateUpdateServiceStaffNotesModal;