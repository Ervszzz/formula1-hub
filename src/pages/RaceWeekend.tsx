import { useState, useEffect, useRef, useCallback } from "react";
import {
  getLatestSession,
  getSessionsForMeeting,
  getDrivers,
  getPositions,
  getIntervals,
  getStints,
  getPits,
  getWeather,
  getLaps,
  type OF1Session,
  type OF1Driver,
  type OF1Position,
  type OF1Interval,
  type OF1Stint,
  type OF1Pit,
  type OF1Weather,
  type OF1Lap,
} from "../api/openF1Service";
import { getTeamHexColor } from "../utils/teamColors";
import SEO from "../components/SEO";

// ── helpers ────────────────────────────────────────────────────────────────

const SESSION_ORDER = [
  "Practice 1",
  "Practice 2",
  "Practice 3",
  "Sprint Shootout",
  "Sprint Qualifying",
  "Sprint",
  "Qualifying",
  "Race",
];

const SESSION_ABBR: Record<string, string> = {
  "Practice 1": "FP1",
  "Practice 2": "FP2",
  "Practice 3": "FP3",
  "Sprint Shootout": "SS",
  "Sprint Qualifying": "SQ",
  Sprint: "SPR",
  Qualifying: "QUAL",
  Race: "RACE",
};

type SessionStatus = "live" | "upcoming" | "completed";

function getSessionStatus(session: OF1Session): SessionStatus {
  const now = Date.now();
  const start = new Date(session.date_start).getTime();
  const end = new Date(session.date_end).getTime();
  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  return "completed";
}

function isCurrentMeeting(sessions: OF1Session[]): boolean {
  if (!sessions.length) return false;
  const now = Date.now();
  const earliest = Math.min(...sessions.map((s) => new Date(s.date_start).getTime()));
  const latest = Math.max(...sessions.map((s) => new Date(s.date_end).getTime()));
  // Weekend is "current" if it started within last 5 days and isn't fully over
  return (
    earliest <= now + 24 * 60 * 60 * 1000 && // started (or starts tomorrow)
    latest >= now - 2 * 60 * 60 * 1000 // ended less than 2h ago at the earliest
  );
}

function formatLapTime(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(3).padStart(6, "0");
  return m > 0 ? `${m}:${s}` : `${s}`;
}

function formatGap(gap: number | null): string {
  if (gap === null || gap === undefined) return "—";
  if (gap === 0) return "LEADER";
  return `+${gap.toFixed(3)}`;
}

const COMPOUND_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  SOFT:         { bg: "#E8002D", text: "#fff", label: "S" },
  MEDIUM:       { bg: "#FFF200", text: "#000", label: "M" },
  HARD:         { bg: "#FFFFFF", text: "#000", label: "H" },
  INTERMEDIATE: { bg: "#39B54A", text: "#fff", label: "I" },
  WET:          { bg: "#0067FF", text: "#fff", label: "W" },
};

// ── sub-components ─────────────────────────────────────────────────────────

function TyreIcon({ compound }: { compound?: string }) {
  const style = compound ? COMPOUND_STYLE[compound.toUpperCase()] : null;
  if (!style) return <span className="tech-text text-xs text-gray-600">—</span>;
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold tech-text"
      style={{ backgroundColor: style.bg, color: style.text }}
      title={compound}
    >
      {style.label}
    </span>
  );
}

function StatusBadge({ status }: { status: SessionStatus }) {
  if (status === "live")
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-500 rounded-full tech-pulse" />
        <span className="tech-text text-xs text-red-500 tracking-widest font-bold">LIVE</span>
      </div>
    );
  if (status === "upcoming")
    return (
      <span className="tech-text text-xs text-yellow-500 tracking-wider">UPCOMING</span>
    );
  return (
    <span className="tech-text text-xs text-gray-500 tracking-wider">COMPLETED</span>
  );
}

