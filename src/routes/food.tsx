import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ColumnDefinition } from "@gp-grid/react";
import { IMG } from "@/lib/images";
import { store, useStoreVersion } from "@/lib/store";
import { AVAILABILITY, type Dish } from "@/data/generate";
import { CUISINE_NAMES, COUNTRY_NAMES } from "@/data/cuisines";
import { PageHero, SearchBox, FilterSelect, GridControls, OrganizerBanner, PhotoCard } from "@/components/ui-festival";
import { ClientFestivalGrid } from "@/components/grid/LazyGrid";
import { ComparePanel } from "@/components/ComparePanel";
import { selectEditor, stars } from "@/components/grid/renderers";

export const Route = createFileRoute("/food")({
  head: () => ({
    meta: [
      { title: "Food Explorer — Street Bites Festival" },
      { name: "description", content: "Find your next favorite bite: browse hundreds of street food dishes by cuisine, diet, price and spice level." },
      { property: "og:title", content: "Food Explorer — Street Bites" },
      { property: "og:description", content: "Takoyaki, birria, brik, bánh mì and more — filter every dish at the festival." },
    ],
  }),
  component: FoodPage,
});

const DIETS = ["Vegan", "Vegetarian", "Gluten-free", "Meat", "Seafood"] as const;
const PRICE = ["Under €7", "€7–10", "€10+"] as const;

const COLUMNS: ColumnDefinition[] = [
  { cellDataType: "text", field: "id", colId: "select", headerName: "", width: 48, cellRenderer: "select", sortable: false, filterable: false, pinned: "start" },
  { cellDataType: "text", field: "name", headerName: "Dish", width: 300, cellRenderer: "dishName", pinned: "start", editable: true },
  { field: "price", headerName: "Price", width: 95, cellDataType: "number", cellRenderer: "price", editable: true },
  { cellDataType: "text", field: "cuisine", headerName: "Cuisine", width: 125, cellRenderer: "cuisine", editable: true, editRenderer: "cuisine" },
  { cellDataType: "text", field: "country", headerName: "Country", width: 120 },
  { cellDataType: "text", field: "diet", headerName: "Diet", width: 120, cellRenderer: "diet", editable: true, editRenderer: "diet" },
  { field: "spice", headerName: "Spice", width: 110, cellDataType: "number", cellRenderer: "spice", editable: true, editRenderer: "spice" },
  { field: "rating", headerName: "Rating", width: 90, cellDataType: "number", cellRenderer: "rating" },
  { field: "popularity", headerName: "Popularity", width: 150, cellDataType: "number", cellRenderer: "popularity" },
  { cellDataType: "text", field: "availability", headerName: "Status", width: 110, cellRenderer: "status", editable: true, editRenderer: "availability" },
  { cellDataType: "text", field: "vendor", headerName: "Vendor", width: 170 },
  { cellDataType: "text", field: "allergens", headerName: "Allergens", width: 180 },
];
const EDITORS = {
  cuisine: selectEditor(CUISINE_NAMES), diet: selectEditor(DIETS),
  spice: selectEditor([0, 1, 2, 3, 4]), availability: selectEditor(AVAILABILITY),
};

function FoodPage() {
  useStoreVersion();
  const [size, setSize] = useState(160);
  const [q, setQ] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [country, setCountry] = useState("");
  const [diet, setDiet] = useState("");
  const [price, setPrice] = useState("");
  const [spice, setSpice] = useState("");
  const [avail, setAvail] = useState("");
  const [organizer, setOrganizer] = useState(false);
  const [dark, setDark] = useState(false);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return store.dishes(size).filter((d) =>
      (!s || `${d.name} ${d.description} ${d.vendor} ${d.cuisine}`.toLowerCase().includes(s)) &&
      (!cuisine || d.cuisine === cuisine) && (!country || d.country === country) && (!diet || d.diet === diet) &&
      (!price || (price === PRICE[0] ? d.price < 7 : price === PRICE[1] ? d.price >= 7 && d.price < 10 : d.price >= 10)) &&
      (!spice || d.spice === Number(spice)) && (!avail || d.availability === avail));
  }, [q, cuisine, country, diet, price, spice, avail, size]);

  const featured = store.dishes(size).filter((d) => d.featured).filter((d, i, a) => a.findIndex((x) => x.img === d.img) === i).slice(0, 3);

  return (
    <>
      <PageHero eyebrow="Food explorer" title="Find your next favorite" accent="bite" img={IMG.padkrapao}>
        <p>Every dish at the festival in one place. Filter by diet, price or spice, then line up a few to compare.</p>
        <div className="mt-6"><SearchBox value={q} onChange={setQ} placeholder="Search dishes, ingredients, vendors…" /></div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5">
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((d) => (
            <PhotoCard key={d.id} img={d.img} title={d.name} tags={[d.cuisine, d.diet, `€${d.price}`]} badges={{ featured: true }} footer={<>{d.vendor} · {"🌶".repeat(d.spice) || "mild"}</>} />
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] bg-secondary/50 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-3xl text-primary">The full menu</h2>
            <GridControls organizer={organizer} setOrganizer={setOrganizer} dark={dark} setDark={setDark}>
              <label className="flex items-center gap-2 text-sm font-bold text-primary">Dataset
                <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-10 rounded-full border border-border bg-card px-3 text-sm">
                  <option value={160}>160 dishes</option><option value={1000}>1,000 dishes</option><option value={5000}>5,000 dishes</option>
                </select>
              </label>
            </GridControls>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-6">
            <FilterSelect label="Cuisine" value={cuisine} onChange={setCuisine} options={CUISINE_NAMES} />
            <FilterSelect label="Country" value={country} onChange={setCountry} options={COUNTRY_NAMES} />
            <FilterSelect label="Diet" value={diet} onChange={setDiet} options={DIETS} />
            <FilterSelect label="Price" value={price} onChange={setPrice} options={PRICE} />
            <FilterSelect label="Spice" value={spice} onChange={setSpice} options={["0", "1", "2", "3", "4"]} />
            <FilterSelect label="Status" value={avail} onChange={setAvail} options={AVAILABILITY} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{rows.length.toLocaleString()} dishes · Shift+click headers to sort by several columns.</p>
        </div>

        <div className="mt-4">
          {organizer && <OrganizerBanner />}
          <ClientFestivalGrid kind="dishes" rows={rows as never} columns={COLUMNS} editRenderers={EDITORS} organizer={organizer} dark={dark} rowHeight={60} />
        </div>

        <ComparePanel<Dish> scope="dishes" noun="dishes" lookup={(id) => store.dishes(size).find((d) => d.id === id)}
          fields={[
            { label: "Price", render: (d) => `€${Number(d.price).toFixed(2)}` },
            { label: "Cuisine", render: (d) => `${d.cuisine} · ${d.country}` },
            { label: "Diet", render: (d) => d.diet },
            { label: "Spice", render: (d) => "🌶".repeat(Number(d.spice)) || "Mild" },
            { label: "Rating", render: (d) => stars(d.rating) },
            { label: "Allergens", render: (d) => d.allergens },
            { label: "Vendor", render: (d) => d.vendor },
          ]} />
      </section>
    </>
  );
}
