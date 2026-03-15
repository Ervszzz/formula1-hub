import axios from "axios";
import type {
  DriverStanding,
  Race,
  LastRaceData,
  ConstructorStanding,
  QualifyingResult,
} from "../types/f1";

const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const JOLPICA_BASE_URL = isDevelopment
  ? "https://api.jolpi.ca/ergast"
  : "/api/jolpica";

const jolpicaInstance = axios.create({ baseURL: JOLPICA_BASE_URL });

const currentYear = () => new Date().getFullYear();

// --- localStorage caching helpers ---
const CACHE_TTL = 5 * 60 * 1000;

function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: T; ts: number };
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // ignore quota errors
  }
}

// If the requested season has no data and it's the current year, try the previous year.
const withYearFallback = <T>(
  fn: (season: number) => Promise<T | null>,
  season: number
): Promise<T | null> => {
  if (season === currentYear()) return fn(season - 1);
  return Promise.resolve(null);
};

const transformRace = (race: Record<string, unknown>): Race => {
  const circuit = race.Circuit as Record<string, unknown>;
  const location = circuit?.Location as Record<string, unknown> | undefined;
  return {
    season: parseInt(race.season as string),
    round: parseInt(race.round as string),
    raceName: race.raceName as string,
    date: race.date as string,
    time: race.time as string | undefined,
    Circuit: {
      circuitId: circuit.circuitId as string,
      circuitName: circuit.circuitName as string,
      Location: location
        ? {
            locality: location.locality as string | undefined,
            country: location.country as string | undefined,
          }
        : undefined,
    },
    hasSprint: !!race.Sprint,
  };
};

const transformStanding = (
  standing: Record<string, unknown>,
  season: number
): DriverStanding => {
  const driver = standing.Driver as Record<string, unknown>;
  const constructors = standing.Constructors as Record<string, unknown>[];
  return {
    position: parseInt(standing.position as string),
    points: parseFloat(standing.points as string),
    wins: parseInt(standing.wins as string),
    Driver: {
      driverId: driver.driverId as string,
      givenName: driver.givenName as string,
      familyName: driver.familyName as string,
      nationality: driver.nationality as string,
    },
    Constructor: {
      constructorId: constructors[0].constructorId as string,
      name: constructors[0].name as string,
    },
    season,
  };
};

// Shared race result transformer used by getLastRaceResults and getRaceResults
export const transformLastRace = (
  race: Record<string, unknown>
): LastRaceData => {
  const circuit = race.Circuit as Record<string, unknown>;
  const location = circuit.Location as Record<string, unknown>;
  const results = race.Results as Record<string, unknown>[];
  return {
    season: parseInt(race.season as string),
    round: parseInt(race.round as string),
    raceName: race.raceName as string,
    date: race.date as string,
    Circuit: {
      circuitId: circuit.circuitId as string,
      circuitName: circuit.circuitName as string,
      Location: {
        locality: location.locality as string,
        country: location.country as string,
      },
    },
    results: results.map((result) => {
      const driver = result.Driver as Record<string, unknown>;
      const constructor_ = result.Constructor as Record<string, unknown>;
      const time = result.Time as Record<string, unknown> | null | undefined;
      const fastestLap = result.FastestLap as
        | Record<string, unknown>
        | null
        | undefined;
      return {
        position: result.position as string,
        Driver: {
          givenName: driver.givenName as string,
          familyName: driver.familyName as string,
          code: driver.code as string,
        },
        Constructor: { name: constructor_.name as string },
        grid: result.grid as string,
        laps: result.laps as string,
        status: result.status as string,
        Time: time ? { time: time.time as string } : null,
        FastestLap: fastestLap
          ? {
              rank: fastestLap.rank as string,
              lap: fastestLap.lap as string,
              Time: fastestLap.Time
                ? {
                    time: (fastestLap.Time as Record<string, unknown>)
                      .time as string,
                  }
                : null,
              AverageSpeed: fastestLap.AverageSpeed
                ? {
                    speed: (
                      fastestLap.AverageSpeed as Record<string, unknown>
                    ).speed as string,
                    units: (
                      fastestLap.AverageSpeed as Record<string, unknown>
                    ).units as string,
                  }
                : null,
            }
          : null,
        points: result.points as string,
      };
    }),
  };
};

export const getDriverStandings = async (
  season = currentYear()
): Promise<DriverStanding[] | null> => {
  const cacheKey = `f1_standings_driver_${season}`;
  const cached = getCached<DriverStanding[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await jolpicaInstance.get(
      `f1/${season}/driverStandings.json`
    );
    const standings =
      response.data?.MRData?.StandingsTable?.StandingsLists?.[0]
        ?.DriverStandings;
    if (standings?.length > 0) {
      const mapped: DriverStanding[] = standings.map(
        (s: Record<string, unknown>) => transformStanding(s, season)
      );
      setCache(cacheKey, mapped);
      return mapped;
    }
    return withYearFallback(getDriverStandings, season);
  } catch {
    return withYearFallback(getDriverStandings, season);
  }
};

