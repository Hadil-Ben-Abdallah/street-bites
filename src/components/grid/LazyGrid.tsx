import { lazy, Suspense, useEffect, useState, type ComponentProps } from "react";
import type { FestivalGrid as FG, PivotGrid as PG } from "./FestivalGrid";

// gp-grid touches browser APIs, so the grid modules load only after hydration.
const FestivalGridLazy = lazy(() => import("./FestivalGrid").then((m) => ({ default: m.FestivalGrid })));
const PivotGridLazy = lazy(() => import("./FestivalGrid").then((m) => ({ default: m.PivotGrid })));

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function Skeleton({ height = 620 }: { height?: number | undefined }) {
  return (
    <div style={{ height }} className="flex items-center justify-center rounded-[1.25rem] border border-border bg-card">
      <span className="font-display text-2xl text-primary/30">Loading the menu…</span>
    </div>
  );
}

export function ClientFestivalGrid(props: ComponentProps<typeof FG>) {
  const mounted = useMounted();
  if (!mounted) return <Skeleton height={props.height} />;
  return (
    <Suspense fallback={<Skeleton height={props.height} />}>
      <FestivalGridLazy {...props} />
    </Suspense>
  );
}

export function ClientPivotGrid(props: ComponentProps<typeof PG>) {
  const mounted = useMounted();
  if (!mounted) return <Skeleton height={props.height} />;
  return (
    <Suspense fallback={<Skeleton height={props.height} />}>
      <PivotGridLazy {...props} />
    </Suspense>
  );
}
