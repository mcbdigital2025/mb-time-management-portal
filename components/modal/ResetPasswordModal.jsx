"use client";

const ResetPasswordModal = ({
  isOpen,
  onClose,
  onConfirm,
  isResettingPassword,
  employeeToReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-red-200 bg-white shadow-2xl">
        <div className="border-b border-red-100 bg-red-50 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Confirm Password Reset
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            This will reset the password for the selected employee.
          </p>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-sm text-gray-500">Employee</div>
            <div className="mt-1 font-semibold text-gray-900">
              {employeeToReset?.firstName} {employeeToReset?.lastName}
            </div>
            <div className="text-sm text-gray-600">
              {employeeToReset?.email || "No email available"}
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-700">
            Are you sure you want to reset this employee&apos;s password?
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isResettingPassword}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isResettingPassword}
              className="rounded-lg bg-[#F75D42] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#d94c34] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isResettingPassword ? "Resetting..." : "Yes, Reset Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;