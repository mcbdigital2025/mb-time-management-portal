"use client";

import { useRouter } from "next/router";
import { useState } from "react";

const Logout = () => {
  const router = useRouter();
  const [message, setMessage] = useState("Do you want to log out?");

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    // Clear session storage
    sessionStorage.clear();

    // Optionally, you might want to clear specific cookies if your app uses them
    // For example: document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setMessage("Logging out...");
    // Redirect to the login page after a short delay
    setTimeout(() => {
      router.replace("/");
    }, 500);
  };

  const handleCancel = () => {
    // Navigate back to the home page or previous page
    router.push("/home"); // Or router.back() if you want to go to the exact previous page
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg text-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{message}</h1>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
        >
          Logout
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Logout;
