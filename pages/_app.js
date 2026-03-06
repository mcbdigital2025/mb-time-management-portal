// pages/_app.js
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { Roboto } from "next/font/google";
import Navbar from "../components/layout/Navbar/Navbar";
import Head from "next/head";
import Script from "next/script";
import Footer from "./footer";
import "../styles/globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const menuRef = useRef(null); // Ref to detect clicks outside the menu
  const [authorized, setAuthorized] = useState(true);
  const [user, setUser] = useState(null);
  const [accessPages, setAccessPages] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

  // 1. Authentication & Menu Fetching
  // useEffect(() => {
  //   const handleAuth = async () => {
  //     const userStr = localStorage.getItem("user");
  //     const token = localStorage.getItem("jwtToken");

  //     const protectedRoutes = [
  //       "/landing",
  //       "/employee",
  //       "/client",
  //       "/bookservice",
  //     ];
  //     const isProtectedRoute = protectedRoutes.includes(router.pathname);

  //     if (!userStr || !token) {
  //       setUser(null);
  //       setAccessPages([]);
  //       if (isProtectedRoute) {
  //         setAuthorized(false);
  //         router.push("/login");
  //       } else {
  //         setAuthorized(true);
  //       }
  //       return;
  //     }

  //     const storedUser = JSON.parse(userStr);
  //     console.log("🚀 ~ handleAuth ~ storedUser:", storedUser);
  //     setUser(storedUser);
  //     setAuthorized(true);

  //     if (accessPages.length === 0) {
  //       await fetchAccessPages(storedUser, token);
  //     }
  //   };

  //   handleAuth().catch((err) => {
  //     console.error("handleAuth failed:", err);
  //     setError(err?.message || "Auth init failed");
  //     setAuthorized(true);
  //   });
  // }, [router.pathname]);

  // 2. Click Outside Listener (Auto-Collapse)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAccessPages = async (storedUser, token) => {
    try {
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

      if (response.status === 401) {
        handleLogout(new Event("click"));
        return;
      }

      if (!response.ok) {
        console.log(
          "🚀 ~ fetchAccessPages ~ response.status:",
          response.status,
        );
      }

      const nav = await response.json();
      setAccessPages(nav);
      setError(null);
    } catch (err) {
      console.error("Menu fetch error:", err);
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

  const toggleCategory = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  const handlePageClick = (e, page) => {
    e.preventDefault();
    const formattedPage = page.replace(/\s+/g, "").toLowerCase();
    router.push(formattedPage === "home" ? "/" : `/${formattedPage}`);
    setOpenCategory(null);
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
        <div className={roboto.className}>
          <Navbar
            user={user}
            nav={accessPages}
            handleLogout={handleLogout}
          />

          <main className="flex-1">
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
