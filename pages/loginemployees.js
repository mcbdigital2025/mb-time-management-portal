"use client";

import { useEffect, useState } from "react";
import JSONbig from "json-bigint";
import { useRouter } from "next/router";
import { authenticatedFetch } from "../utils/api"; // Import authenticatedFetch
import { dummyLogins } from "../utils/data";
import ReusableTable from "../components/ReusableTable";
<<<<<<< HEAD







=======
>>>>>>> main

const LoginEmployees = () => {
  const router = useRouter();
  const [logins, setLogins] = useState(dummyLogins);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success messages
  const [confirmMessage, setConfirmMessage] = useState(null); // New state for confirmation messages
  const [confirmAction, setConfirmAction] = useState(null); // New state for confirmation action callback
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchLoginData = async () => {
      const storedUserRaw = localStorage.getItem("user");
      let storedUser = null;

      if (!storedUserRaw) {
        setError("User not found in local storage. Redirecting to login.");
        setLoading(false);
        setTimeout(() => {
          router.replace("/login");
        }, 500);
        return;
      }

      storedUser = JSON.parse(storedUserRaw);
      const companyId = storedUser?.companyId;

      // ✅ Check for JWT token in storedUser
      if (!companyId || !storedUser.jwtToken) {
        setError("Company ID or user token is missing. Redirecting to login.");
        setLoading(false);
        setTimeout(() => {
          router.replace("/login");
        }, 500);
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/employeesLogin?companyId=${encodeURIComponent(companyId)}`;

      try {
        // ✅ Use authenticatedFetch instead of direct fetch
        const response = await authenticatedFetch(apiUrl, {
          method: "POST", // Assuming this is a POST request as per your original code
          headers: {
            Accept: "application/json",
            // 'Content-Type': 'application/json' // Add if sending a JSON body
          },
          // ✅ Removed credentials: "include"
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Failed to fetch login data: ${response.status} ${response.statusText} - ${text}`,
          );
        }

        const rawText = await response.text();
        const parsed = JSONbig.parse(rawText);
        setLogins(parsed);
      } catch (err) {
        console.error("Error fetching login data:", err);
        setError(err.message);
        // If fetching fails due to token issues (e.g., token expired/invalid),
        // consider redirecting to login after a delay.
        if (
          err.message.includes("Authentication token missing") ||
          err.message.includes("401 Unauthorized")
        ) {
          setTimeout(() => {
            router.replace("/login");
          }, 1500);
        }
      } finally {
        setLoading(false);
      }
    };

    // fetchLoginData();
  }, []);

  useEffect(() => {
    // ✅ Dummy load
    setLoading(true);
    setError(null);

    // simulate API delay (optional)
    setTimeout(() => {
      setLogins(dummyLogins);
      setLoading(false);
    }, 300);
  }, []);

  const handleRowClick = (emp) => {
    setSelectedEmployee(emp);
    sessionStorage.setItem("editEmployee", JSON.stringify(emp));
    setError(null); // Clear errors when selecting a new employee
    setSuccessMessage(null); // Clear success messages
  };

  const handleEdit = () => {
    if (selectedEmployee) {
      router.push("/editLoginEmployee");
    } else {
      setError("Please select an employee to edit.");
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    try {
      // Replace space with 'T' for proper ISO format
      const isoValue = value.replace(" ", "T");
      const date = new Date(isoValue);

      if (isNaN(date.getTime())) return value; // fallback if still invalid

      const pad = (n) => n.toString().padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    } catch {
      return value;
    }
  };

  const handleRegister = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // ✅ Check for JWT token before allowing registration
      if (!parsed.jwtToken) {
        setError("User session or token is missing. Cannot register employee.");
        setTimeout(() => {
          router.replace("/login");
        }, 500);
        return;
      }
      sessionStorage.setItem("companyId", parsed.companyId);
      router.push("/registerLoginEmployee");
    } else {
      setError("User information is missing. Cannot register employee.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
    }
  };

  const handleRemove = async () => {
    if (!selectedEmployee) {
      setError("Please select an employee login to remove.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    // ✅ Check for JWT token in storedUser
    if (!storedUser || !storedUser.jwtToken) {
      setError(
        "User session or token is missing. Cannot remove employee login.",
      );
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    const { email, companyId } = selectedEmployee;

    setConfirmMessage(
      `Are you sure to delete Employee Login email of ${email}?`,
    );
    setConfirmAction(() => async () => {
      try {
        // ✅ Use authenticatedFetch instead of direct fetch
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/delete?email=${encodeURIComponent(
            email,
          )}&companyId=${encodeURIComponent(companyId)}`,
          {
            method: "POST", // Assuming this is a POST request
            headers: {
              Accept: "application/json",
            },
            // ✅ Removed credentials: "include"
          },
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Failed to delete employee login: ${response.status} ${response.statusText} - ${text}`,
          );
        }

        setSuccessMessage("Employee login deleted successfully.");
        // Re-fetch data after successful deletion
        fetchLoginData(); // Call the function to re-fetch
        setSelectedEmployee(null); // Clear selection
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error deleting employee login:", err);
        setError("Error deleting employee login: " + err.message);
        // If fetching fails due to token issues (e.g., token expired/invalid),
        // consider redirecting to login after a delay.
        if (
          err.message.includes("Authentication token missing") ||
          err.message.includes("401 Unauthorized")
        ) {
          setTimeout(() => {
            router.replace("/login");
          }, 1500);
        }
      } finally {
        setConfirmMessage(null); // Close confirmation modal
        setConfirmAction(null);
      }
    });
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
  };

  const handleCancelConfirm = () => {
    setConfirmMessage(null);
    setConfirmAction(null);
  };

  const employeeColumns = [
<<<<<<< HEAD
  { header: "Email", render: (emp) => <span className="font-medium text-gray-900">{emp.email}</span> },
  { header: "Company ID", render: (emp) => emp.companyId?.toString?.() ?? "-" },
  {
    header: "Access Level",
    render: (emp) => {
      const access = (emp.accessLevel || "").toUpperCase();
      const badgeClass =
        access === "ADMIN"
          ? "bg-purple-50 text-purple-700 ring-purple-200"
          : access === "SUPERVISOR"
          ? "bg-blue-50 text-blue-700 ring-blue-200"
          : access === "AUDITOR"
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-green-50 text-green-700 ring-green-200";

      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${badgeClass}`}>
          {emp.accessLevel}
        </span>
      );
    },
  },
  { header: "Last Login", render: (emp) => formatDateTime(emp.lastLogin) || "N/A" },
  { header: "Failed Attempts", align: "center", render: (emp) => emp.failedLoginAttempts },
];

const employeeActions = [
  {
    label: "Edit",
    icon: "edit",
    variant: "primary",
    showLabel: true,
    onClick: (emp) => {
      setSelectedEmployee(emp);
      sessionStorage.setItem("editEmployee", JSON.stringify(emp));
      handleEdit();
    },
  },
  {
    label: "Remove",
    icon: "trash",
    variant: "danger",
    showLabel: false,
    onClick: (emp) => {
      setSelectedEmployee(emp);
      sessionStorage.setItem("editEmployee", JSON.stringify(emp));
      handleRemove();
    },
  },
];
=======
    {
      header: "Email",
      render: (emp) => (
        <span className="font-medium text-gray-900">{emp.email}</span>
      ),
    },
    {
      header: "Company ID",
      render: (emp) => emp.companyId?.toString?.() ?? "-",
    },
    {
      header: "Access Level",
      render: (emp) => {
        const access = (emp.accessLevel || "").toUpperCase();
        const badgeClass =
          access === "ADMIN"
            ? "bg-purple-50 text-purple-700 ring-purple-200"
            : access === "SUPERVISOR"
              ? "bg-blue-50 text-blue-700 ring-blue-200"
              : access === "AUDITOR"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-green-50 text-green-700 ring-green-200";

        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${badgeClass}`}
          >
            {emp.accessLevel}
          </span>
        );
      },
    },
    {
      header: "Last Login",
      render: (emp) => formatDateTime(emp.lastLogin) || "N/A",
    },
    {
      header: "Failed Attempts",
      align: "center",
      render: (emp) => emp.failedLoginAttempts,
    },
  ];

  const employeeActions = [
    {
      label: "Edit",
      icon: "edit",
      variant: "primary",
      showLabel: true,
      onClick: (emp) => {
        setSelectedEmployee(emp);
        sessionStorage.setItem("editEmployee", JSON.stringify(emp));
        handleEdit();
      },
    },
    {
      label: "Remove",
      icon: "trash",
      variant: "danger",
      showLabel: false,
      onClick: (emp) => {
        setSelectedEmployee(emp);
        sessionStorage.setItem("editEmployee", JSON.stringify(emp));
        handleRemove();
      },
    },
  ];
