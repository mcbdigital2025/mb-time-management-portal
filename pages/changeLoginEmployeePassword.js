import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const ChangeLoginEmployeePassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages

  useEffect(() => {
    const stored = sessionStorage.getItem("changePasswordEmployee");
    if (stored) {
      const emp = JSON.parse(stored);
      setEmail(emp.email);
      setCompanyId(emp.companyId.toString()); // Ensure BigInt preserved
      setOldPassword(""); // Ensure old password is blank on load
    } else {
      setError("No employee data found. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
    }
  }, []);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^()\-_=+{};:,<.>]).{8,}$/;
    return regex.test(password);
  };

  const handleSave = async () => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    if (!validatePassword(newPassword)) {
      setError("New password must be at least 8 characters, include upper/lowercase letters, a number, and a symbol.");
      return;
    }

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/changePassword?email=${encodeURIComponent(
          email
        )}&companyId=${encodeURIComponent(
          companyId
        )}&oldPassword=${encodeURIComponent(
          oldPassword
        )}&newPassword=${encodeURIComponent(newPassword)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            // 'Content-Type': 'application/json' // Add if sending a JSON body
          },
          // ✅ Removed credentials: "include"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to change password:", response.status, response.statusText, errorText);
        throw new Error(`Failed to change password: ${response.status} ${response.statusText} - ${errorText}`);
      }

      setSuccess("Password changed successfully!");

      // Navigate after short delay
      setTimeout(() => {
        router.replace("/employee"); // Or wherever you want to redirect after success
      }, 1500); // Give user a moment to see the success message

    } catch (err) {
      console.error("Error changing password:", err);
      setError("Failed to change password: " + err.message);
      // If fetching fails due to token issues (e.g., token expired/invalid),
      // consider redirecting to login after a delay.
      if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
           setTimeout(() => {
               router.replace("/login");
           }, 1500); // Give user a moment to see the error before redirect
      }
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Change Login Password</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      {!error && ( // Only show form if no critical error (like no employee data)
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Email:</label>
            <input
              type="text"
              value={email}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Company ID:</label>
            <input
              type="text"
              value={companyId}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-3"
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangeLoginEmployeePassword;
