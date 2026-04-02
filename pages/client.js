"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from "../utils/api";
import ReusableTable from "../components/ReusableTable";
import ViewEmployeesSkeleton from "../components/loaders/ViewEmployeesSkeleton";
import { Users, BookOpen, Home, Trash2, Edit, AlertCircle } from "lucide-react";

const Client = () => {
  const [clients, setClients] = useState([]);
  const [clientLearningNeeds, setClientLearningNeeds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const hasEditPermission = useMemo(() => {
    return user?.accessLevel === "Administrator";
  }, [user]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.companyId || !storedUser.jwtToken) {
      setError("User session missing. Redirecting to login.");
      setLoading(false);
      setTimeout(() => router.replace("/login"), 500);
      return;
    }
    setUser(storedUser);

    const fetchClients = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/${encodeURIComponent(storedUser.companyId)}`,
          { method: "GET", headers: { Accept: "application/json" } }
        );
        if (!response.ok) throw new Error("Failed to fetch client data.");

        const text = await response.text();
        const data = JSONbig.parse(text);
        setClients(data.map(c => ({
          ...c,
          clientId: c.clientId?.toString(),
          companyId: c.companyId?.toString(),
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [router]);

  const fetchLearningNeeds = async (clientId) => {
    if (!user?.companyId || !clientId) return;
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientLearnNeeds/id/${encodeURIComponent(user.companyId)}/${encodeURIComponent(clientId)}`,
        { method: "GET", headers: { Accept: "application/json" } }
      );
      if (response.ok) {
        const text = await response.text();
        const data = JSONbig.parse(text);
        setClientLearningNeeds({
          ...data,
          clientId: data.clientId?.toString(),
          clientLearningId: data.clientLearningId?.toString(),
          companyId: data.companyId?.toString(),
        });
      } else {
        setClientLearningNeeds(null);
      }
    } catch (err) {
      setClientLearningNeeds(null);
    }
  };

  const handleRowClick = (client) => {
    // Crucial: ReusableTable usually passes the full row object
    const id = client.clientId;
    setSelectedClientId(id);
    fetchLearningNeeds(id);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCreateClient = () => {
    if (!hasEditPermission) return;
    sessionStorage.setItem("companyId", user.companyId);
    router.push("/createClient");
  };

  const handleDeleteClient = (client) => {
    if (!hasEditPermission) return;
    setConfirmMessage(`Delete client: ${client.firstName} ${client.lastName}?`);
    setConfirmAction(() => async () => {
      try {
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/delete?clientId=${client.clientId}&companyId=${user.companyId}`,
          { method: "POST" }
        );
        if (res.ok) {
          setClients(prev => prev.filter(c => c.clientId !== client.clientId));
          setSuccessMessage("Client deleted successfully.");
          if (selectedClientId === client.clientId) {
            setSelectedClientId(null);
            setClientLearningNeeds(null);
          }
        }
      } catch (err) { setError(err.message); }
      setConfirmMessage(null);
    });
  };

  const handleDeleteLearningNeeds = async () => {
    if (!clientLearningNeeds || !hasEditPermission) return;
    setConfirmMessage("Delete these Learning Needs?");
    setConfirmAction(() => async () => {
      try {
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientLearnNeeds/delete?clientLearningId=${clientLearningNeeds.clientLearningId}&companyId=${user.companyId}`,
          { method: "POST" }
        );
        if (res.ok) {
          setClientLearningNeeds(null);
          setSuccessMessage("Learning needs removed.");
        }
      } catch (err) { setError(err.message); }
      setConfirmMessage(null);
    });
  };

  const clientColumns = [
    { header: "ID", render: (c) => <span className="text-xs text-gray-400 font-mono">{c.clientId}</span> },
    { header: "Name", render: (c) => <span className="font-semibold text-gray-900">{c.firstName} {c.lastName}</span> },
    { header: "Email", accessor: "email" },
    { header: "Phone", render: (c) => c.phoneNumber || "—" },
    {
      header: "Status",
      render: (c) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {c.status}
        </span>
      ),
    },
  ];

  const clientActions = hasEditPermission ? [
    {
      label: "Edit",
      icon: "edit",
      variant: "primary",
      onClick: (c) => {
        sessionStorage.setItem("selectedClient", JSON.stringify(c));
        router.push("/updateClient");
      }
    },
    {
      label: "Delete",
      icon: "trash",
      variant: "danger",
      onClick: (c) => handleDeleteClient(c)
    }
  ] : [];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] px-4 py-10">
      <div className="relative z-10 w-full max-w-7xl space-y-6">

        {/* HEADER SECTION */}
        <div className="bg-white/70 rounded-2xl shadow-sm border border-teal-400/30 overflow-hidden px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="text-[#008080]" size={24} />
              <h1 className="text-2xl font-semibold text-gray-900">Client Management</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">Role: <span className="font-bold text-[#008080]">{user?.accessLevel || "Loading..."}</span></p>
          </div>

          <button
            onClick={handleCreateClient}
            disabled={!hasEditPermission}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition shadow-sm ${
              hasEditPermission ? "bg-[#008080] text-white hover:bg-teal-700 cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            + Add Client
          </button>
        </div>

        {/* MESSAGES */}
        {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}
        {successMessage && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">{successMessage}</div>}

        {/* CLIENT TABLE */}
        <div className="bg-white/70 rounded-2xl shadow-sm border border-teal-400/30 overflow-hidden">
          {loading ? <ViewEmployeesSkeleton /> : (
            <ReusableTable
              data={clients}
              columns={clientColumns}
              actions={clientActions}
              getRowKey={(c) => c.clientId}
              onRowClick={(row) => handleRowClick(row)} // Explicitly passing the row
              isRowSelected={(c) => selectedClientId === c.clientId}
              footerLeft={`Showing ${clients.length} clients`}
              footerRight="Select a row to manage needs"
            />
          )}
        </div>

        {/* LEARNING NEEDS SECTION */}
        <div className="bg-white/80 rounded-2xl p-6 border border-teal-100 shadow-sm mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg text-[#008080]"><BookOpen size={20} /></div>
              <h2 className="text-lg font-bold text-gray-800">Client Learning Needs</h2>
            </div>

            {hasEditPermission && selectedClientId && (
              <div className="flex gap-2">

                  <button
                    onClick={() => {
                      const selectedClient = clients.find(c => c.clientId === selectedClientId);
                      if (selectedClient) {
                        sessionStorage.setItem("ClientID", selectedClient.clientId);
                        sessionStorage.setItem("CompanyID", selectedClient.companyId);
                        router.push("/createClientLearningNeeds");
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition shadow-sm cursor-pointer"
                  >
                    + Create Needs
                  </button>
                  <>
                    <button
                      onClick={() => {
                        sessionStorage.setItem("selectedClientLearningNeeds", JSON.stringify(clientLearningNeeds));
                        router.push("/updateClientLearningNeeds");
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleDeleteLearningNeeds}
                      className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition shadow-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  </>
              </div>
            )}
          </div>

          <div className={`p-6 rounded-xl border ${clientLearningNeeds ? 'bg-white border-teal-100' : 'bg-gray-50 border-gray-200 border-dashed'}`}>
            {clientLearningNeeds ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 text-sm">
                <div><strong className="text-gray-400 uppercase text-[10px] tracking-wider">Preferred Method</strong><p className="mt-1 font-medium">{clientLearningNeeds.preferredLearningMethod || "N/A"}</p></div>
                <div><strong className="text-gray-400 uppercase text-[10px] tracking-wider">Assistive Tech</strong><p className="mt-1 font-medium">{clientLearningNeeds.assistiveTechnologyRequired ? "Yes" : "No"}</p></div>
                <div><strong className="text-gray-400 uppercase text-[10px] tracking-wider">Literacy Level</strong><p className="mt-1 font-medium">{clientLearningNeeds.literacyLevel || "N/A"}</p></div>
                <div><strong className="text-gray-400 uppercase text-[10px] tracking-wider">Numeracy Level</strong><p className="mt-1 font-medium">{clientLearningNeeds.numeracyLevel || "N/A"}</p></div>
                <div><strong className="text-gray-400 uppercase text-[10px] tracking-wider">Digital Skills</strong><p className="mt-1 font-medium">{clientLearningNeeds.digitalSkillsLevel || "N/A"}</p></div>
                <div><strong className="text-gray-400 uppercase text-[10px] tracking-wider">Training Goal</strong><p className="mt-1 font-medium">{clientLearningNeeds.trainingGoal || "N/A"}</p></div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 italic text-sm">
                {selectedClientId
                  ? "No specialized needs found. Use the '+ Create Needs' button above."
                  : "Select a client from the table above to view or create learning needs."}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Link href="/home" className="flex items-center gap-2 px-10 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"><Home size={18} /> Home</Link>
        </div>
      </div>

      {confirmMessage && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <p className="text-lg font-bold text-gray-900 mb-2">{confirmMessage}</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => confirmAction()} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition">Confirm</button>
              <button onClick={() => setConfirmMessage(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Client;