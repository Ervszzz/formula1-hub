import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { getDriverStandings } from "../api/f1Service";
import { useFetchData } from "../hooks/useFetchData";
import { getTeamHexColor } from "../utils/teamColors";
import { useSeason } from "../context/SeasonContext";
import type { DriverStanding } from "../types/f1";

interface ChartEntry {
  name: string;
  givenName: string;
  familyName: string;
  team: string;
  points: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartEntry }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#0A0D14] border border-red-500/30 px-4 py-3 tech-text text-xs">
      <div className="text-white font-bold mb-1">
        {d.givenName} {d.familyName}
      </div>
      <div className="text-gray-400">{d.team}</div>
      <div className="text-red-500 mt-1">{d.points} PTS</div>
    </div>
  );
};

const ChampionshipChart = () => {
  const { season } = useSeason();
  const { data: standings, loading } = useFetchData<DriverStanding[]>(
    getDriverStandings as (...args: unknown[]) => Promise<DriverStanding[] | null>,
    Array.isArray,
    [season]
  );

  if (loading || !standings?.length) return null;

  const top10: ChartEntry[] = standings.slice(0, 10).map((d) => ({
    name: d.Driver?.familyName ?? "",
    givenName: d.Driver?.givenName ?? "",
    familyName: d.Driver?.familyName ?? "",
    team: d.Constructor?.name ?? "",
    points: d.points,
    color: getTeamHexColor(d.Constructor?.name),
  }));

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center">
        <div className="w-1 h-6 bg-red-500 mr-3"></div>
        <div>
          <h2 className="text-2xl font-bold">CHAMPIONSHIP OVERVIEW</h2>
          <div className="tech-text text-xs text-red-500 tracking-wider">
            TOP 10 DRIVERS • {season} SEASON
          </div>
        </div>
      </div>

      <div className="tech-card tech-corner p-6">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={top10}
            layout="vertical"
            margin={{ top: 4, right: 40, bottom: 4, left: 10 }}
          >
            <XAxis
              type="number"
              tick={{
                fill: "#9CA3AF",
                fontSize: 11,
                fontFamily: "Space Mono, monospace",
              }}
              axisLine={{ stroke: "rgba(255,0,0,0.2)" }}
              tickLine={{ stroke: "rgba(255,0,0,0.2)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{
                fill: "#E5E7EB",
                fontSize: 11,
                fontFamily: "Space Mono, monospace",
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,0,0,0.05)" }}
            />
            <Bar dataKey="points" radius={0} maxBarSize={28}>
              {top10.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ChampionshipChart;
