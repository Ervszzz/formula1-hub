const ScheduleSkeleton = () => (
  <section id="schedule" className="h-full sticky top-24 animate-pulse">
    {/* Header */}
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-1 h-6 bg-red-500 mr-3"></div>
        <div>
          <div className="h-7 w-36 bg-gray-700/30 rounded"></div>
          <div className="h-3 w-24 bg-gray-700/30 rounded mt-1"></div>
        </div>
      </div>
      <div className="h-7 w-20 bg-gray-700/30 rounded"></div>
    </div>

    {/* Next race card skeleton */}
    <div className="mb-6 tech-card tech-corner">
      <div className="p-6">
        <div className="h-3 w-36 bg-gray-700/30 rounded mb-1"></div>
        <div className="h-6 w-48 bg-gray-700/30 rounded mb-2"></div>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-700/30 mr-3 flex-shrink-0"></div>
          <div>
            <div className="h-5 w-32 bg-gray-700/30 rounded mb-1"></div>
            <div className="h-3 w-20 bg-gray-700/30 rounded"></div>
          </div>
        </div>
        <div className="h-3 w-52 bg-gray-700/30 rounded"></div>
      </div>
    </div>

    {/* Race list skeleton */}
    <div className="tech-card tech-corner">
      <div className="p-4">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-3 flex items-center">
              <div className="w-8 h-8 bg-gray-700/30 mr-3 flex-shrink-0"></div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-4 w-36 bg-gray-700/30 rounded mb-1"></div>
                    <div className="h-3 w-28 bg-gray-700/30 rounded"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-16 bg-gray-700/30 rounded mb-1"></div>
                    <div className="h-3 w-10 bg-gray-700/30 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="ml-3 w-2 h-2 bg-gray-700/30 flex-shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ScheduleSkeleton;
