import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ColumnDefinition, PivotConfig, RowGroupMeasure } from "@gp-grid/react";
import { IMG } from "@/lib/images";
import { store, useStoreVersion } from "@/lib/store";
import { AVAILABILITY, ZONES, type Vendor } from "@/data/generate";
import { CUISINE_NAMES, COUNTRY_NAMES } from "@/data/cuisines";
import { PageHero, StatTile, SearchBox, FilterSelect, Segmented, GridControls, OrganizerBanner } from "@/components/ui-festival";
import { ClientFestivalGrid, ClientPivotGrid } from "@/components/grid/LazyGrid";
import { ComparePanel } from "@/components/ComparePanel";
import { selectEditor, stars } from "@/components/grid/renderers";
import { toast } from "sonner";

export const Route = createFileRoute("/vendors")({
  head: () => ({
    meta: [
      { title: "Vendor Directory — Street Bites Festival" },
      { name: "description", content: "Search, sort, group and compare every food vendor at Street Bites, from Japanese yatai to Tunisian brik stalls." },
      { property: "og:title", content: "Vendor Directory — Street Bites" },
      { property: "og:description", content: "Explore all participating street food vendors by cuisine, zone, rating and price." },
    ],
  }),
  component: VendorsPage,
});

const COLUMNS: ColumnDefinition[] = [
  { cellDataType: "text", field: "id", colId: "select", headerName: "", width: 48, cellRenderer: "select", sortable: false, filterable: false, pinned: "start" },
  { cellDataType: "text", field: "name", headerName: "Vendor", width: 230, cellRenderer: "vendorName", pinned: "start", editable: true },
  { cellDataType: "text", field: "cuisine", headerName: "Cuisine", width: 130, cellRenderer: "cuisine", editable: true, editRenderer: "cuisine" },
  { cellDataType: "text", field: "country", headerName: "Country", width: 120 },
  { cellDataType: "text", field: "zone", headerName: "Zone", width: 130 },
  { cellDataType: "text", field: "stall", headerName: "Stall", width: 80, editable: true },
  { field: "rating", headerName: "Rating", width: 95, cellDataType: "number", cellRenderer: "rating", editable: true },
  { field: "reviews", headerName: "Reviews", width: 100, cellDataType: "number", cellRenderer: "number" },
  { field: "dishCount", headerName: "Dishes", width: 85, cellDataType: "number" },
  { field: "avgPrice", headerName: "Avg price", width: 105, cellDataType: "number", cellRenderer: "price", editable: true },
  { cellDataType: "text", field: "availability", headerName: "Status", width: 115, cellRenderer: "status", editable: true, editRenderer: "availability" },
  { field: "featured", headerName: "Badges", width: 175, cellRenderer: "featured", cellDataType: "boolean" },
  { cellDataType: "text", field: "signature", headerName: "Signature dish", width: 180 },
];

const EDITORS = { availability: selectEditor(AVAILABILITY), cuisine: selectEditor(CUISINE_NAMES) };
const MEASURES: RowGroupMeasure[] = [
  { field: "rating", aggregate: "avg" },
  { field: "reviews", aggregate: "sum" },
  { field: "dishCount", aggregate: "sum" },
  { field: "avgPrice", aggregate: "avg" },
];
const PIVOT: PivotConfig = {
  rows: [{ field: "cuisine" }],
  pivots: [{ field: "availability" }],
  measures: [{ field: "vendors", source: "id", aggregate: "count", column: { headerName: "Vendors", width: 110 } }],
  domain: { availability: [...AVAILABILITY] },
  rowTotals: true,
  grandTotal: "bottom",
  labelColumn: { headerName: "Cuisine", width: 200 },
};

type View = "directory" | "grouped" | "pivot";

