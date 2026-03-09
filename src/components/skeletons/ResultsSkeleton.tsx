const ResultsSkeleton = () => (
  <section id="results" className="mb-16">
    <div className="flex justify-between items-center mb-6 animate-pulse">
      <div className="flex items-center">
        <div className="w-1 h-6 bg-red-500 mr-3"></div>
        <div>
          <div className="h-7 w-44 bg-gray-700/30 rounded"></div>
          <div className="h-3 w-56 bg-gray-700/30 rounded mt-1"></div>
        </div>
      </div>
      <div className="h-9 w-28 bg-gray-700/30 rounded"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      {/* Winner card skeleton */}
      <div className="tech-card tech-corner p-6">
        <div className="h-3 w-24 bg-gray-700/30 rounded mb-4"></div>
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gray-700/30 mr-4 flex-shrink-0"></div>
          <div className="flex-grow">
            <div className="h-6 w-40 bg-gray-700/30 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-700/30 rounded"></div>
          </div>
          <div className="text-right">
            <div className="h-5 w-20 bg-gray-700/30 rounded mb-1"></div>
            <div className="h-4 w-12 bg-gray-700/30 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-black/30 border border-red-500/20 p-4 text-center">
              <div className="h-3 w-12 bg-gray-700/30 rounded mx-auto mb-2"></div>
              <div className="h-8 w-8 bg-gray-700/30 rounded mx-auto"></div>
            </div>
          ))}
        </div>
        <div className="bg-black/30 border border-red-500/20 p-4">
          <div className="h-3 w-24 bg-gray-700/30 rounded mx-auto mb-3"></div>
          <div className="flex justify-between items-center">
            <div className="h-8 w-28 bg-gray-700/30 rounded"></div>
            <div className="h-4 w-16 bg-gray-700/30 rounded"></div>
          </div>
        </div>
      </div>

      {/* Podium card skeleton */}
      <div className="tech-card tech-corner">
        <div className="p-4">
          <div className="h-3 w-32 bg-gray-700/30 rounded mb-3 border-b border-red-500/20 pb-2"></div>
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-3 flex items-center">
                <div className="w-10 h-10 bg-gray-700/30 mr-3 flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="h-4 w-36 bg-gray-700/30 rounded mb-1"></div>
                  <div className="h-3 w-24 bg-gray-700/30 rounded"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-20 bg-gray-700/30 rounded mb-1"></div>
                  <div className="h-3 w-12 bg-gray-700/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ResultsSkeleton;
