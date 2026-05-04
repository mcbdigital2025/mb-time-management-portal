"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import JSONbig from "json-bigint";
import { authenticatedFetch } from "../utils/api";
import { Loader2, Receipt, UploadCloud, CheckCircle2, AlertCircle, X } from "lucide-react";

const CreateUpdateServiceExpense = ({ user }) => {
  const router = useRouter();

  // ID & Context State
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [expenseId, setExpenseId] = useState(null);
  const [attachmentId, setAttachmentId] = useState(null);

  // Form & File State
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    expenseType: "Travel",
    amount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  // UI Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Endpoints - Updated to match ServiceStaffActionController paths
  const API_BASE       = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/staffAction/expense`;
  const ATTACHMENT_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/staffAction/attachment`;

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

  useEffect(() => {
    if (!activeBookingId || !user?.companyId) return;

    const fetchExistingExpense = async () => {
      try {
        const response = await authenticatedFetch(`${API_BASE}/${user.companyId}/${activeBookingId}`);
        if (response.ok) {
          // 1. Get the response as raw text (String) to preserve precision
          const rawText = await response.text();
          console.log("return rawText (string):", rawText);

          // 2. Parse the string using JSONbig
          const data = JSONbig.parse(rawText);

          // 3. Convert the BigInt to a string for React state
          const safeAttachmentId = data.attachmentId ? data.attachmentId.toString() : null;
          console.log("return data.attachmentId (safe):", safeAttachmentId);

          if (data) {
            setExpenseId(data.expenseId);
            setAttachmentId(safeAttachmentId); // Now it's the exact ID from the DB
            setFormData({
              expenseType: data.expenseType || "Travel",
              amount: data.amount || "",
              expenseDate: data.expenseDate || new Date().toISOString().split("T")[0],
              description: data.description || "",
            });
          }
        }
      } catch (err) {
        console.log("Error fetching expense:", err);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchExistingExpense();
  }, [activeBookingId, user?.companyId, API_BASE]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.info(`Selected: ${file.name}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper to convert file to Base64 for JSON transmission
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeBookingId) return toast.error("Shift reference lost.");

    setIsSubmitting(true);
    let currentAttachmentId = attachmentId;

    try {
      // 1. ATTACHMENT PHASE: Handle @RequestBody Attachment
      if (selectedFile) {
        const base64Data = await fileToBase64(selectedFile);

        const attachmentPayload = {
          attachmentId: currentAttachmentId, // Maps to private Long attachmentId
          companyId: user?.companyId,        // Maps to private Long companyId
          fileName: selectedFile.name,
          attachmentBlob: base64Data         // Maps to private byte[] attachmentBlob
        };

        const uploadMethod = currentAttachmentId ? "PUT" : "POST";
        const uploadEndpoint = currentAttachmentId ? `${ATTACHMENT_API}/update` : `${ATTACHMENT_API}/create`;

        const uploadRes = await authenticatedFetch(uploadEndpoint, {
          method: uploadMethod,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attachmentPayload),
        });
        console.log("attachmentPayload:", attachmentPayload);
        if (uploadRes.ok) {
          // 1. Get the raw text from the response
            const rawText = await uploadRes.text();

            // 2. Parse it using JSONbig
            const result = JSONbig.parse(rawText);

            // 3. result.attachmentId is now a BigInt object or string
            currentAttachmentId = result.attachmentId.toString();
            setAttachmentId(currentAttachmentId);
        } else {

          throw new Error("Failed to upload attachment to server.");
        }
      }
      console.log("return currentAttachmentId:", currentAttachmentId);

      // 2. EXPENSE PHASE: Save the main record[cite: 2]
      const expenseMethod = expenseId ? "PUT" : "POST";
      const expenseEndpoint = expenseId ? `${API_BASE}/update` : `${API_BASE}/create`;

      const payload = {
        ...formData,
        expenseId,
        companyId: user?.companyId,
        employeeId: user?.employeeId,
        clientBookingId: activeBookingId,
        attachmentId: currentAttachmentId,
      };
console.log("payload:", payload);
      const expenseRes = await authenticatedFetch(expenseEndpoint, {
        method: expenseMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (expenseRes.ok) {
        toast.success(expenseId ? "Claim updated!" : "Claim submitted!");
        router.back();
      } else {
        toast.error("Failed to save claim details.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#008080]" size={40} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="bg-[#008080] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Receipt size={24} />
            <div>
              <h1 className="text-xl font-black">Expense Claim</h1>
              <p className="text-xs font-bold">Shift ID: {activeBookingId}</p>
            </div>
          </div>
          <button onClick={() => router.back()}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase">Category</label>
            <select name="expenseType" value={formData.expenseType} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl font-bold">
              <option value="Travel">Travel / Parking</option>
              <option value="Meals">Meals</option>
              <option value="Supplies">Client Supplies</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase">Amount ($)</label>
              <input type="number" step="0.01" name="amount" required value={formData.amount} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase">Date</label>
              <input type="date" name="expenseDate" required value={formData.expenseDate} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl font-bold" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase">Description</label>
            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
          </div>

          <div className="p-4 bg-teal-50 border-2 border-dashed border-teal-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UploadCloud className="text-[#008080]" size={24} />
              <p className="text-sm font-bold text-gray-700">{selectedFile ? selectedFile.name : "Attach Receipt"}</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="file" id="file-input" hidden onChange={handleFileSelect} accept="image/*,.pdf" />
              <label htmlFor="file-input" className="px-4 py-2 bg-[#008080] text-white rounded-lg text-xs font-black uppercase cursor-pointer">
                {attachmentId || selectedFile ? "Change" : "Select"}
              </label>
              {(attachmentId || selectedFile) && <CheckCircle2 className="text-emerald-500" size={20} />}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#008080] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
            {isSubmitting && <Loader2 className="animate-spin" size={18} />}
            {isSubmitting ? "Saving..." : expenseId ? "Update Claim" : "Submit Claim"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUpdateServiceExpense;