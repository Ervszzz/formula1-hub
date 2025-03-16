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
  Ligier: "bg-blue-200",
  Dallara: "bg-red-900",
  Osella: "bg-red-700",
  "Leyton House": "bg-teal-100",
  Eurobrun: "bg-orange-300",
  Lotus: "bg-black",
  Alfa: "bg-red-800",
  RB: "bg-blue-800",
  Haas: "bg-gray-500",
  VCARB: "bg-blue-600",
  "Racing Bulls": "bg-blue-600",
  "Visa Cash App RB": "bg-blue-600",
  "Stake F1 Team": "bg-red-800",
  "Stake F1": "bg-red-800",
};

const getTeamColor = (teamName) => {
  return teamColors[teamName] || "bg-gray-700";
};

const LastRaceResults = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewAll, setViewAll] = useState(false);
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

    // Set up an interval to check for updates every 5 minutes
    const intervalId = setInterval(() => {
      fetchResults(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    fetchResults(true);
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
          <div className="tech-text text-xs text-red-500 tracking-wider mb-1">
            RACE WINNER
          </div>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 border border-red-500/30 bg-black flex items-center justify-center mr-4">
              <span className="tech-text text-red-500 text-lg">1</span>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {results.results[0].Driver.givenName}{" "}
                {results.results[0].Driver.familyName}
              </div>
              <div className="flex items-center">
                <span
                  className="px-3 py-1 text-xs tech-text border mr-2"
                  style={{
                    borderColor: getTeamColor(
                      results.results[0].Constructor.name
                    ),
                    color: getTeamColor(results.results[0].Constructor.name),
                  }}
                >
                  {results.results[0].Constructor.name}
                </span>
                <span className="tech-text text-gray-400 text-sm">
                  {results.results[0].Time?.time || results.results[0].status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-black/30 border border-red-500/20 p-4 text-center">
              <div className="tech-text text-xs text-red-500 mb-1">GRID</div>
              <div className="text-xl font-bold">{results.results[0].grid}</div>
            </div>
            <div className="bg-black/30 border border-red-500/20 p-4 text-center">
              <div className="tech-text text-xs text-red-500 mb-1">LAPS</div>
              <div className="text-xl font-bold">{results.results[0].laps}</div>
            </div>
            <div className="bg-black/30 border border-red-500/20 p-4 text-center">
              <div className="tech-text text-xs text-red-500 mb-1">POINTS</div>
              <div className="text-xl font-bold tech-glow">
                {results.results[0].points}
              </div>
            </div>
          </div>

          {results.results[0].FastestLap && (
            <div className="mt-6 bg-black/30 border border-red-500/20 p-4">
              <div className="tech-text text-xs text-red-500 mb-2">
                FASTEST LAP
              </div>
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold tech-glow">
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
            <div className="space-y-2">
              {results.results.slice(0, 3).map((result, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-[#1A1F2A]/30 transition-colors duration-150 flex items-center"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center border mr-3 ${
                      index === 0
                        ? "border-yellow-500 text-yellow-500"
                        : index === 1
                        ? "border-gray-400 text-gray-400"
                        : "border-amber-700 text-amber-700"
                    }`}
                  >
                    <span className="tech-text text-sm">{result.position}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">
                      {result.Driver.givenName} {result.Driver.familyName}
                    </div>
                    <div className="flex items-center">
                      <span
                        className="w-2 h-2 mr-1"
                        style={{
                          backgroundColor: getTeamColor(
                            result.Constructor.name
                          ),
                        }}
                      ></span>
                      <span className="tech-text text-xs text-gray-400">
                        {result.Constructor.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">
                      {result.Time?.time || result.status}
                    </div>
                    <div className="tech-text text-xs text-red-500">
                      {result.points} PTS
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tech-card p-6 tech-corner">
        <div className="grid grid-cols-12 gap-4 mb-4 text-xs font-semibold text-gray-400">
          <div className="col-span-1">POS</div>
          <div className="col-span-3">DRIVER</div>
          <div className="col-span-3">TEAM</div>
          <div className="col-span-1">GRID</div>
          <div className="col-span-1">LAPS</div>
          <div className="col-span-2">TIME/STATUS</div>
          <div className="col-span-1">PTS</div>
        </div>

        {displayedResults.map((result, index) => (
          <div
            key={index}
            className={`grid grid-cols-12 gap-4 py-3 text-sm ${
              index !== displayedResults.length - 1
                ? "border-b border-gray-800"
                : ""
            }`}
          >
            <div className="col-span-1 font-bold">{result.position}</div>
            <div className="col-span-3 flex items-center">
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
            <div className="col-span-3 flex items-center">
              {result.Constructor.name}
            </div>
            <div className="col-span-1">{result.grid}</div>
            <div className="col-span-1">{result.laps}</div>
            <div className="col-span-2">
              {result.Time ? result.Time.time : result.status}
            </div>
            <div className="col-span-1">{result.points}</div>
          </div>
        ))}

        {!viewAll && results.results.length > 10 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setViewAll(true)}
              className="tech-text text-xs px-4 py-2 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 tech-corner"
            >
              SHOW ALL {results.results.length} DRIVERS
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LastRaceResults;
