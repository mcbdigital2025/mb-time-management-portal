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