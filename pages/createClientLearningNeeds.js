"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const CreateClientLearningNeeds = () => {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState(null); // Changed from 'success' to 'successMessage' for clarity
  const [formData, setFormData] = useState({
    clientId: "",
    companyId: "",
    preferredLearningMethod: "Other",
    assistiveTechnologyRequired: false,
    communicationSupport: "",
    literacyLevel: "Low",
    numeracyLevel: "Low",
    digitalSkillsLevel: "None",
    accessToDevice: "No",
    internetAccess: "No",
    trainingGoal: "",
    preferredTrainingDays: "",
    preferredTrainingTimes: "",
    onsiteSupportRequired: false,
    behavioralSupportNotes: "",
    additionalNotes: "",
  });
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const clientId = sessionStorage.getItem("ClientID");
    const companyId = sessionStorage.getItem("CompanyID");

    // ✅ Check for user and JWT token, along with client/company IDs
    if (!storedUser || !storedUser.jwtToken || !clientId || !companyId) {
      setError("User session or client/company information is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      clientId,
      companyId,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle SET data type for days and times
      const set = new Set(formData[name]?.split(",").filter(Boolean) || []);
      if (checked) {
        set.add(value);
      } else {
        set.delete(value);
      }
      setFormData({ ...formData, [name]: Array.from(set).join(",") });
    } else if (type === "radio") {
      // Handle boolean values from radio buttons
      setFormData({ ...formData, [name]: value === "true" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    // Basic validation
    if (!formData.clientId || !formData.companyId || !formData.preferredLearningMethod || !formData.trainingGoal) {
        setError("Please fill in all required fields (Client ID, Company ID, Preferred Learning Method, Training Goal).");
        return;
    }

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientLearnNeeds/create`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          // ✅ Removed credentials: "include"
        }
      );

      if (response.ok) {
        setSuccessMessage("Client learning needs created successfully."); // Set success message
        setTimeout(() => {
          router.push("/client");
        }, 1500); // Give user a moment to see the success message
      } else {
        const errorText = await response.text();
        console.error("Failed to create Client Learning Needs:", response.status, response.statusText, errorText);
        throw new Error(`Failed to create Client Learning Needs: ${response.status} ${response.statusText} - ${errorText}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("An error occurred while creating the learning needs: " + err.message); // Set error message
      // If fetching fails due to token issues (e.g., token expired/invalid),
      // consider redirecting to login after a delay.
      if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
           setTimeout(() => {
               router.replace("/login");
           }, 1500);
      }
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded text-center text-red-600">
        <p>{error}</p>
        <button onClick={() => router.push("/client")} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4">Create Client Learning Needs</h1>

      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      {/* Error message is already handled by the `if (error)` block above */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Read-only fields */}
        <div>
          <label className="block font-medium">Client ID</label>
          <input value={formData.clientId} readOnly className="input-readonly" />
        </div>
        <div>
          <label className="block font-medium">Company ID</label>
          <input value={formData.companyId} readOnly className="input-readonly" />
        </div>

        {/* Input fields */}
        <div>
          <label className="block font-medium">Preferred Learning Method</label>
          <select name="preferredLearningMethod" value={formData.preferredLearningMethod} onChange={handleChange} className="input">
            <option value="Visual">Visual</option>
            <option value="Auditory">Auditory</option>
            <option value="Reading/Writing">Reading/Writing</option>
            <option value="Kinesthetic">Kinesthetic</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Assistive Technology Required</label>
          <div className="flex gap-4 items-center h-full">
            <label><input type="radio" name="assistiveTechnologyRequired" value="true" checked={formData.assistiveTechnologyRequired === true} onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="assistiveTechnologyRequired" value="false" checked={formData.assistiveTechnologyRequired === false} onChange={handleChange} /> No</label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium">Communication Support</label>
          <textarea name="communicationSupport" value={formData.communicationSupport} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block font-medium">Literacy Level</label>
          <select name="literacyLevel" value={formData.literacyLevel} onChange={handleChange} className="input">
            <option>Low</option><option>Basic</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Numeracy Level</label>
          <select name="numeracyLevel" value={formData.numeracyLevel} onChange={handleChange} className="input">
            <option>Low</option><option>Basic</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Digital Skills Level</label>
          <select name="digitalSkillsLevel" value={formData.digitalSkillsLevel} onChange={handleChange} className="input">
            <option>None</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Access To Device</label>
          <select name="accessToDevice" value={formData.accessToDevice} onChange={handleChange} className="input">
            <option>Yes</option><option>No</option><option>Shared</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Internet Access</label>
          <select name="internetAccess" value={formData.internetAccess} onChange={handleChange} className="input">
            <option>Yes</option><option>No</option><option>Limited</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium">Training Goal</label>
          <textarea name="trainingGoal" value={formData.trainingGoal} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block font-medium">Preferred Training Days</label>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <label key={day} className="block">
              <input type="checkbox" name="preferredTrainingDays" value={day} checked={formData.preferredTrainingDays.includes(day)} onChange={handleChange} /> {day}
            </label>
          ))}
        </div>

        <div>
          <label className="block font-medium">Preferred Training Times</label>
          {["Morning", "Afternoon", "Evening"].map((time) => (
            <label key={time} className="block">
              <input type="checkbox" name="preferredTrainingTimes" value={time} checked={formData.preferredTrainingTimes.includes(time)} onChange={handleChange} /> {time}
            </label>
          ))}
        </div>

        <div>
          <label className="block font-medium">Onsite Support Required</label>
          <div className="flex gap-4 items-center h-full">
            <label><input type="radio" name="onsiteSupportRequired" value="true" checked={formData.onsiteSupportRequired === true} onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="onsiteSupportRequired" value="false" checked={formData.onsiteSupportRequired === false} onChange={handleChange} /> No</label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium">Behavioral Support Notes</label>
          <textarea name="behavioralSupportNotes" value={formData.behavioralSupportNotes} onChange={handleChange} className="input" />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium">Additional Notes</label>
          <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} className="input" />
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save
        </button>
        <button onClick={() => router.push("/client")} className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
          Cancel
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          margin-top: 0.25rem;
        }
        .input-readonly {
          width: 100%;
          padding: 0.5rem;
          background-color: #f1f1f1;
          border: 1px solid #ccc;
          border-radius: 6px;
          margin-top: 0.25rem;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default CreateClientLearningNeeds;
