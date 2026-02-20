// pages/_app.js
import { useEffect, useState } from "react";
import { Roboto } from "next/font/google";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import Footer from "./footer";
import "../styles/globals.css";
import Navbar from "../components/layout/Navbar";
import {NAVIGATION, ROLES } from "../data";
import { dummyJWT, dummyUser, mockFetchAccessPages } from "../data/mockdata";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  // const [accessPages, setAccessPages] = useState([]);
  const [accessPages, setAccessPages] = useState([]);
  const [allowedNav, setAllowedNav] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuth = async () => {
      if (process.env.NEXT_PUBLIC_USE_DUMMY_AUTH === "true") {
        localStorage.setItem("user", JSON.stringify(dummyUser));
        localStorage.setItem("jwtToken", dummyJWT);
      }

      const userStr = localStorage.getItem("user");
      console.log("🚀 ~ handleAuth ~ userStr:", userStr)
      const token = localStorage.getItem("jwtToken");

      const protectedRoutes = ["/landing", "/employee", "/client"];
      const isProtectedRoute = protectedRoutes.includes(router.pathname);

      if (userStr && token) {
        const storedUser = JSON.parse(userStr);
        setUser(storedUser);
        setAuthorized(true);

        // Mock fetch of access pages
        const baseNav = getAllowedNavigation(storedUser.role);
        setAllowedNav(baseNav);

        if (process.env.NEXT_PUBLIC_USE_MOCK_ACCESS_PAGES === "true") {
          const data = await mockFetchAccessPages(storedUser);
          setAccessPages(data);
          setAllowedNav(applyAccessPages(baseNav, data));
        } else {
          await fetchAccessPages(storedUser, token, baseNav);
        }

        // Only fetch if we don't have pages yet
        // if (accessPages.length === 0) {
        //   await fetchAccessPages(storedUser, token);
        // }
      } else {
        setUser(null);
        setAccessPages([]);
        setAllowedNav([]);
        if (isProtectedRoute) {
          setAuthorized(false);
          router.push("/login");
        } else {
          setAuthorized(true);
        }
      }
    };

    handleAuth().catch((err) => {
      console.error("handleAuth failed:", err);
      setError(err?.message || "Auth init failed");
      setAuthorized(true);
    });
  }, [router.pathname]);

  const applyAccessPages = (nav, accessPages) => {
    if (!accessPages || accessPages.length === 0) return nav;
    const allowed = new Set(accessPages.map((p) => p.trim()));
    return nav
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => allowed.has(item.key)),
      }))
      .filter((section) => section.items.length > 0);
  };

  const fetchAccessPages = async (storedUser, token, baseNav) => {
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

      if (response.ok) {
        const data = await response.json();
        setAccessPages(data);

        const finalNav = applyAccessPages(baseNav, data);
        setAllowedNav(finalNav);
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

  const getAllowedNavigation = (role) => {
    return NAVIGATION.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    })).filter((section) => section.items.length > 0);
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
          // className="body" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        >
          {/* <div role="banner" className="navbar w-nav">
            <a href="/" className="brand w-nav-brand">
              <img src="/images/Screenshot---logo-2025-12-23-at-11.39.16-pm.png" alt="Logo" className="image-2" />
            </a>
            <div className="container w-container">
              <nav role="navigation" className="nav-menu w-nav-menu">
                <a href="/" className="nav-link w-nav-link">Home</a>
                {user && accessPages.map((page, index) => (
                  <a key={index} href="#" onClick={(e) => handlePageClick(e, page)} className="w-nav-link">{page}</a>
                ))}
                <a href="#" className="w-nav-link">About</a>
              </nav>
            </div>

            <div className="right-nav-button-link-div">
              {user ? (
                <>
                  <span style={{ marginRight: '15px', fontWeight: 'bold' }}>
                    Hi, {user.firstName || user.email}
                  </span>
                  <a onClick={handleLogout} href="#" className="log-in-link">Log Out</a>
                </>
              ) : (
                <a href="/login" className="log-in-link">Log In</a>
              )}
              <a href="#" className="green-button w-inline-block">
                <div className="text-block">Book a Demo</div>
              </a>
            </div>
          </div> */}
          <Navbar user={user} accessPages={accessPages} nav={allowedNav} />

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
