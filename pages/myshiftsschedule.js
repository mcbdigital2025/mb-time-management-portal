import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { toast } from "react-toastify";
import {
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  format,
  parseISO,
  isWithinInterval,
} from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  StickyNote,
  AlertTriangle,
  Car,
  Receipt,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";
import { authenticatedFetch } from "../utils/api";
import CreateUpdateServiceStaffNotesModal from "../components/modal/CreateUpdateServiceStaffNotesModal";
import CreateUpdateIncidentReportModal from "../components/modal/CreateUpdateIncidentReportModal";
import CreateUpdateServiceMileageModal from "../components/modal/CreateUpdateServiceMileageModal";
import CreateUpdateServiceExpenseModal from "../components/modal/CreateUpdateServiceExpenseModal";

const MyShiftsSchedule = ({ user }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const router = useRouter();

  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule`;

  // 1. AUTH CHECK: If user is lost during HTTPS transition, don't try to render
  useEffect(() => {
    if (!loading && !user) {
      console.error("User context lost. Redirecting to landing...");
      router.push("/landing");
    }
  }, [user, loading, router]);

  const isTimeEmpty = (timeStr) => {
    return (
      !timeStr ||
      timeStr.trim() === "" ||
      timeStr === "00:00:00" ||
      timeStr === "00:00"
    );
  };

  const weekRangeLabel = useMemo(() => {
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return `${format(currentWeekStart, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  }, [currentWeekStart]);

  const nextWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, 1));
  const prevWeek = () => setCurrentWeekStart((prev) => subWeeks(prev, 1));
  const goToday = () =>
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const fetchSchedule = async () => {
    if (!user?.companyId || !user?.employeeId) return;
    setLoading(true);
    try {
      const companyId = user.companyId.toString();
      const empId = user.employeeId.toString();
      const response = await authenticatedFetch(
        `${API_BASE}/staffid/${companyId}/${encodeURIComponent(empId)}`,
      );

      if (response.ok) {
        const text = await response.text();
        const data = JSONbig.parse(text);
        setSchedules(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      toast.error("Error connecting to schedule service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [user, currentWeekStart]);

  const filteredSchedules = useMemo(() => {
    const start = currentWeekStart;
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return schedules.filter((s) => {
      const dateStr = s.workDate;
      if (!dateStr) return false;
      return isWithinInterval(parseISO(dateStr), { start, end });
    });
  }, [schedules, currentWeekStart]);

  const getSystemTime = () =>
    new Date().toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const handleClockIn = async () => {
    if (!selectedShift) return;
    const currentTime = getSystemTime();
    const updatedShift = { ...selectedShift, actualStartTime: currentTime };
    try {
      const response = await authenticatedFetch(
        `${API_BASE}/updateActualStartClockIn`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedShift),
        },
      );
      if (response.ok) {
        toast.success(`Clocked in at ${currentTime}`);
        fetchSchedule();
      }
    } catch (error) {
      toast.error("Clock-in failed.");
    }
  };

  const handleClockOut = async () => {
    if (!selectedShift) return;
    const currentTime = getSystemTime();
    const updatedShift = { ...selectedShift, actualEndTime: currentTime };
    try {
      const response = await authenticatedFetch(
        `${API_BASE}/updateActualStartClockOut`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedShift),
        },
      );
      if (response.ok) {
        toast.success(`Clocked out at ${currentTime}`);
        fetchSchedule();
      }
    } catch (error) {
      toast.error("Clock-out failed.");
    }
  };

  // --- HTTPS NAVIGATION FIX ---
  const navigateTo = (path) => {
    if (!selectedShift) return;

    // Ensure we don't have .js in the route
    const cleanPath = path.replace(".js", "");

    const bookingIdStr = selectedShift.clientBookingId.toString();
    const clientIdStr = selectedShift.clientId?.toString() || "";

    sessionStorage.setItem("currentClientBookingId", bookingIdStr);

    // Force a shallow route transition to maintain state
    router.push(
      {
        pathname: cleanPath,
        query: { scheduleId: bookingIdStr, clientId: clientIdStr },
      },
      undefined,
      { shallow: false },
    );
  };

  const menuBtnClass = (isEnabled, isModalActive = false) =>
    `flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-xl transition w-full ${
      !isEnabled
        ? "text-slate-200 cursor-not-allowed opacity-50"
        : isModalActive
          ? "bg-white text-[#008080] shadow-sm cursor-pointer"
          : "text-white hover:bg-white hover:text-[#008080] cursor-pointer"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-[#008080]  border-r border-slate-200 p-4 flex flex-col gap-2 shadow-sm">
        <div className="mb-6 px-2">
          <h2 className="text-base font-bold text-white uppercase tracking-widest">
            Shift Actions
          </h2>
          <p className="text-[13px] text-slate-50 mt-1">
            {selectedShift
              ? `Selected: ${selectedShift.facilitiesName}`
              : "Select a shift to enable menus"}
          </p>
        </div>

        <button
          disabled={!selectedShift}
          onClick={handleClockIn}
          className={`${menuBtnClass(!!selectedShift)} hover:text-emerald-700 hover:bg-emerald-50`}
        >
          <LogIn size={18} /> Clock In
        </button>
        <button
          disabled={!selectedShift}
          onClick={handleClockOut}
          className={`${menuBtnClass(!!selectedShift)} hover:text-rose-700 hover:bg-rose-50`}
        >
          <LogOut size={18} /> Clock Out
        </button>
        <hr className="my-2 border-slate-100" />
        {/* <button
          disabled={!selectedShift}
          onClick={() => navigateTo("/createUpdateServiceStaffNotes")}
          className={`${menuBtnClass(!!selectedShift)} hover:text-blue-700 hover:bg-blue-50`}
        >
          <StickyNote size={18} /> Add Notes
        </button> */}

        <button
          disabled={!selectedShift}
          onClick={() => {
            setShowIncidentModal(false);
            setShowMileageModal(false);
            setShowExpenseModal(false);
            setShowNotesModal(true);
          }}
          className={menuBtnClass(!!selectedShift, showNotesModal)}
        >
          <StickyNote size={18} /> Add Notes
        </button>
        {/* <button
          disabled={!selectedShift}
          onClick={() => navigateTo("/createUpdateIncidentReport")}
          className={`${menuBtnClass(!!selectedShift)} hover:text-amber-700 hover:bg-amber-50`}
        >
          <AlertTriangle size={18} /> Report Incident
        </button> */}
        <button
          disabled={!selectedShift}
          onClick={() => {
            setShowNotesModal(false);
            setShowMileageModal(false);
            setShowExpenseModal(false);
            setShowIncidentModal(true);
          }}
          className={menuBtnClass(!!selectedShift, showIncidentModal)}
        >
          <AlertTriangle size={18} /> Report Incident
        </button>
        <button
          disabled={!selectedShift}
          onClick={() => {
            setShowNotesModal(false);
            setShowIncidentModal(false);
            setShowExpenseModal(false);
            setShowMileageModal(true);
          }}
          className={menuBtnClass(!!selectedShift, showMileageModal)}
        >
          <Car size={18} /> Add Mileage
        </button>
        <button
          disabled={!selectedShift}
          onClick={() => {
            setShowNotesModal(false);
            setShowIncidentModal(false);
            setShowMileageModal(false);
            setShowExpenseModal(true);
          }}
          className={menuBtnClass(!!selectedShift, showExpenseModal)}
        >
          <Receipt size={18} /> Add Expense
        </button>
      </div>

      <div className="relative flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between  p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 gap- bg-[#008080]  ">
            <div className="flex items-center gap-3 ">
              <Calendar className="text-emerald-50 w-5 h-5" />
              <h2 className="text-lg font-bold text-slate-50">
                {weekRangeLabel}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToday}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
              >
                Week
              </button>
              <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={prevWeek}
                  className="p-2 hover:bg-slate-50 border-r border-slate-200 cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextWeek}
                  className="p-2 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className=" min-h-[85vh] p-8 flex flex-col items-center justify-center gap-3 text-slate-500 font-bold">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="animate-pulse">Synchronizing Schedule...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSchedules
                .sort((a, b) => new Date(a.workDate) - new Date(b.workDate))
                .map((shift) => (
                  <div
                    key={shift.clientBookingId.toString()}
                    onClick={() => setSelectedShift(shift)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                      selectedShift?.clientBookingId === shift.clientBookingId
                        ? "border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500"
                        : "border-slate-100 bg-white hover:shadow-md"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        {format(parseISO(shift.workDate), "EEEE, MMM d")}
                      </p>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {shift.facilitiesName}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                        <Clock size={14} className="text-slate-400" />{" "}
                        {shift.scheduledStartTime} - {shift.scheduledEndTime}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ring-1 ring-inset ${
                          shift.status === "In Progress"
                            ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                            : "bg-slate-50 text-slate-600 ring-slate-600/20"
                        }`}
                      >
                        {shift.status}
                      </span>
                      <div className="flex flex-col text-[10px] font-bold text-right space-y-0.5">
                        <div className="flex items-center justify-end gap-1 text-slate-500">
                          <MapPin size={12} className="text-slate-400" />{" "}
                          {shift.workLocation || "No Location"}
                        </div>
                        <div className="text-emerald-600 font-black">
                          Clock In: {shift.actualStartTime}
                        </div>
                        <div className="text-rose-600 font-black">
                          Clock Out: {shift.actualEndTime}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {showNotesModal && selectedShift && (
                <div className="absolute inset-0 z-50 flex items-start justify-center bg-black/10 p-8">
                  <div className="relative w-full max-w-5xl max-h-[calc(100vh-6rem)] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                    <button
                      type="button"
                      onClick={() => setShowNotesModal(false)}
                      className="absolute top-4 right-4 z-10 rounded-full bg-[#008080] px-3 py-1 text-sm font-bold text-slate-50 hover:bg-[#008080] cursor-pointer transition"
                    >
                      ✕
                    </button>

                    <CreateUpdateServiceStaffNotesModal
                      user={user}
                      clientBookingId={selectedShift.clientBookingId?.toString()}
                      onClose={() => setShowNotesModal(false)}
                      onSaved={() => {
                        setShowNotesModal(false);
                        fetchSchedule();
                      }}
                    />
                  </div>
                </div>
              )}

              {showIncidentModal && selectedShift && (
                <div className="absolute inset-0 z-50 flex items-start justify-center bg-black/10 p-8">
                  <div className="relative w-full max-w-5xl max-h-[calc(100vh-6rem)] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                    <button
                      type="button"
                      onClick={() => setShowIncidentModal(false)}
                      className="absolute top-4 right-4 z-10 rounded-full bg-[#008080] px-3 py-1 text-sm font-bold text-slate-50 hover:bg-[#008080] cursor-pointer transition"
                    >
                      ✕
                    </button>

                    <CreateUpdateIncidentReportModal
                      user={user}
                      clientBookingId={selectedShift.clientBookingId?.toString()}
                      clientId={selectedShift.clientId?.toString()}
                      onClose={() => setShowIncidentModal(false)}
                      onSaved={() => {
                        setShowIncidentModal(false);
                        fetchSchedule();
                      }}
                    />
                  </div>
                </div>
              )}

              {showMileageModal && selectedShift && (
                <div className="absolute inset-0 z-50 flex items-start justify-center bg-black/10 p-8">
                  <div className="relative w-full max-w-5xl max-h-[calc(100vh-6rem)] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                    <button
                      type="button"
                      onClick={() => setShowMileageModal(false)}
                      className="absolute top-4 right-4 z-10 rounded-full bg-[#008080] px-3 py-1 text-sm font-bold text-slate-50 hover:bg-[#008080] cursor-pointer transition"
                    >
                      ✕
                    </button>

                    <CreateUpdateServiceMileageModal
                      user={user}
                      clientBookingId={selectedShift.clientBookingId?.toString()}
                      onClose={() => setShowMileageModal(false)}
                      onSaved={() => {
                        setShowMileageModal(false);
                        fetchSchedule();
                      }}
                    />
                  </div>
                </div>
              )}

              {showExpenseModal && selectedShift && (
                <div className="absolute inset-0 z-50 flex items-start justify-center bg-black/40 p-8">
                  <div className="relative w-full max-w-2xl max-h-[calc(100vh-6rem)] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                    <CreateUpdateServiceExpenseModal
                      user={user}
                      clientBookingId={selectedShift.clientBookingId?.toString()}
                      onClose={() => setShowExpenseModal(false)}
                      onSaved={() => {
                        setShowExpenseModal(false);
                        fetchSchedule();
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyShiftsSchedule;
