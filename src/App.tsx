import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import DriverStandings from "./components/DriverStandings";
import RaceSchedule from "./components/RaceSchedule";
import LastRaceResults from "./components/LastRaceResults";
import ConstructorStandings from "./components/ConstructorStandings";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

const HeroSection = () => (
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
          FORMULA 1<span className="text-white text-4xl ml-2">HUB</span>
        </h1>
        <div className="flex items-center justify-center mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/50"></div>
          <div className="px-4 tech-text text-xs tracking-widest text-red-500">
            SYSTEM ONLINE
          </div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/50"></div>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Real-time Formula 1 data interface. Access race telemetry,
          driver statistics, and circuit analytics.
        </p>
      </div>
    </div>
  </div>
);

const DashboardPage = () => (
  <>
    <HeroSection />
    <div className="w-full px-4 py-12">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1920px] mx-auto">
        <div className="xl:col-span-8">
          <ErrorBoundary>
            <LastRaceResults />
          </ErrorBoundary>
          <ErrorBoundary>
            <DriverStandings />
          </ErrorBoundary>
        </div>
        <div className="xl:col-span-4">
          <ErrorBoundary>
            <RaceSchedule />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  </>
);

const StandingsPage = () => (
  <div className="w-full px-4 py-12 pt-24">
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1920px] mx-auto">
      <div className="xl:col-span-12">
        <ErrorBoundary>
          <DriverStandings />
        </ErrorBoundary>
      </div>
    </div>
  </div>
);

const ConstructorsPage = () => (
  <div className="w-full px-4 py-12 pt-24">
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1920px] mx-auto">
      <div className="xl:col-span-12">
        <ErrorBoundary>
          <ConstructorStandings />
        </ErrorBoundary>
      </div>
    </div>
  </div>
);

const SchedulePage = () => (
  <div className="w-full px-4 py-12 pt-24">
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1920px] mx-auto">
      <div className="xl:col-span-12">
        <ErrorBoundary>
          <RaceSchedule />
        </ErrorBoundary>
      </div>
    </div>
  </div>
);

const ResultsPage = () => (
  <div className="w-full px-4 py-12 pt-24">
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1920px] mx-auto">
      <div className="xl:col-span-12">
        <ErrorBoundary>
          <LastRaceResults />
        </ErrorBoundary>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080A0F] text-white">
      <Header />
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/constructors" element={<ConstructorsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
