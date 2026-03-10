const EmployeeProfileSkeleton = () => {
  return (
    <div className="min-h-screen w-full py-10 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white/20 backdrop-blur-xl shadow-[0_10px_10px_rgba(0,0,0,0.15)] rounded-lg overflow-hidden">
          <div className="p-8 animate-pulse">
            <div className="flex flex-col md:flex-row gap-10">
              
              {/* LEFT SIDE */}
              <div className="md:w-1/3 flex flex-col items-center">
                
                {/* Avatar */}
                <div className="w-38 h-38 rounded-full bg-gray-300/60 border md:mt-6"></div>

                {/* Edit button */}
                <div className="mt-4 h-4 w-20 bg-gray-300/60 rounded"></div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex-1">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-7 w-40 bg-gray-300/60 rounded"></div>

                  <div className="flex gap-3">
                    <div className="h-8 w-36 bg-gray-300/60 rounded-lg"></div>
                    <div className="h-8 w-24 bg-gray-300/60 rounded-lg"></div>
                  </div>
                </div>

                {/* Top fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonField key={i} />
                  ))}
                </div>

                {/* Email */}
                <div className="mt-6">
                  <SkeletonField full />
                </div>

                {/* Remaining fields */}
                <div className="mt-8 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonField key={i} />
                  ))}
                </div>

                {/* Employee ID */}
                <SkeletonField />

                {/* Save button */}
                <div className="mt-8 flex justify-end">
                  <div className="h-10 w-36 bg-gray-300/60 rounded-lg"></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const SkeletonField = ({ full }: { full?: boolean }) => {
  return (
    <div className={`flex flex-col ${full ? "col-span-2" : ""}`}>
      <div className="h-3 w-24 bg-gray-300/60 rounded mb-2"></div>
      <div className="h-10 w-full bg-gray-300/60 rounded"></div>
    </div>
  );
};

export default EmployeeProfileSkeleton;