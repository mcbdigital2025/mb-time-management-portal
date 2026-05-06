// pages/_app.js
import { Roboto } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
// import Script from "next/script";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../components/layout/Navbar/Navbar";
import "../styles/globals.css";
import { isTokenExpired } from "../utils/api";
import Footer from "./footer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "500", "900"],
  display: "swap",
});

const protectedRoutes = new Set([
  "/landing",
  "/employee",
  "/client",
  "/bookservice",
]);

function getCookieValue(name) {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

function clearAuthCookie() {
  document.cookie = "jwtToken=; path=/; max-age=0";
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [accessPages, setAccessPages] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);

  const isProtectedRoute = useMemo(() => {
    return protectedRoutes.has(router.pathname);
  }, [router.pathname]);

  // 1. Authentication & Menu Fetching
  // useEffect(() => {
  //   const handleAuth = async () => {
  //     const tokenCookie = document.cookie
  //       .split("; ")
  //       .find((row) => row.startsWith("jwtToken="));

  //     if (!tokenCookie) return;

  //     const tokens = tokenCookie.split("=")[1];

  //     if (isTokenExpired(tokens)) {
  //       localStorage.removeItem("user");
  //       document.cookie = "jwtToken=; path=/; max-age=0";
  //       router.push("/login");
  //     }

  //     const userStr = localStorage.getItem("user");
  //     // const token = localStorage.getItem("jwtToken");

  //     const protectedRoutes = [
  //       "/landing",
  //       "/employee",
  //       "/client",
  //       "/bookservice",
  //     ];
  //     const isProtectedRoute = protectedRoutes.includes(router.pathname);

  //     if (!userStr) {
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
  //     setUser(storedUser);
  //     setAuthorized(true);

  //     if (accessPages.length === 0) {
  //       await fetchAccessPages(storedUser);
  //     }
  //   };

  //   handleAuth().catch((err) => {
  //     console.error("handleAuth failed:", err);
  //     // setError(err?.message || "Auth init failed");
  //     setAuthorized(true);
  //   });
  // }, [router.pathname]);

  // const fetchAccessPages = async (storedUser) => {
  //   const tokenCookie = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("jwtToken="));
  //   const token = tokenCookie?.split("=")[1];
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/accessPages?email=${encodeURIComponent(storedUser.email)}&companyId=${encodeURIComponent(storedUser.companyId)}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //           Authorization: token.startsWith("Bearer ")
  //             ? token
  //             : `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     if (response.status === 401) {
  //       handleLogout(new Event("click"));
  //       return;
  //     }

  //     if (!response.ok) {
  //       console.log(
  //         "🚀 ~ fetchAccessPages ~ response.status:",
  //         response.status,
  //       );
  //     }

  //     const nav = await response.json();
  //     setAccessPages(nav);
  //   } catch (err) {
  //     console.log("Menu fetch error:", err);
  //   }
  // };

  const handleLogout = useCallback(
    (e) => {
      if (e?.preventDefault) e.preventDefault();

      localStorage.removeItem("user");
      sessionStorage.removeItem("accessPages");

      clearAuthCookie();

      setUser(null);
      setAccessPages([]);

      router.push("/login");
    },
    [router],
  );

   const fetchAccessPages = useCallback(
    async (storedUser, token) => {
      if (!storedUser?.email || !storedUser?.companyId || !token) return;

      const cachedPages = sessionStorage.getItem("accessPages");

      if (cachedPages) {
        try {
          setAccessPages(JSON.parse(cachedPages));
          return;
        } catch {
          sessionStorage.removeItem("accessPages");
        }
      }

      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/accessPages`,
        );

        url.searchParams.set("email", storedUser.email);
        url.searchParams.set("companyId", storedUser.companyId);

        console.log("Access page fetch URL:", url.toString());

        const response = await fetch(url.toString(), {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          handleLogout();
          return;
        }

        if (!response.ok) {
          console.error("fetchAccessPages failed:", response.status);
          return;
        }

        const nav = await response.json();

        setAccessPages(nav);
        sessionStorage.setItem("accessPages", JSON.stringify(nav));
      } catch (err) {
        console.error("Menu fetch error:", err);
      }
    },
    [handleLogout],
  );

  useEffect(() => {
    let cancelled = false;

    async function handleAuth() {
      const token = getCookieValue("jwtToken");
      const userStr = localStorage.getItem("user");

      if (!token) {
        setUser(null);
        setAccessPages([]);

        if (isProtectedRoute) {
          router.replace("/login");
          return;
        }

        setAuthChecked(true);
        return;
      }

      if (isTokenExpired(token)) {
        localStorage.removeItem("user");
        sessionStorage.removeItem("accessPages");
        clearAuthCookie();

        setUser(null);
        setAccessPages([]);

        router.replace("/login");
        return;
      }

      if (!userStr) {
        setUser(null);
        setAccessPages([]);

        if (isProtectedRoute) {
          router.replace("/login");
          return;
        }

        setAuthChecked(true);
        return;
      }

      try {
        const storedUser = JSON.parse(userStr);

        if (cancelled) return;

        setUser(storedUser);
        setAuthChecked(true);

        fetchAccessPages(storedUser, token);
      } catch (err) {
        console.error("Invalid user in localStorage:", err);

        localStorage.removeItem("user");
        sessionStorage.removeItem("accessPages");

        setUser(null);
        setAccessPages([]);

        if (isProtectedRoute) {
          router.replace("/login");
          return;
        }

        setAuthChecked(true);
      }
    }

    handleAuth();

    return () => {
      cancelled = true;
    };
  }, [router.pathname, router, isProtectedRoute, fetchAccessPages]);

  const hideLayout = router.pathname === "/login";

 

  return (
    <>
      <Head>
        <title>MaboCore</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={roboto.className}>
        <Navbar user={user} nav={accessPages} handleLogout={handleLogout} />

        <main className="flex-1">
          <Component {...pageProps} user={user} />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            toastStyle={{
              background: "#111827",
              color: "#fff",
              borderRadius: "10px",
            }}
          />
        </main>
       {!hideLayout && <Footer />}
      </div>

      {/* <Script
        src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js"
        strategy="beforeInteractive"
      /> */}
      {/* <Script src="" strategy="afterInteractive" /> */}
    </>
  );
}

export default MyApp;