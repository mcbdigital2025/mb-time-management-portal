"use client";

const DepartmentsSection = ({
  departments,
  selectedDept,
  onSelectDept,
  deptSearch,
  onDeptSearchChange,
  isFilterOpen,
  onToggleFilter,
  onResetFilter,
  formatDateTime,
}) => {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-zinc-200 bg-zinc-50/60 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-zinc-900">Departments</h2>
          <p className="mt-1 text-xs text-zinc-600">Click a row to select it.</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              🔎
            </span>
            <input
              value={deptSearch}
              onChange={(e) => onDeptSearchChange(e.target.value)}
              placeholder="Search departments…"
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-300"
            />
          </div>

          <button
            type="button"
            onClick={onToggleFilter}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
          >
            <span>⛭</span>
            Filter
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="border-b border-zinc-200 bg-white px-5 py-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500">
                Status
              </label>
              <select className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-300">
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500">
                Sort by
              </label>
              <select className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-300">
                <option>Newest updated</option>
                <option>Oldest updated</option>
                <option>Name (A–Z)</option>
                <option>Name (Z–A)</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                className="h-10 w-full rounded-xl bg-zinc-900 px-4 text-sm font-extrabold text-white hover:bg-zinc-800"
                onClick={onToggleFilter}
              >
                Apply
              </button>

              <button
                type="button"
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
                onClick={onResetFilter}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {departments.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead className="bg-white">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3">Department ID</th>
                <th className="px-5 py-3">Company ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Updated</th>
                <th className="px-5 py-3">Select</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {departments.map((dept) => {
                const isActive =
                  selectedDept?.departmentId === dept?.departmentId;

                return (
                  <tr
                    key={dept?.departmentId}
                    onClick={() => onSelectDept(dept)}
                    className={[
                      "cursor-pointer transition",
                      isActive ? "bg-zinc-900/5" : "hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    <td className="px-5 py-3 font-semibold text-zinc-900">
                      {dept?.departmentId}
                    </td>

                    <td className="px-5 py-3 text-zinc-700">
                      {dept?.companyId ? String(dept.companyId) : "-"}
                    </td>

                    <td className="px-5 py-3 font-semibold text-zinc-900">
                      {dept?.departmentName}
                    </td>

                    <td className="px-5 py-3 text-zinc-700">
                      {dept?.departmentDescription}
                    </td>

                    <td className="px-5 py-3 text-zinc-700">
                      {formatDateTime(dept?.createdDate)}
                    </td>

                    <td className="px-5 py-3 text-zinc-700">
                      {formatDateTime(dept?.updatedDate)}
                    </td>

                    <td className="px-5 py-3 text-zinc-700">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => onSelectDept(dept)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-5 py-8 text-sm text-zinc-500">
            No departments found.
          </div>
        )}
      </div>
    </section>
  );
};

export default DepartmentsSection;