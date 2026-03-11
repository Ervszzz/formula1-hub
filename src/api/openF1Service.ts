const BASE = "https://api.openf1.org/v1";

async function get<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export interface OF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  circuit_short_name: string;
  country_name: string;
  location: string;
  date_start: string;
  date_end: string;
  meeting_key: number;
  year: number;
}

export interface OF1Meeting {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  circuit_short_name: string;
  country_name: string;
  location: string;
  date_start: string;
  year: number;
}

export interface OF1Driver {
  driver_number: number;
  name_acronym: string;
  full_name: string;
  team_name: string;
  team_colour: string;
  headshot_url: string;
}

export interface OF1Position {
  driver_number: number;
  position: number;
  date: string;
}

export interface OF1Interval {
  driver_number: number;
  gap_to_leader: number | null;
  interval: number | null;
  date: string;
}

export interface OF1Stint {
  driver_number: number;
  stint_number: number;
  lap_start: number;
  lap_end: number | null;
  compound: string;
  tyre_age_at_start: number;
}

export interface OF1Pit {
  driver_number: number;
  lap_number: number;
  pit_duration: number | null;
  date: string;
}

export interface OF1Weather {
  date: string;
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  rainfall: number;
}

export interface OF1Lap {
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  date_start: string;
  is_pit_out_lap: boolean;
}

export const getLatestSession = () =>
  get<OF1Session>("/sessions?session_key=latest");

export const getSessionsForMeeting = (meetingKey: number) =>
  get<OF1Session>(`/sessions?meeting_key=${meetingKey}`);

export const getMeetings = (year: number) =>
  get<OF1Meeting>(`/meetings?year=${year}`);

export const getDrivers = (sessionKey: number) =>
  get<OF1Driver>(`/drivers?session_key=${sessionKey}`);

export const getPositions = (sessionKey: number) =>
  get<OF1Position>(`/position?session_key=${sessionKey}`);

export const getPositionsSince = (sessionKey: number, since: string) =>
  get<OF1Position>(`/position?session_key=${sessionKey}&date>${since}`);

export const getIntervals = (sessionKey: number) =>
  get<OF1Interval>(`/intervals?session_key=${sessionKey}`);

export const getStints = (sessionKey: number) =>
  get<OF1Stint>(`/stints?session_key=${sessionKey}`);

export const getPits = (sessionKey: number) =>
  get<OF1Pit>(`/pit?session_key=${sessionKey}`);

export const getWeather = (sessionKey: number) =>
  get<OF1Weather>(`/weather?session_key=${sessionKey}`);

export const getLaps = (sessionKey: number) =>
  get<OF1Lap>(`/laps?session_key=${sessionKey}`);
