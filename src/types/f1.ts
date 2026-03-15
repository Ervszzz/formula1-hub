export interface Driver {
  driverId: string;
  givenName: string;
  familyName: string;
  nationality: string;
}

export interface Constructor {
  constructorId: string;
  name: string;
  nationality?: string;
}

export interface DriverStanding {
  position: number;
  points: number;
  wins: number;
  Driver: Driver;
  Constructor: Constructor;
  season: number;
}

export interface CircuitLocation {
  locality?: string;
  country?: string;
}

export interface Circuit {
  circuitId: string;
  circuitName: string;
  Location?: CircuitLocation;
}

export interface Race {
  season: number;
  round: number;
  raceName: string;
  date: string;
  time?: string;
  Circuit: Circuit;
  hasSprint?: boolean;
}

export interface FastestLap {
  rank: string;
  lap: string;
  Time: { time: string } | null;
  AverageSpeed: { speed: string; units: string } | null;
}

export interface RaceResult {
  position: string;
  Driver: {
    givenName: string;
    familyName: string;
    code: string;
  };
  Constructor: { name: string };
  grid: string;
  laps: string;
  status: string;
  Time: { time: string } | null;
  FastestLap: FastestLap | null;
  points: string;
}

export interface LastRaceData {
  season: number;
  round: number;
  raceName: string;
  date: string;
  Circuit: Circuit;
  results: RaceResult[];
}

export interface ConstructorStanding {
  position: number;
  points: number;
  wins: number;
  Constructor: Constructor;
  season: number;
}

export interface QualifyingResult {
  position: string;
  Driver: {
    givenName: string;
    familyName: string;
    code: string;
  };
  Constructor: { name: string };
  Q1: string;
  Q2?: string;
  Q3?: string;
}