function VendorsPage() {
  useStoreVersion();
  const [size, setSize] = useState(100);
  const [q, setQ] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [country, setCountry] = useState("");
  const [zone, setZone] = useState("");
  const [avail, setAvail] = useState("");
  const [minRating, setMinRating] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [view, setView] = useState<View>("directory");
  const [groupBy, setGroupBy] = useState("cuisine");
  const [organizer, setOrganizer] = useState(false);
  const [dark, setDark] = useState(false);

  const all = store.vendors(size);
  // Rows are rebuilt only when filters change, so grid edits don't reset sort/scroll.
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return store.vendors(size).filter((v) =>
      (!s || `${v.name} ${v.cuisine} ${v.signature} ${v.city} ${v.country}`.toLowerCase().includes(s)) &&
      (!cuisine || v.cuisine === cuisine) && (!country || v.country === country) && (!zone || v.zone === zone) &&
      (!avail || v.availability === avail) && (!minRating || v.rating >= Number(minRating)) && (!featuredOnly || v.featured));
  }, [q, cuisine, country, zone, avail, minRating, featuredOnly, size]);

  const open = all.filter((v) => v.availability === "Open" || v.availability === "Busy").length;
  const avg = all.reduce((a, v) => a + Number(v.rating), 0) / all.length;

  return (
    <>
      <PageHero eyebrow="Vendor directory" title="Meet the" accent="makers" img={IMG.crowd}>
        <p>{all.length.toLocaleString()} independent kitchens, carts and trucks from 15 countries. Find a stall, filter by cuisine, then tick a few to compare.</p>
        <div className="mt-6"><SearchBox value={q} onChange={setQ} placeholder="Search vendors, dishes, cities…" /></div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatTile value={all.length.toLocaleString()} label="Total vendors" />
          <StatTile value={open.toLocaleString()} label="Serving right now" tone="text-cobalt" />
          <StatTile value={all.filter((v) => v.featured).length} label="Featured vendors" tone="text-chili" />
          <StatTile value={avg.toFixed(2)} label="Average rating" />
        </div>

        <div className="mt-10 rounded-[2rem] bg-secondary/50 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented value={view} onChange={setView} options={[{ value: "directory", label: "Directory" }, { value: "grouped", label: "Grouped" }, { value: "pivot", label: "Pivot" }]} />
            <GridControls organizer={organizer} setOrganizer={setOrganizer} dark={dark} setDark={setDark}>
              <label className="flex items-center gap-2 text-sm font-bold text-primary">Dataset
                <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-10 rounded-full border border-border bg-card px-3 text-sm">
                  <option value={100}>100 vendors</option><option value={1000}>1,000 vendors</option><option value={10000}>10,000 vendors</option>
                </select>
              </label>
              {store.editCount("vendors") > 0 && (
                <button onClick={() => { store.reset("vendors"); toast("Vendor edits reset"); }} className="h-10 rounded-full px-3 text-sm font-bold text-chili hover:underline">Reset edits</button>
              )}
            </GridControls>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-7">
            <FilterSelect label="Cuisine" value={cuisine} onChange={setCuisine} options={CUISINE_NAMES} />
            <FilterSelect label="Country" value={country} onChange={setCountry} options={COUNTRY_NAMES} />
            <FilterSelect label="Zone" value={zone} onChange={setZone} options={ZONES} />
            <FilterSelect label="Status" value={avail} onChange={setAvail} options={AVAILABILITY} />
            <FilterSelect label="Min rating" value={minRating} onChange={setMinRating} options={["4", "4.5"]} />
            {view === "grouped" ? (
              <FilterSelect label="Group by" value={groupBy} onChange={(v) => setGroupBy(v || "cuisine")} options={["cuisine", "country", "zone"]} />
            ) : <div />}
            <label className="flex items-end gap-2 pb-2 text-sm font-bold text-primary">
              <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" /> Featured only
            </label>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {rows.length.toLocaleString()} shown · Click headers to sort, Shift+click for multi-sort · drag headers to reorder, edges to resize, pin icon to pin · arrow keys to move.
          </p>
        </div>

        <div className="mt-4">
          {organizer && view !== "pivot" && <OrganizerBanner />}
          {view === "pivot" ? (
            <>
              <p className="mb-3 text-sm text-ink/80"><strong className="text-primary">Vendors by cuisine × status.</strong> Expand totals; built by gp-grid's pivot engine from the filtered rows.</p>
              <ClientPivotGrid rows={rows as never} config={PIVOT} dark={dark} />
            </>
          ) : (
            <ClientFestivalGrid kind="vendors" rows={rows as never} columns={COLUMNS} editRenderers={EDITORS}
              organizer={organizer} dark={dark} groupBy={view === "grouped" ? groupBy : null} groupMeasures={MEASURES} />
          )}
        </div>

        <ComparePanel<Vendor> scope="vendors" noun="vendors" lookup={(id) => store.vendors(size).find((v) => v.id === id)}
          fields={[
            { label: "Cuisine", render: (v) => v.cuisine },
            { label: "Rating", render: (v) => stars(v.rating) },
            { label: "Avg price", render: (v) => `€${Number(v.avgPrice).toFixed(2)}` },
            { label: "Location", render: (v) => `${v.zone} · ${v.stall}` },
            { label: "Signature", render: (v) => v.signature },
            { label: "Status", render: (v) => v.availability },
          ]} />
      </section>
    </>
  );
}
