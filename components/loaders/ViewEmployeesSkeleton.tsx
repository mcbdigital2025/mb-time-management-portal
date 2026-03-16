"use client";

const SkeletonBlock = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 ${className}`}
    />
  );
};

const ViewEmployeesSkeleton = () => {
  return (
    <div className="relative min-h-[90vh] w-full overflow-x-hidden flex flex-col items-center justify-center hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] px-3 sm:px-4 md:px-6 py-6 md:py-10">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute top-10 left-6 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-300 opacity-20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-6 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 bg-teal-300 opacity-20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-300 opacity-10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl">
        <div className="bg-white/70 rounded-2xl shadow-sm border border-teal-400/30 overflow-hidden">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <SkeletonBlock className="h-7 w-56" />
              <SkeletonBlock className="h-4 w-80 max-w-full" />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <SkeletonBlock className="h-10 w-full sm:w-40" />
            </div>
          </div>

          {/* Alert placeholder */}
          <div className="px-4 sm:px-6 pb-4">
            <SkeletonBlock className="h-12 w-full" />
          </div>

          {/* Table */}
          <div className="px-4 sm:px-6 pb-6">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* Table header */}
              <div className="grid grid-cols-6 gap-4 px-4 py-4 border-b border-gray-200 bg-gray-50">
                <SkeletonBlock className="h-4 w-12" />
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-4 w-16" />
              </div>

              {/* Table rows */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-4 px-4 py-4 border-b border-gray-100 last:border-b-0"
                >
                  <SkeletonBlock className="h-4 w-14" />
                  <SkeletonBlock className="h-4 w-28" />
                  <SkeletonBlock className="h-4 w-40" />
                  <SkeletonBlock className="h-6 w-24 rounded-full" />
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="h-6 w-16 rounded-full" />
                </div>
              ))}

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4 border-t border-gray-200 bg-gray-50">
                <SkeletonBlock className="h-4 w-36" />
                <SkeletonBlock className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeesSkeleton;