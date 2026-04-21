"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { authenticatedFetch } from '../utils/api';
import { Loader2 } from 'lucide-react';

const CreateUpdateIncidentReport = ({ user }) => {
    const router = useRouter();

    // Tracking context IDs
    const [activeBookingId, setActiveBookingId] = useState(null);
    const [activeClientId, setActiveClientId] = useState(null);

    const [formData, setFormData] = useState({
        incidentDate: new Date().toISOString().split('T')[0],
        incidentTime: new Date().toTimeString().slice(0, 5),
        locationOfIncident: '',
        incidentType: 'Injury',
        severityLevel: 'Low',
        descriptionOfIncident: '',
        immediateActionsTaken: '',
        injuriesSustained: '',
        bodyPartAffected: '',
        firstAidAdministered: false,
        emergencyServicesCalled: false,
        managementFollowUp: '',
        preventativeMeasures: '',
        status: 'Reported'
    });

    const [incidentId, setIncidentId] = useState(null);
    const [attachmentId, setAttachmentId] = useState(null); // Saved after file upload
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/staffAction`;
    const ATTACHMENT_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/attachments/upload`;

    // --- EFFECT: Initialize Context ---
    useEffect(() => {
        if (!router.isReady) return;

        const sessionBookingId = sessionStorage.getItem('currentClientBookingId');
        const urlBookingId = router.query.scheduleId || router.query.clientBookingId;
        const clientId = router.query.clientId;

        const finalBookingId = sessionBookingId || urlBookingId;

        if (finalBookingId) {
            setActiveBookingId(finalBookingId);
            setActiveClientId(clientId);
        } else {
            setIsPageLoading(false);
            setError("No shift reference found. Please return to the schedule.");
        }
    }, [router.isReady, router.query]);

    // --- EFFECT: Fetch Existing Report ---
    useEffect(() => {
        if (!activeBookingId || !user?.companyId) return;

        const fetchExistingReport = async () => {
            try {
                const response = await authenticatedFetch(`${API_BASE}/incident/${user.companyId}/${activeBookingId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setIncidentId(data.incidentId);
                        setAttachmentId(data.attachmentId);
                        setFormData({
                            ...data,
                            incidentDate: data.incidentDate || '',
                            incidentTime: data.incidentTime ? data.incidentTime.slice(0, 5) : ''
                        });
                    }
                }
            } catch (err) {
                console.log("No existing report found.");
            } finally {
                setIsPageLoading(false);
            }
        };
        fetchExistingReport();
    }, [activeBookingId, user, API_BASE]);

    // --- FILE UPLOAD LOGIC ---
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Optional: File size limit check (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File is too large. Max 5MB allowed.");
            return;
        }

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('companyId', user?.companyId);

        // Setting a default expire date (e.g., 7 years for compliance)
        const expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 7);
        uploadData.append('expireDate', expireDate.toISOString());

        try {
            const response = await fetch(ATTACHMENT_API, {
                method: 'POST',
                headers: {
                    // Headers usually managed by authenticatedFetch or browser for FormData
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: uploadData,
            });

            if (response.ok) {
                const result = await response.json();
                setAttachmentId(result.attachmentId); // Store returned PK from Attachment table
                toast.success("Attachment uploaded and linked!");
            } else {
                toast.error("Failed to upload attachment.");
            }
        } catch (err) {
            toast.error("Error during upload.");
        } finally {
            setIsUploading(false);
        }
    };

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
            toast.error("Shift reference lost.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const method = incidentId ? 'PUT' : 'POST';
        const endpoint = incidentId ? `${API_BASE}/update` : `${API_BASE}/create`;

        // IncidentReport JSON Object including Attachment_Id
        const payload = {
            ...formData,
            incidentId: incidentId,
            companyId: user?.companyId,
            clientBookingId: activeBookingId,
            employeeId: user?.employeeId,
            clientId: activeClientId,
            attachmentId: attachmentId // Links the previously uploaded Attachment record
        };

        try {
            const response = await authenticatedFetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Incident report saved successfully!");
                router.push("/myshiftsschedule");
            } else {
                setError("Submission failed. Check your data.");
            }
        } catch (err) {
            setError("Communication error with server.");
        } finally {
            setIsSubmitting(false);
        }
    };


    if (isPageLoading) {
        return (
          <div className=" min-h-[85vh] p-8 flex flex-col items-center justify-center gap-3 text-slate-500 font-bold">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="animate-pulse">Loading...</span>
          </div>
        );
      }

    return (
        <div className="min-h-[85vh] justify-center items-center py-5 pb-15">

        <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 border border-slate-100">
            <h1 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">
                <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
                {incidentId ? "Modify Incident Record" : "Register New Incident"}
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date & Time Section */}
                <div className="space-y-4">
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">Occurrence Details</label>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="date" name="incidentDate" value={formData.incidentDate} onChange={handleChange} required className="p-3 border rounded-xl bg-slate-50 w-full" />
                        <input type="time" name="incidentTime" value={formData.incidentTime} onChange={handleChange} required className="p-3 border rounded-xl bg-slate-50 w-full" />
                    </div>
                    <input type="text" name="locationOfIncident" value={formData.locationOfIncident} onChange={handleChange} required placeholder="Exact Location (e.g. Kitchen, Park)" className="p-3 border rounded-xl bg-slate-50 w-full" />
                </div>

                {/* Categorization */}
                <div className="space-y-4">
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">Classification</label>
                    <div className="grid grid-cols-2 gap-4">
                        <select name="incidentType" value={formData.incidentType} onChange={handleChange} className="p-3 border rounded-xl bg-slate-50 w-full">
                            <option value="Injury">Injury</option>
                            <option value="Near Miss">Near Miss</option>
                            <option value="Behavioral">Behavioral</option>
                            <option value="Property Damage">Property Damage</option>
                        </select>
                        <select name="severityLevel" value={formData.severityLevel} onChange={handleChange} className="p-3 border rounded-xl bg-slate-50 w-full">
                            <option value="Low">Low Severity</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High Severity</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>

                {/* ATTACHMENT SECTION */}
                <div className="md:col-span-2 p-6 bg-emerald-50/50 rounded-2xl border-2 border-dashed border-emerald-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-emerald-900">Evidence & Attachments</h3>
                            <p className="text-sm text-emerald-700">Upload photos or documents related to the incident.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                id="file-upload"
                                hidden
                                onChange={handleFileUpload}
                                disabled={isUploading}
                            />
                            <label
                                htmlFor="file-upload"
                                className={`px-6 py-2 rounded-full font-bold text-sm cursor-pointer transition-all ${
                                    isUploading ? 'bg-slate-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                            >
                                {isUploading ? "Uploading..." : "Choose File"}
                            </label>
                            {attachmentId && (
                                <span className="text-xs font-black text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm border border-emerald-100">
                                    ID: {attachmentId} - ATTACHED
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2">Detailed Narrative</label>
                    <textarea name="descriptionOfIncident" value={formData.descriptionOfIncident} onChange={handleChange} required rows="5" className="p-4 border rounded-2xl bg-slate-50 w-full focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Provide a step-by-step account of the event..." />
                </div>

                {/* Actions Taken */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2">Immediate Actions Taken</label>
                    <textarea name="immediateActionsTaken" value={formData.immediateActionsTaken} onChange={handleChange} rows="3" className="p-4 border rounded-2xl bg-slate-50 w-full focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="What did you do immediately after the incident?" />
                </div>

                {/* Submit / Cancel */}
                <div className="md:col-span-2 flex gap-4 mt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="flex-2 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black disabled:bg-slate-300 transition-all shadow-lg"
                    >
                        {isSubmitting ? "Finalizing Report..." : "Submit Incident Report"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default CreateUpdateIncidentReport;