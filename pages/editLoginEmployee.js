import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const EditLoginEmployee = () => {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [accessLevel, setAccessLevel] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Changed from 'success' to 'successMessage'
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const stored = sessionStorage.getItem("editEmployee");

    // ✅ Check for user and JWT token immediately on load
    if (!storedUser || !storedUser.jwtToken) {
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    if (stored) {
      try {
        const data = JSON.parse(stored);
        setEmployee(data);
        setAccessLevel(data.accessLevel || "Basic");
      } catch (err) {
        console.error("Invalid session data:", err);
        setError("Invalid employee data found in session storage. Redirecting.");
        setTimeout(() => {
          router.replace("/loginemployees");
        }, 500);
      }
    } else {
      setError("No employee selected for editing. Redirecting to employee list.");
      setTimeout(() => {
        router.replace("/loginemployees");
      }, 500);
    }
  }, []);

  const handleSave = async () => {
    setError(null); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages

    if (!employee || !accessLevel) {
      setError("Employee data or access level is missing.");
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

    const { email, companyId } = employee;

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/updateAccessLevel?email=${encodeURIComponent(
          email
        )}&companyId=${encodeURIComponent(
          companyId
        )}&accessLevel=${encodeURIComponent(accessLevel)}`,
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
        console.error("Failed to update access level:", response.status, response.statusText, errorText);
        throw new Error(`Failed to update access level: ${response.status} ${response.statusText} - ${errorText}`);
      }

      setSuccessMessage("Access level updated successfully!");
      sessionStorage.removeItem("editEmployee"); // Clear session storage after successful update

      // Navigate after short delay
      setTimeout(() => {
        router.replace("/loginemployees"); // This already routes to the correct page
      }, 1500); // Give user a moment to see the success message
    } catch (err) {
      console.error("Error updating access level:", err);
      setError("Error: " + err.message);
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
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }

  if (!employee) {
    return <div className="text-center mt-10">Loading employee data...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-xl font-bold mb-4 text-center">Edit Employee Login</h1>

      {successMessage && (
        <div className="text-green-600 font-semibold text-center mt-4 mb-4">
          {successMessage}
        </div>
      )}
      {/* Error message is already handled by the `if (error)` block above */}

      <div className="space-y-4">
        <div>
          <span className="font-semibold">Email: </span>
          <span>{employee.email}</span>
        </div>
        <div>
          <span className="font-semibold">Company ID: </span>
          <span>{employee.companyId.toString()}</span>
        </div>

        <div>
          <label className="block font-semibold mb-1">Access Level:</label>
          <select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Basic">Basic</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Administrator">Administrator</option>
            {/* Add Super Administrator if applicable */}
            <option value="Super Administrator">Super Administrator</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditLoginEmployee;
