import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // useEffect to load saved credentials from localStorage on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedCompanyId = localStorage.getItem("rememberedCompanyId");
        if (savedEmail && savedCompanyId) {
            setEmail(savedEmail);
            setCompanyId(savedCompanyId);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/login?email=${encodeURIComponent(email)}&companyId=${encodeURIComponent(companyId)}&password=${encodeURIComponent(password)}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                    },
                    credentials: "include", // This is fine for the initial login request
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error data:", errorData);
                throw new Error(errorData.message || "Login failed due to server error.");
            }

            const data = await response.json(); // This 'data' should now contain the JWT token from your backend

            // Store the entire user object, which should now include the JWT token
            // Assuming your backend's UserInfo model now has a 'jwtToken' field
            localStorage.setItem("user", JSON.stringify(data));
            // Store the token directly for easier access later by authenticatedFetch
            localStorage.setItem("jwtToken", data.jwtToken); // Assuming 'data' has a 'jwtToken' property

            // Handle "Remember Me" logic for email and companyId
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
                localStorage.setItem("rememberedCompanyId", companyId);
            } else {
                localStorage.removeItem("rememberedEmail");
                localStorage.removeItem("rememberedCompanyId");
            }

            // Redirect to home page
            router.push("/");

        } catch (error) {
            console.error("Error Login request:", error);
            setError("Invalid credentials. Please try again. Error: " + error.message);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>MCB TimeSheet Management Portal</h1>
            <form onSubmit={handleLogin} style={styles.form} autoComplete="off">
                <div style={styles.inputGroup}>
                    <label htmlFor="email" style={styles.label}>UserId:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                        autoComplete="username"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="companyId" style={styles.label}>Company ID:</label>
                    <input
                        type="text"
                        id="companyId"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                        autoComplete="current-password"
                    />
                </div>

                <div style={styles.rememberMeGroup}>
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={styles.checkbox}
                    />
                    <label htmlFor="rememberMe" style={styles.rememberMeLabel}>Remember Me</label>
                </div>

                <button type="submit" style={styles.button}>Login</button>
            </form>

            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        fontFamily: "'Inter', sans-serif",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
        color: "#333",
    },
    form: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        width: "350px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "18px",
        width: "100%",
    },
    label: {
        fontSize: "15px",
        marginBottom: "6px",
        fontWeight: "bold",
        color: "#555",
    },
    input: {
        padding: "12px",
        fontSize: "15px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        boxSizing: "border-box",
        width: "100%",
    },
    rememberMeGroup: {
        display: "flex",
        alignItems: "center",
        marginBottom: "15px",
        width: "100%",
        justifyContent: "flex-start",
    },
    checkbox: {
        marginRight: "8px",
        transform: "scale(1.2)",
    },
    rememberMeLabel: {
        fontSize: "14px",
        color: "#555",
    },
    button: {
        marginTop: "20px",
        padding: "12px 25px",
        fontSize: "17px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        width: "100%",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
    error: {
        color: "#dc3545",
        marginTop: "15px",
        fontSize: "15px",
        fontWeight: "bold",
        textAlign: "center",
    },
};
