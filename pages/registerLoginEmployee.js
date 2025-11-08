import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const RegisterLoginEmployee = () => {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState("Basic");
  const [successMessage, setSuccessMessage] = useState(""); // Changed from 'success' to 'successMessage'
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    setEmail("");
    setPassword("");
    setError(null); // Clear errors on mount
    setSuccessMessage(""); // Clear success on mount

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedCompanyId = sessionStorage.getItem("companyId");

    // ✅ Check for user and JWT token immediately on load
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    if (storedCompanyId) {
      setCompanyId(storedCompanyId); // Keep as string
    } else {
      setError("Company ID not found in session storage. Redirecting to employee login list.");
      setTimeout(() => {
        router.replace("/loginemployees");
      }, 500);
    }
  }, []);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^()\-_=+{};:,<.>]).{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async () => {
    setError(null); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages

    if (!email || !password || !accessLevel || !companyId) {
      setError("All fields are required.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol."
      );
      return;
    }

    // Re-check user and token before submitting
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Please log in again.");
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
      return;
    }

    const payload = {
      email,
      password,
      accessLevel,
      companyId: BigInt(companyId).toString(), // Ensure companyId is a string for the backend
      lastLogin: null, // These fields are typically managed by the backend on creation
      failedLoginAttempts: 0, // These fields are typically managed by the backend on creation
      saltedHash: "", // This field is typically managed by the backend on creation
    };

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          // ✅ Removed credentials: "include"
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to register employee:", response.status, response.statusText, errorText);
        throw new Error(`Failed to register: ${response.status} ${response.statusText} - ${errorText}`);
      }

      setSuccessMessage("Registered login employee successfully!");

      // Navigate after short delay
      setTimeout(() => {
        router.replace("/loginemployees");
      }, 1500); // Give user a moment to see the success message
    } catch (err) {
      console.error("Registration error:", err);
      setError("Error registering: " + err.message);
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
    router.push("/loginemployees");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-xl font-bold mb-6 text-center">Register Login Employee</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="font-semibold">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-2/3 p-2 border rounded"
            autoComplete="off"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-2/3 p-2 border rounded"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">Access Level:</label>
          <select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
            className="w-2/3 p-2 border rounded"
          >
            <option value="Basic">Basic</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Administrator">Administrator</option>
            <option value="Super Administrator">Super Administrator</option> {/* Added for completeness */}
          </select>
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">Company ID:</label>
          <input
            type="text"
            value={companyId}
            readOnly
            className="w-2/3 p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-4"> {/* Added a flex container for buttons */}
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleRegister}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterLoginEmployee;
