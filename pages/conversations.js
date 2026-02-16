"use client";
import React, { useState, useEffect, useRef } from 'react';

const Conversations = ({ user }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice (Day Staff)", text: "Client had a good morning. Medication administered at 09:00 AM.", timestamp: "10:00 AM", type: "staff" },
    { id: 2, sender: "Client (John Doe)", text: "Thank you Alice, feeling much better today.", timestamp: "10:15 AM", type: "client" },
    { id: 3, sender: "Alice (Day Staff)", text: "HANDOVER NOTE: John complained of slight knee pain at 2:00 PM. Please monitor this evening.", timestamp: "04:00 PM", type: "handover" },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e, type = "staff") => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: messages.length + 1,
      sender: `${user?.firstName || "Staff"} (${type === 'handover' ? 'Handover' : 'Current Shift'})`,
      text: type === 'handover' ? `HANDOVER NOTE: ${newMessage}` : newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: type
    };

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', height: '80vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>

      {/* --- CHAT HEADER --- */}
      <div style={{ padding: '20px', borderBottom: '1px solid #eee', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Client: John Doe</h2>
          <span style={{ fontSize: '12px', color: '#16a34a' }}>● Active Support Session</span>
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#666' }}>
          <strong>Logged in as:</strong> {user?.firstName} (Support Staff)
        </div>
      </div>

      {/* --- MESSAGE AREA --- */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f3f4f6' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            marginBottom: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.type === 'client' ? 'flex-start' : 'flex-end'
          }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', marginHorizontal: '10px' }}>
              {msg.sender} • {msg.timestamp}
            </div>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              lineHeight: '1.5',
              backgroundColor: msg.type === 'handover' ? '#fef3c7' : (msg.type === 'client' ? '#fff' : '#389E0D'),
              color: msg.type === 'client' || msg.type === 'handover' ? '#1f2937' : '#fff',
              border: msg.type === 'handover' ? '1px solid #f59e0b' : 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div style={{ padding: '20px', borderTop: '1px solid #eee', backgroundColor: '#fff' }}>
        <form onSubmit={(e) => sendMessage(e)}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message to the client or a handover note..."
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '10px', resize: 'none', height: '80px', fontFamily: 'inherit' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{ flex: 1, padding: '10px', backgroundColor: '#389E0D', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Send to Client
            </button>
            <button
              type="button"
              onClick={(e) => sendMessage(e, "handover")}
              style={{ flex: 1, padding: '10px', backgroundColor: '#fff7e6', color: '#d46b08', border: '1px solid #ffd591', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Post Handover Note 📋
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Conversations;