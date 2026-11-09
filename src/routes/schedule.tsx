import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ColumnDefinition } from "@gp-grid/react";
import { Pause, Play, Radio } from "lucide-react";
import { toast } from "sonner";
import { IMG } from "@/lib/images";
import { store, useStoreVersion } from "@/lib/store";
import { EVENT_CATEGORIES, EVENT_STATUS, FESTIVAL_DAYS, STAGES, advanceSchedule } from "@/data/events";
import { PageHero, StatTile, FilterSelect, Segmented, GridControls, OrganizerBanner } from "@/components/ui-festival";
import { ClientFestivalGrid } from "@/components/grid/LazyGrid";
import { selectEditor } from "@/components/grid/renderers";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Festival Schedule — Street Bites" },
      { name: "description", content: "Three days of cooking demos, competitions, chef talks, workshops and live music. See what's live now." },
      { property: "og:title", content: "Festival Schedule — Street Bites" },
      { property: "og:description", content: "Day-by-day lineup of every stage at the Street Bites festival, with live status." },
    ],
  }),
  component: SchedulePage,
});

const COLUMNS: ColumnDefinition[] = [
  { cellDataType: "text", field: "start", headerName: "Time", width: 130, cellRenderer: "time", editable: true },
  { cellDataType: "text", field: "name", headerName: "Event", width: 260, editable: true },
  { cellDataType: "text", field: "category", headerName: "Category", width: 160, cellRenderer: "category" },
  { cellDataType: "text", field: "stage", headerName: "Stage", width: 140, editable: true, editRenderer: "stage" },
  { cellDataType: "text", field: "host", headerName: "Host", width: 210, cellRenderer: "host" },
  { cellDataType: "text", field: "status", headerName: "Status", width: 120, cellRenderer: "status", editable: true, editRenderer: "status" },
  { field: "featured", headerName: "Badges", width: 120, cellRenderer: "featured", cellDataType: "boolean" },
  { cellDataType: "text", field: "day", headerName: "Day", width: 80 },
  { cellDataType: "text", field: "description", headerName: "About", width: 360, editable: true },
];
const EDITORS = { stage: selectEditor(STAGES), status: selectEditor(EVENT_STATUS) };

function SchedulePage() {
  useStoreVersion();
  const [day, setDay] = useState<string>("Day 1");
  const [cat, setCat] = useState("");
  const [stage, setStage] = useState("");
  const [status, setStatus] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [organizer, setOrganizer] = useState(false);
  const [dark, setDark] = useState(false);
  const [live, setLive] = useState(true);

  const all = store.events();
  const rows = useMemo(
    () => store.events().filter((e) => (day === "All" || e.day === day) && (!cat || e.category === cat) && (!stage || e.stage === stage) && (!status || e.status === status)),
    [day, cat, stage, status],
  );

  // Controlled live simulation: every 12s the current live event ends and the next begins.
  useEffect(() => {
    if (!live) return;
    const t = window.setInterval(() => {
      const changes = advanceSchedule(store.events());
      for (const c of changes) store.update("events", c.id, { status: c.status });
      const started = changes.find((c) => c.status === "Live");
      if (started) toast(`Now live: ${store.events().find((e) => e.id === started.id)?.name}`, { icon: <Radio className="h-4 w-4 text-chili" /> });
      // Occasionally a vendor gets busy or sells out.
      const v = store.vendors(100)[Math.floor(Math.random() * 100)]!;
      store.update("vendors", v.id, { availability: v.availability === "Open" ? "Busy" : v.availability === "Busy" ? "Sold Out" : "Open" });
    }, 12000);
    return () => window.clearInterval(t);
  }, [live]);

  const liveNow = all.filter((e) => e.status === "Live");

  return (
    <>
      <PageHero eyebrow="Festival schedule" title="Three days," accent="six stages" img={IMG.stage}>
        <p>Cooking demos, hot-chili showdowns, chef talks, workshops and late-night music. Statuses update live through the day.</p>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatTile value={all.length} label="Total events" />
          <StatTile value={all.filter((e) => e.status === "Upcoming").length} label="Upcoming" tone="text-cobalt" />
          <StatTile value={<span className="flex items-center gap-2">{liveNow.length}<span className="live-dot h-3 w-3 rounded-full bg-chili" /></span>} label="Live now" tone="text-chili" />
          <StatTile value={all.filter((e) => e.status === "Completed").length} label="Completed" />
        </div>

        {liveNow.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-3xl bg-chili px-5 py-4 text-primary-foreground">
            <Radio className="h-5 w-5" /><strong className="uppercase">On now:</strong>
            {liveNow.map((e) => <span key={e.id} className="rounded-full bg-primary-foreground/15 px-3 py-1 text-sm font-bold">{e.name} · {e.stage}</span>)}
          </div>
        )}

        <div className="mt-8 rounded-[2rem] bg-secondary/50 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented value={day} onChange={setDay}
              options={[...FESTIVAL_DAYS.map((d) => ({ value: d.label, label: `${d.label} · ${d.date}` })), { value: "All", label: "All days" }]} />
            <GridControls organizer={organizer} setOrganizer={setOrganizer} dark={dark} setDark={setDark}>
              <button onClick={() => setLive(!live)} className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold ${live ? "bg-primary text-primary-foreground" : "border-2 border-primary/20 bg-card text-primary"}`}>
                {live ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} Live updates {live ? "on" : "paused"}
              </button>
            </GridControls>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <FilterSelect label="Category" value={cat} onChange={setCat} options={EVENT_CATEGORIES} />
            <FilterSelect label="Stage" value={stage} onChange={setStage} options={STAGES} />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={EVENT_STATUS} />
            <FilterSelect label="Group by" value={groupBy} onChange={setGroupBy} options={["day", "category", "stage"]} />
          </div>
        </div>

        <div className="mt-4">
          {organizer && <OrganizerBanner />}
          <ClientFestivalGrid kind="events" rows={rows as never} columns={COLUMNS} editRenderers={EDITORS} organizer={organizer} dark={dark} groupBy={groupBy || null} />
        </div>
      </section>
    </>
  );
}
