"use client";

const EmployeeSkillsCard = ({
  selectedEmployee,
  skills = [],
  selectedSkill,
  onSelectSkill,
  onAddSkill,
  onUpdateSkill,
}) => {
  if (!selectedEmployee) return null;

  return (
    <section className="mt-8 w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#f1f5f9_45%,#ecfeff_100%)] px-5 py-5 sm:px-6">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-cyan-200/20 blur-2xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
           

            <h2 className="truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              {selectedEmployee.firstName}&apos;s Skills
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage skill records for this employee.
            </p>
          </div>
          <div className="relative mt-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur">
            Total Skills:
            <span className="ml-2 rounded-full bg-slate-900 px-2 py-0.5 text-[11px] text-white">
              {skills.length}
            </span>
          </div>

          {selectedSkill && (
            <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              Selected: {selectedSkill.skillName}
            </div>
          )}
        </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={onAddSkill}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(5,150,105,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-700 cursor-pointer"
            >
              + Add Skill
            </button>

            <button
              disabled={!selectedSkill}
              onClick={onUpdateSkill}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                selectedSkill
                  ? "bg-amber-500 text-white shadow-[0_10px_24px_rgba(245,158,11,0.24)] hover:-translate-y-0.5 hover:bg-amber-600 cursor-pointer"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
              }`}
            >
              Update Skill
            </button>
          </div>
        </div>

        
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6">
        {skills.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 text-center">
            <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm">
              ✨
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No skills added yet
            </h3>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Start building this employee&apos;s profile by adding their first
              skill.
            </p>
            <button
              onClick={onAddSkill}
              className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 cursor-pointer"
            >
              Add First Skill
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3 font-extrabold">Skill</th>
                    <th className="px-5 py-3 font-extrabold">Level</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {skills.map((skill) => {
                    const isSelected =
                      selectedSkill?.employeeSkillId === skill.employeeSkillId;

                    return (
                      <tr
                        key={skill.employeeSkillId}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSkill(skill);
                        }}
                        className={`group cursor-pointer transition ${
                          isSelected
                            ? "bg-amber-50/70"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-black ${
                                isSelected
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {(skill.skillName || "?").slice(0, 1).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-slate-900">
                                {skill.skillName}
                              </div>
                              <div className="text-xs text-slate-500">
                                Click to select
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                              isSelected
                                ? "bg-amber-100 text-amber-700 ring-amber-200"
                                : "bg-slate-100 text-slate-700 ring-slate-200"
                            }`}
                          >
                            {skill.skillLevel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EmployeeSkillsCard;