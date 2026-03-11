"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';

const Conversations = ({ user: initialUser }) => {
  // --- STATE ---
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

  // Get interval from env (fallback to 10s if not defined)
  const POLLING_INTERVAL = Number(process.env.NEXT_PUBLIC_CHAT_POLLING_INTERVAL) || 10000;

  // --- INITIAL LOAD ---
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.jwtToken || !storedUser.companyId) {
      router.replace("/login");
      return;
    }
    loadChatGroups(storedUser);
    fetchEmployees(storedUser);
  }, []);

  // --- POLLING LOGIC ---
  useEffect(() => {
    let intervalId;

    if (selectedChatGroup) {
      // Load immediately on selection
      loadMessages(selectedChatGroup);

      // Set up interval for background updates
      intervalId = setInterval(() => {
        loadMessages(selectedChatGroup);
      }, POLLING_INTERVAL);
    }

    // Cleanup: clear interval when group changes or component unmounts
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedChatGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- API ACTIONS ---

  const fetchEmployees = async (user) => {
    try {
      const response = await authenticatedFetch(
        `${API_BASE}/mcbtt/api/timesheet/employee/company/${user.companyId}`,
        { method: "GET", headers: { "Accept": "application/json" } }
      );
      if (response.ok) {
        const data = await response.json();
        setEmployees(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error("Failed to fetch employees", err); }
  };

  const loadChatGroups = async (user) => {
    try {
      const response = await authenticatedFetch(
       `${API_BASE}/mcbtt/api/timesheet/chat/company/${user.companyId}/${user.employeeId}`,
        { method: "GET", headers: { "Accept": "application/json" } }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const text = await response.text();
      const data = text ? JSONbig.parse(text) : [];
      setChatGroups(Array.isArray(data) ? data : []);
    } catch (err) { setError(err.message); }
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
        { method: "GET", headers: { "Accept": "application/json" } }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const text = await response.text();
      const data = text ? JSONbig.parse(text) : [];
      const memberList = Array.isArray(data) ? data.map(m => m.employeeId || m) : [];
      setChatMembers(memberList);
    } catch (err) { console.error("Failed to load members", err); }
  };

  const loadMessages = async (chatGroupId) => {
    if (!chatGroupId) return;
    try {
      const response = await authenticatedFetch(`${API_BASE}/mcbtt/api/timesheet/chat/message/${chatGroupId}`);
      if (!response.ok) return;
      const text = await response.text();
      const data = text ? JSONbig.parse(text) : [];
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const formatted = data.map((msg) => ({
        id: msg.chatMessageId?.toString() || Math.random().toString(),
        sender: msg.senderEmployeeId?.toString(),
        text: msg.messageText,
        timestamp: new Date(msg.messageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: msg.senderEmployeeId?.toString() === storedUser.employeeId?.toString() ? "staff" : "client"
      }));

      // Only update state if the number of messages has changed to prevent unnecessary re-renders
      setMessages(prev => (prev.length !== formatted.length ? formatted : prev));
    } catch (err) { console.error("Polling error:", err); }
  };

  const addChatMember = async () => {
    if (!selectedChatGroup || !selectedEmployee) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = {
      chatGroupId: selectedChatGroup,
      companyId: user.companyId,
      employeeId: selectedEmployee,
      joinedDate: new Date().toISOString()
    };
    try {
      const res = await authenticatedFetch(`${API_BASE}/mcbtt/api/timesheet/chat/createMemmber`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Member added successfully!");
        setIsModalOpen(false);
        loadChatMembers(selectedChatGroup);
      }
    } catch (err) { console.error("Error adding member:", err); }
  };

  const createChatGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = {
      companyId: user.companyId,
      chatGroupName: newGroupName,
      createdByEmployeeId: user.employeeId?.toString(),
      createdDate: new Date().toISOString()
    };
    try {
      const res = await authenticatedFetch(`${API_BASE}/mcbtt/api/timesheet/chat/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewGroupName("");
        loadChatGroups(user);
      }
    } catch (err) { console.error(err); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatGroup) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const payload = { chatGroupId: selectedChatGroup, companyId: user.companyId, senderEmployeeId: user.employeeId, messageText: newMessage };
    try {
      const res = await authenticatedFetch(`${API_BASE}/mcbtt/api/timesheet/chat/message/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewMessage("");
        loadMessages(selectedChatGroup); // Force refresh after sending
      }
    } catch (err) { console.error(err); }
  };

  // UI return (same as before, but ensure onChange for select only handles selection)
  return (
    <div style={{ width: "100%", maxWidth: "900px", height: "85vh", display: "flex", flexDirection: "column", backgroundColor: "#fff", border: "1px solid #d9d9d9", borderRadius: "12px", margin: "10px auto", overflow: "hidden", position: "relative" }}>
      <div style={{ padding: "15px 20px", borderBottom: "1px solid #eee", display: "flex", gap: "10px" }}>
        <form onSubmit={createChatGroup} style={{ flex: 1, display: "flex", gap: "10px" }}>
          <input
            style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
            placeholder="New group name..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#1890ff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Create</button>
        </form>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedChatGroup}
          style={{ padding: "10px 15px", backgroundColor: "#52c41a", color: "#fff", border: "none", borderRadius: "6px", cursor: selectedChatGroup ? "pointer" : "not-allowed", opacity: selectedChatGroup ? 1 : 0.6 }}
        >
          + Add Member
        </button>
      </div>

      <div style={{ padding: "15px 20px", borderBottom: "1px solid #eee", backgroundColor: "#fafafa" }}>
        <select
          value={selectedChatGroup || ""}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedChatGroup(val);
            loadChatMembers(val);
          }}
          style={{ width: "100%", padding: "10px", borderRadius: "6px", marginBottom: "10px" }}
        >
          <option value="">-- Select a Group --</option>
          {chatGroups.map((g, idx) => (
            <option key={g.chatGroupId?.toString() || idx} value={g.chatGroupId?.toString()}>
              {g.chatGroupName}
            </option>
          ))}
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
            <label style={{ fontWeight: "600", color: "#555" }}>Chat Members:</label>
            <input
                readOnly
                value={chatMembers.length > 0 ? chatMembers.join(", ") : "No members loaded"}
                style={{ flex: 1, border: "none", backgroundColor: "transparent", color: "#1890ff" }}
            />
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#f0f2f5" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: "15px", display: "flex", flexDirection: "column", alignItems: msg.type === "staff" ? "flex-end" : "flex-start" }}>
            <span style={{ fontSize: "11px", color: "#8c8c8c" }}>{msg.type === "staff" ? "You" : msg.sender} • {msg.timestamp}</span>
            <div style={{ padding: "12px", borderRadius: "12px", backgroundColor: msg.type === "staff" ? "#389E0D" : "#fff", color: msg.type === "staff" ? "#fff" : "#000", marginTop: "4px" }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: "20px", borderTop: "1px solid #eee" }}>
        <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
          <input
            style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={selectedChatGroup ? "Type a message..." : "Select a group first"}
            disabled={!selectedChatGroup}
          />
          <button type="submit" disabled={!selectedChatGroup || !newMessage.trim()} style={{ padding: "0 20px", backgroundColor: "#389E0D", color: "#fff", border: "none", borderRadius: "6px" }}>Send</button>
        </form>
      </div>

      {isModalOpen && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#fff", padding: "25px", borderRadius: "8px", width: "350px" }}>
            <h3>Add Member</h3>
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} style={{ width: "100%", padding: "10px", margin: "15px 0" }}>
              <option value="">-- Choose Employee --</option>
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button onClick={addChatMember} disabled={!selectedEmployee} style={{ backgroundColor: "#1890ff", color: "#fff" }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations;

// "use client";
// import React, { useEffect, useRef, useState } from "react";

// const Conversations = ({ user }) => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       sender: "Alice (Day Staff)",
//       text: "Client had a good morning. Medication administered at 09:00 AM.",
//       timestamp: "10:00 AM",
//       type: "staff",
//     },
//     {
//       id: 2,
//       sender: "Client (John Doe)",
//       text: "Thank you Alice, feeling much better today.",
//       timestamp: "10:15 AM",
//       type: "client",
//     },
//     {
//       id: 3,
//       sender: "Alice (Day Staff)",
//       text: "HANDOVER NOTE: John complained of slight knee pain at 2:00 PM. Please monitor this evening.",
//       timestamp: "04:00 PM",
//       type: "handover",
//     },
//     {
//       id: 4,
//       sender: "Client (John Doe)",
//       text: "Thank you Alice, feeling much better today.",
//       timestamp: "10:15 AM",
//       type: "client",
//     },

//   ]);

//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = (e, type = "staff") => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const msg = {
//       id: messages.length + 1,
//       sender: `${user?.firstName || "Staff"} (${type === "handover" ? "Handover" : "Current Shift"
//         })`,
//       text: type === "handover" ? `HANDOVER NOTE: ${newMessage}` : newMessage,
//       timestamp: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       type,
//     };

//     setMessages((prev) => [...prev, msg]);
//     setNewMessage("");
//   };

//   const clientName = "John Doe";
//   const initials = clientName
//     .split(" ")
//     .map((s) => s[0])
//     .join("")
//     .slice(0, 2);

//   const loggedInAs = `${user?.firstName || "Staff"} (Support Staff)`;

//   return (
//     <div className="min-h-[calc(100vh-0px)] hero-radial-background w-full bg-[radial-gradient(1200px_600px_at_20%_0%,#f4f1ff_0%,#f7f7fb_40%,#f3f4f6_100%)] p-5">
//       <div className="mx-auto grid h-[82vh] w-full max-w-262.5 grid-cols-1 gap-4 lg:grid-cols-[1.6fr_0.95fr] lg:gap-4.5">

//         {/* LEFT: CHAT */}
//         <section className="flex min-w-0 flex-col overflow-hidden rounded-[18px] border border-black/5 bg-white/50 shadow-[0_18px_45px_rgba(17,24,39,0.08)]">

//           <header className="flex items-center justify-between gap-3 border-b border-black/5 bg-white px-4 py-4">
//             <div className="flex min-w-0 items-center gap-3">
//               <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border border-violet-500/20 bg-[linear-gradient(135deg,#f0eaff_0%,#e7ddff_60%,#f6f3ff_100%)] font-extrabold text-[#3b2b5a]">
//                 {initials}
//               </div>

//               <div className="min-w-0">
//                 <h2 className="truncate text-sm md:text-base font-extrabold text-zinc-900">
//                   Client: {clientName}
//                 </h2>
//                 <div className="mt-1 inline-flex items-center gap-2 text-xs md:text-base font-semibold text-green-600">
//                   <span className="relative inline-flex h-2 w-2">
//                     <span className="absolute inset-0 rounded-full bg-green-500 opacity-25 ring-4 ring-green-500/15" />
//                     <span className="relative h-2 w-2 rounded-full bg-green-500" />
//                   </span>
//                   Active Support Session
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 title="Call"
//                 className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 bg-white shadow-[0_8px_18px_rgba(17,24,39,0.06)] transition hover:-translate-y-0.5 cursor-pointer"
//               >
//                 📞
//               </button>
//               <button
//                 type="button"
//                 title="More"
//                 className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 bg-white shadow-[0_8px_18px_rgba(17,24,39,0.06)] transition hover:-translate-y-0.5 cursor-pointer"
//               >
//                 ⋯
//               </button>
//             </div>
//           </header>

//           {/* BODY */}
//           <div className="flex-1 overflow-y-auto min-h- bg-[radial-gradient(800px_350px_at_20%_10%,rgba(124,58,237,0.08)_0%,rgba(124,58,237,0)_55%),#f6f7fb] px-3.5 py-4">
//             {messages.map((msg) => {
//               const isLeft = msg.type === "client";
//               const isHandover = msg.type === "handover";

//               return (
//                 <div
//                   key={msg.id}
//                   className={[
//                     "mb-3.5 flex max-w-full flex-col",
//                     isLeft ? "items-start" : "items-end",
//                   ].join(" ")}
//                 >
//                   <div className="mx-2 mb-1.5 text-[10px] md:text-[12px] text-zinc-500/90">
//                     {msg.sender} • {msg.timestamp}
//                   </div>

//                   <div
//                     className={[
//                       "max-w-[min(72%,620px)] wrap-break-words rounded-2xl border px-3.5 py-3 text-[12px] md:text-base font-medium leading-[1.45] shadow-[0_10px_22px_rgba(17,24,39,0.08)] cursor-pointer",
//                       isLeft
//                         ? "rounded-tl-lg border-black/5 bg-white text-zinc-900"
//                         : "rounded-tr-lg border-violet-500/25 bg-[#008080] text-white",
//                       isHandover
//                         ? "border-amber-500/35 bg-[#F75D42] text-white shadow-[0_10px_22px_rgba(245,158,11,0.12)]"
//                         : "",
//                     ].join(" ")}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* FOOTER */}
//           <footer className="flex flex-col gap-2.5 border-t border-black/5 bg-white px-3.5 pb-3.5 pt-3">
//             <form
//               onSubmit={(e) => sendMessage(e)}
//               className="flex items-center gap-2.5 rounded-[18px] border border-black/5 bg-[#f6f7fb] p-1 md:p-2.5"
//             >
//               <button
//                 type="button"
//                 title="Emoji"
//                 className="grid h-8.5 w-8.5 place-items-center rounded-xl border border-black/5 bg-white cursor-pointer"
//               >
//                 🙂
//               </button>
//               <input
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type a message…"
//                 className="h-6 md:h-9 min-w-0 flex-1 bg-transparent text-xs md:text-sm text-zinc-900 outline-none  placeholder:text-zinc-400"
//               />

//               <button
//                 type="button"
//                 title="Attach"
//                 className="grid h-8.5 w-8.5 text-black place-items-center rounded-xl border border-black/30 bg-white cursor-pointer"
//               >
//                 📎
//               </button>




//               <button
//                 type="submit"
//                 title="Send"
//                 className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#008080] cursor-pointer text-white shadow-[0_14px_28px_rgba(124,58,237,0.25)]"
//               >
//                 ➤
//               </button>
//             </form>

//             {/* keep your same actions, but styled like the reference */}
//             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//               <button
//                 type="button"
//                 onClick={(e) => sendMessage(e)}
//                 className="rounded-[14px] bg-[#008080] px-3  p-2 md:py-2.5 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(124,58,237,0.22)] cursor-pointer"
//               >
//                 Send to Client
//               </button>

//               <button
//                 type="button"
//                 onClick={(e) => sendMessage(e, "handover")}
//                 className="rounded-[14px] border border-amber-500/35 bg-[#F75D42] px-3 py-2 md:py-2.5 text-sm font-extrabold text-amber-100 shadow-[0_14px_30px_rgba(245,158,11,0.12)] cursor-pointer"
//               >
//                 Post Handover Note 📋
//               </button>
//             </div>
//           </footer>
//         </section>

//         {/* RIGHT: PROFILE PANEL */}
//         <aside className="hidden md:flex min-w-0">
//           <div className="flex w-full flex-col gap-3 rounded-[18px] border border-black/5 bg-white p-4 shadow-[0_18px_45px_rgba(17,24,39,0.08)]">
//             <div className="flex items-center gap-3">
//               <div className="grid h-16 md:h-18 w-16 md:w-18 shrink-0 place-items-center rounded-[18px] border border-violet-500/20 bg-[linear-gradient(135deg,#f0eaff_0%,#e7ddff_60%,#f6f3ff_100%)] font-black text-[#3b2b5a] text-xl md:text-4xl">
//                 {initials}
//               </div>

//               <div className="min-w-0">
//                 <div className="truncate text-sm md:text-lg font-black text-zinc-900">
//                   Client: {clientName}
//                 </div>
//                 <div className="mt-1 text-xs font-bold md:text-base text-green-600">
//                   ● Active Support Session
//                 </div>
//               </div>
//             </div>

//             <div className="h-px w-full bg-black/5" />

//             <div className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-[13px]">
//               <div className="font-bold text-zinc-500/90">Logged in as:</div>
//               <div className="wrap-break-words font-bold text-zinc-900">
//                 {loggedInAs}
//               </div>
//             </div>

//             {/* (optional) small “gallery” blocks to mimic the reference layout without changing your content */}
//             <div className="mt-2 grid grid-cols-3 gap-2">
//               <div className="h-14 rounded-xl bg-zinc-100/80" />
//               <div className="h-14 rounded-xl bg-zinc-100/80" />
//               <div className="h-14 rounded-xl bg-zinc-100/80" />
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default Conversations;