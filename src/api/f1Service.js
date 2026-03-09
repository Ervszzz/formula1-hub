import axios from "axios";

const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const JOLPICA_BASE_URL = isDevelopment
  ? "https://api.jolpi.ca/ergast"
  : "/api/jolpica";

const jolpicaInstance = axios.create({ baseURL: JOLPICA_BASE_URL });

const currentYear = () => new Date().getFullYear();

// If the requested season has no data and it's the current year, try the previous year.
const withYearFallback = (fn, season) => {
  if (season === currentYear()) return fn(season - 1);
  return Promise.resolve("No Data Fetched");
};

const transformRace = (race, timestamp) => ({
  season: parseInt(race.season),
  round: parseInt(race.round),
  raceName: race.raceName,
  date: race.date,
  time: race.time,
  Circuit: {
    circuitId: race.Circuit.circuitId,
    circuitName: race.Circuit.circuitName,
    Location: {
      locality: race.Circuit.Location.locality,
      country: race.Circuit.Location.country,
    },
  },
  _timestamp: timestamp,
});

const transformStanding = (standing, season, timestamp) => ({
  position: parseInt(standing.position),
  points: parseFloat(standing.points),
  wins: parseInt(standing.wins),
  Driver: {
    driverId: standing.Driver.driverId,
    givenName: standing.Driver.givenName,
    familyName: standing.Driver.familyName,
    nationality: standing.Driver.nationality,
  },
  Constructor: {
    constructorId: standing.Constructors[0].constructorId,
    name: standing.Constructors[0].name,
  },
  season,
  _timestamp: timestamp,
});

export const getDriverStandings = async (season = currentYear()) => {
  try {
    const timestamp = Date.now();
    const response = await jolpicaInstance.get(
      `f1/${season}/driverStandings.json`
    );
    const standings =
      response.data?.MRData?.StandingsTable?.StandingsLists?.[0]
        ?.DriverStandings;
    if (standings?.length > 0) {
      return standings.map((s) => transformStanding(s, season, timestamp));
    }
    return withYearFallback(getDriverStandings, season);
  } catch {
    return withYearFallback(getDriverStandings, season);
  }
};

// Tries axios first, then iterates through fallback URLs (proxy → direct).
const fetchRaceScheduleRaw = async (season) => {
  const timestamp = Date.now();

  try {
    const response = await jolpicaInstance.get(`f1/${season}.json`);
    const races = response.data?.MRData?.RaceTable?.Races;
    if (races?.length > 0) {
      return races.map((r) => transformRace(r, timestamp));
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
        return races.map((r) => transformRace(r, timestamp));
      }
    } catch (_) {}
  }

  return null;
};

export const getRaceSchedule = async (season = currentYear()) => {
  try {
    const races = await fetchRaceScheduleRaw(season);
    if (races) return races;
    return withYearFallback(getRaceSchedule, season);
  } catch {
    return withYearFallback(getRaceSchedule, season);
  }
};

export const getLastRaceResults = async (season = currentYear()) => {
  try {
    const timestamp = Date.now();
    // `last` returns the most recently completed race, not just the last scheduled one
    const resultsRes = await jolpicaInstance.get(
      `f1/${season}/last/results.json`
    );
    const race = resultsRes.data?.MRData?.RaceTable?.Races?.[0];
    if (!race?.Results?.length)
      return withYearFallback(getLastRaceResults, season);

    return {
      season: parseInt(race.season),
      round: parseInt(race.round),
      raceName: race.raceName,
      date: race.date,
      Circuit: {
        circuitId: race.Circuit.circuitId,
        circuitName: race.Circuit.circuitName,
        Location: {
          locality: race.Circuit.Location.locality,
          country: race.Circuit.Location.country,
        },
      },
      results: race.Results.map((result) => ({
        position: result.position,
        Driver: {
          givenName: result.Driver.givenName,
          familyName: result.Driver.familyName,
          code: result.Driver.code,
        },
        Constructor: { name: result.Constructor.name },
        grid: result.grid,
        laps: result.laps,
        status: result.status,
        Time: result.Time ? { time: result.Time.time } : null,
        FastestLap: result.FastestLap
          ? {
              rank: result.FastestLap.rank,
              lap: result.FastestLap.lap,
              Time: result.FastestLap.Time
                ? { time: result.FastestLap.Time.time }
                : null,
              AverageSpeed: result.FastestLap.AverageSpeed
                ? {
                    speed: result.FastestLap.AverageSpeed.speed,
                    units: result.FastestLap.AverageSpeed.units,
                  }
                : null,
            }
          : null,
        points: result.points,
      })),
      _timestamp: timestamp,
    };
  } catch {
    return withYearFallback(getLastRaceResults, season);
  }
};
