"use client";

export default function Modal({ isOpen, title, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <h2 className="text-lg font-extrabold text-zinc-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[85vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}