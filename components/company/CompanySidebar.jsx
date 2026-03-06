"use client";

const CompanySidebar = ({
  stats,
  onAddDepartment,
  onEditDepartment,
  onRemoveDepartment,
}) => {
  const actions = [
    {
      label: "Create department",
      onClick: onAddDepartment,
      className:
        "rounded-xl bg-[#055c38] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#024228]",
    },
    {
      label: "Edit selected",
      onClick: onEditDepartment,
      className:
        "rounded-xl border border-zinc-200 bg-[#008080] px-4 py-2.5 text-sm font-extrabold text-zinc-100 hover:bg-[#054e4e]",
    },
    {
      label: "Remove selected",
      onClick: onRemoveDepartment,
      className:
        "rounded-xl border border-red-200 bg-[#F75D42] px-4 py-2.5 text-sm font-extrabold text-red-50 hover:bg-red-700",
    },
  ];

  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-extrabold text-zinc-900">Overview</div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4"
            >
              <div className="text-xs font-semibold text-zinc-500">
                {item.label}
              </div>
              <div className="mt-1 text-sm font-extrabold text-zinc-900">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-extrabold text-zinc-900">
          Department actions
        </div>

        <p className="mt-1 text-xs text-zinc-600">
          Select a department in the table, then edit or remove it.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={action.className}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CompanySidebar;