// Tries axios first, then iterates through fallback URLs (proxy → direct).
const fetchRaceScheduleRaw = async (season: number): Promise<Race[] | null> => {
  const toRaces = (raw: Record<string, unknown>[]) =>
    raw.filter((r) => r.round != null).map((r) => transformRace(r));

  try {
    const response = await jolpicaInstance.get(`f1/${season}.json`);
    const races = response.data?.MRData?.RaceTable?.Races;
    if (races?.length > 0) {
      const mapped = toRaces(races);
      if (mapped.length > 0) return mapped;
    }
  } catch (_) {}

  const fallbackUrls = isDevelopment
    ? [`https://api.jolpi.ca/ergast/f1/${season}.json`]
    : [
        `${window.location.origin}/api/jolpica/f1/${season}.json`,
        `https://api.jolpi.ca/ergast/f1/${season}.json`,
      ];

  for (const url of fallbackUrls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const races = data?.MRData?.RaceTable?.Races;
      if (races?.length > 0) {
        const mapped = toRaces(races);
        if (mapped.length > 0) return mapped;
      }
    } catch (_) {}
  }

  return null;
};

export const getRaceSchedule = async (
  season = currentYear()
): Promise<Race[] | null> => {
  const cacheKey = `f1_schedule_${season}`;
  const cached = getCached<Race[]>(cacheKey);
  if (cached) return cached;

  try {
    const races = await fetchRaceScheduleRaw(season);
    if (races) {
      setCache(cacheKey, races);
      return races;
    }
    return withYearFallback(getRaceSchedule, season);
  } catch {
    return withYearFallback(getRaceSchedule, season);
  }
};

export const getLastRaceResults = async (
  season = currentYear()
): Promise<LastRaceData | null> => {
  const cacheKey = `f1_last_race_${season}`;
  const cached = getCached<LastRaceData>(cacheKey);
  if (cached) return cached;

  try {
    // `last` returns the most recently completed race, not just the last scheduled one
    const resultsRes = await jolpicaInstance.get(
      `f1/${season}/last/results.json`
    );
    const race = resultsRes.data?.MRData?.RaceTable?.Races?.[0];
    if (!race?.Results?.length)
      return withYearFallback(getLastRaceResults, season);

    const data = transformLastRace(race);
    setCache(cacheKey, data);
    return data;
  } catch {
    return withYearFallback(getLastRaceResults, season);
  }
};

export const getConstructorStandings = async (
  season = currentYear()
): Promise<ConstructorStanding[] | null> => {
  const cacheKey = `f1_standings_constructor_${season}`;
  const cached = getCached<ConstructorStanding[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await jolpicaInstance.get(
      `f1/${season}/constructorStandings.json`
    );
    const standings =
      response.data?.MRData?.StandingsTable?.StandingsLists?.[0]
        ?.ConstructorStandings;
    if (standings?.length > 0) {
      const mapped: ConstructorStanding[] = standings.map(
        (s: Record<string, unknown>) => {
          const constructor_ = s.Constructor as Record<string, unknown>;
          return {
            position: parseInt(s.position as string),
            points: parseFloat(s.points as string),
            wins: parseInt(s.wins as string),
            Constructor: {
              constructorId: constructor_.constructorId as string,
              name: constructor_.name as string,
              nationality: constructor_.nationality as string | undefined,
            },
            season,
          };
        }
      );
      setCache(cacheKey, mapped);
      return mapped;
    }
    return withYearFallback(getConstructorStandings, season);
  } catch {
    return withYearFallback(getConstructorStandings, season);
  }
};

export const getRaceResults = async (
  season: number,
  round: number
): Promise<LastRaceData | null> => {
  const cacheKey = `f1_race_${season}_${round}`;
  const cached = getCached<LastRaceData>(cacheKey);
  if (cached) return cached;
  try {
    const res = await jolpicaInstance.get(
      `f1/${season}/${round}/results.json`
    );
    const race = res.data?.MRData?.RaceTable?.Races?.[0];
    if (!race?.Results?.length) return null;
    const data = transformLastRace(race);
    setCache(cacheKey, data);
    return data;
  } catch {
    return null;
  }
};

export const getQualifyingResults = async (
  season: number,
  round: number
): Promise<QualifyingResult[] | null> => {
  const cacheKey = `f1_quali_${season}_${round}`;
  const cached = getCached<QualifyingResult[]>(cacheKey);
  if (cached) return cached;
  try {
    const res = await jolpicaInstance.get(
      `f1/${season}/${round}/qualifying.json`
    );
    const results =
      res.data?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults;
    if (!results?.length) return null;
    const mapped: QualifyingResult[] = (
      results as Record<string, unknown>[]
    ).map((r) => {
      const driver = r.Driver as Record<string, unknown>;
      const constructor_ = r.Constructor as Record<string, unknown>;
      return {
        position: r.position as string,
        Driver: {
          givenName: driver.givenName as string,
          familyName: driver.familyName as string,
          code: driver.code as string,
        },
        Constructor: { name: constructor_.name as string },
        Q1: (r.Q1 as string) || "—",
        Q2: r.Q2 as string | undefined,
        Q3: r.Q3 as string | undefined,
      };
    });
    setCache(cacheKey, mapped);
    return mapped;
  } catch {
    return null;
  }
};
