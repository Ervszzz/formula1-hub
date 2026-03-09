const StandingsSkeleton = () => (
  <section id="standings" className="mb-16 pt-8">
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-1 h-6 bg-red-500 mr-3"></div>
        <div>
          <div className="h-7 w-48 bg-gray-700/30 animate-pulse rounded"></div>
          <div className="h-3 w-32 bg-gray-700/30 animate-pulse rounded mt-1"></div>
        </div>
      </div>
      <div className="h-9 w-28 bg-gray-700/30 animate-pulse rounded"></div>
    </div>

    <div className="tech-card tech-corner overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-red-500/20">
              {["POS", "DRIVER", "TEAM", "WINS", "POINTS"].map((col, i) => (
                <th
                  key={col}
                  className={`py-4 px-6 tech-text text-xs text-red-500 tracking-wider ${i >= 3 ? "text-right" : "text-left"}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E232F]/30">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="py-4 px-6">
                  <div className="w-8 h-8 bg-gray-700/30 rounded"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-gray-700/30 mr-4"></div>
                    <div>
                      <div className="h-4 w-32 bg-gray-700/30 rounded mb-1"></div>
                      <div className="h-3 w-20 bg-gray-700/30 rounded"></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-6 w-24 bg-gray-700/30 rounded"></div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="h-4 w-6 bg-gray-700/30 rounded ml-auto"></div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="h-4 w-12 bg-gray-700/30 rounded ml-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default StandingsSkeleton;
