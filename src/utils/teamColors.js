const TEAM_COLORS = {
  // Current teams (precise hex)
  "Red Bull":          { hex: "#0600EF", text: "text-[#0600EF]" },
  Ferrari:             { hex: "#DC0000", text: "text-[#DC0000]" },
  Mercedes:            { hex: "#00D2BE", text: "text-[#00D2BE]" },
  McLaren:             { hex: "#FF8700", text: "text-[#FF8700]" },
  "Aston Martin":      { hex: "#006F62", text: "text-[#006F62]" },
  Alpine:              { hex: "#0090FF", text: "text-[#0090FF]" },
  Williams:            { hex: "#005AFF", text: "text-[#005AFF]" },
  AlphaTauri:          { hex: "#2B4562", text: "text-[#2B4562]" },
  "Alfa Romeo":        { hex: "#900000", text: "text-[#900000]" },
  Haas:                { hex: "#FFFFFF", text: "text-white" },
  "Haas F1 Team":      { hex: "#FFFFFF", text: "text-white" },
  RB:                  { hex: "#0600EF", text: "text-[#0600EF]" },
  "Racing Bulls":      { hex: "#0600EF", text: "text-[#0600EF]" },
  "Visa Cash App RB":  { hex: "#0600EF", text: "text-[#0600EF]" },
  VCARB:               { hex: "#0600EF", text: "text-[#0600EF]" },
  Sauber:              { hex: "#900000", text: "text-[#900000]" },
  "Stake F1 Team":     { hex: "#900000", text: "text-[#900000]" },
  "Stake F1":          { hex: "#900000", text: "text-[#900000]" },
  // Historical teams
  "Racing Point":      { hex: "#F596C8", text: "text-pink-400" },
  Renault:             { hex: "#FFF500", text: "text-yellow-400" },
  "Toro Rosso":        { hex: "#469BFF", text: "text-blue-400" },
  "Force India":       { hex: "#FF80C7", text: "text-pink-500" },
  "Lotus F1":          { hex: "#1E1E1E", text: "text-gray-200" },
  Marussia:            { hex: "#EF0000", text: "text-red-500" },
  Caterham:            { hex: "#0C5E00", text: "text-green-600" },
  HRT:                 { hex: "#555555", text: "text-gray-500" },
  Virgin:              { hex: "#CC0000", text: "text-red-400" },
  "Brawn GP":          { hex: "#80FF00", text: "text-green-400" },
  Toyota:              { hex: "#CC1C11", text: "text-red-400" },
  "Super Aguri":       { hex: "#FFFFFF", text: "text-white" },
  Spyker:              { hex: "#E8640F", text: "text-orange-500" },
  Midland:             { hex: "#CC0000", text: "text-red-300" },
  Minardi:             { hex: "#1A1A1A", text: "text-gray-300" },
  Jaguar:              { hex: "#006A11", text: "text-green-700" },
  BAR:                 { hex: "#FFFFFF", text: "text-white" },
  Jordan:              { hex: "#FFB800", text: "text-yellow-500" },
  Arrows:              { hex: "#C25B00", text: "text-orange-600" },
  Prost:               { hex: "#4A90D9", text: "text-blue-400" },
  Benetton:            { hex: "#22AA00", text: "text-green-400" },
  Stewart:             { hex: "#FFFFFF", text: "text-white" },
  Tyrrell:             { hex: "#4A90D9", text: "text-blue-300" },
};

export const getTeamHexColor = (teamName) =>
  TEAM_COLORS[teamName]?.hex ?? "#6B7280";

export const getTeamTextClass = (teamName) =>
  TEAM_COLORS[teamName]?.text ?? "text-gray-400";
