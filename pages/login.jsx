import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthLayout from "../components/auth/AuthLayout";
import FormField from "../components/auth/FormField";
import {
  EmailIcon,
  CompanyIcon,
  PasswordIcon,
} from "../components/auth/icons";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    companyId: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedCompanyId = localStorage.getItem("rememberedCompanyId");

    if (savedEmail && savedCompanyId) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        companyId: savedCompanyId,
      }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { email, companyId, password } = formData;


      const response = await fetch(
        // `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/login?email=${encodeURIComponent(email)}&companyId=${encodeURIComponent(companyId)}&password=${encodeURIComponent(password)}`,
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            companyId: companyId,
            password: password
          }),
          credentials: "include",
        },
      );


      if (!response.ok) {
        let message = "Login failed due to server error.";

        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {
          // ignore json parse failure
        }

        throw new Error(message);
      }

      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data));

      if (data.jwtToken) {
        // const maxAge = 60 * 60 * 24; // 1 day
        const maxAge = 60 * 30; // 30 minutes
        const secure = window.location.protocol === "https:" ? "; Secure" : "";

        document.cookie =
          `jwtToken=${encodeURIComponent(data.jwtToken)}; ` +
          `Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
        localStorage.setItem("jwtToken", data.jwtToken);
      }

      // if (data.jwtToken) {
      //   document.cookie = `jwtToken=${data.jwtToken}; path=/; max-age=86400; SameSite=Lax`;
      //   localStorage.setItem("jwtToken", data.jwtToken);
      // }

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
        localStorage.setItem("rememberedCompanyId", formData.companyId);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedCompanyId");
      }

      router.push("/landing");
    } catch (err) {
      console.log("🚀 ~ handleLogin ~ err:", err)
      setError(`Invalid credentials. Please try again. Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your portal"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleLogin} autoComplete="off">
        <FormField
          label="User ID"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="username"
          placeholder="User ID"
          icon={<EmailIcon />}
          className="mb-4"
          disabled={isSubmitting}
        />

        <FormField
          label="Company ID"
          name="companyId"
          type="text"
          value={formData.companyId}
          onChange={handleChange}
          required
          placeholder="Company ID"
          icon={<CompanyIcon />}
          className="mb-4"
          disabled={isSubmitting}
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          placeholder="Password"
          icon={<PasswordIcon />}
          className="mb-3"
          disabled={isSubmitting}
        />

        <div className="mt-12 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-[#008080]"
              disabled={isSubmitting}
            />
            Remember me
          </label>

          <button
            type="button"
            className="text-sm text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline"
          >
            Forgot password
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-full bg-[#008080] py-3 text-[15px] font-semibold text-white shadow-[0_10px_25px_rgba(0,128,128,0.25)] transition-colors hover:bg-[#025050] active:bg-[#00b6b6] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "LOGIN"}
        </button>

        <p className="mt-6 text-center text-sm text-zinc-700">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/registration")}
            className="cursor-pointer text-base font-semibold text-zinc-900 underline-offset-2 hover:underline"
          >
            Register
          </button>
        </p>

        {error && (
          <p className="mt-4 text-center text-[14px] font-semibold text-red-600">
            {error}
          </p>
        )}
      </form>
    </AuthLayout>
  );
}