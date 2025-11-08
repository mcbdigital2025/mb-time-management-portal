import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Assuming api.js is in a 'utils' folder one level up

const EmployeeProfile = () => {
    const [user, setUser] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        // ✅ Check for JWT token in storedUser
        if (!storedUser || !storedUser.companyId || !storedUser.email || !storedUser.jwtToken) {
            setError("User session or token is missing. Please log in again.");
            setTimeout(() => {
                router.replace("/login");
            }, 500);
            return; // Exit early if user data is incomplete
        }

        setUser(storedUser);

        const fetchEmployee = async () => {
            try {
                // ✅ Use authenticatedFetch instead of direct fetch
                // authenticatedFetch automatically adds the Authorization header with the JWT token
                const response = await authenticatedFetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/email/${encodeURIComponent(storedUser.companyId)}/${encodeURIComponent(storedUser.email)}`,
                    {
                        method: "GET",
                        headers: { Accept: "application/json" },
                        // ✅ Removed credentials: "include" as JWT is stateless and doesn't rely on cookies
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text(); // Get raw text for more info
                    throw new Error(`Failed to fetch employee data: ${response.status} ${response.statusText} - ${errorText}`);
                }
                const data = await response.json();
                setEmployee(data);
            } catch (err) {
                console.error("Error in fetchEmployee:", err);
                setError(err.message);
                // If fetching fails due to token issues (e.g., token expired/invalid),
                // consider redirecting to login after a delay.
                if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
                     setTimeout(() => {
                         router.replace("/login");
                     }, 1500); // Give user a moment to see the error before redirect
                }
            }
        };

        fetchEmployee();
    }, []); // Dependency array can be empty as storedUser is accessed inside the effect

    const handleHome = () => {
        router.push("/");
    };

    const handleChangePassword = () => {
        if (employee && user) {
            const passwordInfo = {
                email: employee.email,
                companyId: user.companyId,
            };
            sessionStorage.setItem("changePasswordEmployee", JSON.stringify(passwordInfo));
            router.push("/changeLoginEmployeePassword");
        }
    };

    if (error) {
        return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
    }

    if (!employee) {
        return <div className="text-center mt-10">Loading employee data...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border">
            <h2 className="text-2xl font-bold mb-6 text-center">Employee Profile</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border p-4 rounded-lg">
                    <Field label="Name" value={`${employee.firstName} ${employee.lastName}`} />
                    <Field label="Email" value={employee.email} />
                    <Field label="Phone" value={employee.phoneNumber} />
                    <Field label="Date of Birth" value={employee.dateOfBirth} />
                </div>

                <div className="border p-4 rounded-lg">
                    <Field label="Job Title" value={employee.jobTitle} />
                    <Field label="Hire Date" value={employee.hireDate} />
                    <Field label="Department Id" value={employee.departmentId} />
                    <Field label="Status" value={employee.status} />
                </div>

                <div className="border p-4 rounded-lg sm:col-span-2">
                    <Field label="Employee Id" value={employee.employeeId} />
                    <Field label="Company Id" value={user?.companyId || "N/A"} />
                    <Field label="Gender" value={employee.gender} />
                </div>
            </div>

            <div className="mt-12"></div>

            <div className="border rounded-lg p-4 mt-6 bg-gray-100 shadow-md text-center">
                <div className="flex flex-wrap justify-center space-x-6">
                    <button
                        onClick={handleHome}
                        className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-700"
                    >
                        Home
                    </button>

                    <button
                        onClick={handleChangePassword}
                        className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded hover:bg-yellow-700"
                    >
                        Change Login Password
                    </button>
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, value }) => (
    <div className="flex items-center border-b pb-1">
        <span className="font-semibold text-gray-700 w-1/3">{label}:</span>
        <span className="ml-2 text-gray-900 break-words">{value}</span>
    </div>
);

export default EmployeeProfile;
