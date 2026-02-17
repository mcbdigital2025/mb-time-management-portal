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
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data:", errorData);
        throw new Error(
          errorData.message || "Login failed due to server error.",
        );
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
      router.push("/landing");
    } catch (error) {
      console.error("Error Login request:", error);
      setError(
        "Invalid credentials. Please try again. Error: " + error.message,
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-4 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      {/* Background blobs (glass login style) */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#008080]/20 blur-2xl" />
      <div className="pointer-events-none absolute top-16 -right-24 h-80 w-80 rounded-full bg-blue-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-28 left-10 h-96 w-96 rounded-full bg-purple-500/15 blur-2xl" />

      {/* Glass Card */}
      <form
        onSubmit={handleLogin}
        autoComplete="off"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-white/30 bg-white/20 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] px-6 sm:px-8 py-8"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#008080] via-cyan-600 to-[#008080] bg-clip-text text-transparent">
            MCB TimeSheet Management Portal
          </h1>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-zinc-800">Welcom back</h2>
          <p className="text-sm text-zinc-600/90 mt-1">
            Sign in to continue to your portal
          </p>
        </div>

        {/* UserId */}
        <div className="mb-4">
          <label htmlFor="email" className="sr-only">
            UserId
          </label>
          <div className="flex items-center gap-3 rounded-full border border-white/30 bg-white/25 backdrop-blur px-4 py-3 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400">
            {/* icon */}
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-zinc-600/80"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M6.5 7.5 12 12l5.5-4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="UserId"
              className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80"
            />
          </div>
        </div>

        {/* Company ID */}
        <div className="mb-4">
          <label htmlFor="companyId" className="sr-only">
            Company ID
          </label>
          <div className="flex items-center gap-3 rounded-full border border-white/30 bg-white/25 backdrop-blur px-4 py-3 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400">
            {/* icon */}
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-zinc-600/80"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4.5 20V8.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2V20"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M8 20v-4.5M12 20v-4.5M16 20v-4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M8 10h8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              id="companyId"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              placeholder="Company ID"
              className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="flex items-center gap-3 rounded-full border border-white/30 bg-white/25 backdrop-blur px-4 py-3 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400">
            {/* icon */}
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-zinc-600/80"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7 10V8a5 5 0 0 1 10 0v2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M6.5 10h11A2.5 2.5 0 0 1 20 12.5v5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-5A2.5 2.5 0 0 1 6.5 10Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Password"
              className="w-full bg-transparent outline-none text-[15px] text-zinc-800 placeholder:text-zinc-500/80"
            />
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mt-12">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-[#008080]"
            />
            Remember me
          </label>

          {/* keep layout like image; you can wire this later */}
          <button
            type="button"
            className="text-sm md:mt-4 text-zinc-700 hover:text-zinc-900 underline-offset-2 hover:underline"
            onClick={() => {}}
          >
            Forgot password
          </button>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-[#008080] text-white text-[15px] py-3 font-semibold
                   shadow-[0_10px_25px_rgba(0,128,128,0.25)]
                   hover:bg-[#025050] active:bg-[#00b6b6] transition-colors"
        >
          LOGIN
        </button>

        {/* Error */}
        {error && (
          <p className="mt-4 text-red-600 text-[14px] font-semibold text-center">
            {error}
          </p>
        )}
      </form>
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
