"use client";
import React, { useState, useEffect } from 'react';
import JSONbig from "json-bigint";
import { authenticatedFetch } from '../utils/api';
import { toast } from 'react-toastify';

const BookingService = ({ user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Metadata Lists
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [availableJobs, setAvailableJobs] = useState([]);
  const [facilities, setFacilities] = useState([]);

  // Selections
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Form Data spanning all tables
  const [formData, setFormData] = useState({
    // Step 4: ServiceMileage
    mileageCap: '', mileageRate: '', hasCompanyVehicle: false,
    // Step 5: ServiceAllowances
    allowanceType: 'TRAVEL', allowanceAmount: 0.00,
    // Step 6: ServiceStaffRequirements
    minimumStaffRequired: 1, smartMatchEnabled: false,
    // Step 7: ServiceScheduleSignatures
    requireClientSignature: false, requireCarerSignature: false,

    // ...ClientBookingSchedule
      facilitiesId: 0,
      instructions: '',
      bookingType: 'ONE_TIME', // default for Step 8
      workDate: '',
      scheduledStartTime: '',
      scheduledEndTime: '',
      actualStartTime: '00:00',
      actualEndTime: '00:00',
      workLocation: '',
      breakMinutes: 0,
      serviceBonusEnabled: false,
      serviceEndsNextDay: false,
      isPublicHoliday: false,
      clientCancel: false,
      clientReschedule: false,
      employeeCancel: false,
      status: 'SCHEDULED',
      // Step 9: ClientBookingRecurring
          recurrenceType: 'WEEKLY',
          monday: false, tuesday: false, wednesday: false, thursday: false,
          friday: false, saturday: false, sunday: false,
          startDate: '', endDate: '', acceptPublicHoliday: false, skipPublicHoliday: true, isActive: true

  });

  // 1. Initial Data Load - Fixed Endpoints
    useEffect(() => {
      if (!user?.companyId) return;

      const loadInitialData = async () => {
        setLoading(true);
        try {
          const companyId = user.companyId.toString();

          // Standardized paths based on MaboCore backend structure
          const [clientRes, empRes, typeRes, facRes] = await Promise.all([
            authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/client/${companyId}`),
            authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/${companyId}`),
            authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/jobType/${companyId}`),
            authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/facilities/${companyId}`) // New Endpoint
          ]);
          if (clientRes.ok) {
            const data = JSONbig.parse(await clientRes.text());
            setClients(Array.isArray(data) ? data : []);
          }

          if (empRes.ok) {
            const data = JSONbig.parse(await empRes.text());
            console.log("Employee Data Received:", data); // Debugging
            setEmployees(Array.isArray(data) ? data : []);
          } else {
            console.error("Employee fetch failed:", empRes.status);
          }

          if (typeRes.ok) {
              const data = JSONbig.parse(await typeRes.text());
              console.log("Job Type Data Received:", data);

              // 1. You must save the list to state so the .map() in Step 3 works
              setJobTypes(Array.isArray(data) ? data : []);

              // 2. Access 'data', not 'typeRes', and check if it has items
              if (Array.isArray(data) && data.length > 0) {
                  setSelectedJobType(data[0].jobType || data[0].description || "");
              }
          }
          if (facRes.ok) {
              const data = JSONbig.parse(await facRes.text());
              setFacilities(Array.isArray(data) ? data : []);
          }

        } catch (err) {
          console.error("Initialization Error:", err);
          toast.error("Failed to load selection lists.");
        } finally {
          setLoading(false);
        }
      };

      loadInitialData();
    }, [user]);


  const handleFinalSubmit = async () => {
    if (!user?.companyId) {
      toast.error("User session expired. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const companyId = user.companyId;
      const bookingId = 0; // Backend typically generates this on create

      // 1. Construct the Payload following DTO structure
      const payload = {
        // Step 8: Main Schedule
        schedule: {
          companyId: companyId,
          clientId: selectedClientId,
          employeeId: selectedEmpId,
          jobId: selectedJob?.jobId,
          facilitiesId: parseInt(formData.facilitiesId) || 0,
          instructions: formData.instructions,
          bookingType: formData.bookingType || 'ONE_TIME',
          workDate: formData.workDate,
          scheduledStartTime: formData.scheduledStartTime,
          scheduledEndTime: formData.scheduledEndTime,
          actualStartTime: formData.actualStartTime || "00:00:00",
          actualEndTime: formData.actualEndTime || "00:00:00",
          workLocation: formData.workLocation,
          breakMinutes: parseInt(formData.breakMinutes) || 0,
          serviceBonusEnabled: !!formData.serviceBonusEnabled,
          serviceEndsNextDay: !!formData.serviceEndsNextDay,
          isPublicHoliday: !!formData.isPublicHoliday,
          clientCancel: !!formData.clientCancel,
          clientReschedule: !!formData.clientReschedule,
          employeeCancel: !!formData.employeeCancel,
          status: formData.status || 'SCHEDULED'
        },

        // Step 9: Recurring Pattern
        recurring: {
          companyId: companyId,
          clientId: selectedClientId,
          employeeId: selectedEmpId,
          jobId: selectedJob?.jobId,
          recurrenceType: formData.recurrenceType || 'WEEKLY',
          monday: !!formData.monday,
          tuesday: !!formData.tuesday,
          wednesday: !!formData.wednesday,
          thursday: !!formData.thursday,
          friday: !!formData.friday,
          saturday: !!formData.saturday,
          sunday: !!formData.sunday,
          startDate: formData.startDate,
          endDate: formData.endDate || null,
          acceptPublicHoliday: !!formData.acceptPublicHoliday,
          skipPublicHoliday: !!formData.skipPublicHoliday,
          isActive: formData.isActive !== false
        },

        // Step 4: Mileage Data
        serviceMileage: {
          companyId: companyId,
          clientBookingId: bookingId,
          mileageCap: formData.mileageCap,
          mileageRate: formData.mileageRate,
          hasCompanyVehicle: !!formData.hasCompanyVehicle
        },

        // Step 5: Allowance Data
        serviceAllowances: {
          companyId: companyId,
          clientBookingId: bookingId,
          allowanceType: formData.allowanceType,
          amount: formData.allowanceAmount
        },

        // Step 6: Staffing Requirements
        serviceStaffRequirements: {
          companyId: companyId,
          clientBookingId: bookingId,
          minimumStaffRequired: parseInt(formData.minimumStaffRequired) || 1,
          smartMatchEnabled: !!formData.smartMatchEnabled
        },

        // Step 7: Signature Requirements
        serviceScheduleSignatures: {
          companyId: companyId,
          clientBookingId: bookingId,
          requireClientSignature: !!formData.requireClientSignature,
          requireCarerSignature: !!formData.requireCarerSignature
        }
      };

      // 2. Send the combined DTO using JSONbig for Long/BigInt safety
      const res = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSONbig.stringify(payload)
        }
      );

      if (res.ok) {
        toast.success("Complete Booking Service created successfully!");
        setCurrentStep(1); // Reset wizard on success
      } else {
        const errorText = await res.text();
        toast.error(`Save Failed: ${errorText}`);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("A network error occurred while saving all steps.");
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const steps = [
    { id: 1, title: 'Select Client' }, { id: 2, title: 'Select Employee' },
    { id: 3, title: 'Job Type' }, { id: 4, title: 'Mileage Config' },
    { id: 5, title: 'Service Allowance' }, { id: 6, title: 'Staffing' },
    { id: 7, title: 'Signatures' }, { id: 8, title: 'One-Time Book Service' },
    { id: 9, title: 'Book Recurring Service' }
  ];

 // Fetch Jobs by Type
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

  return (
    <div style={{ display: 'flex', minHeight: '90vh', gap: '20px', padding: '20px', background: '#f0f2f5' }}>

     {/* LEFT NAV */}
           <div style={{ width: '280px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd' }}>
             <h3 style={{ color: '#389E0D' }}>MaboCore Wizard</h3>
             {steps.map(s => (
               <div key={s.id} onClick={() => setCurrentStep(s.id)} style={{
                 padding: '12px', margin: '8px 0', cursor: 'pointer', borderRadius: '8px',
                 background: currentStep === s.id ? '#f6ffed' : 'transparent',
                 borderLeft: currentStep === s.id ? '4px solid #389E0D' : '4px solid transparent',
                 color: currentStep === s.id ? '#389E0D' : '#666'
               }}>Step {s.id}: {s.title}</div>
             ))}

             <button
               onClick={handleFinalSubmit}
               disabled={loading}
               style={{
                 width: '100%',
                 marginTop: '20px',
                 padding: '12px',
                 background: loading ? '#ccc' : '#389E0D',
                 color: '#fff',
                 border: 'none',
                 borderRadius: '6px',
                 fontWeight: 'bold',
                 cursor: loading ? 'not-allowed' : 'pointer'
               }}
             >
               {loading ? "Saving..." : "Save All Steps"}
             </button>
           </div>
      {/* RIGHT CONTENT */}
      <div style={{ flex: 1, background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>

        {currentStep === 1 && (
          <section>
            <h2>Step 1: Select Client</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {clients.map(c => (
                  <tr key={c.clientId} onClick={() => { setSelectedClientId(c.clientId); setCurrentStep(2); }} style={{ cursor: 'pointer', background: selectedClientId === c.clientId ? '#e6f7ff' : '' }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{c.firstName} {c.lastName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {currentStep === 2 && (
                  <section>
                    <h2>Step 2: Select Employee</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {employees.map(e => (
                          <tr key={e.employeeId} onClick={() => { setSelectedEmpId(e.employeeId); setCurrentStep(3); }} style={{ cursor: 'pointer', background: setSelectedEmpId === e.employeeId ? '#e6f7ff' : '' }}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{e.firstName} {e.lastName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
            )}

             {currentStep === 3 && (
               <section>
                 <h2>Step 3: Select Specific Job</h2>

                 {/* Category Selection Dropdown */}
                 <label className="text-sm font-bold text-gray-600">Filter by Job Category:</label>
                 <select
                   value={selectedJobType}
                   onChange={(e) => setSelectedJobType(e.target.value)}
                   style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
                 >
                   {jobTypes.map((jt, idx) => (
                     <option key={jt?.jobId?.toString() || idx} value={jt.jobType}>
                       {jt.jobType}
                     </option>
                   ))}
                 </select>

                 {/* Jobs Table - Now using availableJobs */}
                 <div style={{ marginTop: '20px' }}>
                   <h3 style={{ fontSize: '1rem', color: '#666' }}>Available {selectedJobType} Jobs:</h3>
                   <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                     <thead>
                       <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                         <th style={{ padding: '12px' }}>Job Code</th>
                         <th style={{ padding: '12px' }}>Description</th>
                       </tr>
                     </thead>
                     <tbody>
                       {availableJobs.length > 0 ? (
                         availableJobs.map(j => (
                           <tr
                             key={j.jobId}
                             onClick={() => {
                               setSelectedJob(j);
                               // Also update formData so Step 8 sees the selection
                               setFormData(prev => ({ ...prev, jobType: j.jobCode }));
                               setCurrentStep(4);
                             }}
                             style={{
                               cursor: 'pointer',
                               background: selectedJob?.jobId === j.jobId ? '#e6f7ff' : 'transparent',
                               transition: 'background 0.2s'
                             }}
                             onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                             onMouseLeave={(e) => e.currentTarget.style.background = selectedJob?.jobId === j.jobId ? '#e6f7ff' : 'transparent'}
                           >
                             <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{j.jobCode}</td>
                             <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{j.description}</td>
                           </tr>
                         ))
                       ) : (
                         <tr>
                           <td colSpan="2" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                             No specific jobs found for this category.
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </section>
             )}
        {currentStep === 4 && (
          <section>
            <h2>Step 4: Mileage Configuration (ServiceMileage Table)</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              <label>Mileage Cap: <input type="number" name="mileageCap" value={formData.mileageCap} onChange={handleInputChange} className="input-style" /></label>
              <label>Mileage Rate: <input type="number" step="0.01" name="mileageRate" value={formData.mileageRate} onChange={handleInputChange} className="input-style" /></label>
              <label><input type="checkbox" name="hasCompanyVehicle" checked={formData.hasCompanyVehicle} onChange={handleInputChange} /> Has Company Vehicle</label>
              <button onClick={() => setCurrentStep(5)} className="btn-next">Next: Allowances</button>
            </div>
          </section>
        )}

        {currentStep === 5 && (
          <section>
            <h2>Step 5: Service Allowance (ServiceAllowances Table)</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              <label>Allowance Type:
                <select name="allowanceType" value={formData.allowanceType} onChange={handleInputChange}>
                  {['MEAL', 'TRAVEL', 'TOOL', 'UNIFORM', 'FIRST_AID', 'SLEEP_OVER', 'OTHER'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label>Amount: <input type="number" name="allowanceAmount" value={formData.allowanceAmount} onChange={handleInputChange} /></label>
              <button onClick={() => setCurrentStep(6)} className="btn-next">Next: Staffing</button>
            </div>
          </section>
        )}

        {/* Step 6: Staffing Requirements */}
        {currentStep === 6 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Step 6: Staffing Requirements</h2>
            <div style={{ background: '#f9f9f9', padding: '25px', borderRadius: '12px', border: '1px solid #eee' }}>
              <div style={{ display: 'grid', gap: '25px' }}>

                {/* Minimum Staff Required */}
                <div className="space-y-2">
                  <label style={{ display: 'block', fontWeight: 'bold', color: '#555' }}>
                    Minimum Staff Required
                  </label>
                  <input
                    type="number"
                    name="minimumStaffRequired"
                    min="1"
                    value={formData.minimumStaffRequired}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                  <p style={{ fontSize: '12px', color: '#888' }}>
                    Specify the number of employees required for this service.
                  </p>
                </div>

                {/* Smart Match Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <input
                    type="checkbox"
                    name="smartMatchEnabled"
                    id="smartMatchEnabled"
                    checked={formData.smartMatchEnabled}
                    onChange={handleInputChange}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <label htmlFor="smartMatchEnabled" style={{ cursor: 'pointer', fontWeight: '600' }}>
                    Enable Smart Match
                  </label>
                </div>

                <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                  Smart Match uses AI to suggest employees based on proximity and skills.
                </p>

                <button onClick={() => setCurrentStep(7)} className="btn-next" style={{ background: '#389E0D' }}>
                  Next: Signatures
                </button>
              </div>
            </div>
          </section>
        )}

        {currentStep === 7 && (
          <section>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Step 7: Signature Requirements</h2>

            <div style={{ display: 'grid', gap: '15px' }}>

              {/* Client Signature Card */}
              <div
                onClick={() => setFormData(prev => ({ ...prev, requireClientSignature: !prev.requireClientSignature }))}
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  border: '2px solid',
                  borderColor: formData.requireClientSignature ? '#389E0D' : '#eee',
                  background: formData.requireClientSignature ? '#f6ffed' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '16px' }}>Client Signature</strong>
                  <span style={{ color: '#888', fontSize: '14px' }}>Require the client to sign off on the service upon completion.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.requireClientSignature}
                  readOnly
                  style={{ width: '20px', height: '20px' }}
                />
              </div>

              {/* Carer/Employee Signature Card */}
              <div
                onClick={() => setFormData(prev => ({ ...prev, requireCarerSignature: !prev.requireCarerSignature }))}
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  border: '2px solid',
                  borderColor: formData.requireCarerSignature ? '#389E0D' : '#eee',
                  background: formData.requireCarerSignature ? '#f6ffed' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '16px' }}>Carer Signature</strong>
                  <span style={{ color: '#888', fontSize: '14px' }}>Require the employee (carer) to sign and verify their hours.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.requireCarerSignature}
                  readOnly
                  style={{ width: '20px', height: '20px' }}
                />
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => setCurrentStep(6)} style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>
                  Back
                </button>
                <button onClick={() => setCurrentStep(8)} className="btn-next" style={{ marginTop: 0, flex: 1 }}>
                  Next: One-Time Details
                </button>
              </div>
            </div>
          </section>
        )}

        {currentStep === 8 && (
          <section>
            <h2 style={{ borderBottom: '2px solid #389E0D', paddingBottom: '10px' }}>
              Step 8: One-Time Booking Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>

              {/* --- Section: Type & Location --- */}
              <div style={{ gridColumn: 'span 2', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>LOCATION & FACILITIES</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <label>Work Location:
                    <input name="workLocation" value={formData.workLocation} onChange={handleInputChange} style={{width:'100%', padding: '8px'}} placeholder="Full Address"/>
                  </label>
                  <label>Select Facility:
                        <select
                          name="facilitiesId"
                          value={formData.facilitiesId}
                          onChange={handleInputChange}
                          style={{width:'100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                        >
                          <option value="0">-- Select a Facility --</option>
                          {facilities.map(f => (
                            <option key={f.facilitiesId} value={f.facilitiesId}>
                              {f.facilitiesName} ({f.city})
                            </option>
                          ))}
                        </select>
                      </label>
                </div>
              </div>

              {/* --- Section: Scheduled Timing --- */}
              <div style={{ background: '#fff', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>SCHEDULED TIMES</h3>
                <label>Work Date:
                  <input type="date" name="workDate" value={formData.workDate} onChange={handleInputChange} style={{width:'100%', marginBottom: '10px'}}/>
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label style={{flex: 1}}>Start: <input type="time" name="scheduledStartTime" value={formData.scheduledStartTime} onChange={handleInputChange}/></label>
                  <label style={{flex: 1}}>End: <input type="time" name="scheduledEndTime" value={formData.scheduledEndTime} onChange={handleInputChange}/></label>
                </div>
                <label style={{marginTop: '10px', display: 'block'}}>Break (Minutes):
                  <input type="number" name="breakMinutes" value={formData.breakMinutes} onChange={handleInputChange} style={{width:'100%'}}/>
                </label>
              </div>

              {/* --- Section: Actual Timing (Defaults to 00:00) --- */}
              <div style={{ background: '#fff', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>ACTUAL TIMES (FOR LOGGING)</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label style={{flex: 1}}>Actual Start: <input type="time" name="actualStartTime" value={formData.actualStartTime} onChange={handleInputChange}/></label>
                  <label style={{flex: 1}}>Actual End: <input type="time" name="actualEndTime" value={formData.actualEndTime} onChange={handleInputChange}/></label>
                </div>
                <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                  <label><input type="checkbox" name="isPublicHoliday" checked={formData.isPublicHoliday} onChange={handleInputChange}/> Public Holiday</label>
                  <label><input type="checkbox" name="serviceBonusEnabled" checked={formData.serviceBonusEnabled} onChange={handleInputChange}/> Service Bonus</label>
                  <label><input type="checkbox" name="serviceEndsNextDay" checked={formData.serviceEndsNextDay} onChange={handleInputChange}/> Ends Next Day</label>
                </div>
              </div>

              {/* --- Section: Cancellation Flags --- */}
              <div style={{ gridColumn: 'span 2', background: '#fff0f0', padding: '15px', borderRadius: '8px', border: '1px solid #ffccc7' }}>
                <h3 style={{ fontSize: '14px', color: '#cf1322', marginBottom: '10px' }}>CANCELLATION & RESCHEDULE FLAGS</h3>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label><input type="checkbox" name="clientCancel" checked={formData.clientCancel} onChange={handleInputChange}/> Client Cancel</label>
                  <label><input type="checkbox" name="clientReschedule" checked={formData.clientReschedule} onChange={handleInputChange}/> Client Reschedule</label>
                  <label><input type="checkbox" name="employeeCancel" checked={formData.employeeCancel} onChange={handleInputChange}/> Employee Cancel</label>
                </div>
              </div>

            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <button onClick={() => setCurrentStep(7)} style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff' }}>Back</button>
              <button onClick={() => setCurrentStep(9)} className="btn-next" style={{ flex: 1, marginTop: 0 }}>Next: Recurring Rules</button>
            </div>
          </section>
        )}

       {currentStep === 9 && (
         <section>
           <h2>Step 9: Book Recurring Service</h2>
           <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>

             {/* 1. Recurrence Type Selection */}
             <div style={{ marginBottom: '15px' }}>
               <label><strong>Recurrence Type: </strong></label>
               <select
                 name="recurrenceType"
                 value={formData.recurrenceType || 'WEEKLY'}
                 onChange={handleInputChange}
                 style={{ padding: '5px', marginLeft: '10px' }}
               >
                 <option value="WEEKLY">WEEKLY</option>
                 <option value="ONE_TIME">ONE_TIME</option>
               </select>
             </div>

             {/* 2. Weekly Pattern (Monday - Sunday) */}
             <p><strong>Weekly Schedule:</strong></p>
             <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
               {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                 <label key={day} style={{ textTransform: 'capitalize', textAlign: 'center', cursor: 'pointer' }}>
                   <input
                     type="checkbox"
                     name={day}
                     checked={!!formData[day]}
                     onChange={handleInputChange}
                   />
                   <br />
                   {day.slice(0, 3)}
                 </label>
               ))}
             </div>

             {/* 3. Validity and Holiday Behavior */}
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               <label>
                 <strong>Start Date:</strong>
                 <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} style={{ width: '100%', marginTop: '5px' }} />
               </label>
               <label>
                 <strong>End Date (Optional):</strong>
                 <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleInputChange} style={{ width: '100%', marginTop: '5px' }} />
               </label>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <label style={{ cursor: 'pointer' }}>
                   <input type="checkbox" name="acceptPublicHoliday" checked={!!formData.acceptPublicHoliday} onChange={handleInputChange} />
                   {" "}Accept Public Holiday
                 </label>
                 <label style={{ cursor: 'pointer' }}>
                   <input type="checkbox" name="skipPublicHoliday" checked={!!formData.skipPublicHoliday} onChange={handleInputChange} />
                   {" "}Skip Public Holiday
                 </label>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ cursor: 'pointer' }}>
                   <input type="checkbox" name="isActive" checked={formData.isActive !== false} onChange={handleInputChange} />
                   {" "}Is Active
                 </label>
               </div>
             </div>

             <button
               onClick={handleFinalSubmit}
               style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
             >
               Save Recurring Booking
             </button>
           </div>
         </section>
       )}

      </div>
      <style jsx>{`
        .btn-next { margin-top: 20px; padding: 10px 20px; background: #1890ff; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
        .input-style { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
        .col-span-2 { grid-column: span 2; }
      `}</style>
    </div>
  );
};

export default BookingService;