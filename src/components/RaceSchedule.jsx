import React, { useState, useEffect } from "react";
import { getRaceSchedule } from "../api/f1Service";

const RaceSchedule = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seasonYear, setSeasonYear] = useState(new Date().getFullYear());
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRaces = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      // Use the current year
      const currentYear = new Date().getFullYear();
      setSeasonYear(currentYear);

      console.log("Fetching race schedule for year:", currentYear);
      const data = await getRaceSchedule(currentYear);
      console.log("Race schedule data received:", data);
      console.log("Data type:", typeof data, Array.isArray(data));

      if (data === "No Data Fetched") {
        console.log("No data fetched from API");
        setError("No Data Fetched");
        setRaces([]);
      } else if (data && Array.isArray(data) && data.length > 0) {
        console.log(`Received ${data.length} races, first race:`, data[0]);

        // Verify that the data has the expected structure
        const hasValidStructure = data.every(
          (race) =>
            race &&
            race.season &&
            race.round &&
            race.raceName &&
            race.date &&
            race.Circuit &&
            race.Circuit.circuitName &&
            race.Circuit.Location &&
            race.Circuit.Location.locality &&
            race.Circuit.Location.country
        );

        if (!hasValidStructure) {
          console.error("Race data has invalid structure:", data[0]);
          setError("Invalid data structure");
          setRaces([]);
          setLoading(false);
          setIsRefreshing(false);
          return;
        }

        // The OpenF1 API already returns dates in the correct format
        // and our service handles year adjustments, so we can use the data directly
        setRaces(data);

        // Check if data is from previous season
        if (data[0].season < currentYear) {
          console.log(`Data is from previous season: ${data[0].season}`);
          setError(`Showing data from ${data[0].season} season`);
          setSeasonYear(data[0].season);
        } else {
          console.log("Data is from current season");
          setError(null);
        }

        setLastUpdated(new Date());
      } else {
        console.warn("No race schedule data returned or empty array");
        console.warn("Data received:", data);
        setError("No data fetched");
        setRaces([]);
      }

      if (isManualRefresh) {
        setIsRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error in race schedule:", err);
      setError("Failed to load race schedule");
      setRaces([]);
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchRaces(true);
  };

  useEffect(() => {
    fetchRaces();

    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchRaces(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full min-h-[500px]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-2 border-red-500/50 rounded-sm opacity-25 animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-2 border-t-transparent border-red-500 rounded-sm animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="tech-text text-red-500 text-xs">LOADING</span>
          </div>
        </div>
      </div>
    );

  if (error || races.length === 0)
    return (
      <section id="schedule" className="h-full sticky top-24">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-red-500 mr-3"></div>
            <div>
              <h2 className="text-2xl font-bold">RACE CALENDAR</h2>
              <div className="tech-text text-xs text-red-500 tracking-wider">
                {seasonYear} SEASON
              </div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`tech-button px-3 py-1 text-xs ${
              isRefreshing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isRefreshing ? "REFRESHING..." : "REFRESH"}
          </button>
        </div>
        <div className="tech-card p-6 h-[calc(100%-100px)] flex items-center justify-center tech-corner">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="tech-text text-red-500 text-sm tracking-wider">
              {error || "NO DATA AVAILABLE"}
            </p>
            <div className="mt-2 text-xs text-gray-500">
              ERR_DATA_FETCH_FAILED
            </div>
          </div>
        </div>
      </section>
    );

  // Function to format date
  const formatDate = (dateString, timeString) => {
    try {
      if (!dateString) return "TBD";
      // Handle different date formats
      let date;
      if (typeof dateString === "string" && dateString.includes("T")) {
        // ISO format with time
        date = new Date(dateString);
      } else if (timeString) {
        // Separate date and time
        date = new Date(`${dateString}T${timeString || "00:00:00Z"}`);
      } else {
        // Just date
        date = new Date(dateString);
      }

      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", e, dateString, timeString);
      return "Date TBD";
    }
  };

  // Function to format time
  const formatTime = (dateString, timeString) => {
    try {
      if (!dateString) return "";

      // Handle different time formats
      let date;
      if (typeof dateString === "string" && dateString.includes("T")) {
        // ISO format with time
        date = new Date(dateString);
      } else if (timeString) {
        // Separate date and time
        date = new Date(`${dateString}T${timeString}`);
      } else {
        // No time available
        return "";
      }

      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      console.error("Error formatting time:", e, dateString, timeString);
      return "";
    }
  };

  // Function to check if race is in the past
  const isPastRace = (dateString) => {
    if (!dateString) return false;
    try {
      const raceDate = new Date(dateString);
      const today = new Date();
      return raceDate < today;
    } catch (e) {
      return false;
    }
  };

  // Function to get next race
  const getNextRace = () => {
    const today = new Date();
    return races.find((race) => new Date(race.date) > today) || null;
  };

  const nextRace = getNextRace();

  // Calculate days until next race
  const getDaysUntilRace = (raceDate) => {
    const today = new Date();
    const race = new Date(raceDate);
    const diffTime = Math.abs(race - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Group races by month
  const groupedRaces = races.reduce((acc, race) => {
    try {
      const date = new Date(race.date);
      const month = date.toLocaleString("default", { month: "long" });

      if (!acc[month]) {
        acc[month] = [];
      }

      acc[month].push(race);
    } catch (e) {
      // If date parsing fails, add to "Unknown" group
      if (!acc["Unknown"]) {
        acc["Unknown"] = [];
      }
      acc["Unknown"].push(race);
    }

    return acc;
  }, {});

  return (
    <section id="schedule" className="h-full sticky top-24">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-red-500 mr-3"></div>
          <div>
            <h2 className="text-2xl font-bold">RACE CALENDAR</h2>
            <div className="tech-text text-xs text-red-500 tracking-wider">
              {seasonYear} SEASON
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`tech-button px-3 py-1 text-xs ${
              isRefreshing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isRefreshing ? "REFRESHING..." : "REFRESH"}
          </button>
          {lastUpdated && (
            <div className="text-xs text-gray-500 mt-1">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {nextRace && (
        <div className="mb-6 tech-card tech-corner tech-scan">
          <div className="p-6">
            <div className="tech-text text-xs text-red-500 tracking-wider mb-1">
              NEXT RACE • T-{getDaysUntilRace(nextRace.date)} DAYS
            </div>
            <h3 className="text-xl font-bold mb-2">{nextRace.raceName}</h3>

            <div className="flex items-center mb-4">
              <div className="w-10 h-10 border border-red-500/30 bg-black flex items-center justify-center mr-3">
                <span className="tech-text text-red-500 text-sm">
                  R{nextRace.round}
                </span>
              </div>
              <div>
                <div className="text-lg font-bold">
                  {formatDate(nextRace.date, nextRace.time)}
                </div>
                <div className="tech-text text-xs text-red-500">
                  {formatTime(nextRace.date, nextRace.time)}
                </div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="tech-text text-xs tracking-wider">
                {nextRace.Circuit.circuitName},{" "}
                {nextRace.Circuit.Location.locality},{" "}
                {nextRace.Circuit.Location.country}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="tech-card h-[calc(100vh-350px)] min-h-[400px] tech-corner">
        <div className="p-4 h-full overflow-y-auto custom-scrollbar">
          {Object.entries(groupedRaces).map(([month, monthRaces]) => (
            <div key={month} className="mb-6 last:mb-0">
              <h3 className="tech-text text-xs text-red-500 tracking-wider mb-3 px-2 sticky top-0 bg-[#0A0D14]/90 backdrop-blur-sm py-2 z-10 border-b border-red-500/20">
                {month.toUpperCase()}
              </h3>
              <div className="space-y-2">
                {monthRaces.map((race) => (
                  <div
                    key={`${race.season}-${race.round}`}
                    className={`p-3 flex items-center ${
                      isPastRace(race.date)
                        ? "opacity-50"
                        : race === nextRace
                        ? "border border-red-500/30 bg-red-500/5"
                        : "hover:bg-[#1A1F2A]/30 transition-colors duration-150"
                    }`}
                  >
                    <div className="w-8 h-8 border border-red-500/30 bg-black flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="tech-text text-red-500 text-xs">
                        {race.round}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="truncate pr-2">
                          <div className="font-medium">{race.raceName}</div>
                          <div className="tech-text text-xs text-gray-400 truncate">
                            {race.Circuit.circuitName}
                          </div>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap">
                          <div className="font-medium">
                            {formatDate(race.date, race.time)}
                          </div>
                          <div className="tech-text text-red-500 text-[10px]">
                            {formatTime(race.date, race.time)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      {isPastRace(race.date) ? (
                        <span className="w-2 h-2 bg-gray-500"></span>
                      ) : race === nextRace ? (
                        <span className="w-2 h-2 bg-red-500 tech-pulse"></span>
                      ) : (
                        <span className="w-2 h-2 border border-red-500/50"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RaceSchedule;
