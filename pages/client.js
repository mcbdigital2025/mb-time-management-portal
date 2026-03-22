"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from "../utils/api"; // Import authenticatedFetch
import ReusableTable from "../components/ReusableTable";
import ViewEmployeesSkeleton from "../components/loaders/ViewEmployeesSkeleton";

const Client = () => {
  const [clients, setClients] = useState([]);
  const [clientLearningNeeds, setClientLearningNeeds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success messages
  const [confirmMessage, setConfirmMessage] = useState(null); // New state for confirmation messages
  const [confirmAction, setConfirmAction] = useState(null); // New state for confirmation action callback
  const [selectedClientId, setSelectedClientId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // ✅ Check for JWT token in storedUser
    if (!user || !user.companyId || !user.jwtToken) {
      setError("User information or token is missing. Redirecting to login.");
      setLoading(false);
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return; // Exit early
    }

    const fetchClients = async () => {
      try {
        // ✅ Use authenticatedFetch instead of direct fetch
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/${encodeURIComponent(user.companyId)}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            // ✅ Removed credentials: "include"
          },
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch client data: ${response.status} ${response.statusText} - ${errorText}`,
          );
        }

        const text = await response.text();
        const data = JSONbig.parse(text);

        const converted = data.map((client) => ({
          ...client,
          clientId: client.clientId?.toString(),
          companyId: client.companyId?.toString(),
        }));
        setClients(converted);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError(err.message);
        // If fetching fails due to token issues (e.g., token expired/invalid),
        // consider redirecting to login after a delay.
        if (
          err.message.includes("Authentication token missing") ||
          err.message.includes("401 Unauthorized")
        ) {
          setTimeout(() => {
            router.replace("/login");
          }, 1500);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []); // Empty dependency array as user is accessed inside the effect

  const fetchLearningNeeds = async (clientId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    // ✅ Check for JWT token in storedUser
    if (!user || !user.companyId || !clientId || !user.jwtToken) {
      console.error(
        "User information or token is missing for fetching learning needs.",
      );
      setError("User session or token is missing. Redirecting to login.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    try {
      // ✅ Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientLearnNeeds/id/${encodeURIComponent(user.companyId)}/${encodeURIComponent(clientId)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          // ✅ Removed credentials: "include"
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch learning needs: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const text = await response.text();
      const data = JSONbig.parse(text);

      const safeData = {
        ...data,
        clientId: data.clientId?.toString(),
        clientLearningId: data.clientLearningId?.toString(),
        companyId: data.companyId?.toString(),
      };

      if (!safeData || Object.keys(safeData).length === 0) {
        setClientLearningNeeds(null);
      } else {
        setClientLearningNeeds(safeData);
      }
    } catch (err) {
      console.error("Error fetching learning needs:", err);
      setClientLearningNeeds(null); // Clear learning needs on error
      setError(err.message); // Set error for display
      // If fetching fails due to token issues (e.g., token expired/invalid),
      // consider redirecting to login after a delay.
      if (
        err.message.includes("Authentication token missing") ||
        err.message.includes("401 Unauthorized")
      ) {
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      }
    }
  };

  const handleRowClick = (clientId) => {
    setSelectedClientId(clientId);
    fetchLearningNeeds(clientId);
    setError(null); // Clear errors when selecting a new client
    setSuccessMessage(null); // Clear success messages
  };

  const handleCreateClient = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.companyId) {
      sessionStorage.setItem("companyId", user.companyId);
      router.push("/createClient");
    } else {
      setError("User information is missing. Cannot create client.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
    }
  };

  const handleUpdateClients = () => {
    const selectedClient = clients.find((c) => c.clientId === selectedClientId);
    if (selectedClient) {
      sessionStorage.setItem("selectedClient", JSON.stringify(selectedClient));
      router.push("/updateClient");
    } else {
      setError("No client selected for update.");
    }
  };

  const handleDeleteClients = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const client = clients.find((c) => c.clientId === selectedClientId);
    // ✅ Check for JWT token in storedUser
    if (!client || !user || !user.companyId || !user.jwtToken) {
      setError("User information or token is missing. Cannot delete client.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    setConfirmMessage(
      `Are you sure you want to delete the Client of email ${client.email}?`,
    );
    setConfirmAction(() => async () => {
      try {
        // ✅ Use authenticatedFetch instead of direct fetch
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/delete?clientId=${encodeURIComponent(
            client.clientId,
          )}&companyId=${encodeURIComponent(user.companyId)}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            // ✅ Removed credentials: "include"
          },
        );

        if (response.ok) {
          setSuccessMessage("Client deleted successfully.");
          setClients(clients.filter((c) => c.clientId !== client.clientId));
          setClientLearningNeeds(null);
          setSelectedClientId(null);
          setError(null); // Clear any previous errors
        } else {
          const errorText = await response.text();
          throw new Error(
            `Failed to delete client: ${response.status} ${response.statusText} - ${errorText}`,
          );
        }
      } catch (err) {
        console.error("Delete client error:", err);
        setError("An error occurred while deleting the client: " + err.message);
        // If fetching fails due to token issues (e.g., token expired/invalid),
        // consider redirecting to login after a delay.
        if (
          err.message.includes("Authentication token missing") ||
          err.message.includes("401 Unauthorized")
        ) {
          setTimeout(() => {
            router.replace("/login");
          }, 1500);
        }
      } finally {
        setConfirmMessage(null); // Close confirmation modal
        setConfirmAction(null);
      }
    });
  };

  const handleDeleteClient = (client) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!client || !user || !user.companyId || !user.jwtToken) {
      setError("User information or token is missing. Cannot delete client.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    setConfirmMessage(
      `Are you sure you want to delete the client with email ${client.email}?`,
    );
    setConfirmAction(() => async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/delete?clientId=${encodeURIComponent(
            client.clientId,
          )}&companyId=${encodeURIComponent(user.companyId)}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to delete client: ${response.status} ${response.statusText} - ${errorText}`,
          );
        }

        setSuccessMessage("Client deleted successfully.");
        setClients((prev) =>
          prev.filter((c) => c.clientId !== client.clientId),
        );

        if (selectedClientId === client.clientId) {
          setSelectedClientId(null);
          setClientLearningNeeds(null);
        }

        setError(null);
      } catch (err) {
        console.error("Delete client error:", err);
        setError("An error occurred while deleting the client: " + err.message);

        if (
          err.message.includes("Authentication token missing") ||
          err.message.includes("401 Unauthorized")
        ) {
          setTimeout(() => {
            router.replace("/login");
          }, 1500);
        }
      } finally {
        setConfirmMessage(null);
        setConfirmAction(null);
      }
    });
  };

  // New handler for creating client learning needs
  const handleCreateLearningNeeds = () => {
    const selectedClient = clients.find((c) => c.clientId === selectedClientId);
    if (selectedClient) {
      sessionStorage.setItem("ClientID", selectedClient.clientId);
      sessionStorage.setItem("CompanyID", selectedClient.companyId);
      router.push("/createClientLearningNeeds");
    } else {
      setError("No client selected to create learning needs.");
    }
  };

  const handleDeleteLearningNeeds = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    // ✅ Check for JWT token in storedUser
    if (!clientLearningNeeds || !user || !user.companyId || !user.jwtToken) {
      setError(
        "User information or token is missing. Cannot delete learning needs.",
      );
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return;
    }

    setConfirmMessage(
      `Are you sure you want to delete Client Learning Needs for ClientId ${clientLearningNeeds.clientId}?`,
    );
    setConfirmAction(() => async () => {
      try {
        // ✅ Use authenticatedFetch instead of direct fetch
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientLearnNeeds/delete?clientLearningId=${encodeURIComponent(
            clientLearningNeeds.clientLearningId,
          )}&companyId=${encodeURIComponent(user.companyId)}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            // ✅ Removed credentials: "include"
          },
        );

        if (response.ok) {
          setSuccessMessage("Client Learning Needs deleted successfully.");
          setClientLearningNeeds(null);
          setError(null); // Clear any previous errors
        } else {
          const errorText = await response.text();
          throw new Error(
            `Failed to delete learning needs: ${response.status} ${response.statusText} - ${errorText}`,
          );
        }
      } catch (err) {
        console.error("Delete learning needs error:", err);
        setError(
          "An error occurred while deleting learning needs: " + err.message,
        );
        // If fetching fails due to token issues (e.g., token expired/invalid),
        // consider redirecting to login after a delay.
        if (
          err.message.includes("Authentication token missing") ||
          err.message.includes("401 Unauthorized")
        ) {
          setTimeout(() => {
            router.replace("/login");
          }, 1500);
        }
      } finally {
        setConfirmMessage(null); // Close confirmation modal
        setConfirmAction(null);
      }
    });
  };

  const handleUpdateLearningNeeds = () => {
    if (clientLearningNeeds) {
      sessionStorage.setItem(
        "selectedClientLearningNeeds",
        JSON.stringify(clientLearningNeeds),
      );
      router.push("/updateClientLearningNeeds");
    } else {
      setError("No learning needs selected for update.");
    }
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
  };

  const handleCancelConfirm = () => {
    setConfirmMessage(null);
    setConfirmAction(null);
  };

  const handleUpdateClient = (client) => {
    if (client) {
      sessionStorage.setItem("selectedClient", JSON.stringify(client));
      router.push("/updateClient");
    } else {
      setError("No client selected for update.");
    }
  };

  const clientColumns = [
    { header: "Client ID", accessor: "clientId", align: "center" },
    { header: "Company ID", accessor: "companyId", align: "center" },
    { header: "First Name", accessor: "firstName", align: "center" },
    { header: "Last Name", accessor: "lastName", align: "center" },
    { header: "Email", accessor: "email" },
    {
      header: "Phone",
      render: (row) => row.phoneNumber || "N/A",
    },
    {
      header: "Address",
      render: (row) => row.address || "N/A",
    },
    { header: "Age", accessor: "age", align: "center" },
    { header: "Gender", accessor: "gender", align: "center" },
    {
      header: "Status",
      align: "center",
      render: (row) =>
        row.status === "Active" ? (
          <span className="text-green-600 font-semibold">Active</span>
        ) : (
          <span className="text-red-500 font-semibold">Inactive</span>
        ),
    },
  ];

  const clientActions = [
    {
      label: "Edit",
      icon: "edit",
      variant: "primary",
      title: "Edit client",
      showLabel: true,
      onClick: (client) => handleUpdateClient(client),
    },
    {
      label: "Delete",
      icon: "trash",
      variant: "danger",
      title: "Delete client",
      showLabel: false,
      onClick: (client) => handleDeleteClient(client),
    },
  ];

  return (
    <div className="hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] w-full flex justify-center py-3 min-h-[90vh]">
      <div className="bg-white/30 backdrop-blur-2xl shadow-xl rounded-2xl max-w-7xl mx-auto mt-10  bg-gray-50 rounded shadow space-y-10">
        {/* Confirmation Modal */}
        {confirmMessage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
              <p className="text-lg font-semibold mb-4">{confirmMessage}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Group Box: Clients */}
        <div className=" w-full pt-3 border-gray-300 rounded">
          <p className="text-2xl text-center mb-2 font-semibold px-2">
            {" "}
            Clients
          </p>
          <div className=" flex justify-end px-5 mb-3  ">
            <button
              onClick={handleCreateClient}
              className="px-4 py-2 bg-[#008080] text-white rounded-lg cursor-pointer hover:bg-[#008080]"
            >
              + add Clients
            </button>
          </div>

          {loading ? (
            <div className="text-center text-blue-500 mt-4">
              <ViewEmployeesSkeleton />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center mt-4">{error}</div>
          ) : clients.length > 0 ? (
            <ReusableTable
              data={clients}
              columns={clientColumns}
              actions={clientActions}
              getRowKey={(row) => row.clientId}
              onRowClick={(row) => handleRowClick(row.clientId)}
              isRowSelected={(row) => selectedClientId === row.clientId}
              emptyText="No clients found."
              footerLeft={`Total clients: ${clients.length}`}
            />
          ) : (
            <p className="text-center text-gray-500">No clients found.</p>
          )}

          {/* Action Buttons for Clients */}
          <div className="hidden gap-4 justify-center mt-4">
            <button
              onClick={handleUpdateClient}
              disabled={!selectedClientId}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Update
            </button>
            <button
              onClick={handleDeleteClient}
              disabled={!selectedClientId}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Group Box: Client Learning Needs */}
        <fieldset className="border border-gray-300 rounded p-5">
          <legend className="text-xl font-semibold px-2">
            Client Learning Needs
          </legend>

          {/* Action Buttons for Learning Needs */}
          {clientLearningNeeds && (
            <div className="flex gap-4 justify-center mb-4">
              <button
                onClick={handleCreateLearningNeeds}
                disabled={!selectedClientId || !!clientLearningNeeds}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Create
              </button>
              <button
                onClick={handleUpdateLearningNeeds}
                disabled={!selectedClientId || !clientLearningNeeds}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Update
              </button>
              <button
                onClick={handleDeleteLearningNeeds}
                disabled={!selectedClientId || !clientLearningNeeds}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          )}

          {clientLearningNeeds ? (
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Client Learning Id:</strong>{" "}
                {clientLearningNeeds.clientLearningId}
              </p>
              <p>
                <strong>Client Id:</strong> {clientLearningNeeds.clientId}
              </p>
              <p>
                <strong>Company Id:</strong> {clientLearningNeeds.companyId}
              </p>
              <p>
                <strong>Preferred Method:</strong>{" "}
                {clientLearningNeeds.preferredLearningMethod}
              </p>
              <p>
                <strong>Assistive Tech:</strong>{" "}
                {clientLearningNeeds.assistiveTechnologyRequired ? "Yes" : "No"}
              </p>
              <p>
                <strong>Communication Support:</strong>{" "}
                {clientLearningNeeds.communicationSupport}
              </p>
              <p>
                <strong>Literacy:</strong> {clientLearningNeeds.literacyLevel}
              </p>
              <p>
                <strong>Numeracy:</strong> {clientLearningNeeds.numeracyLevel}
              </p>
              <p>
                <strong>Digital Skills:</strong>{" "}
                {clientLearningNeeds.digitalSkillsLevel}
              </p>
              <p>
                <strong>Device Access:</strong>{" "}
                {clientLearningNeeds.accessToDevice}
              </p>
              <p>
                <strong>Internet:</strong> {clientLearningNeeds.internetAccess}
              </p>
              <p>
                <strong>Training Goal:</strong>{" "}
                {clientLearningNeeds.trainingGoal}
              </p>
              <p>
                <strong>Days:</strong>{" "}
                {clientLearningNeeds.preferredTrainingDays}
              </p>
              <p>
                <strong>Times:</strong>{" "}
                {clientLearningNeeds.preferredTrainingTimes}
              </p>
              <p>
                <strong>Onsite Support:</strong>{" "}
                {clientLearningNeeds.onsiteSupportRequired ? "Yes" : "No"}
              </p>
              <p>
                <strong>Behavioral Notes:</strong>{" "}
                {clientLearningNeeds.behavioralSupportNotes}
              </p>
              <p>
                <strong>Notes:</strong> {clientLearningNeeds.additionalNotes}
              </p>
            </div>
          ) : selectedClientId ? (
            <div className="text-sm text-gray-500 italic text-center">
              No learning needs data found for this client.
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic text-center">
              Select a client to view learning needs.
            </div>
          )}
        </fieldset>

        {/* Global Error/Success Message Display */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-lg shadow-lg z-50">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg z-50">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Client;
