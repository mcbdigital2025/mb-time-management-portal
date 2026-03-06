export const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 p-5 shadow-sm">
      <p className="text-base font-medium text-slate-800">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
    </div>
  );
};