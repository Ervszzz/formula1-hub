import { lazy, Suspense } from "react";
import LiveTiming from "../components/LiveTiming";
import SEO from "../components/SEO";

const LastRaceResults = lazy(() => import("../components/LastRaceResults"));
const DriverStandings = lazy(() => import("../components/DriverStandings"));
const RaceSchedule = lazy(() => import("../components/RaceSchedule"));

const CardSkeleton = () => (
  <div className="tech-card p-6 tech-corner animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
    <div className="space-y-3">
      <div className="h-10 bg-gray-700 rounded"></div>
      <div className="h-10 bg-gray-700 rounded"></div>
      <div className="h-10 bg-gray-700 rounded"></div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <>
      <SEO path="/" />
      {/* Hero */}
      <div className="relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-[url('/f1-hero.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080A0F]"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 50%)`,
          }}
        ></div>
        <div className="relative py-20 px-4 w-full">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block mb-2 px-3 py-1 border border-red-500/30 bg-red-500/10 tech-text text-xs tracking-widest">
              TELEMETRY ACTIVE
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 glow-text">
              F1<span className="text-white text-4xl ml-2">PULSE</span>
            </h1>
            <div className="flex items-center justify-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/50"></div>
              <div className="px-4 tech-text text-xs tracking-widest text-red-500">
                SYSTEM ONLINE
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/50"></div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time Formula 1 data interface. Access race telemetry, driver
              statistics, and circuit analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Live Timing — only renders when there's an active session */}
      <LiveTiming />

      {/* Main content grid */}
      <div className="w-full px-4 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1920px] mx-auto">
          <div className="xl:col-span-8">
            <Suspense fallback={<CardSkeleton />}>
              <LastRaceResults />
            </Suspense>
            <Suspense fallback={<CardSkeleton />}>
              <DriverStandings />
            </Suspense>
          </div>
          <div className="xl:col-span-4">
            <Suspense fallback={<CardSkeleton />}>
              <RaceSchedule />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
