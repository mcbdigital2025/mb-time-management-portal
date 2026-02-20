"use client";
import React, { useState, useEffect } from 'react';
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';

const BookingService = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [availableJobs, setAvailableJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    workLocation: '',
    startDate: '',
    workDate: '',
    startTime: '',
    endTime: '',
    monday: false, tuesday: false, wednesday: false, thursday: false,
    friday: false, saturday: false, sunday: false
  });

  useEffect(() => {
    if (!user?.companyId) return;
    const initializeData = async () => {
      try {
        const clientRes = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/${user.companyId}`);
        if (clientRes.ok) setClients(JSONbig.parse(await clientRes.text()));

        const typeRes = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/jobType/${user.companyId}`);
        if (typeRes.ok) {
          const types = JSONbig.parse(await typeRes.text());
          setJobTypes(types);
          if (types.length > 0) setSelectedJobType(types[0].jobType);
        }
      } catch (err) { console.error("Initialization error", err); }
    };
    initializeData();
  }, [user]);

  useEffect(() => {
    if (selectedJobType && user?.companyId) {
      const fetchJobsByType = async () => {
        try {
          const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/job/type/${selectedJobType}/${user.companyId}`);
          if (res.ok) setAvailableJobs(JSONbig.parse(await res.text()));
          else setAvailableJobs([]);
          setSelectedJob(null);
        } catch (err) { console.error("Error fetching jobs", err); }
      };
      fetchJobsByType();
    }
  }, [selectedJobType, user]);

  useEffect(() => {
    if (selectedClientId && user?.companyId) fetchUserBookings(selectedClientId);
  }, [selectedClientId, user]);

  const fetchUserBookings = async (clientId) => {
    try {
      const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/id/${user.companyId}/${clientId}`);
      if (res.ok) setActiveBookings(JSONbig.parse(await res.text()));
    } catch (err) { console.error("Fetch bookings error", err); }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClientId || !selectedJob) return;
    setLoading(true);
    const endpoint = isRecurring ? 'clientschedulerecurring' : 'clientschedule';
    const client = clients.find(c => c.clientId.toString() === selectedClientId);

    const payload = isRecurring ? {
      companyId: user.companyId,
      clientId: selectedClientId,
      jobId: selectedJob.jobId.toString(),
      workLocation: formData.workLocation,
      startTime: formData.startTime,
      endTime: formData.endTime,
      startDate: formData.startDate,
      monday: formData.monday, tuesday: formData.tuesday, wednesday: formData.wednesday,
      thursday: formData.thursday, friday: formData.friday, saturday: formData.saturday, sunday: formData.sunday,
      isActive: true
    } : {
      companyId: user.companyId,
      clientId: selectedClientId,
      jobId: selectedJob.jobId.toString(),
      workLocation: formData.workLocation,
      workDate: `${formData.workDate}T00:00:00`,
      startTime: `${formData.workDate}T${formData.startTime}:00`,
      endTime: `${formData.workDate}T${formData.endTime}:00`,
      firstName: client.firstName,
      lastName: client.lastName
    };

    try {
      const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/${endpoint}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSONbig.stringify(payload)
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Booking Created!' });
        fetchUserBookings(selectedClientId);
      } else {
        setMessage({ type: 'error', text: 'Failed to create booking.' });
      }
    } catch (err) { setMessage({ type: 'error', text: 'Network Error.' }); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <h2 style={{ borderBottom: '2px solid #389E0D', paddingBottom: '10px' }}>Client Service Booking</h2>

      {/* Row 1: Client Selection Table (Full Width) */}
      <div style={{ marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <strong style={{ fontSize: '16px' }}>Step 1: Select a Client</strong>
        <div style={{ maxHeight: '180px', overflowY: 'auto', marginTop: '10px', border: '1px solid #eee' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f4f4f4', position: 'sticky', top: 0 }}>
              <tr><th style={{ padding: '10px', textAlign: 'left' }}>Client Name</th><th style={{ padding: '10px', textAlign: 'left' }}>Client ID</th></tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.clientId.toString()}
                    onClick={() => setSelectedClientId(c.clientId.toString())}
                    style={{ cursor: 'pointer', borderBottom: '1px solid #eee', background: selectedClientId === c.clientId.toString() ? '#e6f7ff' : '' }}>
                  <td style={{ padding: '10px' }}>{c.firstName} {c.lastName}</td>
                  <td style={{ padding: '10px' }}>{c.clientId.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 2: Grid Layout for Job Selection, Booking Form, and Schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Column 1: Job Selection (Bigger view) */}
        <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', height: '600px' }}>
          <strong style={{ display: 'block', marginBottom: '10px' }}>Step 2: Service Type & Job List</strong>
          <label style={{ fontSize: '12px', color: '#666' }}>Filter by Category:</label>
          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '5px 0 15px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {jobTypes.map((jt, idx) => (
              <option key={jt.jobId?.toString() || idx} value={jt.jobType}>{jt.jobType}</option>
            ))}
          </select>

          <div style={{ height: '420px', overflowY: 'auto', border: '1px solid #eee' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f4f4f4', position: 'sticky', top: 0 }}>
                <tr><th style={{ padding: '8px', textAlign: 'left' }}>Job Code</th><th style={{ padding: '8px', textAlign: 'left' }}>Description</th></tr>
              </thead>
              <tbody>
                {availableJobs.map(j => (
                  <tr key={j.jobId.toString()}
                      onClick={() => setSelectedJob(j)}
                      style={{ cursor: 'pointer', borderBottom: '1px solid #eee', background: selectedJob?.jobId === j.jobId ? '#f6ffed' : '' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{j.jobCode}</td>
                    <td style={{ padding: '8px' }}>{j.jobType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 2: Booking Form (Always visible fields) */}
        <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', minHeight: '600px', opacity: selectedJob ? 1 : 0.6 }}>
          <strong style={{ display: 'block', marginBottom: '15px' }}>Step 3: Create Booking</strong>
          {!selectedJob && <p style={{ fontSize: '12px', color: 'orange' }}>⚠️ Select a Job from the list to enable fields.</p>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <button type="button" onClick={() => setIsRecurring(false)} style={{ width: '50%', padding: '10px', background: !isRecurring ? '#389E0D' : '#eee', color: !isRecurring ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '4px 0 0 4px', cursor: 'pointer' }}>Single</button>
              <button type="button" onClick={() => setIsRecurring(true)} style={{ width: '50%', padding: '10px', background: isRecurring ? '#389E0D' : '#eee', color: isRecurring ? '#fff' : '#333', border: '1px solid #ccc', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>Recurring</button>
            </div>

            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Work Location</label>
            <input name="workLocation" disabled={!selectedJob} placeholder="e.g. Sydney Zoo" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', margin: '5px 0 15px', borderRadius: '4px', border: '1px solid #ccc' }} />

            {isRecurring ? (
              <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>Days of Week:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(d => (
                    <label key={d} style={{ fontSize: '12px', textTransform: 'capitalize' }}>
                      <input type="checkbox" name={d} disabled={!selectedJob} onChange={handleInputChange} /> {d.slice(0,3)}
                    </label>
                  ))}
                </div>
                <label style={{ display: 'block', marginTop: '10px', fontSize: '12px' }}>Start Date</label>
                <input type="date" name="startDate" disabled={!selectedJob} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
              </div>
            ) : (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Service Date</label>
                <input type="date" name="workDate" disabled={!selectedJob} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px' }}>Start Time</label>
                <input type="time" name="startTime" disabled={!selectedJob} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px' }}>End Time</label>
                <input type="time" name="endTime" disabled={!selectedJob} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
            </div>

            <button type="submit" disabled={loading || !selectedJob || !selectedClientId}
                    style={{ width: '100%', padding: '15px', background: (selectedJob && selectedClientId) ? '#389E0D' : '#ccc', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? 'Submitting...' : 'Confirm Schedule'}
            </button>
          </form>
          {message && <div style={{ marginTop: '15px', padding: '10px', borderRadius: '4px', background: message.type === 'success' ? '#f6ffed' : '#fff2f0', color: message.type === 'success' ? '#389e0d' : '#cf1322', border: '1px solid' }}>{message.text}</div>}
        </div>

        {/* Column 3: Schedule List */}
        <div style={{ background: '#f0f2f5', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', height: '600px', overflowY: 'auto' }}>
          <strong style={{ display: 'block', marginBottom: '15px' }}>Client Schedule History</strong>
          {!selectedClientId ? <p style={{ fontSize: '13px', color: '#999' }}>Select a client to view bookings.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeBookings.length === 0 ? <p style={{ fontSize: '12px' }}>No bookings found.</p> : activeBookings.map(b => (
                <div key={b.clientBookingId?.toString()} style={{ background: '#fff', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #389E0D', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{b.jobId}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>📅 {b.workDate ? new Date(b.workDate).toLocaleDateString() : 'Weekly Recurring'}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>⏰ {b.startTime} - {b.endTime}</div>
                  <div style={{ fontSize: '11px', marginTop: '4px' }}>📍 {b.workLocation}</div>
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