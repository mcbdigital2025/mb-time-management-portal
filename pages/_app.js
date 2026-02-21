// pages/_app.js
import { Roboto } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar/Navbar";
import { NAVIGATIONS } from "../data";
import { dummyJWT, dummyUser } from "../data/mockdata";
import "../styles/globals.css";
import Footer from "./footer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

// FOR TESTING
// const nav = NAVIGATIONS;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [accessPages, setAccessPages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuth = async () => {
      //?  THIS IS USE FOR TESTING/SIMULATION
      // if (process.env.NEXT_PUBLIC_USE_DUMMY_AUTH === "true") {
      //   localStorage.setItem("user", JSON.stringify(dummyUser));
      //   localStorage.setItem("jwtToken", dummyJWT);
      // }

      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("jwtToken");

      const protectedRoutes = ["/landing", "/employee", "/client"];
      const isProtectedRoute = protectedRoutes.includes(router.pathname);

      if (!userStr || !token) {
        setUser(null);
        setAccessPages([]);
        if (isProtectedRoute) {
          setAuthorized(false);
          router.push("/login");
        } else {
          setAuthorized(true);
        }
        return;
      }

      const storedUser = JSON.parse(userStr);
      setUser(storedUser);
      setAuthorized(true);

      if (accessPages.length === 0) {
        await fetchAccessPages(storedUser, token);
      }
    };

    handleAuth().catch((err) => {
      console.error("handleAuth failed:", err);
      setError(err?.message || "Auth init failed");
      setAuthorized(true);
    });
  }, [router.pathname]);

  const fetchAccessPages = async (storedUser, token) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        setError(
          "No API base URL set. Enable mock access pages in .env.local.",
        );
        return;
      }

      // Note: Ensure your API expects "Bearer " or just the token string
      const response = await fetch(
        `${baseUrl}/mcbtt/api/timesheet/userLogin/accessPages?email=${encodeURIComponent(storedUser.email)}&companyId=${encodeURIComponent(storedUser.companyId)}`,
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

      if (response.status === 401) {
        handleLogout(new Event("click"));
        return;
      }

      if (!response.ok) {
        throw new Error(`Navigation fetch failed: ${res.status}`);
      }

      const nav = await res.json();
      setAccessPages(nav);
      setError(null);
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
        <div
          className={roboto.className}
        >
          
          <Navbar
            user={user}
            nav={accessPages}
            // nav={nav}
            handleLogout={handleLogout}
          />

          <main className="flex-1 flex flex-col items-center justify-center p-">
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
      <Script
        src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js"
        strategy="beforeInteractive"
      />
      <Script src="/js/webflow.js" strategy="afterInteractive" />
    </>
  );
}

export default MyApp;
