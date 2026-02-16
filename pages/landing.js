"use client";
import React from 'react';

const LandingPage = ({ user }) => {
  // Mock data for the daily dashboard
  const dailySchedules = [
    { id: 1, client: "St. Jude Hospital", time: "08:00 AM - 04:00 PM", status: "Confirmed", type: "On-site" },
    { id: 2, client: "Oakwood Care Home", time: "09:30 AM - 02:00 PM", status: "Postponed", type: "Clinical", alert: "Rescheduled to 11:00 AM" },
    { id: 3, client: "Global Security HQ", time: "10:00 AM - 06:00 PM", status: "Canceled", type: "Security", alert: "Client Canceled due to site maintenance" },
    { id: 4, client: "Northside Clinic", time: "11:00 AM - 07:00 PM", status: "Confirmed", type: "Nursing" },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* --- WELCOME HEADER --- */}
      <section className="hero-header-section" style={{ paddingBottom: '30px', borderBottom: '1px solid #eee', marginBottom: '30px' }}>
        <div className="w-layout-blockcontainer top-hero-header-container w-container">
          <div className="green-tag-1" style={{ marginBottom: '15px' }}>
            <div className="text-block-2">System Status: Active</div>
          </div>
          <h1 className="heading" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
            Hello, {user?.firstName || "User"}!
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            Here is your workforce overview and schedule for <strong>{new Date().toLocaleDateString()}</strong>.
          </p>
        </div>
      </section>

      {/* --- DASHBOARD SCHEDULE SECTION --- */}
      <section style={{ backgroundColor: '#fff', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#333' }}>Daily Schedule & Alerts</h2>
          <div style={{ fontSize: '14px', color: '#888' }}>{dailySchedules.length} Appointments Total</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {dailySchedules.map((shift) => (
            <div key={shift.id} style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              transition: 'transform 0.2s ease'
            }}>
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '20px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                backgroundColor: shift.status === 'Confirmed' ? '#ecfdf5' : shift.status === 'Canceled' ? '#fef2f2' : '#fffbeb',
                color: shift.status === 'Confirmed' ? '#065f46' : shift.status === 'Canceled' ? '#991b1b' : '#92400e'
              }}>
                {shift.status}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <span style={{ fontSize: '12px', color: '#389E0D', fontWeight: 'bold', textTransform: 'uppercase' }}>{shift.type}</span>
                <h3 style={{ margin: '5px 0 0 0', fontSize: '20px', color: '#111' }}>{shift.client}</h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px' }}>⏰ <strong>Shift:</strong> {shift.time}</span>
              </div>

              {/* Alert Message Block */}
              {shift.alert && (
                <div style={{
                  marginTop: '15px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: shift.status === 'Canceled' ? '#fef2f2' : '#fffbeb',
                  border: `1px solid ${shift.status === 'Canceled' ? '#fecaca' : '#fef3c7'}`,
                  fontSize: '13px',
                  color: shift.status === 'Canceled' ? '#991b1b' : '#92400e',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <span>⚠️</span>
                  <span><strong>Notice:</strong> {shift.alert}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- QUICK ACTIONS SECTION --- */}
      <section style={{ marginTop: '40px', padding: '20px', borderTop: '1px solid #eee' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button style={{ padding: '10px 20px', backgroundColor: '#389E0D', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Request Leave
          </button>
          <button style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}>
            Download Timesheet
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;