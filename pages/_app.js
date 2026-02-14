// pages/_app.js
import Head from "next/head";
import { Roboto } from "next/font/google";
import "../styles/globals.css";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../pages/footer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"], // pick what you actually use
  display: "swap",
  variable: "--font-roboto", // optional but recommended
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [accessPages, setAccessPages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuth = () => {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("jwtToken");

      const protectedRoutes = ["/landing", "/employee", "/client"];
      const isProtectedRoute = protectedRoutes.includes(router.pathname);

      if (userStr && token) {
        const storedUser = JSON.parse(userStr);
        setUser(storedUser);
        setAuthorized(true);

        // Only fetch if we don't have pages yet
        if (accessPages.length === 0) {
          fetchAccessPages(storedUser, token);
        }
      } else {
        setUser(null);
        setAccessPages([]);
        if (isProtectedRoute) {
          setAuthorized(false);
          router.push("/login");
        } else {
          setAuthorized(true);
        }
      }
    };

    handleAuth();
  }, [router.pathname]);

  const fetchAccessPages = async (storedUser, token) => {
    try {
      // Note: Ensure your API expects "Bearer " or just the token string
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/accessPages?email=${encodeURIComponent(storedUser.email)}&companyId=${encodeURIComponent(storedUser.companyId)}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setAccessPages(data);
        setError(null); // Clear any previous errors
      } else {
        // If 401, token might be expired
        if (response.status === 401) handleLogout(new Event("click"));
        console.error("Menu fetch failed:", response.status);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    setUser(null);
    setAccessPages([]);
    router.push("/login");
  };

  const handlePageClick = (e, page) => {
    e.preventDefault();
    const formattedPage = page.replace(/\s+/g, "").toLowerCase();
    router.push(formattedPage === "home" ? "/" : `/${formattedPage}`);
  };

  const isPublicPage = ["/", "/login"].includes(router.pathname);

  return (
    <>
      <Head>
        <title>MaboCore</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className={`${roboto.variable} ${roboto.className} w-full min-h-screen`}
      >
        {!authorized && !isPublicPage ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <div className="text-block">Loading...</div>
          </div>
        ) : (
          <div className="w-full min-h-screen">
            <Navbar user={user} handleLogout={handleLogout} />

            <main className="flex-1 flex flex-col items-center justify-center">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              <Component {...pageProps} user={user} />
            </main>

            <Footer />
          </div>
        )}
      </div>
      <Script
        src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js"
        strategy="beforeInteractive"
      />
      <Script src="/js/webflow.js" strategy="afterInteractive" />
    </>
  );
}

export default MyApp;
