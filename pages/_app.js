// pages/_app.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from '../utils/api'; // Adjust path if needed

// Import your Company and Job components if they are not already in pages
// For _app.js, you generally render the 'Component' prop, so you don't
// directly import your page components here unless they are part of a shared layout component.
// Instead, your page components (Company.js, index.js, job.js) will be passed as `Component`

import '../styles/globals.css'; // Assuming you have a global CSS file

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [accessPages, setAccessPages] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.companyId || !storedUser.email || !storedUser.jwtToken) {
      setUser(null);
      setError("");
      // No immediate redirect here; allow login/registration buttons to show
      return;
    }

    setUser(storedUser);
    setError(null);

    const fetchAccessPages = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/userLogin/accessPages?email=${encodeURIComponent(storedUser.email)}&companyId=${encodeURIComponent(storedUser.companyId)}`,
          {
            method: "POST",
            headers: { "Accept": "application/json" },
          }
        );
        if (!response.ok) {
          const errorDetails = await response.text();
          console.error("Failed to fetch access pages:", response.status, response.statusText, errorDetails);
          throw new Error(`Failed to fetch access pages: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setAccessPages(data);
      } catch (err) {
        console.error("Error in fetchAccessPages:", err);
        setError(err.message);
        if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
          setTimeout(() => {
            router.replace("/login");
          }, 1500);
        }
      }
    };

    fetchAccessPages();
  }, []); // Empty dependency array to run once on mount

  const handlePageClick = (page) => {
    if (!page) return;
      // Format the page string by removing spaces and converting to lowercase
      const formattedPage = page.replace(/\s+/g, "").toLowerCase();

      // If the formatted page is "home", push to the root URL "/"
      if (formattedPage === "home") {
        router.push("/");
      } else {
        // For all other pages, push to the formatted path (e.g., /company, /job)
        router.push(`/${formattedPage}`);
      }
  };

  const handleLoginClick = () => { router.push("/login"); };
  const handleRegistrationClick = () => { router.push("/registration"); };
  const handleLogoutClick = () => { router.push("/logout"); };

  // This is the common layout wrapper
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Toolbar (Header) */}
      <header className="bg-blue-600 text-white py-3 shadow-md w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          {user ? (
            <>
              <nav className="flex-grow flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <img src="/mcb_service_hub_logo.png" alt="Company Logo" className="h-10 w-10 rounded-full mr-2"/>
                  {accessPages.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageClick(page)}
                      className="px-4 py-2 rounded hover:bg-blue-800 transition duration-200"
                    >
                      {page.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  ))}
                       <img src="/mcb_blank_menu.png" alt="Company Logo" className="h-10 w-10 rounded-full"/>
                       <span className="text-lg font-semibold">Hi, {user.firstName}   </span>
                       <button
                         onClick={handleLogoutClick}
                         className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 transition duration-200"
                       >
                         Logout
                       </button>
           </div>
                <div className="flex items-center space-x-4">
                </div>
              </nav>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-end space-x-4">
              <img src="/mcb_service_hub_logo.png" alt="Company Logo" className="h-10 w-10 rounded-full mr-2"/>
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 rounded hover:bg-blue-800 transition duration-200"
              >
                Login
              </button>
              <button
                onClick={handleRegistrationClick}
                className="px-4 py-2 rounded hover:bg-blue-800 transition duration-200"
              >
                Registration
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area: This is where each page component will be rendered */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
         {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
         )}
        <Component {...pageProps} /> {/* This renders the current page (e.g., Company, Job, Home) */}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center text-sm shadow-inner w-full">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} MCB Service Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default MyApp;