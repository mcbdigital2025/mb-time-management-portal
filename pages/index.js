// pages/index.js
// This file now only contains the content specific to your home page.
// The top toolbar and foot bar are handled by _app.js.

"use client"; // Keep this if you're using client-side hooks like useState/useEffect in other parts of this component, though for just static content, it's not strictly necessary.

const HomePageContent = () => {
  return (
    <fieldset className="border border-gray-300 p-6 rounded-lg shadow-md bg-white w-full max-w-4xl">
      <legend className="text-xl font-bold px-2 text-gray-800"></legend>
      <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
        Welcome to the MCB Service Hub
      </h1>
      <h3 className="text-lg text-gray-700 mb-8 text-center">
        Navigate through MCB Service Hub efficiently.
      </h3>
      <div
        className="flex-1 flex items-center justify-center w-full"
        style={{
          backgroundImage: 'url("/mcb_service_hub_background.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      />
    </fieldset>
  );
};

export default HomePageContent;