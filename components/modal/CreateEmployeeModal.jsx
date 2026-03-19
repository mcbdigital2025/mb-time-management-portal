"use client";

const CreateEmployeeModal = ({
    isOpen,
    onClose,
    isCreating,
    createFormError,
    createFormSuccess,
    createFormData,
    handleCreateEmployeeSubmit,
    formatLabel,
    renderCreateInputField,
    requiredFields,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs px-3 py-6">
            <div className="hero-radial-background max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-teal-200 bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-gray-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
                    <div className="mb-2 flex items-center justify-center">
                        <h2 className="bg-linear-to-r border-b from-[#008080] via-cyan-600 to-[#008080] bg-clip-text text-center text-xl font-bold text-transparent md:text-3xl">
                            Create Employee Profile
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isCreating}
                        className="rounded-lg bg-[#F75D42] px-3 py-2 text-gray-100 transition hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
                    >
                        Close
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    {createFormError && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {createFormError}
                        </div>
                    )}

                    {createFormSuccess && (
                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {createFormSuccess}
                        </div>
                    )}

                    <form
                        onSubmit={handleCreateEmployeeSubmit}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                        {Object.entries(createFormData).map(([key, value]) => (
                            <div key={key} className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">
                                    {formatLabel(key)}{" "}
                                    {requiredFields.includes(key) && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </label>
                                {renderCreateInputField(key, value)}
                            </div>
                        ))}

                        <div className="mt-4 flex flex-col gap-3 md:col-span-2 sm:flex-row">
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="flex-1 rounded-lg bg-[#008080] py-3 font-semibold text-white transition-colors hover:bg-[#035f5f] disabled:bg-gray-400 cursor-pointer"
                            >
                                {isCreating ? "Creating..." : "Create Employee"}
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isCreating}
                                className="flex-1 rounded-lg bg-[#F75D42] py-3 font-semibold text-white transition-colors hover:bg-[#f53918] disabled:bg-gray-400 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEmployeeModal;