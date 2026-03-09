import React, { useState } from "react";
import { getDriverStandings } from "../api/f1Service";
import { useFetchData } from "../hooks/useFetchData";
import { getTeamHexColor, getTeamTextClass } from "../utils/teamColors";

const positionClass = (index) => {
  if (index === 0) return "border-yellow-500 text-yellow-500";
  if (index === 1) return "border-gray-400 text-gray-400";
  if (index === 2) return "border-amber-700 text-amber-700";
  return "border-red-500/30 text-gray-400";
};

const SectionHeader = ({ lastUpdated, onRefresh, refreshing }) => (
  <div className="mb-6 flex items-center justify-between">
    <div className="flex items-center">
      <div className="w-1 h-6 bg-red-500 mr-3"></div>
      <div>
        <h2 className="text-2xl font-bold">DRIVER STANDINGS</h2>
        <div className="tech-text text-xs text-red-500 tracking-wider">
          {lastUpdated && `UPDATED ${lastUpdated.toLocaleTimeString()} • `}
          CURRENT SEASON
        </div>
      </div>
    </div>
    <button
      onClick={onRefresh}
      disabled={refreshing}
      className={`tech-text text-xs px-4 py-2 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 tech-corner flex items-center ${
        refreshing ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {refreshing ? (
        <>
          <div className="w-3 h-3 border-t-transparent border border-red-500 rounded-full animate-spin mr-2"></div>
          UPDATING
        </>
      ) : (
        "REFRESH DATA"
      )}
    </button>
  </div>
);

const DriverStandings = () => {
  const { data: standings, loading, error, refreshing, lastUpdated, refresh } =
    useFetchData(getDriverStandings, Array.isArray);
  const [showAll, setShowAll] = useState(false);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-2 border-red-500/50 rounded-sm opacity-25 animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-2 border-t-transparent border-red-500 rounded-sm animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="tech-text text-red-500 text-xs">LOADING</span>
          </div>
        </div>
      </div>
    );

  if (error && !standings)
    return (
      <section id="standings" className="mb-16 pt-8">
        <SectionHeader onRefresh={refresh} refreshing={refreshing} />
        <div className="tech-card p-6 flex items-center justify-center tech-corner">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border border-red-500/30 rounded-sm flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="tech-text text-red-500 text-sm tracking-wider">
              {error || "DATA UNAVAILABLE"}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              ERR_DATA_FETCH_FAILED
            </div>
          </div>
        </div>
      </section>
    );

  if (!standings?.length) return null;

  const displayed = showAll ? standings : standings.slice(0, 5);

  return (
    <section id="standings" className="mb-16 pt-8">
      <SectionHeader
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        refreshing={refreshing}
      />

      <div className="tech-card tech-corner overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar max-h-[500px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#0A0F1B] z-10">
              <tr className="border-b border-red-500/20">
                {["POS", "DRIVER", "TEAM", "WINS", "POINTS"].map((col, i) => (
                  <th
                    key={col}
                    className={`py-4 px-6 tech-text text-xs text-red-500 tracking-wider ${
                      i >= 3 ? "text-right" : "text-left"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E232F]/30">
              {displayed.map((driver, index) => (
                <tr
                  key={driver.Driver?.driverId ?? index}
                  className={`${
                    index < 3
                      ? "bg-red-500/5"
                      : index % 2 === 0
                      ? "bg-transparent"
                      : "bg-[#1A1F2A]/10"
                  } hover:bg-[#1A1F2A]/20 transition-colors duration-150`}
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div
                      className={`w-8 h-8 flex items-center justify-center border ${positionClass(index)}`}
                    >
                      <span className="tech-text text-sm">
                        {driver.position}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-1 h-10 mr-4"
                        style={{
                          backgroundColor: getTeamHexColor(
                            driver.Constructor?.name
                          ),
                        }}
                      />
                      <div>
                        <div className="font-medium">
                          {driver.Driver?.givenName} {driver.Driver?.familyName}
                        </div>
                        <div className="tech-text text-xs text-gray-400">
                          {driver.Driver?.nationality}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs tech-text font-bold ${getTeamTextClass(
                        driver.Constructor?.name
                      )}`}
                    >
                      {driver.Constructor?.name}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <span className="tech-text text-gray-300">
                      {driver.wins}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <span className="font-bold text-white tech-glow">
                      {driver.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowAll(!showAll)}
          className="tech-text text-xs px-6 py-3 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 tech-corner"
        >
          {showAll ? "SHOW TOP 5" : `SHOW ALL DRIVERS (${standings.length})`}
        </button>
      </div>
    </section>
  );
};

export default DriverStandings;
