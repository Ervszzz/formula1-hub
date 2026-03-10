import { lazy, Suspense } from "react";

const ConstructorStandings = lazy(
  () => import("../components/ConstructorStandings")
);

const CardSkeleton = () => (
  <div className="tech-card p-6 tech-corner animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-700 rounded"></div>
      ))}
    </div>
  </div>
);

const Constructors = () => (
  <div className="w-full px-4 py-12 pt-24">
    <div className="max-w-[1920px] mx-auto">
      <Suspense fallback={<CardSkeleton />}>
        <ConstructorStandings />
      </Suspense>
    </div>
  </div>
);

export default Constructors;
