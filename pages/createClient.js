"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const CreateClient = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientId: "",
    companyId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    status: "Active",
    address: "",
  });
  const [error, setError] = useState(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState(null); // State for success messages

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedCompanyId = sessionStorage.getItem("companyId");

    // ✅ Check for user and JWT token
    if (!storedUser || !storedUser.jwtToken || !storedCompanyId) {
      setError("User session or company information is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    setFormData((prev) => ({ ...prev, companyId: storedCompanyId }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    // Basic validation
    if (!formData.clientId || !formData.companyId || !formData.firstName || !formData.email) {
        setError("Please fill in all required fields (Client ID, Company ID, First Name, Email).");
        return;
    }

    try {
      const payload = { ...formData };
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          // ✅ Removed credentials: "include"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to create client:", response.status, response.statusText, errorText);
        throw new Error(`Failed to create client: ${response.status} ${response.statusText} - ${errorText}`);
      }

      setSuccessMessage("Client created successfully!");
      // Navigate after short delay
      setTimeout(() => {
        router.push("/client");
      }, 1500); // Give user a moment to see the success message

    } catch (err) {
      console.error("Error creating client:", err);
      setError("Error creating client: " + err.message);
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

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-50 rounded shadow space-y-10">
      {/* Group Box: Create Client */}
      <fieldset className="border border-gray-300 rounded p-5">
        <legend className="text-xl font-semibold px-2">Create Client</legend>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block font-medium">Client ID</label>
            <input
              type="text"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Company ID</label>
            <input
              type="text"
              name="companyId"
              value={formData.companyId}
              readOnly
              className="w-full mt-1 border rounded px-3 py-2 bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2"> {/* Make status span full width on medium screens */}
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2"> {/* Make address span full width on medium screens */}
            <label className="block font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="4"
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

        </form>

        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default CreateClient;
