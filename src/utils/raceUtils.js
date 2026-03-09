export const formatDate = (dateString, timeString) => {
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

export const formatTime = (dateString, timeString) => {
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

export const isPastRace = (dateString) => {
  if (!dateString) return false;
  try {
    return new Date(dateString) < new Date();
  } catch {
    return false;
  }
};

export const getDaysUntilRace = (raceDate) => {
  const diffMs = Math.abs(new Date(raceDate) - new Date());
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const getNextRace = (races) => {
  const today = new Date();
  return races.find((race) => new Date(race.date) > today) ?? null;
};

export const groupRacesByMonth = (races) =>
  races.reduce((acc, race) => {
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
