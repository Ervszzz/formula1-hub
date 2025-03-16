import React, { useState, useEffect } from "react";
import { getDriverStandings } from "../api/f1Service";

// Team color mapping
const teamColors = {
  "Red Bull": "bg-[#0600EF] border-[#0600EF]",
  Ferrari: "bg-[#DC0000] border-[#DC0000]",
  Mercedes: "bg-[#00D2BE] border-[#00D2BE]",
  McLaren: "bg-[#FF8700] border-[#FF8700]",
  "Aston Martin": "bg-[#006F62] border-[#006F62]",
  Alpine: "bg-[#0090FF] border-[#0090FF]",
  Williams: "bg-[#005AFF] border-[#005AFF]",
  AlphaTauri: "bg-[#2B4562] border-[#2B4562]",
  "Alfa Romeo": "bg-[#900000] border-[#900000]",
  Haas: "bg-[#FFFFFF] border-[#FFFFFF] text-black",
  RB: "bg-[#0600EF] border-[#0600EF]",
  "Racing Bulls": "bg-[#0600EF] border-[#0600EF]",
  "Visa Cash App RB": "bg-[#0600EF] border-[#0600EF]",
  VCARB: "bg-[#0600EF] border-[#0600EF]",
  Sauber: "bg-[#900000] border-[#900000]",
  "Stake F1 Team": "bg-[#900000] border-[#900000]",
  "Stake F1": "bg-[#900000] border-[#900000]",
};

// Text color mapping
const teamTextColors = {
  "Red Bull": "text-[#0600EF]",
  Ferrari: "text-[#DC0000]",
  Mercedes: "text-[#00D2BE]",
  McLaren: "text-[#FF8700]",
  "Aston Martin": "text-[#006F62]",
  Alpine: "text-[#0090FF]",
  Williams: "text-[#005AFF]",
  AlphaTauri: "text-[#2B4562]",
  "Alfa Romeo": "text-[#900000]",
  Haas: "text-[#FFFFFF]",
  RB: "text-[#0600EF]",
  "Racing Bulls": "text-[#0600EF]",
  "Visa Cash App RB": "text-[#0600EF]",
  VCARB: "text-[#0600EF]",
  Sauber: "text-[#900000]",
  "Stake F1 Team": "text-[#900000]",
  "Stake F1": "text-[#900000]",
};

const getTeamColor = (teamName) => {
  return teamColors[teamName] || "bg-gray-700 border-gray-700";
};

const getTeamTextColor = (teamName) => {
  return teamTextColors[teamName] || "text-gray-400";
};

const DriverStandings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllDrivers, setShowAllDrivers] = useState(false);

  const fetchStandings = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Add cache-busting parameter to force fresh data
      const data = await getDriverStandings();
      console.log("Driver standings data received:", data);

      if (data === "No Data Fetched") {
        setError("No Data Fetched");
        setStandings([]);
      } else if (data && Array.isArray(data)) {
        console.log("Setting driver standings:", data);
        setStandings(data);
        setLastUpdated(new Date());
        setError(null);
      } else {
        console.error("Invalid data format received:", data);
        setError("Invalid data format received");
        setStandings([]);
      }

      if (showRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error in driver standings:", err);
      setError("Failed to load driver standings");
      setStandings([]);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  const handleRefresh = () => {
    fetchStandings(true);
  };

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

  // Only show the error state if there's an error AND no standings data
  if (error && standings.length === 0)
    return (
      <section id="standings" className="mb-16 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-red-500 mr-3"></div>
            <div>
              <h2 className="text-2xl font-bold">DRIVER STANDINGS</h2>
              <div className="tech-text text-xs text-red-500 tracking-wider">
                CURRENT SEASON
              </div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="tech-text text-xs px-4 py-2 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 tech-corner"
          >
            REFRESH DATA
          </button>
        </div>
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

  if (standings.length === 0) return null;

  // Display only top 5 drivers or all drivers based on state
  const displayedStandings = showAllDrivers ? standings : standings.slice(0, 5);

  return (
    <section id="standings" className="mb-16 pt-8">
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
          onClick={handleRefresh}
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

      <div className="tech-card tech-corner overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar max-h-[500px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#0A0F1B] z-10">
              <tr className="border-b border-red-500/20">
                <th className="py-4 px-6 text-left tech-text text-xs text-red-500 tracking-wider">
                  POS
                </th>
                <th className="py-4 px-6 text-left tech-text text-xs text-red-500 tracking-wider">
                  DRIVER
                </th>
                <th className="py-4 px-6 text-left tech-text text-xs text-red-500 tracking-wider">
                  TEAM
                </th>
                <th className="py-4 px-6 text-right tech-text text-xs text-red-500 tracking-wider">
                  WINS
                </th>
                <th className="py-4 px-6 text-right tech-text text-xs text-red-500 tracking-wider">
                  POINTS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E232F]/30">
              {displayedStandings.map((driver, index) => (
                <tr
                  key={index}
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
                      className={`w-8 h-8 flex items-center justify-center border ${
                        index === 0
                          ? "border-yellow-500 text-yellow-500"
                          : index === 1
                          ? "border-gray-400 text-gray-400"
                          : index === 2
                          ? "border-amber-700 text-amber-700"
                          : "border-red-500/30 text-gray-400"
                      }`}
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
                          backgroundColor: getTeamColor(
                            driver.Constructor?.name
                          ),
                        }}
                      ></div>
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
                      className={`px-3 py-1 text-xs tech-text font-bold ${getTeamTextColor(
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
          onClick={() => setShowAllDrivers(!showAllDrivers)}
          className="tech-text text-xs px-6 py-3 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 tech-corner"
        >
          {showAllDrivers
            ? "SHOW TOP 5"
            : `SHOW ALL DRIVERS (${standings.length})`}
        </button>
      </div>
    </section>
  );
};

export default DriverStandings;
