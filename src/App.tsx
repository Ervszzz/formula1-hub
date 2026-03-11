import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SeasonProvider } from "./context/SeasonContext";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Standings = lazy(() => import("./pages/Standings"));
const Constructors = lazy(() => import("./pages/Constructors"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Results = lazy(() => import("./pages/Results"));
const RaceDetail = lazy(() => import("./pages/RaceDetail"));

// Full-page loading skeleton shown while lazy chunks load
const PageSkeleton = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <div className="relative w-20 h-20">
      <div className="absolute top-0 left-0 w-full h-full border-2 border-red-500/50 rounded-sm opacity-25 animate-ping"></div>
      <div className="absolute top-0 left-0 w-full h-full border-2 border-t-transparent border-red-500 rounded-sm animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="tech-text text-red-500 text-xs">LOADING</span>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <SeasonProvider>
        <div className="min-h-screen flex flex-col bg-[#080A0F] text-white">
          <Header />
          <main className="flex-grow w-full">
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/standings" element={<Standings />} />
                <Route path="/constructors" element={<Constructors />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/results" element={<Results />} />
                <Route path="/race/:season/:round" element={<RaceDetail />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Analytics />
        </div>
      </SeasonProvider>
    </BrowserRouter>
  );
}

export default App;
