import { createContext, useContext, useState, ReactNode } from "react";

const CURRENT_YEAR = new Date().getFullYear();

interface SeasonContextValue {
  season: number;
  setSeason: (season: number | string) => void;
}

const SeasonContext = createContext<SeasonContextValue>({
  season: CURRENT_YEAR,
  setSeason: () => {},
});

interface SeasonProviderProps {
  children: ReactNode;
}

export const SeasonProvider = ({ children }: SeasonProviderProps) => {
  const [season, setSeason] = useState<number>(CURRENT_YEAR);

  const handleSetSeason = (newSeason: number | string) => {
    const yr = parseInt(String(newSeason), 10);
    // Clear relevant localStorage cache entries for the previous season
    const keys = Object.keys(localStorage).filter(
      (k) =>
        k.startsWith("f1_standings_") ||
        k.startsWith("f1_schedule_") ||
        k.startsWith("f1_last_race_") ||
        k.startsWith("f1_race_") ||
        k.startsWith("f1_quali_")
    );
    keys.forEach((k) => localStorage.removeItem(k));
    setSeason(yr);
  };

  return (
    <SeasonContext.Provider value={{ season, setSeason: handleSetSeason }}>
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => useContext(SeasonContext);

export default SeasonContext;
