import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import JSONbig from "json-bigint";
import { toast } from "react-toastify";
import {
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  format,
  parseISO,
  isWithinInterval
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { authenticatedFetch } from "../utils/api";

const MyShiftsSchedule = ({ user }) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentWeekStart, setCurrentWeekStart] = useState(() =>
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );
    const router = useRouter();

    const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule`;

    // --- Navigation Logic ---
    const weekRangeLabel = useMemo(() => {
        const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
        return `${format(currentWeekStart, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }, [currentWeekStart]);

    const nextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
    const prevWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
    const goToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

    // --- Data Fetching ---
    useEffect(() => {
        const fetchSchedule = async () => {
            if (!user?.companyId || !user?.employeeId) return;
            setLoading(true);
            try {
                const companyId = user.companyId.toString();
                const empId = user.employeeId.toString();
                const response = await authenticatedFetch(
                    `${API_BASE}/staffid/${companyId}/${encodeURIComponent(empId)}`
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
        fetchSchedule();
    }, [user, API_BASE]);

    // --- Filtering Logic ---
    const filteredSchedules = useMemo(() => {
        const start = currentWeekStart;
        const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

        return schedules.filter((s) => {
            // Using workDate or scheduledStart depending on your API structure
            const dateStr = s.workDate || s.scheduledStart;
            if (!dateStr) return false;
            const scheduleDate = parseISO(dateStr);
            return isWithinInterval(scheduleDate, { start, end });
        });
    }, [schedules, currentWeekStart]);

    // --- Clock Handlers ---
    const handleClockIn = async (schedule) => {
        try {
            const response = await authenticatedFetch(`${API_BASE}/updateActualStartClockIn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schedule)
            });
            if (response.ok) {
                toast.success("Clocked in.");
                router.reload();
            }
        } catch (error) {
            toast.error("Clock-in failed.");
        }
    };

    const handleClockOut = async (schedule) => {
        const hasIncident = window.confirm("Report an incident?");
        if (hasIncident) {
            router.push({ pathname: '/incidents/new', query: { scheduleId: schedule.id } });
            return;
        }
        try {
            const response = await authenticatedFetch(`${API_BASE}/updateActualStartClockOut`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schedule)
            });
            if (response.ok) {
                toast.success("Clocked out.");
                router.reload();
            }
        } catch (error) {
            toast.error("Clock-out failed.");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading shifts...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Calendar Navigation Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <Calendar className="text-emerald-600 w-5 h-5" />
                    <h2 className="text-lg font-bold text-slate-800">{weekRangeLabel}</h2>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={goToday} className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition">
                        Today
                    </button>
                    <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <button onClick={prevWeek} className="p-2 hover:bg-slate-50 border-r border-slate-200">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={nextWeek} className="p-2 hover:bg-slate-50">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Shift List */}
            <div className="space-y-4">
                {filteredSchedules.length > 0 ? (
                    filteredSchedules.sort((a, b) => new Date(a.workDate) - new Date(b.workDate)).map((shift) => (
                        <div key={shift.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:shadow-md">
                            <div>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                    {format(parseISO(shift.workDate || shift.scheduledStart), "EEEE, MMM d")}
                                </p>
                                <h3 className="text-lg font-bold text-slate-900 mt-1">{shift.clientName}</h3>
                                <div className="mt-2 flex flex-col gap-1 text-sm text-slate-500">
                                    <div className="flex items-center gap-2"><span>⏰</span> {shift.scheduledStart} - {shift.scheduledEnd}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ring-1 ring-inset ${
                                    shift.status === 'In Progress' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 'bg-slate-50 text-slate-600 ring-slate-600/20'
                                }`}>
                                    {shift.status}
                                </span>

                                {shift.status === 'Pending' && (
                                    <button onClick={() => handleClockIn(shift)} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700">
                                        Clock In
                                    </button>
                                )}
                                {shift.status === 'In Progress' && (
                                    <button onClick={() => handleClockOut(shift)} className="bg-rose-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-rose-700">
                                        Clock Out
                                    </button>
                                )}
                                {shift.status === 'Completed' && (
                                    <span className="text-emerald-600 font-bold px-4">✓ Done</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-400 font-medium">No shifts found for this week.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyShiftsSchedule;