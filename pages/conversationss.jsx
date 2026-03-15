"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';

const Conversations = ({ user: initialUser }) => {
  // --- HYDRATION CONTROL ---
  const [hasMounted, setHasMounted] = useState(false);
  const [userData, setUserData] = useState(null);

  // --- CHAT STATE ---
  const [chatGroups, setChatGroups] = useState([]);
  const [selectedChatGroup, setSelectedChatGroup] = useState(null);
  const [chatMembers, setChatMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [error, setError] = useState(null);

  // --- MODAL & UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const messagesEndRef = useRef(null);
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const POLLING_INTERVAL = Number(process.env.NEXT_PUBLIC_CHAT_POLLING_INTERVAL) || 10000;

  // --- INITIAL MOUNT & AUTH CHECK ---
  useEffect(() => {
    setHasMounted(true);
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.jwtToken || !storedUser.companyId) {
      router.replace("/login");
      return;
    }

    setUserData(storedUser);
    loadChatGroups(storedUser);
    fetchEmployees(storedUser);
  }, [router]);

  // --- POLLING LOGIC ---
  useEffect(() => {
    let intervalId;
    if (selectedChatGroup) {
      loadMessages(selectedChatGroup);
      intervalId = setInterval(() => loadMessages(selectedChatGroup), POLLING_INTERVAL);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [selectedChatGroup]);

  // --- AUTO-SCROLL ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- API ACTIONS ---
  const fetchEmployees = async (user) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/mcbtt/api/timesheet/employee/company/${user.companyId}`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error("Employee fetch failed", err); }
  };

  const loadChatGroups = async (user) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/mcbtt/api/timesheet/chat/company/${user.companyId}/${user.employeeId}`);
      const text = await response.text();
      const data = text ? JSONbig.parse(text) : [];
      setChatGroups(Array.isArray(data) ? data : []);
    } catch (err) { setError(err.message); }
  };

  const loadChatMembers = async (chatGroupId) => {
    if (!chatGroupId) return;
    try {
      const response = await authenticatedFetch(`${API_BASE}/mcbtt/api/timesheet/chat/chatMember/${userData.companyId}/${chatGroupId}`);
      const text = await response.text();
      const data = text ? JSONbig.parse(text) : [];
      setChatMembers(Array.isArray(data) ? data.map(m => m.employeeId || m) : []);
    } catch (err) { console.error("Member load failed", err); }
  };

  const loadMessages = async (chatGroupId) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/mcbtt/api/timesheet/chat/message/${chatGroupId}`);
      if (!response.ok) return;
      const text = await response.text();
      const data = text ? JSONbig.parse(text) : [];

      const formatted = data.map((msg) => ({
        id: msg.chatMessageId?.toString() || Math.random().toString(),
        sender: msg.senderEmployeeId?.toString(),
        text: msg.messageText,
        timestamp: new Date(msg.messageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: msg.senderEmployeeId?.toString() === userData.employeeId?.toString() ? "staff" : "client"
      }));

      setMessages(prev => (prev.length !== formatted.length ? formatted : prev));
    } catch (err) { console.error("Polling error", err); }
  };

  const createChatGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const payload = {
      companyId: userData.companyId,
      chatGroupName: newGroupName,
      createdByEmployeeId: userData.employeeId?.toString(),
      createdDate: new Date().toISOString(),
    };

    try {
      const res = await authenticatedFetch(`${API_BASE}/mcbtt/api/timesheet/chat/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNewGroupName("");
        loadChatGroups(userData);
      }
    } catch (err) { console.error("Create group failed", err); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatGroup) return;

    const payload = {
      chatGroupId: selectedChatGroup,
      companyId: userData.companyId,
      senderEmployeeId: userData.employeeId,
      messageText: newMessage
    };

    try {
      const res = await authenticatedFetch(`${API_BASE}/mcbtt/api/timesheet/chat/message/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNewMessage("");
        loadMessages(selectedChatGroup);
      }
    } catch (err) { console.error("Send failed", err); }
  };

  if (!hasMounted) return null;

  const loggedInAsName = userData?.firstName ? `${userData.firstName} (Support Staff)` : "Staff Member";

  return (
    <div style={{ width: "100%", maxWidth: "900px", height: "85vh", display: "flex", flexDirection: "column", backgroundColor: "#fff", border: "1px solid #d9d9d9", borderRadius: "12px", margin: "10px auto", overflow: "hidden", position: "relative" }}>

      {/* HEADER: CREATE GROUP */}
      <div style={{ padding: "15px 20px", borderBottom: "1px solid #eee", display: "flex", gap: "10px" }}>
        <form onSubmit={createChatGroup} style={{ flex: 1, display: "flex", gap: "10px" }}>
          <input
            style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
            placeholder="New group name..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          {/* FIX: Button is disabled if newGroupName is empty or whitespace */}
          <button
            type="submit"
            disabled={!newGroupName.trim()}
            style={{
              padding: "10px 20px",
              backgroundColor: newGroupName.trim() ? "#1890ff" : "#d9d9d9",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: newGroupName.trim() ? "pointer" : "not-allowed"
            }}
          >
            Create
          </button>
        </form>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedChatGroup}
          style={{ padding: "10px 15px", backgroundColor: "#52c41a", color: "#fff", border: "none", borderRadius: "6px", cursor: selectedChatGroup ? "pointer" : "not-allowed", opacity: selectedChatGroup ? 1 : 0.6 }}
        >
          + Add Member
        </button>
      </div>

      {/* SUB-HEADER: SELECT GROUP */}
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
          {chatGroups.map((g) => (
            <option key={g.chatGroupId?.toString()} value={g.chatGroupId?.toString()}>
              {g.chatGroupName}
            </option>
          ))}
        </select>
        <div style={{ display: "flex", gap: "10px", fontSize: "13px" }}>
          <label style={{ fontWeight: "600", color: "#555" }}>Members:</label>
          <span style={{ color: "#1890ff" }}>{chatMembers.length > 0 ? chatMembers.join(", ") : "None"}</span>
        </div>
      </div>

      {/* MESSAGES BODY */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#f0f2f5" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: "15px", display: "flex", flexDirection: "column", alignItems: msg.type === "staff" ? "flex-end" : "flex-start" }}>
            <span style={{ fontSize: "11px", color: "#8c8c8c" }}>{msg.type === "staff" ? "You" : `Member ${msg.sender}`} • {msg.timestamp}</span>
            <div style={{ padding: "12px", borderRadius: "12px", backgroundColor: msg.type === "staff" ? "#389E0D" : "#fff", color: msg.type === "staff" ? "#fff" : "#000", marginTop: "4px", maxWidth: "80%" }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER: LOGGED IN AS & SEND */}
      <div style={{ padding: "20px", borderTop: "1px solid #eee" }}>
        <div style={{ marginBottom: "10px", fontSize: "13px" }}>
          <span style={{ color: "#8c8c8c" }}>Logged in as: </span>
          <span style={{ fontWeight: "bold", color: "#262626" }}>
            {hasMounted ? loggedInAsName : ""}
          </span>
        </div>
        <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
          <input
            style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #ddd" }}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={selectedChatGroup ? "Type a message..." : "Select a group first"}
            disabled={!selectedChatGroup}
          />
          <button type="submit" disabled={!selectedChatGroup || !newMessage.trim()} style={{ padding: "0 20px", backgroundColor: "#389E0D", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Send</button>
        </form>
      </div>

      {/* MODAL: ADD MEMBER */}
      {isModalOpen && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#fff", padding: "25px", borderRadius: "8px", width: "350px" }}>
            <h3 style={{ marginTop: 0 }}>Add Member</h3>
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} style={{ width: "100%", padding: "10px", margin: "15px 0" }}>
              <option value="">-- Choose Employee --</option>
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: "8px 15px", borderRadius: "4px", border: "1px solid #ddd", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => {/* Add Member API call */}} disabled={!selectedEmployee} style={{ padding: "8px 15px", borderRadius: "4px", border: "none", backgroundColor: "#1890ff", color: "#fff", cursor: "pointer" }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations;