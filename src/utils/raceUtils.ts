import type { Race } from "../types/f1";

export const formatDate = (dateString: string | undefined, timeString: string | undefined): string => {
  try {
    if (!dateString) return "TBD";
    const date =
      timeString && !dateString.includes("T")
        ? new Date(`${dateString}T${timeString}`)
        : new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return "Date TBD";
  }
};

export const formatTime = (dateString: string | undefined, timeString: string | undefined): string => {
  try {
    if (!dateString) return "";
    if (!timeString && !dateString.includes("T")) return "";
    const date = dateString.includes("T")
      ? new Date(dateString)
      : new Date(`${dateString}T${timeString}`);
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
};

const raceDateTime = (dateString: string, timeString?: string): Date =>
  timeString ? new Date(`${dateString}T${timeString}`) : new Date(dateString);

export const isPastRace = (dateString: string | undefined, timeString?: string): boolean => {
  if (!dateString) return false;
  try {
    return raceDateTime(dateString, timeString) < new Date();
  } catch {
    return false;
  }
};

export const getDaysUntilRace = (raceDate: string): number => {
  const diffMs = Math.abs(new Date(raceDate).getTime() - new Date().getTime());
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const getNextRace = (races: Race[]): Race | null => {
  const now = new Date();
  return races.find((race) => raceDateTime(race.date, race.time) > now) ?? null;
};

export const groupRacesByMonth = (races: Race[]): Record<string, Race[]> =>
  races.reduce<Record<string, Race[]>>((acc, race) => {
    try {
      const month = new Date(race.date).toLocaleString("default", {
        month: "long",
      });
      (acc[month] ??= []).push(race);
    } catch {
      (acc["Unknown"] ??= []).push(race);
    }
    return acc;
  }, {});
