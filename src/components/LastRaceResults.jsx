import React, { useState, useEffect } from "react";
import { getLastRaceResults } from "../api/f1Service";

// Team color mapping
const teamColors = {
  "Red Bull": "bg-blue-800",
  Ferrari: "bg-red-600",
  Mercedes: "bg-teal-500",
  McLaren: "bg-orange-500",
  "Aston Martin": "bg-green-600",
  Alpine: "bg-blue-500",
  Williams: "bg-blue-700",
  AlphaTauri: "bg-navy-500",
  "Alfa Romeo": "bg-red-800",
  "Haas F1 Team": "bg-gray-500",
  "Racing Point": "bg-pink-500",
  Renault: "bg-yellow-500",
  "Toro Rosso": "bg-blue-600",
  Sauber: "bg-red-700",
  "Force India": "bg-pink-600",
  "Lotus F1": "bg-black",
  Marussia: "bg-red-500",
  Caterham: "bg-green-500",
  HRT: "bg-gray-600",
  Virgin: "bg-red-400",
  "Brawn GP": "bg-green-400",
  Toyota: "bg-red-300",
  "Super Aguri": "bg-white",
  Spyker: "bg-orange-600",
  Midland: "bg-red-200",
  Minardi: "bg-black",
  Jaguar: "bg-green-700",
  BAR: "bg-white",
  Jordan: "bg-yellow-600",
  Arrows: "bg-orange-700",
  Prost: "bg-blue-400",
  Benetton: "bg-green-300",
  Stewart: "bg-white",
  Tyrrell: "bg-blue-300",
  Lola: "bg-red-100",
  Forti: "bg-yellow-700",
  Simtek: "bg-purple-500",
  Pacific: "bg-teal-400",
  Larrousse: "bg-yellow-400",
  Footwork: "bg-white",
  Brabham: "bg-teal-300",
  "Andrea Moda": "bg-black",
  March: "bg-green-200",
  Fondmetal: "bg-teal-200",
  Coloni: "bg-yellow-300",
};

// Text color mapping
const teamTextColors = {
  "Red Bull": "text-blue-800",
  Ferrari: "text-red-600",
  Mercedes: "text-teal-500",
  McLaren: "text-orange-500",
  "Aston Martin": "text-green-600",
  Alpine: "text-blue-500",
  Williams: "text-blue-700",
  AlphaTauri: "text-navy-500",
  "Alfa Romeo": "text-red-800",
  "Haas F1 Team": "text-gray-500",
  "Racing Point": "text-pink-500",
  Renault: "text-yellow-500",
  "Toro Rosso": "text-blue-600",
  Sauber: "text-red-700",
  "Force India": "text-pink-600",
  "Lotus F1": "text-black",
  Marussia: "text-red-500",
  Caterham: "text-green-500",
  HRT: "text-gray-600",
  Virgin: "text-red-400",
  "Brawn GP": "text-green-400",
  Toyota: "text-red-300",
  "Super Aguri": "text-white",
  Spyker: "text-orange-600",
  Midland: "text-red-200",
  Minardi: "text-black",
  Jaguar: "text-green-700",
  BAR: "text-white",
  Jordan: "text-yellow-600",
  Arrows: "text-orange-700",
  Prost: "text-blue-400",
  Benetton: "text-green-300",
  Stewart: "text-white",
  Tyrrell: "text-blue-300",
  Lola: "text-red-100",
  Forti: "text-yellow-700",
  Simtek: "text-purple-500",
  Pacific: "text-teal-400",
  Larrousse: "text-yellow-400",
  Footwork: "text-white",
  Brabham: "text-teal-300",
  "Andrea Moda": "text-black",
  March: "text-green-200",
  Fondmetal: "text-teal-200",
  Coloni: "text-yellow-300",
};

const getTeamColor = (teamName) => {
  return teamColors[teamName] || "bg-gray-500";
};

