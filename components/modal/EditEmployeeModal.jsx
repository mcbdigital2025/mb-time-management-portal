"use client";

const EditEmployeeModal = ({
  isOpen,
  onClose,
  isUpdating,
  editFormError,
  editFormData,
  handleEditEmployeeSubmit,
  formatLabel,
  renderEditInputField,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 -mt-8 flex items-center justify-center bg-black/40 px-3 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-amber-200 bg-white shadow-2xl">
        <div className="hero-radial-background sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
              Edit Employee Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update employee information without leaving this page.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="rounded-lg bg-[#F75D42] px-2 py-1 font-bold text-gray-100 transition hover:bg-[#86200e] disabled:opacity-50 cursor-pointer"
          >
            X
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {editFormError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {editFormError}
            </div>
          )}

          <form
            onSubmit={handleEditEmployeeSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {Object.entries(editFormData).map(([key, value]) => (
              <div
                key={key}
                className={
                  key === "status"
                    ? "flex flex-col gap-1 md:col-span-2"
                    : "flex flex-col gap-1"
                }
              >
                <label
                  className={`text-sm font-semibold ${
                    ["employeeId", "companyId", "email"].includes(key)
                      ? "text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {formatLabel(key)}
                </label>
                {renderEditInputField(key, value)}
              </div>
            ))}

            <div className="mt-4 flex flex-col gap-3 md:col-span-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                className="flex-1 rounded-lg bg-[#F75D42] py-3 font-semibold text-gray-100 transition-colors hover:bg-[#d32a0c] disabled:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 rounded-lg bg-[#008080] py-3 font-semibold text-white transition-colors hover:bg-[#035353] disabled:bg-gray-400 cursor-pointer"
              >
                {isUpdating ? "Updating..." : "Update Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;