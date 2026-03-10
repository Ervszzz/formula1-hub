import { lazy, Suspense } from "react";
import SEO from "../components/SEO";

const LastRaceResults = lazy(() => import("../components/LastRaceResults"));

const CardSkeleton = () => (
  <div className="tech-card p-6 tech-corner animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-700 rounded"></div>
      ))}
    </div>
  </div>
);

const Results = () => (
  <>
    <SEO
      title="Last Race Results"
      description="Latest Formula 1 race results including podium, fastest lap and full classification."
      path="/results"
    />
    <div className="w-full px-4 py-12 pt-24">
      <div className="max-w-[1920px] mx-auto">
        <Suspense fallback={<CardSkeleton />}>
          <LastRaceResults />
        </Suspense>
      </div>
    </div>
  </>
);

export default Results;
