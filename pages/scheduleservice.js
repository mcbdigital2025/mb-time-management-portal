"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import JSONbig from "json-bigint";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays
} from 'date-fns';
import { authenticatedFetch } from '../utils/api'; // Correct import path based on source
import { toast } from 'react-toastify';

const ScheduleService = ({ user }) => {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initial Data Load
  useEffect(() => {
    if (!user?.companyId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const companyId = user.companyId.toString();

        const [schedRes, facRes] = await Promise.all([
          authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/${companyId}`),
          authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/facilities/${companyId}`)
        ]);

        if (schedRes.ok) {
          const data = JSONbig.parse(await schedRes.text());
          setSchedules(Array.isArray(data) ? data : []);
        }

        if (facRes.ok) {
          const data = JSONbig.parse(await facRes.text());
          setFacilities(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load schedule data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Helper to find facility name by ID
  const getFacilityName = (id) => {
    const fac = facilities.find(f => f.facilitiesId === id);
    return fac ? fac.facilitiesName : `Facility ${id}`;
  };

  // Status-based color mapping
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED': return '#e6f7ff';
      case 'COMPLETED': return '#f6ffed';
      case 'CANCELLED': return '#fff1f0';
      default: return '#fafafa';
    }
  };

  const handleDoubleClick = (bookingId) => {
    router.push(`/bookservice?id=${bookingId}`);
  };

  // --- Calendar Render Logic ---
  const renderHeader = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h2 style={{ margin: 0 }}>{format(currentMonth, 'MMMM yyyy')}</h2>
      <div>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={btnStyle}>Prev</button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={btnStyle}>Next</button>
      </div>
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const dayBookings = schedules.filter(s => s.workDate === formattedDate);

        days.push(
          <div key={day.toString()} style={{
            minHeight: '120px', border: '1px solid #eee', padding: '5px',
            background: !isSameMonth(day, monthStart) ? '#f9f9f9' : '#fff'
          }}>
            <div style={{ fontSize: '12px', fontWeight: isSameDay(day, new Date()) ? 'bold' : 'normal', color: isSameDay(day, new Date()) ? '#389E0D' : '#333' }}>
              {format(day, 'd')}
            </div>
            {dayBookings.map(b => (
              <div
                key={b.clientBookingId.toString()}
                onDoubleClick={() => handleDoubleClick(b.clientBookingId)}
                style={{
                  fontSize: '10px', padding: '4px', margin: '2px 0', borderRadius: '4px',
                  background: getStatusColor(b.status), border: '1px solid #ddd', cursor: 'pointer'
                }}
              >
                <strong>{getFacilityName(b.facilitiesId)}</strong><br/>
                {b.scheduledStartTime} - {b.scheduledEndTime}<br/>
                <span style={{ fontSize: '9px', fontStyle: 'italic' }}>{b.status}</span>
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>{days}</div>);
      days = [];
    }
    return <div>{rows}</div>;
  };

  if (loading) return <div>Loading Schedules...</div>;

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #ddd' }}>
      {renderHeader()}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'bold', background: '#f0f2f5', padding: '10px 0' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      {renderCells()}
    </div>
  );
};

const btnStyle = { padding: '5px 15px', marginLeft: '10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ddd', background: '#fff' };

export default ScheduleService;