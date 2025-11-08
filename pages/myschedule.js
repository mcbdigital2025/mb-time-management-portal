import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const EmployeeClientSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.companyId || !user.employeeId) {
            setError("User information is missing from local storage.");
            setLoading(false);
            setTimeout(() => {
                             router.replace("/login");
                         }, 500);
        }

        const fetchSchedule = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/id/${user.companyId}/${user.employeeId}`,
                    {
                        method: "GET",
                        headers: { "Accept": "application/json" },
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch schedule data");
                }

                const data = await response.json();
                setSchedule(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    if (loading) {
        return <div className="text-center mt-10 text-blue-500">Loading schedule...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Employee Client Schedule</h1>
            {schedule.length > 0 ? (
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Booking ID</th>
                            <th className="border p-2">Client Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Phone</th>
                            <th className="border p-2">Job Code</th>
                            <th className="border p-2">Start Time</th>
                            <th className="border p-2">End Time</th>
                            <th className="border p-2">Work Location</th>
                            <th className="border p-2">Client Cancel</th>
                             <th className="border p-2">Client Reschedule</th>
                            <th className="border p-2">Employee Cancel</th>
                            <th className="border p-2">Date Complete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((item) => (
                            <tr key={item.clientBookingId} className="hover:bg-gray-100">
                                <td className="border p-2 text-center">{item.clientBookingId}</td>
                                <td className="border p-2">{`${item.firstName} ${item.lastName}`}</td>
                                <td className="border p-2">{item.email}</td>
                                <td className="border p-2">{item.phoneNumber || "N/A"}</td>
                                <td className="border p-2">{item.jobCode}</td>
                                <td className="border p-2">{item.startTime}</td>
                                <td className="border p-2">{item.endTime}</td>
                                <td className="border p-2">{item.workLocation || "N/A"}</td>
                                <td className="border p-2 text-center">
                                    {item.clientCancel ? (
                                        <span className="text-red-500">Yes</span>
                                    ) : (
                                        <span className="text-green-500">No</span>
                                    )}
                                </td>
                                <td className="border p-2 text-center">
                                    {item.clientReschedule ? (
                                         <span className="text-red-500">Yes</span>
                                    ) : (
                                        <span className="text-green-500">No</span>
                                    )}
                                </td>
                                <td className="border p-2 text-center">
                                    {item.employeeCancel ? (
                                        <span className="text-red-500">Yes</span>
                                    ) : (
                                        <span className="text-green-500">No</span>
                                    )}
                                </td>
                                <td className="border p-2">{item.dateComplete || "Not Completed"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500">No schedule found.</p>
            )}
            {/* Home Button */}
            <div className="text-center mt-6">
                <Link href="/home">
                    <button className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200">
                        Home
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default EmployeeClientSchedule;
