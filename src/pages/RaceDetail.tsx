import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRaceResults, getQualifyingResults } from "../api/f1Service";
import { useFetchData } from "../hooks/useFetchData";
import { getTeamHexColor, getTeamTextClass } from "../utils/teamColors";
import type { LastRaceData, QualifyingResult } from "../types/f1";

const positionClass = (index: number): string => {
  if (index === 0) return "border-yellow-500 text-yellow-500";
  if (index === 1) return "border-gray-400 text-gray-400";
  if (index === 2) return "border-amber-700 text-amber-700";
  return "border-red-500/30 text-gray-400";
};

const LoadingSkeleton = () => (
  <div className="w-full px-4 py-12 pt-24">
    <div className="max-w-5xl mx-auto">
      <div className="tech-card p-6 tech-corner animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const RaceDetail = () => {
  const { season, round } = useParams<{ season: string; round: string }>();
  const seasonNum = parseInt(season ?? "0", 10);
  const roundNum = parseInt(round ?? "0", 10);
  const [activeTab, setActiveTab] = useState<"race" | "qualifying">("race");

  const {
    data: raceData,
    loading: raceLoading,
    error: raceError,
  } = useFetchData<LastRaceData>(
    getRaceResults as (...args: unknown[]) => Promise<LastRaceData | null>,
    (d) => (d?.results?.length ?? 0) > 0,
    [seasonNum, roundNum]
  );

  const { data: qualiData, loading: qualiLoading } =
    useFetchData<QualifyingResult[]>(
      getQualifyingResults as (...args: unknown[]) => Promise<QualifyingResult[] | null>,
      (d) => Array.isArray(d) && d.length > 0,
      [seasonNum, roundNum]
    );

  if (raceLoading) return <LoadingSkeleton />;

  if (raceError || !raceData) {
    return (
      <div className="w-full px-4 py-12 pt-24">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/schedule"
            className="inline-flex items-center tech-text text-xs text-red-500 hover:text-red-400 mb-8 tracking-wider transition-colors"
          >
            ← BACK TO SCHEDULE
          </Link>
          <div className="tech-card p-10 tech-corner flex items-center justify-center">
            <div className="text-center">
              <p className="tech-text text-red-500 text-sm tracking-wider">
                {raceError || "DATA UNAVAILABLE"}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                ERR_DATA_FETCH_FAILED
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-12 pt-24">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          to="/schedule"
          className="inline-flex items-center tech-text text-xs text-red-500 hover:text-red-400 mb-8 tracking-wider transition-colors"
        >
          ← BACK TO SCHEDULE
        </Link>

        {/* Race header */}
        <div className="tech-card tech-corner p-6 mb-6">
          <div className="tech-text text-xs text-red-500 tracking-wider mb-1">
            ROUND {raceData.round} • {raceData.season} SEASON
          </div>
          <h1 className="text-3xl font-bold mb-2">{raceData.raceName}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="tech-text text-xs tracking-wider">
              {raceData.Circuit?.circuitName}
            </span>
            <span className="text-gray-500">•</span>
            <span className="tech-text text-xs tracking-wider">
              {raceData.Circuit?.Location?.locality},{" "}
              {raceData.Circuit?.Location?.country}
            </span>
            <span className="text-gray-500">•</span>
            <span className="tech-text text-xs tracking-wider">
              {new Date(raceData.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-red-500/20 mb-6">
          {(["race", "qualifying"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tech-text text-xs tracking-wider px-6 py-3 transition-all duration-200 ${
                activeTab === tab
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "race" ? "RACE" : "QUALIFYING"}
            </button>
          ))}
        </div>

        {/* Race results table */}
        {activeTab === "race" && (
          <div className="tech-card tech-corner overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#0A0F1B] z-10">
                  <tr className="border-b border-red-500/20">
                    {[
                      "POS",
                      "DRIVER",
                      "TEAM",
                      "GRID",
                      "LAPS",
                      "TIME/STATUS",
                      "PTS",
                    ].map((col, i) => (
                      <th
                        key={col}
                        className={`py-4 px-4 tech-text text-xs text-red-500 tracking-wider ${
                          i === 6 ? "text-right" : "text-left"
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E232F]/30">
                  {raceData.results.map((result, index) => (
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
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div
                          className={`w-8 h-8 flex items-center justify-center border ${positionClass(
                            index
                          )}`}
                        >
                          <span className="tech-text text-sm">
                            {result.position}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-1 h-10 mr-3 flex-shrink-0"
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
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs tech-text font-medium ${getTeamTextClass(
                            result.Constructor.name
                          )}`}
                        >
                          {result.Constructor.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap tech-text text-sm text-gray-300">
                        {result.grid}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap tech-text text-sm text-gray-300">
                        {result.laps}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap tech-text text-sm text-gray-300">
                        {result.Time ? result.Time.time : result.status}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="font-bold text-white tech-glow">
                          {result.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Qualifying results table */}
        {activeTab === "qualifying" && (
          <div className="tech-card tech-corner overflow-hidden">
            {qualiLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-2 border-red-500/50 rounded-sm opacity-25 animate-ping"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-2 border-t-transparent border-red-500 rounded-sm animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="tech-text text-red-500 text-xs">
                      LOADING
                    </span>
                  </div>
                </div>
              </div>
            ) : !qualiData ? (
              <div className="flex items-center justify-center py-16">
                <p className="tech-text text-gray-500 text-sm tracking-wider">
                  NO QUALIFYING DATA AVAILABLE
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="sticky top-0 bg-[#0A0F1B] z-10">
                    <tr className="border-b border-red-500/20">
                      {["POS", "DRIVER", "TEAM", "Q1", "Q2", "Q3"].map(
                        (col) => (
                          <th
                            key={col}
                            className="py-4 px-4 tech-text text-xs text-red-500 tracking-wider text-left"
                          >
                            {col}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E232F]/30">
                    {qualiData.map((result, index) => (
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
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div
                            className={`w-8 h-8 flex items-center justify-center border ${positionClass(
                              index
                            )}`}
                          >
                            <span className="tech-text text-sm">
                              {result.position}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-1 h-10 mr-3 flex-shrink-0"
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
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs tech-text font-medium ${getTeamTextClass(
                              result.Constructor.name
                            )}`}
                          >
                            {result.Constructor.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap tech-text text-sm text-gray-300">
                          {result.Q1}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap tech-text text-sm text-gray-300">
                          {result.Q2 || "—"}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap tech-text text-sm text-gray-300">
                          {result.Q3 || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RaceDetail;
