"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';
import ReusableTable from "../components/ReusableTable";
import { Users, BookOpen, Home, Info, PlusCircle } from "lucide-react";

const Client = () => {
  const [clients, setClients] = useState([]);
  const [clientLearningNeeds, setClientLearningNeeds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Permissions Check
  const hasEditPermission = useMemo(() => {
    return user?.accessLevel === "Administrator";
  }, [user]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.companyId) {
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
          { method: "GET" }
        );
        if (!response.ok) throw new Error("Failed to fetch client data.");

        const text = await response.text();
        const data = JSONbig.parse(text);
        setClients(data.map(c => ({
          ...c,
          clientId: c.clientId?.toString(),
          companyId: c.companyId?.toString()
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
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientLearnNeeds/id/${encodeURIComponent(user.companyId)}/${encodeURIComponent(clientId)}`,
        { method: "GET" }
      );
      if (response.ok) {
        const text = await response.text();
        const data = JSONbig.parse(text);
        setClientLearningNeeds(data);
      } else {
        setClientLearningNeeds(null);
      }
    } catch (err) {
      setClientLearningNeeds(null);
    }
  };

  const handleRowClick = (client) => {
    setSelectedClientId(client.clientId);
    fetchLearningNeeds(client.clientId);
    setError("");
    setSuccessMessage("");
  };

  // Action Columns Definition
  const clientColumns = [
    { header: "ID", render: (c) => <span className="font-mono text-xs text-gray-400">{c.clientId}</span> },
    { header: "Name", render: (c) => <span className="font-semibold text-gray-900">{c.firstName} {c.lastName}</span> },
    { header: "Email", render: (c) => c.email },
    { header: "Phone", render: (c) => c.phoneNumber || "—" },
    {
      header: "Status",
      render: (c) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
          {c.status}
        </span>
      )
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
      onClick: async (c) => {
        if (!window.confirm(`Are you sure you want to delete ${c.firstName}?`)) return;
        try {
          const res = await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/delete?clientId=${c.clientId}&companyId=${user.companyId}`,
            { method: "POST" }
          );
          if (res.ok) {
            setClients(clients.filter(item => item.clientId !== c.clientId));
            setSuccessMessage("Client deleted successfully.");
          }
        } catch (err) { setError(err.message); }
      }
    }
  ] : [];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] px-4 py-10">

      <div className="relative z-10 w-full max-w-7xl space-y-6">
        {/* Header Card */}
        <div className="bg-white/70 rounded-2xl shadow-sm border border-teal-400/30 overflow-hidden px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="text-[#008080]" size={24} />
              <h1 className="text-2xl font-semibold text-gray-900">Client Management</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">Manage client profiles and specialized learning requirements.</p>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <p className="text-sm font-bold text-gray-700">Role: {user?.accessLevel || "Loading..."}</p>
            <button
              onClick={() => {
                sessionStorage.setItem("companyId", user.companyId);
                router.push("/createClient");
              }}
              disabled={!hasEditPermission}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                hasEditPermission ? "bg-[#008080] text-white hover:bg-teal-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <PlusCircle size={16} /> Add Client
            </button>
          </div>
        </div>

        {/* Alerts */}
        {(error || successMessage) && (
          <div className="px-2">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
            {successMessage && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{successMessage}</div>}
          </div>
        )}

        {/* Main Table */}
        <div className="bg-white/70 rounded-2xl shadow-sm border border-teal-400/30 overflow-hidden">
          <ReusableTable
            data={clients}
            columns={clientColumns}
            actions={clientActions}
            getRowKey={(c) => c.clientId}
            onRowClick={handleRowClick}
            isRowSelected={(c) => selectedClientId === c.clientId}
            footerLeft={`Total Clients: ${clients.length}`}
            footerRight="Select a client to view Learning Needs"
          />
        </div>

        {/* Learning Needs Section - Consistent Card Style */}
        <div className="bg-white/80 rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 rounded-lg text-[#008080]">
                <BookOpen size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Learning Requirements</h2>
            </div>
            {selectedClientId && hasEditPermission && (
              <div className="flex gap-2">
                {!clientLearningNeeds ? (
                  <button onClick={() => router.push('/createClientLearningNeeds')} className="text-xs font-bold px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50">Add Needs</button>
                ) : (
                  <button onClick={() => router.push('/updateClientLearningNeeds')} className="text-xs font-bold px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50">Modify</button>
                )}
              </div>
            )}
          </div>

          {clientLearningNeeds ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2"><Info size={12}/> Skill Levels</h3>
                <div className="text-sm">
                  <p className="flex justify-between py-1 border-b border-gray-200"><span className="text-gray-500">Literacy:</span> <b>{clientLearningNeeds.literacyLevel}</b></p>
                  <p className="flex justify-between py-1 border-b border-gray-200"><span className="text-gray-500">Numeracy:</span> <b>{clientLearningNeeds.numeracyLevel}</b></p>
                  <p className="flex justify-between py-1"><span className="text-gray-500">Digital:</span> <b>{clientLearningNeeds.digitalSkillsLevel}</b></p>
                </div>
              </div>
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl text-sm">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><BookOpen size={12}/> Method</h3>
                <p><span className="text-gray-500">Preferred:</span> {clientLearningNeeds.preferredLearningMethod}</p>
                <p><span className="text-gray-500">Assistive Tech:</span> {clientLearningNeeds.assistiveTechnologyRequired ? "Yes" : "No"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Behavioral Notes</h3>
                <p className="text-xs text-gray-600 italic">"{clientLearningNeeds.behavioralSupportNotes || "None recorded."}"</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 italic text-sm">
              {selectedClientId ? "No data found for this client." : "Select a client to view details."}
            </div>
          )}
        </div>

        {/* Home Button */}
        <div className="flex justify-center pt-4">
          <Link href="/home">
            <button className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
              <Home size={18} /> Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Client;