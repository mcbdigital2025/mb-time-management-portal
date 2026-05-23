"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import JSONbig from "json-bigint";
import {
  Loader2,
  Receipt,
  UploadCloud,
  CheckCircle2,
  X,
} from "lucide-react";
import { authenticatedFetch } from "../../utils/api";

const CreateUpdateServiceExpenseModal = ({
  user,
  clientBookingId,
  onClose,
  onSaved,
}) => {
  const [expenseId, setExpenseId] = useState(null);
  const [attachmentId, setAttachmentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    expenseType: "Travel",
    amount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/staffAction/expense`;
  const ATTACHMENT_API = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/staffAction/attachment`;

  useEffect(() => {
    if (!clientBookingId || !user?.companyId) {
      setError("No shift reference found. Please select a shift again.");
      setIsPageLoading(false);
      return;
    }

    const fetchExistingExpense = async () => {
      try {
        const response = await authenticatedFetch(
          `${API_BASE}/${user.companyId}/${clientBookingId}`,
        );

        if (response.ok) {
          const rawText = await response.text();
          if (!rawText) return;

          const data = JSONbig.parse(rawText);
          const safeAttachmentId = data.attachmentId
            ? data.attachmentId.toString()
            : null;

          if (data) {
            if (data.fileName) {
              setSelectedFile({
                name: data.fileName,
                isExisting: true,
              });
            }

            setExpenseId(data.expenseId);
            setAttachmentId(safeAttachmentId);

            setFormData({
              expenseType: data.expenseType || "Travel",
              amount: data.amount || "",
              expenseDate:
                data.expenseDate || new Date().toISOString().split("T")[0],
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
  }, [clientBookingId, user?.companyId, API_BASE]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      toast.info(`Selected: ${file.name}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientBookingId) {
      toast.error("Shift reference lost.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    let currentAttachmentId = attachmentId;

    try {
      /**
       * Only upload when the user picked a real new file.
       * Existing file placeholders should NOT be passed to FileReader.
       */
      if (selectedFile && !selectedFile.isExisting) {
        const base64Data = await fileToBase64(selectedFile);

        const attachmentPayload = {
          attachmentId: currentAttachmentId,
          companyId: user?.companyId,
          fileName: selectedFile.name,
          attachmentBlob: base64Data,
        };

        const uploadMethod = currentAttachmentId ? "PUT" : "POST";
        const uploadEndpoint = currentAttachmentId
          ? `${ATTACHMENT_API}/update`
          : `${ATTACHMENT_API}/create`;

        const uploadRes = await authenticatedFetch(uploadEndpoint, {
          method: uploadMethod,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attachmentPayload),
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload attachment to server.");
        }

        const rawText = await uploadRes.text();
        const result = JSONbig.parse(rawText);

        currentAttachmentId = result.attachmentId.toString();
        setAttachmentId(currentAttachmentId);
      }

      const expenseMethod = expenseId ? "PUT" : "POST";
      const expenseEndpoint = expenseId
        ? `${API_BASE}/update`
        : `${API_BASE}/create`;

      const payload = {
        ...formData,
        expenseId,
        companyId: user?.companyId,
        employeeId: user?.employeeId,
        clientBookingId,
        attachmentId: currentAttachmentId,
      };

      const expenseRes = await authenticatedFetch(expenseEndpoint, {
        method: expenseMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (expenseRes.ok) {
        toast.success(expenseId ? "Claim updated!" : "Claim submitted!");

        if (onSaved) {
          onSaved();
        }
      } else {
        toast.error("Failed to save claim details.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-[320px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#008080]" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden">
      <div className="bg-[#008080] p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Receipt size={24} />
          <div>
            <h1 className="text-xl font-black">Expense Claim</h1>
            <p className="text-xs font-bold">Shift ID: {clientBookingId}</p>
          </div>
        </div>

        <button type="button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {error && (
        <p className="mx-6 mt-5 bg-red-100 text-red-700 p-3 rounded font-semibold">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-400 uppercase">
            Category
          </label>
          <select
            name="expenseType"
            value={formData.expenseType}
            onChange={handleChange}
            className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
          >
            <option value="Travel">Travel / Parking</option>
            <option value="Meals">Meals</option>
            <option value="Supplies">Client Supplies</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              required
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase">
              Date
            </label>
            <input
              type="date"
              name="expenseDate"
              required
              value={formData.expenseDate}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border rounded-xl font-bold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-400 uppercase">
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 bg-gray-50 border rounded-xl"
          />
        </div>

        <div className="p-4 bg-teal-50 border-2 border-dashed border-teal-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <UploadCloud className="text-[#008080] shrink-0" size={24} />
            <p className="text-sm font-bold text-gray-700 truncate">
              {selectedFile ? selectedFile.name : "Attach Receipt"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              id="expense-file-input"
              hidden
              onChange={handleFileSelect}
              accept="image/*,.pdf"
            />

            <label
              htmlFor="expense-file-input"
              className="px-4 py-2 bg-[#008080] text-white rounded-lg text-xs font-black uppercase cursor-pointer"
            >
              {attachmentId || selectedFile ? "Change" : "Select"}
            </label>

            {(attachmentId || selectedFile) && (
              <CheckCircle2 className="text-emerald-500" size={20} />
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] bg-[#008080] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={18} />}
            {isSubmitting
              ? "Saving..."
              : expenseId
                ? "Update Claim"
                : "Submit Claim"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUpdateServiceExpenseModal;