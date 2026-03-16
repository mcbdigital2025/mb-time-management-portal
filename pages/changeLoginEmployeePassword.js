import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from "../utils/api";

const ChangeLoginEmployeePassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("changePasswordEmployee");
    if (stored) {
      const emp = JSON.parse(stored);
      setEmail(emp.email);
      setCompanyId(emp.companyId.toString());
      setOldPassword("");
    } else {
      setError("No employee data found. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
    }
  }, [router]);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^()\-_=+{};:,<.>]).{8,}$/;
    return regex.test(password);
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!validatePassword(newPassword)) {
      setError(
        "New password must be at least 8 characters, include upper/lowercase letters, a number, and a symbol.",
      );
      return;
    }

    try {
      // ✅ Updated to use JSON Request Body for security
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/changePassword`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json", // ✅ Inform backend we are sending JSON
          },
          body: JSON.stringify({
            email: email,
            companyId: companyId,
            password: oldPassword, // ✅ Maps to 'password' in UserLogin model
            newPassword: newPassword, // ✅ Maps to 'newPassword' in UserLogin model
          }),
        },
      );

      if (!response.ok) {
        // Try to parse error text from the backend
        const errorText = await response.text();
        console.error("Failed to change password:", response.status, errorText);
        throw new Error(errorText || "Invalid credentials or server error.");
      }

      setSuccess("Password changed successfully!");

      setTimeout(() => {
        router.replace("/employee");
      }, 1500);
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.message);

      if (err.message.includes("401") || err.message.includes("token")) {
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      }
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <div className="min-h-screen w-full  py-10 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white/20 backdrop-blur-xl shadow-[0_10px_10px_rgba(0,0,0,0.15)]  rounded ">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center bg-linear-to-r from-[#008080] via-cyan-600 to-[#008080] bg-clip-text text-transparent">
          Change Login Password
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        {!error && (
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
              <label className="block text-sm font-semibold mb-1">
                Company ID:
              </label>
              <input
                type="text"
                value={companyId}
                readOnly
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Old Password:
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                New Password:
              </label>
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
              className="w-full bg-[#008080] hover:bg-[#035f5f] text-white py-2 rounded-xl mb-3 font-bold cursor-pointer"
            >
              Save
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-[#F75D42] hover:bg-[#f53918] text-white py-2  cursor-pointer rounded-xl font-bold"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangeLoginEmployeePassword;
