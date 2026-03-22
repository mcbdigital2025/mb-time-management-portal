"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import JSONbig from "json-bigint";
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays
} from 'date-fns';
import { authenticatedFetch } from '../utils/api';
import { toast } from 'react-toastify';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react'; // Optional: for icons
import ViewEmployeesSkeleton from '../components/loaders/ViewEmployeesSkeleton';

const ScheduleService = ({ user }) => {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Zoom State ---
  // 1 = Normal, 0.7 = Zoom Out, 1.5 = Zoom In
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const getFacilityName = (id) => {
    const fac = facilities.find(f => f.facilitiesId === id);
    return fac ? fac.facilitiesName : `Facility ${id}`;
  };

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

  // --- Zoom Handlers ---
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  const resetZoom = () => setZoomLevel(1);

  const renderHeader = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h2 style={{ margin: 0 }}>{format(currentMonth, 'MMMM yyyy')}</h2>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* Zoom Controls */}
        <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '4px', background: '#f9f9f9', padding: '2px', marginRight: '20px' }}>
          <button onClick={handleZoomOut} title="Zoom Out" style={zoomBtnStyle}>-</button>
          <span style={{ padding: '0 10px', fontSize: '12px', lineHeight: '28px', minWidth: '45px', textAlign: 'center' }}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button onClick={handleZoomIn} title="Zoom In" style={zoomBtnStyle}>+</button>
          <button onClick={resetZoom} title="Reset" style={{...zoomBtnStyle, marginLeft: '2px'}}>⟲</button>
        </div>

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

    // Dynamic styles based on Zoom level
    const cellMinHeight = 120 * zoomLevel;
    const dateFontSize = 12 * zoomLevel;
    const bookingFontSize = 10 * zoomLevel;
    const statusFontSize = 9 * zoomLevel;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const dayBookings = schedules.filter(s => s.workDate === formattedDate);

        days.push(
          <div key={day.toString()} style={{
            minHeight: `${cellMinHeight}px`,
            border: '1px solid #eee',
            padding: `${5 * zoomLevel}px`,
            background: !isSameMonth(day, monthStart) ? '#f9f9f9' : '#fff',
            transition: 'all 0.2s ease-in-out' // Smooth zoom transition
          }}>
            <div style={{
              fontSize: `${dateFontSize}px`,
              fontWeight: isSameDay(day, new Date()) ? 'bold' : 'normal',
              color: isSameDay(day, new Date()) ? '#389E0D' : '#333'
            }}>
              {format(day, 'd')}
            </div>
            {dayBookings.map(b => (
              <div
                key={b.clientBookingId.toString()}
                onDoubleClick={() => handleDoubleClick(b.clientBookingId)}
                style={{
                  fontSize: `${bookingFontSize}px`,
                  padding: `${4 * zoomLevel}px`,
                  margin: '2px 0',
                  borderRadius: '4px',
                  background: getStatusColor(b.status),
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
              >
                <strong>{getFacilityName(b.facilitiesId)}</strong><br/>
                {zoomLevel > 0.8 && <>{b.scheduledStartTime} - {b.scheduledEndTime}<br/></>}
                <span style={{ fontSize: `${statusFontSize}px`, fontStyle: 'italic' }}>{b.status}</span>
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

  if (loading) return <div> <ViewEmployeesSkeleton/> </div>;

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #ddd' }}>
      {renderHeader()}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'bold', background: '#f0f2f5', padding: '10px 0', fontSize: `${14 * zoomLevel}px` }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      {renderCells()}
    </div>
  );
};

// Styles
const btnStyle = { padding: '5px 15px', marginLeft: '10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ddd', background: '#fff' };
const zoomBtnStyle = {
  width: '30px',
  height: '28px',
  border: '1px solid #ccc',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '3px'
};

export default ScheduleService;