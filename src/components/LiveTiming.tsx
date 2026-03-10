import { useState, useEffect, useRef, useCallback } from "react";
import { getTeamHexColor } from "../utils/teamColors";

const OPENF1_BASE = "https://api.openf1.org/v1";
const CURRENT_YEAR = new Date().getFullYear();
const POLL_INTERVAL = 10000;

interface OpenF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  circuit_short_name: string;
  date_start: string;
  date_end: string;
}

interface OpenF1Driver {
  driver_number: number;
  name_acronym: string;
  team_name: string;
  team_colour: string;
}

interface OpenF1Position {
  driver_number: number;
  position: number;
  date: string;
}

interface DriverMap {
  [driverNumber: number]: OpenF1Driver;
}

const isSessionLive = (session: OpenF1Session): boolean => {
  if (!session?.date_start || !session?.date_end) return false;
  const now = new Date();
  return now >= new Date(session.date_start) && now <= new Date(session.date_end);
};

const LiveTiming = () => {
  const [session, setSession] = useState<OpenF1Session | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [positions, setPositions] = useState<OpenF1Position[]>([]);
  const [drivers, setDrivers] = useState<DriverMap>({});
  const [loading, setLoading] = useState(true);
  const lastPollRef = useRef<string>(new Date().toISOString());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchDrivers = useCallback(async (sessionKey: number) => {
    try {
      const res = await fetch(
        `${OPENF1_BASE}/drivers?session_key=${sessionKey}`
      );
      if (!res.ok) return;
      const data: OpenF1Driver[] = await res.json();
      const map: DriverMap = {};
      data.forEach((d) => {
        map[d.driver_number] = d;
      });
      setDrivers(map);
    } catch {
      // ignore
    }
  }, []);

  const fetchPositions = useCallback(async (sessionKey: number) => {
    try {
      const since = lastPollRef.current;
      lastPollRef.current = new Date().toISOString();
      const res = await fetch(
        `${OPENF1_BASE}/position?session_key=${sessionKey}&date>${since}`
      );
      if (!res.ok) return;
      const data: OpenF1Position[] = await res.json();
      if (!data?.length) return;
      // Keep only the latest position per driver
      const latest: { [key: number]: OpenF1Position } = {};
      data.forEach((p) => {
        if (!latest[p.driver_number] || p.date > latest[p.driver_number].date) {
          latest[p.driver_number] = p;
        }
      });
      setPositions((prev) => {
        const merged: { [key: number]: OpenF1Position } = {
          ...Object.fromEntries(prev.map((p) => [p.driver_number, p])),
          ...latest,
        };
        return Object.values(merged).sort((a, b) => a.position - b.position);
      });
    } catch {
      // ignore
    }
  }, []);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(
        `${OPENF1_BASE}/sessions?session_type=Race&year=${CURRENT_YEAR}`
      );
      if (!res.ok) return;
      const data: OpenF1Session[] = await res.json();
      if (!data?.length) {
        setLoading(false);
        return;
      }
      // Get most recent session
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
      );
      const latest = sorted[0];
      setSession(latest);
      const live = isSessionLive(latest);
      setIsLive(live);
      if (live) {
        await fetchDrivers(latest.session_key);
        await fetchPositions(latest.session_key);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [fetchDrivers, fetchPositions]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (!isLive || !session) return;
    intervalRef.current = setInterval(() => {
      fetchPositions(session.session_key);
    }, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive, session, fetchPositions]);

  // Don't render anything when not live — avoid empty space
  if (loading || !isLive) return null;

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-[1920px] mx-auto">
        <div className="tech-card tech-corner p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-red-500 mr-3"></div>
              <div>
                <h2 className="text-2xl font-bold">LIVE TIMING</h2>
                <div className="tech-text text-xs text-red-500 tracking-wider">
                  {session?.session_name?.toUpperCase()} •{" "}
                  {session?.circuit_short_name?.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full tech-pulse"></div>
              <span className="tech-text text-xs text-red-500 tracking-widest font-bold">
                LIVE
              </span>
            </div>
          </div>

          {/* Positions table */}
          {positions.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-red-500/20">
                    {["POS", "NO", "ABBREVIATION", "TEAM"].map((col) => (
                      <th
                        key={col}
                        className="py-3 px-4 tech-text text-xs text-red-500 tracking-wider text-left"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E232F]/30">
                  {positions.map((pos, index) => {
                    const driver = drivers[pos.driver_number];
                    const teamColor = driver?.team_colour
                      ? `#${driver.team_colour}`
                      : getTeamHexColor(driver?.team_name ?? "");
                    return (
                      <tr
                        key={pos.driver_number}
                        className={`${
                          index % 2 === 0
                            ? "bg-transparent"
                            : "bg-[#1A1F2A]/10"
                        } hover:bg-[#1A1F2A]/20 transition-colors duration-150`}
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
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
                              {pos.position}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="tech-text text-sm font-bold">
                            {pos.driver_number}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-1 h-8 mr-3 flex-shrink-0"
                              style={{ backgroundColor: teamColor }}
                            />
                            <span className="font-bold">
                              {driver?.name_acronym ?? `#${pos.driver_number}`}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap tech-text text-xs text-gray-400">
                          {driver?.team_name ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-10">
              <div className="relative w-12 h-12 mr-4">
                <div className="absolute top-0 left-0 w-full h-full border-2 border-red-500/50 rounded-sm opacity-25 animate-ping"></div>
                <div className="absolute top-0 left-0 w-full h-full border-2 border-t-transparent border-red-500 rounded-sm animate-spin"></div>
              </div>
              <span className="tech-text text-xs text-gray-400 tracking-wider">
                ACQUIRING TELEMETRY...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTiming;