>>>>>>> main

  const th = "px-4 py-2 border font-medium text-left";
  const td = "px-4 py-2 border text-left";

  return (
<<<<<<< HEAD
  <div className="relative min-h-[90vh] w-full overflow-x-hidden flex flex-col items-center justify-center hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] px-3 sm:px-4 md:px-6 py-6 md:py-10">
    {/* decorative blobs */}
    <div className="pointer-events-none absolute top-10 left-6 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-300 opacity-20 rounded-full blur-3xl" />
    <div className="pointer-events-none absolute bottom-10 right-6 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 bg-teal-300 opacity-20 rounded-full blur-3xl" />
    <div className="pointer-events-none absolute top-1/2 left-1/3 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-300 opacity-10 rounded-full blur-3xl" />

    <div className="relative z-10 w-full max-w-7xl">
      {/* Card */}
      <div className="bg-white/70 rounded-2xl shadow-sm border border-teal-400/30 overflow-hidden">
        {/* Header / Toolbar */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
              Employee Login History
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View employee login records and manage access.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 justify-start md:justify-end">
            <button
              onClick={handleRegister}
              className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-[#008080] text-white hover:bg-teal-700 transition cursor-pointer"
            >
              + Register Login Employee
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="px-4 sm:px-6 pb-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm mt-2">
              {successMessage}
            </div>
          )}
        </div>

        {/* Confirmation Modal (unchanged) */}
        {confirmMessage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-3">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
              <p className="text-lg font-semibold mb-4">{confirmMessage}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && logins.length === 0 && (
          <div className="px-4 sm:px-6 py-10 text-center text-gray-500">
            No login records found.
          </div>
        )}

        {!loading && !error && logins.length > 0 && (
          <ReusableTable
            data={logins}
            columns={employeeColumns}
            actions={employeeActions}
            getRowKey={(emp) => `${emp.email}-${emp.companyId}`}
            onRowClick={(emp) => handleRowClick(emp)}
            isRowSelected={(emp) =>
              selectedEmployee?.email === emp.email &&
              selectedEmployee?.companyId === emp.companyId
            }
            footerLeft={`Showing ${logins.length} records`}
            footerRight="Click a row to select"
          />
        )}
=======
    <div className="relative min-h-[90vh] w-full overflow-x-hidden flex flex-col items-center justify-center hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] px-3 sm:px-4 md:px-6 py-6 md:py-10">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute top-10 left-6 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-300 opacity-20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-6 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 bg-teal-300 opacity-20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-300 opacity-10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl">
        {/* Card */}
        <div className="bg-white/70 rounded-2xl shadow-sm border border-teal-400/30 overflow-hidden">
          {/* Header / Toolbar */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                Employee Login History
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View employee login records and manage access.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 justify-start md:justify-end">
              <button
                onClick={handleRegister}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-[#008080] text-white hover:bg-teal-700 transition cursor-pointer"
              >
                + Register Login Employee
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="px-4 sm:px-6 pb-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm mt-2">
                {successMessage}
              </div>
            )}
          </div>

          {/* Confirmation Modal (unchanged) */}
          {confirmMessage && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 px-3">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                <p className="text-lg font-semibold mb-4">{confirmMessage}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleCancelConfirm}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && !error && logins.length === 0 && (
            <div className="px-4 sm:px-6 py-10 text-center text-gray-500">
              No login records found.
            </div>
          )}

          {!loading && !error && logins.length > 0 && (
            <ReusableTable
              data={logins}
              columns={employeeColumns}
              actions={employeeActions}
              getRowKey={(emp) => `${emp.email}-${emp.companyId}`}
              onRowClick={(emp) => handleRowClick(emp)}
              isRowSelected={(emp) =>
                selectedEmployee?.email === emp.email &&
                selectedEmployee?.companyId === emp.companyId
              }
              footerLeft={`Showing ${logins.length} records`}
              footerRight="Click a row to select"
            />
          )}
        </div>
>>>>>>> main
      </div>
    </div>
  </div>
);
};

export default LoginEmployees;
