"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from "../utils/api";

const Conversations = ({ user: initialUser }) => {
  const [chatGroups, setChatGroups] = useState([]);
  const [selectedChatGroup, setSelectedChatGroup] = useState(null);
  const [chatMembers, setChatMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const messagesEndRef = useRef(null);
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const POLLING_INTERVAL =
    Number(process.env.NEXT_PUBLIC_CHAT_POLLING_INTERVAL) || 10000;

  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const selectedGroupObject = useMemo(() => {
    return (
      chatGroups.find(
        (g) => g.chatGroupId?.toString() === selectedChatGroup?.toString(),
      ) || null
    );
  }, [chatGroups, selectedChatGroup]);

  const clientName = selectedGroupObject?.chatGroupName || "No group selected";

  const initials = useMemo(() => {
    if (!clientName || clientName === "No group selected") return "CG";
    const words = clientName.trim().split(/\s+/);
    return words
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
  }, [clientName]);

  const loggedInAs = useMemo(() => {
    const firstName = storedUser?.firstName || "";
    const lastName = storedUser?.lastName || "";
    const email = storedUser?.email || "";
    return `${firstName} ${lastName}`.trim() || email || "Unknown User";
  }, [storedUser]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || !user.jwtToken || !user.companyId) {
      router.replace("/login");
      return;
    }
    loadChatGroups(user);
    fetchEmployees(user);
  }, []);

  useEffect(() => {
    let intervalId;

    if (selectedChatGroup) {
      loadMessages(selectedChatGroup);

      intervalId = setInterval(() => {
        loadMessages(selectedChatGroup);
      }, POLLING_INTERVAL);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedChatGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchEmployees = async (user) => {
    try {
      const response = await authenticatedFetch(
        `${API_BASE}/mcbtt/api/timesheet/employee/company/${user.companyId}`,
        { method: "GET", headers: { Accept: "application/json" } },
      );

      if (response.ok) {
        const data = await response.json();
        setEmployees(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const loadChatGroups = async (user) => {
    try {
      const response = await authenticatedFetch(
        `${API_BASE}/mcbtt/api/timesheet/chat/company/${user.companyId}/${user.employeeId}`,
        { method: "GET", headers: { Accept: "application/json" } },
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const text = await response.text();
      const data = text ? JSONbig.parse(text) : [];
      setChatGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadChatMembers = async (chatGroupId) => {
    if (!chatGroupId) {
      setChatMembers([]);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const response = await authenticatedFetch(
        `${API_BASE}/mcbtt/api/timesheet/chat/chatMember/${user.companyId}/${chatGroupId}`,
        { method: "GET", headers: { Accept: "application/json" } },
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const text = await response.text();
      const data = text ? JSONbig.parse(text) : [];
      const memberList = Array.isArray(data)
        ? data.map((m) => m.employeeId || m)
        : [];

      setChatMembers(memberList);
    } catch (err) {
      console.error("Failed to load members", err);
    }
  };

  const loadMessages = async (chatGroupId) => {
    if (!chatGroupId) return;

    try {
      const response = await authenticatedFetch(
        `${API_BASE}/mcbtt/api/timesheet/chat/message/${chatGroupId}`,
      );

      if (!response.ok) return;

      const text = await response.text();
      const data = text ? JSONbig.parse(text) : [];
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const formatted = data.map((msg) => ({
        id: msg.chatMessageId?.toString() || Math.random().toString(),
        sender: msg.senderEmployeeId?.toString(),
        text: msg.messageText,
        timestamp: new Date(msg.messageTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type:
          msg.senderEmployeeId?.toString() === user.employeeId?.toString()
            ? "staff"
            : "client",
      }));

      setMessages((prev) =>
        prev.length !== formatted.length ? formatted : prev,
      );
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  const addChatMember = async () => {
    if (!selectedChatGroup || !selectedEmployee) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const payload = {
      chatGroupId: selectedChatGroup,
      companyId: user.companyId,
      employeeId: selectedEmployee,
      joinedDate: new Date().toISOString(),
    };

    try {
      const res = await authenticatedFetch(
        `${API_BASE}/mcbtt/api/timesheet/chat/createMemmber`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        alert("Member added successfully!");
        setIsModalOpen(false);
        setSelectedEmployee("");
        loadChatMembers(selectedChatGroup);
      }
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };

  const createChatGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const payload = {
      companyId: user.companyId,
      chatGroupName: newGroupName,
      createdByEmployeeId: user.employeeId?.toString(),
      createdDate: new Date().toISOString(),
    };

    try {
      const res = await authenticatedFetch(
        `${API_BASE}/mcbtt/api/timesheet/chat/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        setNewGroupName("");
        loadChatGroups(user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedChatGroup) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const payload = {
      chatGroupId: selectedChatGroup,
      companyId: user.companyId,
      senderEmployeeId: user.employeeId,
      messageText: newMessage,
    };

    try {
      const res = await authenticatedFetch(
        `${API_BASE}/mcbtt/api/timesheet/chat/message/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        setNewMessage("");
        loadMessages(selectedChatGroup);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-0px)] w-full bg-[radial-gradient(1200px_600px_at_20%_0%,#f4f1ff_0%,#f7f7fb_40%,#f3f4f6_100%)] p-2">
      <div className="mx-auto grid h-[90vh] w-full max-w-350 grid-cols-1 gap-4 lg:grid-cols-[1.6fr_0.95fr] lg:gap-4.5">
        {/* LEFT: CHAT */}
        <section className="flex min-w-0 flex-col overflow-hidden rounded-[18px] border border-black/5 bg-white/50 shadow-[0_18px_45px_rgba(17,24,39,0.08)]">
          {/* TOP CONTROL BAR */}
          <div className="border-b border-black/5 bg-white px-4 py-4">
            <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center">
              <form
                onSubmit={createChatGroup}
                className="flex flex-1 items-center gap-2"
              >
                <input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="New group name..."
                  className="h-11 flex-1 rounded-xl border border-black/10 bg-white px-4 text-sm outline-none placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#008080] px-4 py-2.5 text-sm font-bold text-white cursor-pointer"
                >
                  Create
                </button>
              </form>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={!selectedChatGroup}
                className="rounded-xl bg-[#F75D42] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                + Add Member
              </button>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedChatGroup || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedChatGroup(val);
                  loadChatMembers(val);
                }}
                className="h-11 w-[60%] rounded-xl border border-black/10 bg-white px-4 text-sm outline-none"
              >
                <option value="">-- Select a Group --</option>
                {chatGroups.map((g, idx) => (
                  <option
                    key={g.chatGroupId?.toString() || idx}
                    value={g.chatGroupId?.toString()}
                  >
                    {g.chatGroupName}
                  </option>
                ))}
              </select>

              <div className="rounded-xl w-[40%] border border-black/5 bg-[#f6f7fb] px-4 py-1">
                <div className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Chat Members
                </div>
                <div className="text-sm text-zinc-700 wrap-break-words">
                  {chatMembers.length > 0
                    ? chatMembers.join(", ")
                    : "No members loaded"}
                </div>
              </div>
            </div>
          </div>

          {/* HEADER */}
          <header className="flex items-center justify-between gap-2 border-b border-black/5 bg-white px-4 py-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border border-violet-500/20 bg-[linear-gradient(135deg,#f0eaff_0%,#e7ddff_60%,#f6f3ff_100%)] font-extrabold text-[#3b2b5a]">
                {initials}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-extrabold text-zinc-900 md:text-base">
                  Group: {clientName}
                </h2>
                <div className="mt-1 inline-flex items-center gap-2 text-xs font-semibold text-green-600 md:text-base">
                  <span className="relative inline-flex h-2 w-2">
                    <span className="absolute inset-0 rounded-full bg-green-500 opacity-25 ring-4 ring-green-500/15" />
                    <span className="relative h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  {selectedChatGroup
                    ? "Active Chat Session"
                    : "No Group Selected"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                title="More"
                className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 bg-white shadow-[0_8px_18px_rgba(17,24,39,0.06)] transition hover:-translate-y-0.5 cursor-pointer"
              >
                ⋯
              </button>
            </div>
          </header>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto bg-[radial-gradient(800px_350px_at_20%_10%,rgba(124,58,237,0.08)_0%,rgba(124,58,237,0)_55%),#f6f7fb] px-3.5 py-4">
            {error && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center text-sm font-medium text-zinc-500">
                {selectedChatGroup
                  ? "No messages yet. Start the conversation."
                  : "Select a group to view messages."}
              </div>
            )}

            {messages.map((msg) => {
              const isLeft = msg.type === "client";

              return (
                <div
                  key={msg.id}
                  className={[
                    "mb-3.5 flex max-w-full flex-col",
                    isLeft ? "items-start" : "items-end",
                  ].join(" ")}
                >
                  <div className="mx-2 mb-1.5 text-[10px] text-zinc-500/90 md:text-[12px]">
                    {msg.type === "staff" ? "You" : msg.sender} •{" "}
                    {msg.timestamp}
                  </div>

                  <div
                    className={[
                      "max-w-[min(72%,620px)] wrap-break-words rounded-2xl border px-3.5 py-3 text-[12px] font-medium leading-[1.45] shadow-[0_10px_22px_rgba(17,24,39,0.08)] md:text-base",
                      isLeft
                        ? "rounded-tl-lg border-black/5 bg-white text-zinc-900"
                        : "rounded-tr-lg border-violet-500/25 bg-[#008080] text-white",
                    ].join(" ")}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* FOOTER */}
          <footer className="flex flex-col gap-2.5 border-t border-black/5 bg-white px-3.5 pb-3.5 pt-3">
            <form
              onSubmit={sendMessage}
              className="flex items-center gap-2.5 rounded-[18px] border border-black/5 bg-[#f6f7fb] p-1 md:p-2.5"
            >
              <button
                type="button"
                title="Emoji"
                className="grid h-8.5 w-8.5 place-items-center rounded-xl border border-black/5 bg-white cursor-pointer"
              >
                🙂
              </button>

              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  selectedChatGroup
                    ? "Type a message..."
                    : "Select a group first"
                }
                disabled={!selectedChatGroup}
                className="h-6 min-w-0 flex-1 bg-transparent text-xs text-zinc-900 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed md:h-9 md:text-sm"
              />

              <button
                type="submit"
                title="Send"
                disabled={!selectedChatGroup || !newMessage.trim()}
                className="grid px-5 py-2 place-items-center rounded-[14px] bg-[#008080] text-white shadow-[0_14px_28px_rgba(124,58,237,0.25)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                send ➤
              </button>
            </form>

            <div className=" hidden  grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={(e) => sendMessage(e)}
                disabled={!selectedChatGroup || !newMessage.trim()}
                className="rounded-[14px] bg-[#008080] px-3 py-2 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(124,58,237,0.22)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer md:py-2.5"
              >
                Send to Group
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={!selectedChatGroup}
                className="rounded-[14px] border border-amber-500/35 bg-[#F75D42] px-3 py-2 text-sm font-extrabold text-amber-100 shadow-[0_14px_30px_rgba(245,158,11,0.12)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer md:py-2.5"
              >
                Manage Members 📋
              </button>
            </div>
          </footer>
        </section>

        {/* RIGHT: PROFILE PANEL */}
        <aside className="hidden min-w-0 md:flex">
          <div className="flex w-full flex-col gap-3 rounded-[18px] border border-black/5 bg-white p-4 shadow-[0_18px_45px_rgba(17,24,39,0.08)]">
            <div className="flex items-center gap-3">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[18px] border border-violet-500/20 bg-[linear-gradient(135deg,#f0eaff_0%,#e7ddff_60%,#f6f3ff_100%)] text-xl font-black text-[#3b2b5a] md:h-18 md:w-18 md:text-4xl">
                {initials}
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-black text-zinc-900 md:text-lg">
                  Group: {clientName}
                </div>
                <div className="mt-1 text-xs font-bold text-green-600 md:text-base">
                  ●{" "}
                  {selectedChatGroup
                    ? "Active Chat Session"
                    : "Waiting for Selection"}
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-black/5" />

            <div className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-[13px]">
              <div className="font-bold text-zinc-500/90">Logged in as:</div>
              <div className="wrap-break-words font-bold text-zinc-900">
                {loggedInAs}
              </div>

              <div className="font-bold text-zinc-500/90">Members:</div>
              <div className="wrap-break-words text-zinc-900">
                {chatMembers.length > 0
                  ? chatMembers.join(", ")
                  : "No members loaded"}
              </div>

              <div className="font-bold text-zinc-500/90">Groups:</div>
              <div className="wrap-break-words text-zinc-900">
                {chatGroups.length}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="h-14 rounded-xl bg-zinc-100/80" />
              <div className="h-14 rounded-xl bg-zinc-100/80" />
              <div className="h-14 rounded-xl bg-zinc-100/80" />
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-900">Add Member</h3>

            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="mt-4 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-zinc-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addChatMember}
                disabled={!selectedEmployee}
                className="rounded-xl bg-[#008080] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations;
