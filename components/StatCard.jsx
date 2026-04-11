import {
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  Activity
} from "lucide-react";

const getStatIcon = (title) => {
  switch (title.toLowerCase()) {
    case "weekly appointments":
      return CalendarDays;

    case "confirmed":
      return CheckCircle;

    case "postponed":
      return Clock;

    case "canceled":
    case "cancelled":
      return XCircle;

    default:
      return Activity; // fallback icon
  }
};

const getIconStyle = (title) => {
  switch (title.toLowerCase()) {
    case "confirmed":
      return "text-green-600 bg-green-50";
    case "postponed":
      return "text-yellow-600 bg-yellow-50";
    case "canceled":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-700 bg-gray-50";
  }
};

export const StatCard = ({ title, value, subtitle }) => {
  const style = getIconStyle(title);



  const Icon = getStatIcon(title);

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-emerald-700 p-5 shadow-sm">
      <div className="w-full flex items-center justify-between">
        <p className="text-xl font-semibold text-slate-800">{title}</p>
        <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${style}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="mt-0 text-sm text-slate-800/60">{subtitle}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
};