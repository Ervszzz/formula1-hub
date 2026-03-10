import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getRaceSchedule } from "../api/f1Service";
import { useFetchData } from "../hooks/useFetchData";
import { useSeason } from "../context/SeasonContext";
import {
  formatDate,
  formatTime,
  isPastRace,
  getDaysUntilRace,
  getNextRace,
  groupRacesByMonth,
} from "../utils/raceUtils";
import ScheduleSkeleton from "./skeletons/ScheduleSkeleton";
import type { Race } from "../types/f1";

const validateRaces = (races: Race[]): boolean =>
  Array.isArray(races) &&
  races.length > 0 &&
  races.every(
    (r) =>
      r?.season &&
      r?.round &&
      r?.raceName &&
      r?.date &&
      r?.Circuit?.circuitName &&
      r?.Circuit?.Location?.locality &&
      r?.Circuit?.Location?.country
  );

interface RaceScheduleProps {
  fullPage?: boolean;
}

const RaceSchedule = ({ fullPage }: RaceScheduleProps) => {
  const { season } = useSeason();
  const { data: races, loading, error, refreshing, lastUpdated, refresh } =
    useFetchData<Race[]>(
      getRaceSchedule as (...args: unknown[]) => Promise<Race[] | null>,
      validateRaces,
      [season]
    );

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => refresh(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentYear = new Date().getFullYear();
  const seasonYear = races?.[0]?.season ?? season;
  const prevSeasonNote =
    seasonYear < currentYear ? `Showing ${seasonYear} season` : null;

  const SectionHeader = () => (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-1 h-6 bg-red-500 mr-3"></div>
        <div>
          <h2 className="text-2xl font-bold">RACE CALENDAR</h2>
          <div className="tech-text text-xs text-red-500 tracking-wider">
            {prevSeasonNote ? `${prevSeasonNote.toUpperCase()} • ` : ""}
            {seasonYear} SEASON
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <button
          onClick={refresh}
          disabled={refreshing}
          className={`tech-button px-3 py-1 text-xs ${
            refreshing ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {refreshing ? "REFRESHING..." : "REFRESH"}
        </button>
        {lastUpdated && (
          <div className="text-xs text-gray-500 mt-1">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) return <ScheduleSkeleton />;

  if (error || !races?.length)
    return (
      <section id="schedule" className="h-full sticky top-24">
        <SectionHeader />
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

  const nextRace = getNextRace(races);
  const groupedRaces = groupRacesByMonth(races);

  return (
    <section id="schedule" className={fullPage ? "" : "h-full sticky top-24"}>
      <SectionHeader />

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

      <div
        className={`tech-card tech-corner ${
          fullPage ? "" : "h-[calc(100vh-350px)] min-h-[400px]"
        }`}
      >
        <div className="p-4 h-full overflow-y-auto custom-scrollbar">
          {Object.entries(groupedRaces).map(([month, monthRaces]) => (
            <div key={month} className="mb-6 last:mb-0">
              <h3 className="tech-text text-xs text-red-500 tracking-wider mb-3 px-2 sticky top-0 bg-[#0A0D14]/90 backdrop-blur-sm py-2 z-10 border-b border-red-500/20">
                {month.toUpperCase()}
              </h3>
              <div className="space-y-2">
                {monthRaces.map((race) => {
                  const past = isPastRace(race.date);
                  const inner = (
                    <div
                      className={`p-3 flex items-center ${
                        past
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
                            <div className="font-medium flex items-center">
                              {race.raceName}
                              {race.hasSprint && (
                                <span className="ml-2 px-1 py-0.5 text-[9px] tech-text border border-yellow-500/50 text-yellow-500">
                                  SPR
                                </span>
                              )}
                            </div>
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
                        {past ? (
                          <span className="w-2 h-2 bg-gray-500"></span>
                        ) : race === nextRace ? (
                          <span className="w-2 h-2 bg-red-500 tech-pulse"></span>
                        ) : (
                          <span className="w-2 h-2 border border-red-500/50"></span>
                        )}
                      </div>
                    </div>
                  );

                  return past ? (
                    <Link
                      key={`${race.season}-${race.round}`}
                      to={`/race/${race.season}/${race.round}`}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div key={`${race.season}-${race.round}`}>{inner}</div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RaceSchedule;
