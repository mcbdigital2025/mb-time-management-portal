"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { authenticatedFetch } from "../utils/api";
import { Loader2, Receipt, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";

const CreateUpdateServiceExpense = ({ user }) => {
  const router = useRouter();

  // Track context IDs
  const [activeBookingId, setActiveBookingId] = useState(null);

  const [formData, setFormData] = useState({
    expenseType: "Travel",
    amount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [expenseId, setExpenseId] = useState(null);
  const [attachmentId, setAttachmentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/staffAction/expense`;
  const ATTACHMENT_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/attachments/upload`;

  // --- EFFECT: Initialize Context ---
  useEffect(() => {
    if (!router.isReady) return;

    const sessionStoreId = sessionStorage.getItem("currentClientBookingId");
    const urlBookingId = router.query.scheduleId || router.query.clientBookingId;
    const finalBookingId = urlBookingId || sessionStoreId;
    if (finalBookingId) {
      setActiveBookingId(finalBookingId);
    } else {
      setError("No shift reference found. Please return to the schedule.");
      setIsPageLoading(false);
    }
  }, [router.isReady, router.query]);

  // --- EFFECT: Fetch Existing Expense ---
  useEffect(() => {
    // 1. ADD GUARD: Stop if IDs are not ready
    if (!activeBookingId || !user?.companyId) {
      console.log("Fetch postponed: activeBookingId is currently:", activeBookingId);
      return;
    }

    const fetchExistingExpense = async () => {
      try {
        // Log for debugging to ensure we are sending the right ID
        console.log(`Calling API with Booking ID activeBookingId: activeBookingId`);

        const response = await authenticatedFetch(
          `${API_BASE}/${user.companyId}/${activeBookingId}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setExpenseId(data.expenseId);
            setAttachmentId(data.attachmentId);
            setFormData({
              expenseType: data.expenseType || "Travel",
              amount: data.amount || "",
              expenseDate: data.expenseDate || new Date().toISOString().split("T")[0],
              description: data.description || "",
            });
          }
        }
      } catch (err) {
        console.log("No existing expense found for this shift.");
      } finally {
        // 2. ONLY stop loading after the fetch attempt is done
        setIsPageLoading(false);
      }
    };

    fetchExistingExpense();
  }, [activeBookingId, user?.companyId, API_BASE]); // 3. Re-run when activeBookingId changes from null to the actual ID

  // --- FILE UPLOAD LOGIC ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("companyId", user?.companyId);

    try {
      const response = await fetch(ATTACHMENT_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: uploadData,
      });

      if (response.ok) {
        const result = await response.json();
        setAttachmentId(result.attachmentId);
        toast.success("Receipt attached!");
      } else {
        toast.error("Failed to upload receipt.");
      }
    } catch (err) {
      toast.error("Error during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeBookingId) {
      toast.error("Shift reference lost.");
      return;
    }

    setIsSubmitting(true);
    const method = expenseId ? "PUT" : "POST";
    const endpoint = expenseId ? `${API_BASE}/update` : `${API_BASE}/create`;
console.log("DEBUG: Expense Context method 12 :", method);
console.log("DEBUG: Expense Context endpoint 12 :", method);
    const payload = {
      ...formData,
      expenseId: expenseId,
      companyId: user?.companyId,
      employeeId: user?.employeeId,
      clientBookingId: activeBookingId,
      attachmentId: attachmentId,
    };

    try {
      const response = await authenticatedFetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Expense claim saved successfully.");
        router.back();
      } else {
        toast.error("Failed to save expense claim.");
      }
    } catch (err) {
      toast.error("Server communication error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#008080]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-[#F75D42] mb-4" />
        <p className="font-bold text-gray-700">{error}</p>
        <button onClick={() => router.back()} className="mt-4 text-[#008080] font-bold underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#008080] p-6 text-white flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Receipt size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black">Expense Claim</h1>
            <p className="text-xs text-teal-100 uppercase tracking-wider font-bold">
              Shift ID: {activeBookingId}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Expense Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase">Expense Type</label>
            <select
              name="expenseType"
              value={formData.expenseType}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-[#008080] outline-none transition-all"
            >
              <option value="Travel">Travel / Parking</option>
              <option value="Meals">Meals</option>
              <option value="Supplies">Client Supplies</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-[#008080] outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase">Date</label>
              <input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-[#008080] outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Provide details about this expense..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-[#008080] outline-none"
            />
          </div>

          {/* Receipt Upload */}
          <div className="p-4 bg-teal-50/50 border-2 border-dashed border-teal-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UploadCloud className="text-[#008080]" size={24} />
              <div>
                <p className="text-sm font-bold text-gray-700">Attach Receipt</p>
                <p className="text-[10px] text-gray-500 font-medium">Image or PDF (Max 5MB)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="receipt-upload"
                hidden
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <label
                htmlFor="receipt-upload"
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase cursor-pointer transition-all ${
                  isUploading ? "bg-gray-200 text-gray-400" : "bg-[#008080] text-white hover:bg-[#035f5f]"
                }`}
              >
                {isUploading ? "Uploading..." : "Select"}
              </label>
              {attachmentId && <CheckCircle2 className="text-emerald-500" size={20} />}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 bg-[#008080] text-white font-bold py-4 rounded-xl hover:bg-[#035f5f] shadow-lg shadow-teal-700/20 disabled:bg-gray-400 transition-all"
            >
              {isSubmitting ? "Saving..." : "Submit Claim"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 bg-white border border-gray-200 text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUpdateServiceExpense;