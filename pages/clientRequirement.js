import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import JSONbig from "json-bigint"; // Import JSONbig
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const ClientRequirement = () => {
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const clientId = sessionStorage.getItem("selectedClientId");

        // ✅ Check for JWT token in storedUser
        if (!user || !user.companyId || !clientId || !user.jwtToken) {
            setError("User information or token is missing. Redirecting to login.");
            setLoading(false);
            setTimeout(() => {
                router.replace("/login");
            }, 500);
            return; // Exit early
        }

        const fetchRequirements = async () => {
            try {
                // ✅ Use authenticatedFetch instead of direct fetch
                const response = await authenticatedFetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientRequirement/id/${encodeURIComponent(user.companyId)}/${encodeURIComponent(clientId)}`,
                    {
                        method: "GET",
                        headers: { Accept: "application/json" },
                        // ✅ Removed credentials: "include"
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch client requirements: ${response.status} ${response.statusText} - ${errorText}`);
                }

                const text = await response.text();
                if (!text) {
                    setRequirements([]);
                    return;
                }

                // ✅ Use JSONbig.parse for handling large numbers
                const data = JSONbig.parse(text);

                // Check if the received data is not an array. If so, wrap it in an array.
                if (data && !Array.isArray(data)) {
                    setRequirements([data]);
                } else {
                    // If the API could return an array or nothing, handle that too.
                    setRequirements(data || []);
                }

            } catch (err) {
                console.error("Error fetching client requirements:", err);
                setError(err.message);
                // If fetching fails due to token issues (e.g., token expired/invalid),
                // consider redirecting to login after a delay.
                if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
                     setTimeout(() => {
                         router.replace("/login");
                     }, 1500);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRequirements();
    }, []); // The empty dependency array means this runs once on mount.

    if (loading) return <div className="text-center mt-10 text-blue-500">Loading requirements...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Client Requirements</h2>
            {requirements.length > 0 ? ( // More robust check
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Requirement ID</th>
                            <th className="border p-2">Job ID</th>
                            <th className="border p-2">Support Option</th>
                            <th className="border p-2">Literacy Skill</th>
                            <th className="border p-2">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requirements.map((req) => (
                            <tr key={req.clientJobRequirementId}>
                                <td className="border p-2 text-center">{req.clientJobRequirementId?.toString()}</td> {/* Ensure toString() for BigInt */}
                                <td className="border p-2 text-center">{req.jobId?.toString()}</td> {/* Ensure toString() for BigInt */}
                                <td className="border p-2 text-center">{req.clientSupportOption}</td>
                                <td className="border p-2 text-center">{req.clientLiteracySkill}</td>
                                <td className="border p-2">{req.requirementDesc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500">No requirements found for this client.</p>
            )}
        </div>
    );
};

export default ClientRequirement;
