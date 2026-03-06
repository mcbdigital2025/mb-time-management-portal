"use client";

const DetailRow = ({ label, value, valueClassName = "" }) => {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <dt className="text-xs font-semibold text-zinc-700 md:text-sm">{label}</dt>
      <dd className={`mt-1 break-all text-sm font-bold text-zinc-900 ${valueClassName}`}>
        {value}
      </dd>
    </div>
  );
};

const FlagRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <dt className="text-xs font-semibold text-zinc-700 md:text-base">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-zinc-900 md:text-base">
        {value ? "Yes" : "No"}
      </dd>
    </div>
  );
};

const StatusRow = ({ status }) => {
  const statusClasses =
    status === "Active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-zinc-200 bg-zinc-50 text-zinc-700";

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <dt className="text-xs font-semibold text-zinc-700 md:text-base">Status</dt>
      <dd className="mt-1">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${statusClasses}`}
        >
          {status || "Active"}
        </span>
      </dd>
    </div>
  );
};

const CompanyDetailsCard = ({ company, onEditCompany }) => {
  const leftColumn = [
    { label: "Company ID:", value: company?.companyId?.toString() || "id-12345678901234567890" },
    { label: "Company code:", value: company?.companyCode || "CODE1234" },
    { label: "Company name:", value: company?.companyName || "Example Company Inc." },
  ];

  const rightColumnFlags = [
    { label: "Client booking enabled", value: company?.clientBooking },
    { label: "Employee assigned schedule", value: company?.employeeAssignedSchedule },
    { label: "Log daily note", value: company?.logDailyNote },
    { label: "Transport travel claim", value: company?.transportTravelClaim },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/50 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/60 px-5 py-4">
        <div>
          <h2 className="text-sm font-extrabold text-zinc-900 md:text-lg">
            Company details
          </h2>
          <p className="mt-1 text-xs text-zinc-600 md:text-sm">
            Core identifiers and configuration flags.
          </p>
        </div>

        <button
          onClick={onEditCompany}
          className="hidden rounded-xl border border-zinc-200 bg-[#008080] px-4 py-2 text-sm font-bold text-zinc-100 hover:bg-[#006d6d] md:inline-flex"
        >
          Edit
        </button>
      </div>

      <dl className="grid grid-cols-1 divide-y divide-zinc-200 md:grid-cols-2 md:divide-x md:divide-y-0 md:divide-zinc-200">
        <div className="divide-y divide-zinc-200">
          {leftColumn.map((item) => (
            <DetailRow key={item.label} label={item.label} value={item.value} />
          ))}

          <div className="px-5 py-4">
            <dt className="text-xs font-semibold text-zinc-700 md:text-base">
              Description:
            </dt>
            <dd className="mt-1 break-words text-sm text-zinc-700 md:text-base">
              {company?.companyDescription || "No description provided."}
            </dd>
          </div>
        </div>

        <div className="divide-y divide-zinc-200">
          <StatusRow status={company?.status} />

          {rightColumnFlags.map((item) => (
            <FlagRow key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </dl>
    </section>
  );
};

export default CompanyDetailsCard;