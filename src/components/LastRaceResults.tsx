import { useState } from "react";
import { getLastRaceResults } from "../api/f1Service";
import { useFetchData } from "../hooks/useFetchData";
import { getTeamHexColor, getTeamTextClass } from "../utils/teamColors";
import ResultsSkeleton from "./skeletons/ResultsSkeleton";
import type { LastRaceData } from "../types/f1";

const validateResults = (data: LastRaceData): boolean =>
  !!(data?.results && Array.isArray(data.results));

const positionClass = (index: number): string => {
  if (index === 0) return "border-yellow-500 text-yellow-500";
  if (index === 1) return "border-gray-400 text-gray-400";
  if (index === 2) return "border-amber-700 text-amber-700";
  return "border-red-500/30 text-gray-400";
};

interface RefreshButtonProps {
  onRefresh: () => void;
  refreshing: boolean;
}

const RefreshButton = ({ onRefresh, refreshing }: RefreshButtonProps) => (
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
);

interface SectionHeaderProps {
  results: LastRaceData | null;
  error: string | null;
  lastUpdated: Date | null;
  onRefresh: () => void;
  refreshing: boolean;
  showAll: boolean;
  onToggleAll: () => void;
}

const SectionHeader = ({ results, error, lastUpdated, onRefresh, refreshing, showAll, onToggleAll }: SectionHeaderProps) => (
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center">
      <div className="w-1 h-6 bg-red-500 mr-3"></div>
      <div>
        <h2 className="text-2xl font-bold">LAST RACE RESULTS</h2>
        <div className="tech-text text-xs text-red-500 tracking-wider">
          {results ? (
            <>
              {error ? `${error} • ` : ""}
              {results.raceName.toUpperCase()} •{" "}
              {new Date(results.date)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                .toUpperCase()}
              {lastUpdated && ` • UPDATED ${lastUpdated.toLocaleTimeString()}`}
            </>
          ) : (
            "MOST RECENT GRAND PRIX"
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <RefreshButton onRefresh={onRefresh} refreshing={refreshing} />
      {results && (
        <button
          onClick={onToggleAll}
          className="tech-text text-xs px-4 py-2 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 tech-corner"
        >
          {showAll ? "HIDE ALL POSITIONS" : "SHOW ALL POSITIONS"}
        </button>
      )}
    </div>
  </div>
);

const LastRaceResults = () => {
  const { data: results, loading, error, refreshing, lastUpdated, refresh } =
    useFetchData<LastRaceData>(getLastRaceResults, validateResults);
  const [showAll, setShowAll] = useState(false);
  const [showAllDrivers, setShowAllDrivers] = useState(false);

  const prevSeasonError =
    results && results.season < new Date().getFullYear()
      ? `Showing data from ${results.season} season`
      : null;
  const displayError = prevSeasonError || (error && !results ? error : null);

  if (loading) return <ResultsSkeleton />;

  if (error && !results)
    return (
      <section id="results" className="mb-16">
        <SectionHeader
          results={null}
          error={displayError}
          lastUpdated={null}
          onRefresh={refresh}
          refreshing={refreshing}
          showAll={false}
          onToggleAll={() => {}}
        />
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

  const winner = results.results[0];
  const tableRows = showAllDrivers
    ? results.results
    : results.results.slice(0, 5);

  return (
    <section id="results" className="mb-16">
      <SectionHeader
        results={results}
        error={displayError}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        refreshing={refreshing}
        showAll={showAll}
        onToggleAll={() => setShowAll(!showAll)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Winner card */}
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
                {winner.Driver.givenName} {winner.Driver.familyName}
              </div>
              <span
                className={`text-sm tech-text font-bold ${getTeamTextClass(
                  winner.Constructor.name
                )}`}
              >
                {winner.Constructor.name}
              </span>
            </div>
            <div className="text-right">
              <div className="font-medium text-lg">
                {winner.Time?.time || winner.status}
              </div>
              <div className="tech-text text-red-500 text-sm">
                {winner.points} PTS
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "GRID", value: winner.grid, glow: false },
              { label: "LAPS", value: winner.laps, glow: false },
              { label: "POINTS", value: winner.points, glow: true },
            ].map(({ label, value, glow }) => (
              <div
                key={label}
                className="bg-black/30 border border-red-500/20 p-4 text-center"
              >
                <div className="tech-text text-xs text-red-500 mb-1">
                  {label}
                </div>
                <div className={`text-2xl font-bold${glow ? " tech-glow" : ""}`}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {winner.FastestLap && (
            <div className="bg-black/30 border border-red-500/20 p-4">
              <div className="tech-text text-xs text-red-500 mb-3 text-center">
                FASTEST LAP
              </div>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold tech-glow">
                  {winner.FastestLap.Time?.time ?? "—"}
                </div>
                <div className="tech-text text-sm text-gray-400">
                  LAP {winner.FastestLap.lap}
                </div>
              </div>
              {winner.FastestLap.AverageSpeed && (
                <div className="tech-text text-xs text-gray-400 mt-1">
                  {winner.FastestLap.AverageSpeed.speed}{" "}
                  {winner.FastestLap.AverageSpeed.units}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Podium card */}
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
                    className={`w-10 h-10 flex items-center justify-center border mr-3 ${positionClass(index)}`}
                  >
                    <span className="tech-text text-lg">{result.position}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold">
                      {result.Driver.givenName} {result.Driver.familyName}
                    </div>
                    <span
                      className={`text-sm tech-text font-bold ${getTeamTextClass(
                        result.Constructor.name
                      )}`}
                    >
                      {result.Constructor.name}
                    </span>
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

      {showAll && (
        <div className="tech-card p-6 tech-corner mt-6">
          <div className="overflow-x-auto custom-scrollbar max-h-[500px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#0A0F1B] z-10">
                <tr className="border-b border-red-500/20">
                  {["POS", "DRIVER", "TEAM", "GRID", "LAPS", "TIME/STATUS", "PTS"].map(
                    (col, i) => (
                      <th
                        key={col}
                        className={`py-4 px-6 tech-text text-xs text-red-500 tracking-wider ${
                          i === 6 ? "text-right" : "text-left"
                        }`}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E232F]/30">
                {tableRows.map((result, index) => (
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
                        className={`w-8 h-8 flex items-center justify-center border ${positionClass(index)}`}
                      >
                        <span className="tech-text text-sm">
                          {result.position}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-1 h-10 mr-3"
                          style={{
                            backgroundColor: getTeamHexColor(
                              result.Constructor.name
                            ),
                          }}
                        />
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
                        className={`px-3 py-1 text-xs tech-text font-medium ${getTeamTextClass(
                          result.Constructor.name
                        )}`}
                      >
                        {result.Constructor.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">{result.grid}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{result.laps}</td>
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

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAllDrivers(!showAllDrivers)}
              className="tech-text text-xs px-4 py-2 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 tech-corner"
            >
              {showAllDrivers
                ? "SHOW TOP 5"
                : `SHOW ALL ${results.results.length} DRIVERS`}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default LastRaceResults;
