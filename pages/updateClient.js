"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const UpdateClient = () => {
  const [form, setForm] = useState(null);
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState(null); // Changed from 'success' to 'successMessage'
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedClient = sessionStorage.getItem("selectedClient");

    // ✅ Check for user and JWT token immediately on load
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    if (storedClient) {
      const client = JSON.parse(storedClient);
      setForm({
        clientId: client.clientId,
        companyId: client.companyId,
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        email: client.email || "",
        phoneNumber: client.phoneNumber || "",
        address: client.address || "",
        age: client.age || "",
        gender: client.gender || "",
        status: client.status || "Active",
      });
    } else {
      setError("No client data found in session storage. Redirecting to client list.");
      setTimeout(() => {
        router.push("/client");
      }, 500);
    }
  }, []); // Empty dependency array as router is accessed inside the effect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    // Re-check user and token before submitting
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Please log in again.");
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
      return;
    }

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          // ✅ Removed credentials: "include"
        }
      );

      if (response.ok) {
        setSuccessMessage("Client updated successfully.");
        setTimeout(() => {
          router.push("/client");
        }, 1500); // Give user a moment to see the success message
      } else {
        const errorText = await response.text();
        console.error("Failed to update client:", response.status, response.statusText, errorText);
        throw new Error(`Failed to update client: ${response.status} ${response.statusText} - ${errorText}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred while updating the client: " + err.message);
      // If fetching fails due to token issues (e.g., token expired/invalid),
      // consider redirecting to login after a delay.
      if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
           setTimeout(() => {
               router.replace("/login");
           }, 1500);
      }
    }
  };

  const handleCancel = () => {
    router.push("/client");
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  if (!form) {
    return <div className="p-6 text-center text-blue-600">Loading client data...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded shadow space-y-10">
      {/* Group Box: Update Client */}
      <fieldset className="border border-gray-300 rounded p-5">
        <legend className="text-xl font-semibold px-2">Update Client</legend>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block font-medium">Client ID</label>
            <input
              type="text"
              value={form.clientId}
              disabled
              className="w-full mt-1 border rounded px-3 py-2 bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block font-medium">Company ID</label>
            <input
              type="text"
              value={form.companyId}
              disabled
              className="w-full mt-1 border rounded px-3 py-2 bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div className="md:col-span-2"> {/* Span full width on medium screens */}
            <label className="block font-medium">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 border rounded px-3 py-2 resize-y"
            />
          </div>


          <div>
            <label className="block font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Nonbinary">Nonbinary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2"> {/* Span full width on medium screens */}
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default UpdateClient;
