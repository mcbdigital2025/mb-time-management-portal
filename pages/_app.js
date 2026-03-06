// pages/_app.js
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import Script from 'next/script';
import Footer from './footer';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const menuRef = useRef(null); // Ref to detect clicks outside the menu
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [accessPages, setAccessPages] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

  // 1. Authentication & Menu Fetching
  useEffect(() => {
    const handleAuth = () => {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("jwtToken");
      const protectedRoutes = ["/landing", "/employee", "/client", "/bookservice"];
      const isProtectedRoute = protectedRoutes.includes(router.pathname);

      if (userStr && token) {
        const storedUser = JSON.parse(userStr);
        setUser(storedUser);
        setAuthorized(true);
        if (accessPages.length === 0) fetchAccessPages(storedUser, token);
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
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}`
          },
        }
      );
      if (response.ok) {
        setAccessPages(await response.json());
      }
    } catch (err) { console.error("Menu fetch error:", err); }
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="text-block">Loading...</div>
        </div>
      ) : (
        <div className="body" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

          <div role="banner" className="navbar w-nav">
            <a href="/" className="brand w-nav-brand">
              <img src="/images/Screenshot---logo-2025-12-23-at-11.39.16-pm.png" alt="Logo" className="image-2" />
            </a>

            <div className="container w-container">
              {/* Added gap: 25px for spacing between Home, Workforce, Customer, etc. */}
              <nav role="navigation" className="nav-menu w-nav-menu" ref={menuRef} style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>

                {/* 1. Home */}
                <a href="/" className="nav-link w-nav-link" style={{ margin: 0 }}>Home</a>

                {/* 2. Dynamic Categories */}
                {user && accessPages.map((category, idx) => {
                  const isOpen = openCategory === category.categoryName;
                  return (
                    <div key={idx} style={{ position: 'relative' }}>
                      <button
                        onClick={() => toggleCategory(category.categoryName)}
                        className="nav-link"
                        style={{
                          background: 'none', border: 'none', fontWeight: 'bold', padding: '0',
                          cursor: 'pointer', color: '#389E0D', display: 'flex', alignItems: 'center'
                        }}
                      >
                        {category.categoryName}
                        <span style={{ fontSize: '9px', marginLeft: '6px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>

                      {isOpen && (
                        <div style={{
                          position: 'absolute', top: '40px', left: '-10px', background: '#fff',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)', borderRadius: '6px',
                          zIndex: 1000, minWidth: '200px', padding: '12px 0', border: '1px solid #ddd'
                        }}>
                          {category.subMenus.map((subMenu, sIdx) => (
                            <a
                              key={sIdx}
                              href="#"
                              onClick={(e) => handlePageClick(e, subMenu)}
                              style={{
                                display: 'block', padding: '10px 20px', color: '#333',
                                textDecoration: 'none', fontSize: '14px', borderBottom: '1px solid #f9f9f9'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f6ffed'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              {subMenu}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 3. Contact & About */}
                <a href="/contact" className="nav-link w-nav-link" style={{ margin: 0 }}>Contact</a>
                <a href="/about" className="nav-link w-nav-link" style={{ margin: 0 }}>About</a>
              </nav>
            </div>

            <div className="right-nav-button-link-div">
              {user ? (
                <>
                  <span style={{ marginRight: '15px', fontSize: '14px' }}>Hi, <strong>{user.firstName}</strong></span>
                  <a onClick={handleLogout} href="#" className="log-in-link">Log Out</a>
                </>
              ) : (
                <a href="/login" className="log-in-link">Log In</a>
              )}
              <a href="#" className="green-button w-inline-block">
                <div className="text-block">Book a Demo</div>
              </a>
            </div>
          </div>

          <main className="flex-1">
            <Component {...pageProps} user={user} />
          </main>
          <Footer />
        </div>
      )}

      <Script src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js" strategy="beforeInteractive" />
      <Script src="/js/webflow.js" strategy="afterInteractive" />
    </>
  );
}

export default MyApp;