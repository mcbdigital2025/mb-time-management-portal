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
} from "lucide-react";
import { authenticatedFetch } from "../utils/api";
import ViewEmployeesSkeleton from "../components/loaders/ViewEmployeesSkeleton";

const MyShiftsSchedule = ({ user }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const router = useRouter();

  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule`;

  const isTimeEmpty = (timeStr) => {
    // Returns true if null, undefined, empty string, "00:00:00", or "00:00"
    return (
      !timeStr ||
      timeStr.trim() === "" ||
      timeStr === "00:00:00" ||
      timeStr === "00:00"
    );
  };

  // --- Navigation Logic ---
  const weekRangeLabel = useMemo(() => {
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return `${format(currentWeekStart, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  }, [currentWeekStart]);

  const nextWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, 1));
  const prevWeek = () => setCurrentWeekStart((prev) => subWeeks(prev, 1));
  const goToday = () =>
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // --- Data Fetching ---
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

  // --- Filtering Logic ---
  const filteredSchedules = useMemo(() => {
    const start = currentWeekStart;
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return schedules.filter((s) => {
      const dateStr = s.workDate || s.scheduledStart;
      if (!dateStr) return false;
      return isWithinInterval(parseISO(dateStr), { start, end });
    });
  }, [schedules, currentWeekStart]);

  // --- Action Handlers ---
  // --- Action Handlers ---
  const handleClockIn = async () => {
    if (!selectedShift) return;

    // Check if already clocked in using the updated helper
    if (!isTimeEmpty(selectedShift.actualStartTime)) {
      toast.info("Already clocked in for this shift.");
      return;
    }

    // Capture current system time
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const updatedShift = {
      ...selectedShift,
      actualStartTime: currentTime, // Set to system time
    };

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

    // Check if already clocked out
    if (!isTimeEmpty(selectedShift.actualEndTime)) {
      toast.info("Already clocked out for this shift.");
      return;
    }

    // Capture current system time
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const updatedShift = {
      ...selectedShift,
      actualEndTime: currentTime, // Set to system time
    };

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

  const navigateTo = (path) => {
    if (!selectedShift) return;
    router.push({
      pathname: path,
      query: { scheduleId: selectedShift.id, clientId: selectedShift.clientId },
    });
  };

  const menuBtnClass = (isActive) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition w-full ${
      isActive
        ? "text-slate-700 hover:bg-slate-50 cursor-pointer"
        : "text-slate-300 cursor-not-allowed opacity-50"
    }`;

  // if (loading) return <ViewEmployeesSkeleton />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* LEFT SIDEBAR PANEL */}
      <div className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shadow-sm">
        <div className="mb-6 px-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Shift Actions
          </h2>
          <p className="text-[10px] text-slate-500 mt-1">
            {selectedShift
              ? `Selected: ${selectedShift.clientName}`
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
        <button
          disabled={!selectedShift}
          onClick={() => navigateTo("/notes/add")}
          className={`${menuBtnClass(!!selectedShift)} hover:text-blue-700 hover:bg-blue-50`}
        >
          <StickyNote size={18} /> Add Notes
        </button>
        <button
          disabled={!selectedShift}
          onClick={() => navigateTo("/incidents/new")}
          className={`${menuBtnClass(!!selectedShift)} hover:text-amber-700 hover:bg-amber-50`}
        >
          <AlertTriangle size={18} /> Report Incident
        </button>
        <button
          disabled={!selectedShift}
          onClick={() => navigateTo("/mileage/add")}
          className={`${menuBtnClass(!!selectedShift)} hover:text-indigo-700 hover:bg-indigo-50`}
        >
          <Car size={18} /> Add Mileage
        </button>
        <button
          disabled={!selectedShift}
          onClick={() => navigateTo("/expenses/add")}
          className={`${menuBtnClass(!!selectedShift)} hover:text-teal-700 hover:bg-teal-50`}
        >
          <Receipt size={18} /> Add Expense
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      {loading ? (
        <ViewEmployeesSkeleton />
      ) : (
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Weekly Navigation Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-emerald-600 w-5 h-5" />
                <h2 className="text-lg font-bold text-slate-800">
                  {weekRangeLabel}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToday}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                >
                  Today
                </button>
                <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={prevWeek}
                    className="p-2 hover:bg-slate-50 border-r border-slate-200"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={nextWeek} className="p-2 hover:bg-slate-50">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Shift List */}
            <div className="grid gap-4">
              {filteredSchedules.length > 0 ? (
                filteredSchedules
                  .sort((a, b) => new Date(a.workDate) - new Date(b.workDate))
                  .map((shift) => (
                    <div
                      key={shift.id}
                      onClick={() => setSelectedShift(shift)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        selectedShift?.id === shift.id
                          ? "border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500"
                          : "border-slate-100 bg-white hover:shadow-md"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                          {format(
                            parseISO(shift.workDate || shift.scheduledStart),
                            "EEEE, MMM d",
                          )}
                        </p>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">
                          {shift.clientName}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin size={14} className="text-slate-400" />{" "}
                          {shift.facilitiesName || "No Location Listed"}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                          <Clock size={14} className="text-slate-400" />{" "}
                          {shift.scheduledStart} - {shift.scheduledEnd}
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
                        {/* Clock In / Out Details below Status */}
                        <div className="flex flex-col text-[10px] text-slate-400 font-bold text-right space-y-0.5">
                          <div className="text-emerald-600">
                            Clock In: {shift.actualStartTime}
                          </div>
                          <div className="text-rose-600">
                            Clock Out: {shift.actualEndTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                  <p className="text-slate-400 font-medium">
                    No shifts found for this week.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyShiftsSchedule;
