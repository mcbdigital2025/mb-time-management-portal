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
    const jwtToken = localStorage.getItem("jwtToken"); // Retrieve the stored JWT token

    if (!jwtToken) {
        // Handle case where token is missing (e.g., redirect to login)
        console.error("No JWT token found. User not authenticated.");
        // You might want to redirect the user to the login page here
        // import { useRouter } from 'next/router';
        // const router = useRouter();
        // router.push('/login');
        throw new Error("Authentication token missing.");
    }

    // Ensure headers object exists
    options.headers = {
        ...options.headers, // Preserve any existing headers
        'Authorization': `Bearer ${jwtToken}`, // Add the Authorization header
        'Accept': 'application/json', // Common for APIs
        'Content-Type': 'application/json', // Common for POST/PUT requests with JSON body
    };

    // Remove credentials: 'include' if you are solely relying on JWT for authentication
    // as it might send cookies/session IDs which are not needed with stateless JWT.
    // However, if your backend still uses session cookies for some reason, keep it.
    // For pure JWT, you'd typically omit or set to 'omit'.
    // delete options.credentials; // Uncomment this line for pure JWT authentication

    return fetch(url, options);
}