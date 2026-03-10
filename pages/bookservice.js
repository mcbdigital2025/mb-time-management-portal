"use client";
import React, { useState, useEffect } from 'react';
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';

const BookingService = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [availableJobs, setAvailableJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingRecordId, setEditingRecordId] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    workLocation: '',
    status: 'SCHEDULED',
    workDate: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    actualStartTime: '',
    actualEndTime: '',
    isPublicHoliday: false,
    clientCancel: false,
    clientReschedule: false,
    employeeCancel: false,
    recurrenceType: 'WEEKLY',
    startDate: '',
    endDate: '',
    defaultStartTime: '',
    defaultEndTime: '',
    acceptPublicHoliday: false,
    skipPublicHoliday: true,
    isActive: true,
    monday: false, tuesday: false, wednesday: false, thursday: false,
    friday: false, saturday: false, sunday: false
  });

  // 1. Initial Data Load
  useEffect(() => {
    if (!user?.companyId) return;
    const initializeData = async () => {
      try {
        const clientRes = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/${user.companyId}`);
        if (clientRes.ok) setClients(JSONbig.parse(await clientRes.text()));

        const empRes = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/${encodeURIComponent(user.companyId)}`);
        if (empRes.ok) setEmployees(JSONbig.parse(await empRes.text()));

        const typeRes = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/jobType/${user.companyId}`);
        if (typeRes.ok) {
          const types = JSONbig.parse(await typeRes.text());
          setJobTypes(types);
          if (types.length > 0) setSelectedJobType(types[0].jobType || types[0].description || "");
        }
      } catch (err) { console.error("Init error", err); }
    };
    initializeData();
  }, [user]);

  // 2. Fetch History when Client is selected (Fixed to use POST as requested)
  useEffect(() => {
    if (selectedClientId && user?.companyId) {
      fetchHistory();
    }
  }, [selectedClientId, user]);

  const fetchHistory = async () => {
    try {
      const res = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/clientid/${user.companyId}/${selectedClientId}`,
      );
      if (res.ok) {
        setActiveBookings(JSONbig.parse(await res.text()));
      }
    } catch (err) { console.error("History fetch error", err); }
  };

  // 3. Fetch Jobs by Type
  useEffect(() => {
    if (selectedJobType && user?.companyId) {
      const fetchJobsByType = async () => {
        try {
          const res = await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/job/type/${encodeURIComponent(selectedJobType)}/${user.companyId}`
          );
          if (res.ok) {
            setAvailableJobs(JSONbig.parse(await res.text()));
          }
        } catch (err) { console.error("Jobs fetch error", err); }
      };
      fetchJobsByType();
    }
  }, [selectedJobType, user]);

  const handleEdit = (booking) => {
    setEditingRecordId(booking.clientBookingId || booking.recurringId);
    setIsRecurring(!!booking.recurrenceType);

    setFormData({
      ...formData,
      ...booking,
      employeeId: booking.employeeId?.toString() || '',
    });
    setSelectedEmpId(booking.employeeId?.toString());

    const job = availableJobs.find(j => j.jobId.toString() === booking.jobId.toString());
    if (job) setSelectedJob(job);
  };

  const resetForm = () => {
    setEditingRecordId(null);
    setFormData(prev => ({
      ...prev,
      workDate: '',
      scheduledStartTime: '',
      scheduledEndTime: '',
      actualStartTime: '',
      actualEndTime: ''
    }));
  };

  const handleSave = async (isUpdateAction) => {
    if (!selectedClientId || (!selectedJob && !editingRecordId)) return;
    setLoading(true);

    try {
      const endpoint = isRecurring
        ? `clientschedulerecurring/${isUpdateAction ? 'update' : 'create'}`
        : `clientschedule/${isUpdateAction ? 'update' : 'create'}`;

      const payload = isRecurring ? {
        recurringId: editingRecordId,
        companyId: user.companyId,
        clientId: selectedClientId,
        employeeId: formData.employeeId,
        jobId: selectedJob?.jobId?.toString() || formData.jobId,
        recurrenceType: formData.recurrenceType,
        monday: formData.monday, tuesday: formData.tuesday, wednesday: formData.wednesday,
        thursday: formData.thursday, friday: formData.friday, saturday: formData.saturday, sunday: formData.sunday,
        defaultStartTime: formData.defaultStartTime,
        defaultEndTime: formData.defaultEndTime,
        workLocation: formData.workLocation,
        startDate: formData.startDate,
        endDate: formData.endDate,
        acceptPublicHoliday: formData.acceptPublicHoliday,
        skipPublicHoliday: formData.skipPublicHoliday,
        isActive: formData.isActive
      } : {
        clientBookingId: editingRecordId || 0,
        companyId: user.companyId,
        clientId: selectedClientId,
        employeeId: formData.employeeId,
        jobId: selectedJob?.jobId?.toString() || formData.jobId,
        bookingType: 'ONE_TIME',
        workDate: formData.workDate,
        scheduledStartTime: formData.scheduledStartTime,
        scheduledEndTime: formData.scheduledEndTime,
        actualStartTime: formData.actualStartTime,
        actualEndTime: formData.actualEndTime,
        workLocation: formData.workLocation,
        isPublicHoliday: formData.isPublicHoliday,
        clientCancel: formData.clientCancel,
        clientReschedule: formData.clientReschedule,
        employeeCancel: formData.employeeCancel,
        status: formData.status
      };

      const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/${endpoint}`, {
        method: isUpdateAction ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSONbig.stringify(payload)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Successfully ${isUpdateAction ? 'updated' : 'created'}!` });
        fetchHistory();
        if (!isUpdateAction) resetForm();
      } else {
        setMessage({ type: 'error', text: 'Save failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error.' });
    } finally { setLoading(false); }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div style={{ maxWidth: '1450px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #389E0D', paddingBottom: '10px' }}>Client Service Booking</h2>

      {message && (
        <div style={{ padding: '10px', marginBottom: '10px', borderRadius: '4px', background: message.type === 'success' ? '#f6ffed' : '#fff1f0', border: `1px solid ${message.type === 'success' ? '#b7eb8f' : '#ffa39e'}` }}>
          {message.text}
        </div>
      )}

      {/* STEP 1: Selection Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <strong>Step 1a: Select a Client</strong>
          <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr><th style={{ textAlign: 'left', padding: '8px' }}>Name</th><th style={{ textAlign: 'left', padding: '8px' }}>ID</th></tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.clientId.toString()} onClick={() => setSelectedClientId(c.clientId.toString())}
                      style={{ cursor: 'pointer', background: selectedClientId === c.clientId.toString() ? '#e6f7ff' : '' }}>
                    <td style={{ padding: '8px', border: '1px solid #eee' }}>{c.firstName} {c.lastName}</td>
                    <td style={{ padding: '8px', border: '1px solid #eee' }}>{c.clientId.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <strong>Step 1b: Select an Employee</strong>
          <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr><th style={{ textAlign: 'left', padding: '8px' }}>Name</th><th style={{ textAlign: 'left', padding: '8px' }}>ID</th></tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.employeeId.toString()} onClick={() => {
                      setSelectedEmpId(emp.employeeId.toString());
                      setFormData(prev => ({ ...prev, employeeId: emp.employeeId.toString() }));
                    }}
                    style={{ cursor: 'pointer', background: selectedEmpId === emp.employeeId.toString() ? '#e6f7ff' : '' }}>
                    <td style={{ padding: '8px', border: '1px solid #eee' }}>{emp.firstName} {emp.lastName}</td>
                    <td style={{ padding: '8px', border: '1px solid #eee' }}>{emp.employeeId.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* STEP 2 & 3: Jobs, Form, and History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '20px' }}>

        {/* JOB SELECTION */}
        <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <strong>Step 2: Service Type & Job</strong>
          <select value={selectedJobType} onChange={(e) => setSelectedJobType(e.target.value)} style={{ width: '100%', padding: '8px', margin: '10px 0' }}>
            {jobTypes.map((jt, idx) => (
              <option key={jt?.jobId?.toString() || idx} value={jt.jobType}>{jt.jobType}</option>
            ))}
          </select>
          <div style={{ height: '550px', overflowY: 'auto' }}>
            {availableJobs.map(j => (
              <div key={j.jobId.toString()} onClick={() => setSelectedJob(j)}
                   style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer', background: selectedJob?.jobId === j.jobId ? '#f6ffed' : '' }}>
                <strong>{j.jobCode}</strong><br/><small>{j.jobType}</small>
              </div>
            ))}
          </div>
        </div>

        {/* BOOKING FORM */}
        <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button onClick={() => setIsRecurring(false)} style={{ flex: 1, padding: '10px', background: !isRecurring ? '#389E0D' : '#eee', color: !isRecurring ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>Single Booking</button>
            <button onClick={() => setIsRecurring(true)} style={{ flex: 1, padding: '10px', background: isRecurring ? '#389E0D' : '#eee', color: isRecurring ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>Recurring Booking</button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <label>Employee ID: <input name="employeeId" value={formData.employeeId} readOnly style={{ width: '100%', background: '#f5f5f5', border: '1px solid #ccc', padding: '5px' }} /></label>
              <label>Status:
                <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '5px' }}>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </label>
            </div>

            <label>Work Location: <input name="workLocation" value={formData.workLocation} onChange={handleInputChange} required style={{ width: '100%', padding: '5px' }} /></label>

            {!isRecurring ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px', background: '#f9f9f9' }}>
                  <label>Work Date: <input type="date" name="workDate" value={formData.workDate} onChange={handleInputChange} style={{ width: '100%' }} /></label>
                  <label style={{ marginTop: '25px' }}><input type="checkbox" name="isPublicHoliday" checked={formData.isPublicHoliday} onChange={handleInputChange} /> Public Holiday</label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label>Sched. Start: <input type="time" name="scheduledStartTime" value={formData.scheduledStartTime} onChange={handleInputChange} style={{ width: '100%' }} /></label>
                  <label>Sched. End: <input type="time" name="scheduledEndTime" value={formData.scheduledEndTime} onChange={handleInputChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label>Actual Start: <input type="time" name="actualStartTime" value={formData.actualStartTime} onChange={handleInputChange} style={{ width: '100%' }} /></label>
                  <label>Actual End: <input type="time" name="actualEndTime" value={formData.actualEndTime} onChange={handleInputChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
                  <label><input type="checkbox" name="clientCancel" checked={formData.clientCancel} onChange={handleInputChange} /> Client Cancel</label>
                  <label><input type="checkbox" name="clientReschedule" checked={formData.clientReschedule} onChange={handleInputChange} /> Client Resched</label>
                  <label><input type="checkbox" name="employeeCancel" checked={formData.employeeCancel} onChange={handleInputChange} /> Emp Cancel</label>
                </div>
              </>
            ) : (
              <>
                <div style={{ background: '#f0f7ff', padding: '10px', borderRadius: '4px' }}>
                  <strong>Weekly Pattern:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '10px 0' }}>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(d => (
                      <label key={d} style={{ textTransform: 'capitalize' }}><input type="checkbox" name={d} checked={formData[d]} onChange={handleInputChange} /> {d.slice(0,3)}</label>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label>Start Date: <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} style={{ width: '100%' }} /></label>
                  <label>End Date: <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label>Default Start: <input type="time" name="defaultStartTime" value={formData.defaultStartTime} onChange={handleInputChange} style={{ width: '100%' }} /></label>
                  <label>Default End: <input type="time" name="defaultEndTime" value={formData.defaultEndTime} onChange={handleInputChange} style={{ width: '100%' }} /></label>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <label><input type="checkbox" name="acceptPublicHoliday" checked={formData.acceptPublicHoliday} onChange={handleInputChange} /> Accept PH</label>
                  <label><input type="checkbox" name="skipPublicHoliday" checked={formData.skipPublicHoliday} onChange={handleInputChange} /> Skip PH</label>
                  <label><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} /> Active</label>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={loading || !!editingRecordId}
                style={{ flex: 1, padding: '15px', background: editingRecordId ? '#ccc' : '#389E0D', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: editingRecordId ? 'not-allowed' : 'pointer' }}>
                Create
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={loading || !editingRecordId}
                style={{ flex: 1, padding: '15px', background: !editingRecordId ? '#ccc' : '#1890ff', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: !editingRecordId ? 'not-allowed' : 'pointer' }}>
                Update
              </button>
            </div>
            {editingRecordId && <button onClick={resetForm} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', textDecoration: 'underline' }}>Clear Selection / Create New</button>}
          </form>
        </div>

        {/* SCHEDULE HISTORY TABLE */}
        <div style={{ background: '#f0f2f5', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', maxHeight: '700px', overflowY: 'auto' }}>
          <strong style={{ display: 'block', marginBottom: '10px' }}>Client Schedule History</strong>
          <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead style={{ background: '#f4f4f4', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd' }}>Work Date</th>
                  <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd' }}>Job ID</th>
                  <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeBookings.length === 0 ? (
                  <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No records found.</td></tr>
                ) : (
                  activeBookings.map((b, idx) => {
                    const isSelected = editingRecordId === (b.clientBookingId || b.recurringId);
                    return (
                      <tr key={idx} onClick={() => handleEdit(b)}
                        style={{ cursor: 'pointer', backgroundColor: isSelected ? '#e6f7ff' : 'transparent', borderBottom: '1px solid #eee' }}
                      >
                        <td style={{ padding: '10px' }}>{b.workDate || `Recurring (${b.recurrenceType})`}</td>
                        <td style={{ padding: '10px' }}>{b.jobId?.toString()}</td>
                        <td style={{ padding: '10px' }}>
                           <span style={{
                            padding: '2px 6px', borderRadius: '10px', fontSize: '11px',
                            background: b.status === 'COMPLETED' ? '#f6ffed' : '#fff7e6',
                            color: b.status === 'COMPLETED' ? '#389e0d' : '#d46b08',
                            border: `1px solid ${b.status === 'COMPLETED' ? '#b7eb8f' : '#ffd591'}`
                          }}>{b.status || (b.isActive ? 'ACTIVE' : 'INACTIVE')}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingService;