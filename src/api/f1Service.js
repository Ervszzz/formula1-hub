import axios from "axios";

// Jolpica API (Ergast replacement) for F1 data
const JOLPICA_BASE_URL = "/api/jolpica";

const jolpicaInstance = axios.create({
  baseURL: JOLPICA_BASE_URL,
});

// Fetch driver standings from Jolpica API
export const getDriverStandings = async (season = new Date().getFullYear()) => {
  try {
    console.log(
      `Fetching driver standings from Jolpica API for season ${season}`
    );
    const timestamp = new Date().getTime();

    // Use the Ergast-compatible endpoint format
    const response = await jolpicaInstance.get(
      `/ergast/f1/${season}/driverStandings.json`
    );

    console.log(
      "Jolpica API response:",
      JSON.stringify(response.data, null, 2)
    );

    if (
      response.data &&
      response.data.MRData &&
      response.data.MRData.StandingsTable &&
      response.data.MRData.StandingsTable.StandingsLists &&
      response.data.MRData.StandingsTable.StandingsLists.length > 0
    ) {
      const standingsList =
        response.data.MRData.StandingsTable.StandingsLists[0];
      const driverStandings = standingsList.DriverStandings;

      console.log(
        `Successfully fetched ${driverStandings.length} driver standings from Jolpica API`
      );
      console.log(
        "First driver standing:",
        JSON.stringify(driverStandings[0], null, 2)
      );

      // Transform to match our expected format
      const mappedStandings = driverStandings.map((standing) => ({
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
        season: season,
        _timestamp: timestamp,
      }));

      console.log(
        "Mapped standings:",
        JSON.stringify(mappedStandings[0], null, 2)
      );
      return mappedStandings;
    } else {
      console.log("No driver standings data found in Jolpica API response");

      // Try previous season if we're looking at current year
      if (season === new Date().getFullYear()) {
        console.log("Trying previous season");
        const previousYear = season - 1;
        return await getDriverStandings(previousYear);
      } else {
        console.log("No data available");
        return "No Data Fetched";
      }
    }
  } catch (error) {
    console.error("Error fetching driver standings from Jolpica API:", error);

    // Try previous season if we're looking at current year
    if (season === new Date().getFullYear()) {
      console.log("Error occurred, trying previous season");
      const previousYear = season - 1;
      try {
        return await getDriverStandings(previousYear);
      } catch (prevYearError) {
        console.error("Error fetching previous season data:", prevYearError);
        console.log("No data available");
        return "No Data Fetched";
      }
    } else {
      console.log("No data available");
      return "No Data Fetched";
    }
  }
};

// Fetch race schedule from Jolpica API
export const getRaceSchedule = async (season = new Date().getFullYear()) => {
  try {
    console.log(`Fetching race schedule from Jolpica API for season ${season}`);
    const timestamp = new Date().getTime();

    // Get the race schedule for the season
    const response = await jolpicaInstance.get(`/ergast/f1/${season}.json`);

    if (
      response.data &&
      response.data.MRData &&
      response.data.MRData.RaceTable &&
      response.data.MRData.RaceTable.Races &&
      response.data.MRData.RaceTable.Races.length > 0
    ) {
      const races = response.data.MRData.RaceTable.Races;

      console.log(
        `Successfully fetched ${races.length} races for season ${season}`
      );

      // Transform to match our expected format
      return races.map((race) => ({
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
      }));
    } else {
      console.log("No race schedule data found in Jolpica API response");

      // Try previous season if we're looking at current year
      if (season === new Date().getFullYear()) {
        console.log("Trying previous season");
        const previousYear = season - 1;
        return await getRaceSchedule(previousYear);
      } else {
        console.log("No data available for season", season);
        return "No Data Fetched";
      }
    }
  } catch (error) {
    console.error("Error fetching race schedule from Jolpica API:", error);

    // Try previous season if we're looking at current year
    if (season === new Date().getFullYear()) {
      console.log("Error occurred, trying previous season");
      const previousYear = season - 1;
      try {
        return await getRaceSchedule(previousYear);
      } catch (prevYearError) {
        console.error("Error fetching previous season data:", prevYearError);
        console.log("No data available");
        return "No Data Fetched";
      }
    } else {
      console.log("No data available");
      return "No Data Fetched";
    }
  }
};

// Fetch last race results from Jolpica API
export const getLastRaceResults = async (season = new Date().getFullYear()) => {
  try {
    console.log(
      `Fetching last race results from Jolpica API for season ${season}`
    );
    const timestamp = new Date().getTime();

    // First get the last round number for the season
    const seasonsResponse = await jolpicaInstance.get(
      `/ergast/f1/${season}.json`
    );

    if (
      seasonsResponse.data &&
      seasonsResponse.data.MRData &&
      seasonsResponse.data.MRData.RaceTable &&
      seasonsResponse.data.MRData.RaceTable.Races &&
      seasonsResponse.data.MRData.RaceTable.Races.length > 0
    ) {
      const races = seasonsResponse.data.MRData.RaceTable.Races;
      const lastRaceRound = races[races.length - 1].round;

      console.log(
        `Found last race round: ${lastRaceRound} for season ${season}`
      );

      // Now get the results for this race
      const resultsResponse = await jolpicaInstance.get(
        `/ergast/f1/${season}/${lastRaceRound}/results.json`
      );

      if (
        resultsResponse.data &&
        resultsResponse.data.MRData &&
        resultsResponse.data.MRData.RaceTable &&
        resultsResponse.data.MRData.RaceTable.Races &&
        resultsResponse.data.MRData.RaceTable.Races.length > 0
      ) {
        const race = resultsResponse.data.MRData.RaceTable.Races[0];
        const results = race.Results;

        console.log(
          `Successfully fetched ${results.length} results for ${race.raceName}`
        );

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
          results: results.map((result) => ({
            position: result.position,
            Driver: {
              givenName: result.Driver.givenName,
              familyName: result.Driver.familyName,
              code: result.Driver.code,
            },
            Constructor: {
              name: result.Constructor.name,
            },
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
      } else {
        console.log("No race results found in Jolpica API response");
      }
    } else {
      console.log("No races found for season in Jolpica API response");
    }

    // If we get here, try previous season if we're looking at current year
    if (season === new Date().getFullYear()) {
      console.log("No current season data found, trying previous season");
      const previousYear = season - 1;
      return await getLastRaceResults(previousYear);
    } else {
      console.log("No data available for season", season);
      return "No Data Fetched";
    }
  } catch (error) {
    console.error("Error fetching last race results from Jolpica API:", error);

    // Try previous season if we're looking at current year
    if (season === new Date().getFullYear()) {
      console.log("Error occurred, trying previous season");
      const previousYear = season - 1;
      try {
        return await getLastRaceResults(previousYear);
      } catch (prevYearError) {
        console.error("Error fetching previous season data:", prevYearError);
        console.log("No data available");
        return "No Data Fetched";
      }
    } else {
      console.log("No data available");
      return "No Data Fetched";
    }
  }
};