function WeatherPanel({ weather }: { weather: OF1Weather | null }) {
  if (!weather) return null;
  const windDeg = weather.wind_direction ?? 0;
  return (
    <div className="tech-card tech-corner p-4">
      <div className="flex items-center mb-3">
        <div className="w-1 h-5 bg-red-500 mr-2" />
        <span className="tech-text text-xs text-red-500 tracking-wider">TRACK CONDITIONS</span>
        {weather.rainfall ? (
          <span className="ml-auto tech-text text-xs text-blue-400">RAIN</span>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "AIR", value: `${weather.air_temperature?.toFixed(1)}°C` },
          { label: "TRACK", value: `${weather.track_temperature?.toFixed(1)}°C` },
          { label: "HUMIDITY", value: `${weather.humidity?.toFixed(0)}%` },
          { label: "WIND", value: `${(weather.wind_speed * 3.6).toFixed(0)} km/h` },
        ].map(({ label, value }) => (
          <div key={label} className="border border-red-500/10 bg-black/30 p-2">
            <div className="tech-text text-[9px] text-gray-500 tracking-widest">{label}</div>
            <div className="tech-text text-sm text-white font-bold">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" stroke="#1E232F" strokeWidth="1" fill="none" />
          <line
            x1="16" y1="16"
            x2={16 + 10 * Math.sin((windDeg * Math.PI) / 180)}
            y2={16 - 10 * Math.cos((windDeg * Math.PI) / 180)}
            stroke="#DC0000" strokeWidth="2" strokeLinecap="round"
          />
          <circle cx="16" cy="16" r="2" fill="#DC0000" />
        </svg>
        <span className="tech-text text-[9px] text-gray-500 ml-1">{windDeg}°</span>
      </div>
    </div>
  );
}

function PitFeed({ pits, drivers }: { pits: OF1Pit[]; drivers: Record<number, OF1Driver> }) {
  if (!pits.length) return null;
  const sorted = [...pits].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return (
    <div className="tech-card tech-corner p-4">
      <div className="flex items-center mb-3">
        <div className="w-1 h-5 bg-red-500 mr-2" />
        <span className="tech-text text-xs text-red-500 tracking-wider">PIT STOPS</span>
        <span className="ml-auto tech-text text-xs text-gray-500">{pits.length} total</span>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
        {sorted.map((pit, i) => {
          const driver = drivers[pit.driver_number];
          const teamColor = driver?.team_colour
            ? `#${driver.team_colour}`
            : getTeamHexColor(driver?.team_name ?? "");
          return (
            <div
              key={i}
              className="flex items-center p-2 border border-red-500/10 bg-black/20"
            >
              <div
                className="w-0.5 h-6 mr-2 flex-shrink-0"
                style={{ backgroundColor: teamColor }}
              />
              <span className="tech-text text-sm font-bold w-10">
                {driver?.name_acronym ?? `#${pit.driver_number}`}
              </span>
              <span className="tech-text text-xs text-gray-400 ml-2">
                LAP {pit.lap_number}
              </span>
              {pit.pit_duration != null && (
                <span className="ml-auto tech-text text-xs text-yellow-500">
                  {pit.pit_duration.toFixed(1)}s
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NoWeekend() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 border border-red-500/30 flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="tech-text text-red-500 tracking-wider text-sm">NO ACTIVE RACE WEEKEND</p>
      <p className="tech-text text-gray-500 text-xs mt-2">
        Live data is only available during practice, qualifying, and race sessions.
      </p>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────

const RaceWeekend = () => {
  const [sessions, setSessions] = useState<OF1Session[]>([]);
  const [activeSession, setActiveSession] = useState<OF1Session | null>(null);
  const [isCurrentWeekend, setIsCurrentWeekend] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [drivers, setDrivers] = useState<Record<number, OF1Driver>>({});
  const [positions, setPositions] = useState<OF1Position[]>([]);
  const [intervals, setIntervals] = useState<Record<number, OF1Interval>>({});
  const [stints, setStints] = useState<Record<number, OF1Stint>>({});
  const [pits, setPits] = useState<OF1Pit[]>([]);
  const [weather, setWeather] = useState<OF1Weather | null>(null);
  const [laps, setLaps] = useState<Record<number, OF1Lap>>({});

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionKeyRef = useRef<number | null>(null);

  // Initial load: find current meeting
  useEffect(() => {
    const init = async () => {
      const latest = await getLatestSession();
      if (!latest.length) {
        setInitialLoading(false);
        return;
      }
      const meetingSessions = await getSessionsForMeeting(latest[0].meeting_key);
      const sorted = [...meetingSessions].sort(
        (a, b) => SESSION_ORDER.indexOf(a.session_name) - SESSION_ORDER.indexOf(b.session_name)
      );
      setSessions(sorted);
      const current = isCurrentMeeting(sorted);
      setIsCurrentWeekend(current);
      if (current) {
        // Pick active live session, or the most recent one
        const liveSession = sorted.find((s) => getSessionStatus(s) === "live");
        const upcomingSession = sorted.find((s) => getSessionStatus(s) === "upcoming");
        const defaultSession =
          liveSession ?? upcomingSession ?? sorted[sorted.length - 1];
        setActiveSession(defaultSession);
      }
      setInitialLoading(false);
    };
    init();
  }, []);

  // Fetch all data for the active session
  const fetchSessionData = useCallback(async (session: OF1Session) => {
    const key = session.session_key;
    const status = getSessionStatus(session);
    const hasData = status === "live" || status === "completed";
    if (!hasData) return;

    const [driversData, posData, stintsData, pitsData, weatherData, lapsData] =
      await Promise.all([
        getDrivers(key),
        getPositions(key),
        getStints(key),
        getPits(key),
        getWeather(key),
        getLaps(key),
      ]);

    // Drivers map
    const driverMap: Record<number, OF1Driver> = {};
    driversData.forEach((d) => { driverMap[d.driver_number] = d; });
    setDrivers(driverMap);

    // Positions (sorted, latest per driver)
    const posMap = posData.reduce<Record<number, OF1Position>>((acc, p) => {
      if (!acc[p.driver_number] || p.date > acc[p.driver_number].date)
        acc[p.driver_number] = p;
      return acc;
    }, {});
    setPositions(Object.values(posMap).sort((a, b) => a.position - b.position));

    // Stints: latest per driver
    const stintMap: Record<number, OF1Stint> = {};
    stintsData.forEach((s) => {
      if (!stintMap[s.driver_number] || s.stint_number > stintMap[s.driver_number].stint_number)
        stintMap[s.driver_number] = s;
    });
    setStints(stintMap);

    setPits(pitsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

    // Latest weather entry
    if (weatherData.length)
      setWeather(weatherData[weatherData.length - 1]);

    // Latest lap per driver
    const lapMap: Record<number, OF1Lap> = {};
    lapsData.forEach((l) => {
      if (!lapMap[l.driver_number] || l.lap_number > lapMap[l.driver_number].lap_number)
        lapMap[l.driver_number] = l;
    });
    setLaps(lapMap);

    // Intervals (race only)
    if (session.session_type === "Race") {
      const intervalsData = await getIntervals(key);
      const iMap: Record<number, OF1Interval> = {};
      intervalsData.forEach((i) => {
        if (!iMap[i.driver_number] || i.date > iMap[i.driver_number].date)
          iMap[i.driver_number] = i;
      });
      setIntervals(iMap);
    }
  }, []);

  // Poll live session
  useEffect(() => {
    if (!activeSession) return;
    sessionKeyRef.current = activeSession.session_key;

    // Clear previous poll
    if (pollRef.current) clearInterval(pollRef.current);

    fetchSessionData(activeSession);

    const status = getSessionStatus(activeSession);
    if (status !== "live") return;

    pollRef.current = setInterval(() => {
      if (sessionKeyRef.current === activeSession.session_key)
        fetchSessionData(activeSession);
    }, 10000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeSession, fetchSessionData]);

  // ── render ───────────────────────────────────────────────────────────────

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-red-500/30 animate-ping opacity-25" />
          <div className="absolute inset-0 border-2 border-t-transparent border-red-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="tech-text text-red-500 text-[9px]">LOADING</span>
          </div>
        </div>
      </div>
    );
  }

  const meeting = sessions[0];
  const activeStatus = activeSession ? getSessionStatus(activeSession) : null;
  const isRace = activeSession?.session_type === "Race";

  return (
    <>
      <SEO path="/race-weekend" />
      <div className="w-full px-4 pt-24 pb-12">
        <div className="max-w-[1920px] mx-auto">

          {/* Page header */}
          <div className="mb-6">
            <div className="flex items-center mb-1">
              <div className="w-1 h-8 bg-red-500 mr-3" />
              <div>
                <h1 className="text-3xl font-bold">
                  {meeting
                    ? meeting.location?.toUpperCase()
                    : "RACE WEEKEND"}
                </h1>
                <div className="tech-text text-xs text-red-500 tracking-wider">
                  {meeting
                    ? `${meeting.circuit_short_name?.toUpperCase()} • ${meeting.country_name?.toUpperCase()}`
                    : "LIVE SESSION DATA"}
                </div>
              </div>
            </div>
          </div>

          {!isCurrentWeekend || !sessions.length ? (
            <NoWeekend />
          ) : (
            <>
              {/* Session tabs */}
              <div className="flex flex-wrap gap-1 mb-6">
                {sessions.map((s) => {
                  const status = getSessionStatus(s);
                  const isActive = s.session_key === activeSession?.session_key;
                  return (
                    <button
                      key={s.session_key}
                      onClick={() => {
                        setActiveSession(s);
                        setPositions([]);
                        setIntervals({});
                        setLaps({});
                        setStints({});
                        setPits([]);
                        setWeather(null);
                      }}
                      className={`px-4 py-2 tech-text text-xs tracking-wider transition-all duration-200 border relative ${
                        isActive
                          ? "border-red-500 bg-red-500/10 text-red-500"
                          : "border-red-500/20 text-gray-400 hover:border-red-500/50 hover:text-gray-200"
                      }`}
                    >
                      {SESSION_ABBR[s.session_name] ?? s.session_name.toUpperCase()}
                      {status === "live" && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full tech-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>

              {activeSession && (
                <>
                  {/* Session status bar */}
                  <div className="tech-card tech-corner p-4 mb-6 flex items-center justify-between">
                    <div>
                      <div className="tech-text text-xs text-gray-500 tracking-wider mb-0.5">
                        {activeSession.session_name.toUpperCase()}
                      </div>
                      <div className="text-lg font-bold">
                        {new Date(activeSession.date_start).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                        {" · "}
                        {new Date(activeSession.date_start).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" – "}
                        {new Date(activeSession.date_end).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {activeStatus && <StatusBadge status={activeStatus} />}
                  </div>

                  {/* Main grid */}
                  {(activeStatus === "live" || activeStatus === "completed") &&
                  positions.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                      {/* Timing tower */}
                      <div className="xl:col-span-9">
                        <div className="tech-card tech-corner">
                          <div className="p-4 border-b border-red-500/20 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-1 h-5 bg-red-500 mr-2" />
                              <span className="tech-text text-xs text-red-500 tracking-wider">
                                TIMING TOWER
                              </span>
                            </div>
                            {activeStatus === "live" && (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full tech-pulse" />
                                <span className="tech-text text-[10px] text-red-500 tracking-widest">LIVE</span>
                              </div>
                            )}
                          </div>
                          <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-red-500/10">
                                  {[
                                    "POS", "DRIVER", "TEAM",
                                    "LAST LAP",
                                    ...(isRace ? ["GAP"] : []),
                                    "TYRE",
                                    ...(isRace ? ["PITS"] : []),
                                  ].map((col) => (
                                    <th
                                      key={col}
                                      className="py-3 px-4 tech-text text-[10px] text-red-500 tracking-wider text-left whitespace-nowrap"
                                    >
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#1E232F]/30">
                                {positions.map((pos, idx) => {
                                  const driver = drivers[pos.driver_number];
                                  const teamColor = driver?.team_colour
                                    ? `#${driver.team_colour}`
                                    : getTeamHexColor(driver?.team_name ?? "");
                                  const stint = stints[pos.driver_number];
                                  const lap = laps[pos.driver_number];
                                  const interval = intervals[pos.driver_number];
                                  const pitCount = pits.filter(
                                    (p) => p.driver_number === pos.driver_number
                                  ).length;

                                  return (
                                    <tr
                                      key={pos.driver_number}
                                      className={`${
                                        idx % 2 === 0 ? "bg-transparent" : "bg-[#1A1F2A]/10"
                                      } hover:bg-[#1A1F2A]/20 transition-colors duration-150`}
                                    >
                                      {/* POS */}
                                      <td className="py-3 px-4">
                                        <div
                                          className={`w-8 h-8 flex items-center justify-center border ${
                                            idx === 0
                                              ? "border-yellow-500 text-yellow-500"
                                              : idx === 1
                                              ? "border-gray-400 text-gray-400"
                                              : idx === 2
                                              ? "border-amber-700 text-amber-700"
                                              : "border-red-500/20 text-gray-400"
                                          }`}
                                        >
                                          <span className="tech-text text-sm">{pos.position}</span>
                                        </div>
                                      </td>
                                      {/* DRIVER */}
                                      <td className="py-3 px-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div
                                            className="w-1 h-8 mr-3 flex-shrink-0"
                                            style={{ backgroundColor: teamColor }}
                                          />
                                          <div>
                                            <div className="font-bold text-sm">
                                              {driver?.name_acronym ?? `#${pos.driver_number}`}
                                            </div>
                                            <div className="tech-text text-[10px] text-gray-500">
                                              #{pos.driver_number}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      {/* TEAM */}
                                      <td className="py-3 px-4 whitespace-nowrap tech-text text-xs text-gray-400">
                                        {driver?.team_name ?? "—"}
                                      </td>
                                      {/* LAST LAP */}
                                      <td className="py-3 px-4 whitespace-nowrap tech-text text-sm">
                                        {lap && !lap.is_pit_out_lap
                                          ? formatLapTime(lap.lap_duration)
                                          : "—"}
                                      </td>
                                      {/* GAP (race only) */}
                                      {isRace && (
                                        <td className="py-3 px-4 whitespace-nowrap tech-text text-xs text-gray-400">
                                          {formatGap(interval?.gap_to_leader ?? null)}
                                        </td>
                                      )}
                                      {/* TYRE */}
                                      <td className="py-3 px-4">
                                        <TyreIcon compound={stint?.compound} />
                                      </td>
                                      {/* PITS (race only) */}
                                      {isRace && (
                                        <td className="py-3 px-4 tech-text text-xs text-center text-gray-400">
                                          {pitCount || "—"}
                                        </td>
                                      )}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Sidebar: weather + pits */}
                      <div className="xl:col-span-3 space-y-4">
                        <WeatherPanel weather={weather} />
                        {isRace && <PitFeed pits={pits} drivers={drivers} />}
                      </div>
                    </div>
                  ) : activeStatus === "upcoming" ? (
                    <div className="tech-card tech-corner p-12 text-center">
                      <p className="tech-text text-gray-500 text-xs tracking-wider">
                        SESSION NOT STARTED
                      </p>
                      <p className="tech-text text-red-500 text-sm mt-2">
                        {new Date(activeSession.date_start).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZoneName: "short",
                        })}
                      </p>
                    </div>
                  ) : (
                    <div className="tech-card tech-corner p-12 text-center">
                      <p className="tech-text text-gray-500 text-xs tracking-wider">
                        ACQUIRING DATA...
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RaceWeekend;
