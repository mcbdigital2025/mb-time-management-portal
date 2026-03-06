"use client";

const CompanyHeader = ({ company, companyInitials, onEditCompany }) => {
  const statusClasses =
    company?.status === "Active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-zinc-200 bg-zinc-50 text-zinc-700";

  return (
    <div className="border-b border-zinc-200/60 bg-white/70 backdrop-blur hero-radial-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-zinc-200 bg-white text-lg font-extrabold text-zinc-900 shadow-sm">
            {companyInitials}
          </div>

          <div className="min-w-0">
            <div className="text-xs font-semibold tracking-wide text-zinc-500">
              Company
            </div>

            <h1 className="truncate text-xl font-black text-zinc-900">
              {company?.companyName || "Company Profile"}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
              <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5">
                ID: {company?.companyId?.toString() || "id-12345..."}
              </span>

              <span className={`rounded-full border px-2 py-0.5 ${statusClasses}`}>
                {company?.status || "Active"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onEditCompany}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#008080] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#006d6d]"
        >
          <span className="text-base">✎</span>
          Edit company
        </button>
      </div>
    </div>
  );
};

export default CompanyHeader;