"use client";
import React, { useState, useEffect } from 'react';
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';

const BookingService = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    jobId: '',
    workLocation: '',
    startDate: '',
    endDate: '',
    workDate: '',
    startTime: '',
    endTime: '',
    monday: false, tuesday: false, wednesday: false, thursday: false,
    friday: false, saturday: false, sunday: false
  });

  // 1. Fetch Client List on Load (Reference from client.js)
  useEffect(() => {
    const fetchClients = async () => {
      if (!user?.companyId) return;
      try {
        const response = await authenticatedFetch(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/${encodeURIComponent(user.companyId)}`,
                  {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    // ✅ Removed credentials: "include"
                  }
        );
        if (response.ok) {
          const text = await response.text();
          const data = JSONbig.parse(text);
          setClients(data);
        }
      } catch (err) { console.error("Error fetching clients:", err); }
    };
    fetchClients();
  }, [user]);

  // 2. Fetch Bookings when a Client is selected
  useEffect(() => {
    if (selectedClientId && user?.companyId) {
      fetchUserBookings(selectedClientId);
    }
  }, [selectedClientId, user]);

  const fetchUserBookings = async (clientId) => {
    try {
      // API from ClientBookingScheduleController
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/id/${user.companyId}/${clientId}`
      );
      if (response.ok) {
        const text = await response.text();
        setActiveBookings(JSONbig.parse(text));
      }
    } catch (err) { console.error("Fetch bookings error", err); }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert("Please select a client first");
      return;
    }
    setLoading(true);

    // Logic to select between Single or Recurring controllers
    const endpoint = isRecurring ? 'clientschedulerecurring' : 'clientschedule';
    const selectedClient = clients.find(c => c.clientId.toString() === selectedClientId.toString());

    const payload = isRecurring ? {
      companyId: user.companyId,
      clientId: selectedClientId.toString(),
      jobId: formData.jobId,
      workLocation: formData.workLocation,
      startTime: formData.startTime,
      endTime: formData.endTime,
      startDate: formData.startDate,
      monday: formData.monday, tuesday: formData.tuesday, wednesday: formData.wednesday,
      thursday: formData.thursday, friday: formData.friday, saturday: formData.saturday, sunday: formData.sunday,
      isActive: true
    } : {
      companyId: user.companyId,
      clientId: selectedClientId.toString(),
      jobId: formData.jobId,
      workLocation: formData.workLocation,
      workDate: `${formData.workDate}T00:00:00`,
      startTime: `${formData.workDate}T${formData.startTime}:00`,
      endTime: `${formData.workDate}T${formData.endTime}:00`,
      firstName: selectedClient.firstName,
      lastName: selectedClient.lastName,
      email: selectedClient.email
    };

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/${endpoint}/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        setMessage({ type: 'success', text: 'Booking successfully saved!' });
        fetchUserBookings(selectedClientId);
      } else {
        setMessage({ type: 'error', text: 'Failed to save booking.' });
      }
    } catch (err) { setMessage({ type: 'error', text: 'Connection error.' });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#333' }}>Service Booking</h1>

      {/* CLIENT SELECTION TABLE (Ref: client.js) */}
      <fieldset style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
        <legend style={{ fontWeight: 'bold', padding: '0 10px' }}>Step 1: Select Client</legend>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f4f4f4', position: 'sticky', top: 0 }}>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Client ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr
                  key={client.clientId.toString()}
                  onClick={() => setSelectedClientId(client.clientId.toString())}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedClientId === client.clientId.toString() ? '#e6f7ff' : 'transparent'
                  }}
                >
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{client.firstName} {client.lastName}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{client.clientId.toString()}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', color: client.status === 'Active' ? 'green' : 'red' }}>{client.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </fieldset>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* BOOKING FORM */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Step 2: Create Booking</h3>
          <div style={{ marginBottom: '15px' }}>
            <button onClick={() => setIsRecurring(false)} style={{ padding: '8px 15px', cursor: 'pointer', background: !isRecurring ? '#389E0D' : '#eee', color: !isRecurring ? '#fff' : '#333', border: 'none', borderRadius: '4px 0 0 4px' }}>Single</button>
            <button onClick={() => setIsRecurring(true)} style={{ padding: '8px 15px', cursor: 'pointer', background: isRecurring ? '#389E0D' : '#eee', color: isRecurring ? '#fff' : '#333', border: 'none', borderRadius: '0 4px 4px 0' }}>Recurring</button>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Service Category</label>
            <select name="jobId" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', margin: '8px 0 15px' }}>
              <option value="">-- Choose --</option>
              <option value="NDIS_OT">NDIS OT Session</option>
              <option value="OUTDOOR_ZOO">Outdoor Activity (Zoo)</option>
              <option value="SPEECH_PATH">Speech Pathology</option>
              <option value="MEDICAL_DENTIST">Medical / Dentist</option>
            </select>

            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Location</label>
            <input name="workLocation" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', margin: '8px 0 15px' }} />

            {isRecurring ? (
              <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px' }}>Repeat Every:</p>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <label key={day} style={{ marginRight: '10px', fontSize: '12px', textTransform: 'capitalize' }}>
                    <input type="checkbox" name={day} onChange={handleInputChange} /> {day.slice(0,3)}
                  </label>
                ))}
                <input type="date" name="startDate" onChange={handleInputChange} style={{ width: '100%', marginTop: '10px', padding: '8px' }} />
              </div>
            ) : (
              <input type="date" name="workDate" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginBottom: '15px' }} />
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px' }}>Start</label>
                <input type="time" name="startTime" onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px' }}>End</label>
                <input type="time" name="endTime" onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
              </div>
            </div>

            <button type="submit" disabled={loading || !selectedClientId} style={{ width: '100%', marginTop: '20px', padding: '12px', background: selectedClientId ? '#389E0D' : '#ccc', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? 'Saving...' : 'Confirm Schedule'}
            </button>
          </form>
          {message && <p style={{ color: message.type === 'success' ? 'green' : 'red', fontWeight: 'bold', textAlign: 'center' }}>{message.text}</p>}
        </div>

        {/* SCHEDULE LIST */}
        <div style={{ background: '#f0f2f5', padding: '20px', borderRadius: '12px', border: '1px solid #ddd' }}>
          <h3 style={{ marginTop: 0 }}>Client Schedule</h3>
          {!selectedClientId ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>Please select a client to view their schedule.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeBookings.length === 0 ? <p>No bookings found.</p> : activeBookings.map(b => (
                <div key={b.clientBookingId?.toString()} style={{ background: '#fff', padding: '12px', borderRadius: '8px', borderLeft: '5px solid #389E0D' }}>
                  <div style={{ fontWeight: 'bold' }}>{b.jobId}</div>
                  <div style={{ fontSize: '14px' }}>📅 {b.workDate ? new Date(b.workDate).toLocaleDateString() : 'Recurring'}</div>
                  <div style={{ fontSize: '14px' }}>⏰ {b.startTime} - {b.endTime}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>📍 {b.workLocation}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingService;