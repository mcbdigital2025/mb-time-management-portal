import { jwtDecode } from "jwt-decode";

// utils/api.js
// This file would be imported and used by other components that need to make authenticated requests.

/**
 * Fetches data from a protected API endpoint, automatically including the JWT token.
 * @param {string} url The URL of the API endpoint.
 * @param {RequestInit} [options] Optional fetch options (method, body, headers, etc.).
 * @returns {Promise<Response>} The fetch Response object.
 * @throws {Error} If no JWT token is found in localStorage.
 */
export async function authenticatedFetch(url, options = {}) {
    // 1. Safety check for SSR (Next.js environment)
    if (typeof document === "undefined") {
        return fetch(url, options);
    }

    // 2. Safely find the cookie
    const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwtToken="));

    // 3. If cookie is missing, do not attempt to .split("="), just handle the error
    if (!tokenCookie) {
        console.error("No JWT token found. User not authenticated.");
        // We throw a clear error that your components can .catch()
        throw new Error("Authentication token missing.");
    }

    // 4. Safe to split now because we know tokenCookie exists
    const jwtToken = tokenCookie.split("=")[1];
    // console.log("🚀 ~ authenticatedFetch ~ jwtToken:", jwtToken)

    if (!jwtToken) {
        throw new Error("JWT Token value is empty.");
    }

    // 5. Prepare headers
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        "ngrok-skip-browser-warning": "any-value-here", // ◄ ADD THIS LINE
        ...options.headers, // Allow overriding if specific calls need different headers
    };

    return fetch(url, {
        ...options,
        headers,
    });
}

/**
 * Checks if a JWT token's expiration time has passed.
 */
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);

    if (!decoded.exp) return false;

    // Check if current time (in seconds) is greater than expiry time
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    // If decoding fails, treat as expired/invalid
    return true;
  }
}