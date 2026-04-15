"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { authenticatedFetch } from '../utils/api';

const CreateUpdateServiceMileage = ({ user }) => {
    const router = useRouter();

    // Track the ID from session or URL as seen in referenced logic
    const [activeBookingId, setActiveBookingId] = useState(null);

    const [formData, setFormData] = useState({
        mileageCap: '',
        mileageRate: '',
        hasCompanyVehicle: false,
    });

    const [serviceMileageId, setServiceMileageId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/staffAction/mileage`;

    // --- EFFECT: Initialize ID from Session (Matching myshiftsschedule.js logic) ---
    useEffect(() => {
        if (!router.isReady) return;

        // Retrieve the session value passed from myshiftsschedule.js
        const sessionStoreId = sessionStorage.getItem('currentClientBookingId');
        const urlId = router.query.scheduleId || router.query.clientBookingId;

        const finalId = sessionStoreId || urlId;

        if (finalId) {
            setActiveBookingId(finalId);
        } else {
            setIsPageLoading(false);
            setError("No shift reference found. Please return to the schedule.");
        }
    }, [router.isReady, router.query]);

    // --- EFFECT: Fetch existing mileage record if it exists ---
    useEffect(() => {
        if (!activeBookingId || !user?.companyId) return;

        const fetchExistingMileage = async () => {
            try {
                // Endpoint follows the pattern of the referenced staff notes fetch
                const response = await authenticatedFetch(`${API_BASE}/booking/${user.companyId}/${activeBookingId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setServiceMileageId(data.serviceMileageId);
                        setFormData({
                            mileageCap: data.mileageCap || '',
                            mileageRate: data.mileageRate || '',
                            hasCompanyVehicle: data.hasCompanyVehicle || false,
                        });
                    }
                }
            } catch (err) {
                console.log("No existing mileage record found for this shift.");
            } finally {
                setIsPageLoading(false);
            }
        };
        fetchExistingMileage();
    }, [activeBookingId, user, API_BASE]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!activeBookingId) {
            toast.error("Shift reference lost. Please return to the schedule.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const method = serviceMileageId ? 'PUT' : 'POST';
        const endpoint = serviceMileageId ? `${API_BASE}/update` : `${API_BASE}/create`;

        // Construct ServiceMileage JSON object
        const payload = {
            serviceMileageId: serviceMileageId,
            companyId: user?.companyId,
            clientBookingId: activeBookingId,
            mileageCap: formData.mileageCap,
            mileageRate: formData.mileageRate,
            hasCompanyVehicle: formData.hasCompanyVehicle
        };

        try {
            const response = await authenticatedFetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Mileage details saved successfully!");
                router.push("/myshiftsschedule");
            } else {
                setError("Failed to save mileage. Please check your connection.");
            }
        } catch (err) {
            setError("An error occurred while saving.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPageLoading) {
        return <div className="p-10 text-center font-bold text-gray-500">Loading Shift Data...</div>;
    }

    return (

        <div className='min-h-[85vh] hero-radial-background flex justify-center items-center'>

        <div className="max-w-5xl  mx-auto p-6  bg-white shadow-lg rounded-lg mt-10 border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                {serviceMileageId ? "Update Service Mileage" : "Add Service Mileage"}
            </h1>

            {error && (
                <p className="bg-red-100 text-red-700 p-3 rounded mb-4 font-semibold">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mileage Cap Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-gray-600">
                            Mileage Cap (BigDecimal)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="mileageCap"
                            value={formData.mileageCap}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] bg-gray-50"
                        />
                    </div>

                    {/* Mileage Rate Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-gray-600">
                            Mileage Rate (BigDecimal)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="mileageRate"
                            value={formData.mileageRate}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] bg-gray-50"
                        />
                    </div>
                </div>

                {/* Has Company Vehicle Boolean Field */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <input
                        type="checkbox"
                        id="hasCompanyVehicle"
                        name="hasCompanyVehicle"
                        checked={formData.hasCompanyVehicle}
                        onChange={handleChange}
                        className="w-5 h-5 accent-[#008080]"
                    />
                    <label htmlFor="hasCompanyVehicle" className="text-sm font-bold text-gray-700 cursor-pointer">
                        Used Company Vehicle?
                    </label>
                </div>

                {/* Action Buttons using CreateUpdateServiceStaffNotes colors */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#008080] text-white font-bold py-3 rounded-lg hover:bg-[#035f5f] disabled:bg-gray-400 transition-colors cursor-pointer"
                    >
                        {isSubmitting ? "Saving..." : "Save Mileage"}
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
        </div>
    );
};

export default CreateUpdateServiceMileage;