const getTeamTextColor = (teamName) => {
  return teamTextColors[teamName] || "text-gray-500";
};

const LastRaceResults = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [showAllPositions, setShowAllPositions] = useState(false);
  const [showAllDriversInPositions, setShowAllDriversInPositions] =
    useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchResults = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Add timestamp to force fresh data
      const data = await getLastRaceResults();
      console.log("Last race results data received:", data);

      if (data === "No Data Fetched") {
        setError("No Data Fetched");
        setResults(null);
      } else if (data && data.results && Array.isArray(data.results)) {
        console.log("Setting last race results:", data);
        setResults(data);
        // Check if data is from previous season
        if (data.season < new Date().getFullYear()) {
          setError(`Showing data from ${data.season} season`);
        } else {
          // Set a message for current season data but don't treat it as an error
          setError(null);
        }
        setLastUpdated(new Date());
      } else {
        console.error("Invalid data format received:", data);
        setError("Invalid data format received");
        setResults(null);
      }

      if (showRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error in last race results:", err);
      setError("Failed to load last race results");
      setResults(null);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleRefresh = () => {
    fetchResults(true);
  };

  if (loading)
    return (
      <div className="tech-card p-6 tech-corner animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );

  // Only show the error state if there's an error AND no results data
  if (error && !results)
    return (
      <section id="results" className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-red-500 mr-3"></div>
            <div>
              <h2 className="text-2xl font-bold">LAST RACE RESULTS</h2>
              <div className="tech-text text-xs text-red-500 tracking-wider">
                MOST RECENT GRAND PRIX
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

  if (!results) return null;

  const displayedResults = viewAll
    ? results.results
    : results.results.slice(0, 10);

  return (
    <section id="results" className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-red-500 mr-3"></div>
          <div>
            <h2 className="text-2xl font-bold">LAST RACE RESULTS</h2>
            <div className="tech-text text-xs text-red-500 tracking-wider">
              {error ? error + " • " : ""}
              {results.raceName.toUpperCase()} •{" "}
              {new Date(results.date)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                .toUpperCase()}
              {lastUpdated && ` • UPDATED ${lastUpdated.toLocaleTimeString()}`}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
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
          <button
            onClick={() => setViewAll(!viewAll)}
            className="tech-text text-xs px-4 py-2 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 tech-corner"
          >
            {viewAll ? "SHOW TOP 10" : "VIEW ALL"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="tech-card tech-corner tech-scan p-6">
          <div className="tech-text text-xs text-red-500 tracking-wider mb-4">
            RACE WINNER
          </div>
          <div className="flex items-center">
            <div className="w-12 h-12 border border-yellow-500 bg-black flex items-center justify-center mr-4">
              <span className="tech-text text-yellow-500 text-xl">1</span>
            </div>
            <div className="flex-grow">
              <div className="text-2xl font-bold">
                {results.results[0].Driver.givenName}{" "}
                {results.results[0].Driver.familyName}
              </div>
              <div className="flex items-center">
                <span
                  className={`text-sm tech-text font-bold ${getTeamTextColor(
                    results.results[0].Constructor.name
                  )}`}
                >
                  {results.results[0].Constructor.name}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-lg">
                {results.results[0].Time?.time || results.results[0].status}
              </div>
              <div className="tech-text text-red-500 text-sm">
                {results.results[0].points} PTS
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 border border-red-500/20 p-4 text-center">
              <div className="tech-text text-xs text-red-500 mb-1">GRID</div>
              <div className="text-2xl font-bold">
                {results.results[0].grid}
              </div>
            </div>
            <div className="bg-black/30 border border-red-500/20 p-4 text-center">
              <div className="tech-text text-xs text-red-500 mb-1">LAPS</div>
              <div className="text-2xl font-bold">
                {results.results[0].laps}
              </div>
            </div>
            <div className="bg-black/30 border border-red-500/20 p-4 text-center">
              <div className="tech-text text-xs text-red-500 mb-1">POINTS</div>
              <div className="text-2xl font-bold tech-glow">
                {results.results[0].points}
              </div>
            </div>
          </div>

          {results.results[0].FastestLap && (
            <div className="bg-black/30 border border-red-500/20 p-4">
              <div className="tech-text text-xs text-red-500 mb-3 text-center">
                FASTEST LAP
              </div>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold tech-glow">
                  {results.results[0].FastestLap.Time.time}
                </div>
                <div className="tech-text text-sm text-gray-400">
                  LAP {results.results[0].FastestLap.lap}
                </div>
              </div>
              <div className="tech-text text-xs text-gray-400 mt-1">
                {results.results[0].FastestLap.AverageSpeed.speed}{" "}
                {results.results[0].FastestLap.AverageSpeed.units}
              </div>
            </div>
          )}
        </div>

        <div className="tech-card tech-corner">
          <div className="p-4">
            <div className="tech-text text-xs text-red-500 tracking-wider mb-3 border-b border-red-500/20 pb-2">
              PODIUM FINISHERS
            </div>
            <div className="space-y-3">
              {results.results.slice(0, 3).map((result, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-[#1A1F2A]/30 transition-colors duration-150 flex items-center"
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center border mr-3 ${
                      index === 0
                        ? "border-yellow-500 text-yellow-500"
                        : index === 1
                        ? "border-gray-400 text-gray-400"
                        : "border-amber-700 text-amber-700"
                    }`}
                  >
                    <span className="tech-text text-lg">{result.position}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold">
                      {result.Driver.givenName} {result.Driver.familyName}
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`text-sm tech-text font-bold ${getTeamTextColor(
                          result.Constructor.name
                        )}`}
                      >
                        {result.Constructor.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {result.Time?.time || result.status}
                    </div>
                    <div className="tech-text text-red-500 text-sm">
                      {result.points} PTS
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 mb-6">
        <button
          onClick={() => setShowAllPositions(!showAllPositions)}
          className="tech-text text-xs px-6 py-3 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 tech-corner"
        >
          {showAllPositions ? "HIDE ALL POSITIONS" : "SHOW ALL POSITIONS"}
        </button>
      </div>

      {showAllPositions && (
        <div className="tech-card p-6 tech-corner">
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
                  <th className="py-4 px-6 text-left tech-text text-xs text-red-500 tracking-wider">
                    GRID
                  </th>
                  <th className="py-4 px-6 text-left tech-text text-xs text-red-500 tracking-wider">
                    LAPS
                  </th>
                  <th className="py-4 px-6 text-left tech-text text-xs text-red-500 tracking-wider">
                    TIME/STATUS
                  </th>
                  <th className="py-4 px-6 text-right tech-text text-xs text-red-500 tracking-wider">
                    PTS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E232F]/30">
                {(showAllDriversInPositions
                  ? results.results
                  : results.results.slice(0, 5)
                ).map((result, index) => (
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
                          {result.position}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-1 h-10 ${getTeamColor(
                            result.Constructor.name
                          )} mr-3`}
                        ></div>
                        <div>
                          <div className="font-bold">
                            {result.Driver.familyName.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {result.Driver.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs tech-text ${getTeamTextColor(
                          result.Constructor.name
                        )} font-medium`}
                      >
                        {result.Constructor.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {result.grid}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {result.laps}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {result.Time ? result.Time.time : result.status}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <span className="font-bold text-white tech-glow">
                        {result.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!showAllDriversInPositions && results.results.length > 5 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAllDriversInPositions(true)}
                className="tech-text text-xs px-4 py-2 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 tech-corner"
              >
                SHOW ALL {results.results.length} DRIVERS
              </button>
            </div>
          )}

          {showAllDriversInPositions && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAllDriversInPositions(false)}
                className="tech-text text-xs px-4 py-2 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 tech-corner"
              >
                SHOW TOP 5
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default LastRaceResults;
