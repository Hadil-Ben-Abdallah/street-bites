import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, MapPin, Flame, ChefHat, Trophy, Music, Sparkles, Clock, Star } from "lucide-react";
import { IMG } from "@/lib/images";
import { store, useStoreVersion } from "@/lib/store";
import { PhotoCard } from "@/components/ui-festival";
import { cuisineTone, STATUS_TONE } from "@/components/grid/renderers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Street Bites — International Street Food Festival" },
      { name: "description", content: "40+ vendors, 15 cuisines, 200+ dishes and three days of food, music and chefs. Explore the Street Bites festival." },
      { property: "og:title", content: "Street Bites — One City. A Thousand Flavors." },
      { property: "og:description", content: "An international street food festival: vendors, dishes, live cooking and music over three days." },
    ],
  }),
  component: Home,
});

const HIGHLIGHTS = [
  { icon: Flame, title: "Live cooking shows", text: "Wok fire, taco trompos and pastry folding on the Fire Pit stage.", tone: "bg-chili text-primary-foreground" },
  { icon: Trophy, title: "Food competitions", text: "Hot chili showdowns and the Golden Spatula final.", tone: "bg-sun text-ink" },
  { icon: ChefHat, title: "Chef appearances", text: "Talks and tastings with chefs from 15 countries.", tone: "bg-lavender text-primary" },
  { icon: Music, title: "Live music", text: "Cumbia, afrobeat and DJ sets until late.", tone: "bg-sky text-cobalt" },
  { icon: Sparkles, title: "Special experiences", text: "Midnight night market and a chef's table under the stars.", tone: "bg-blush text-primary" },
];

function Home() {
  useStoreVersion();
  const vendors = store.vendors(100);
  const dishes = store.dishes(160);
  const featured = vendors.filter((v) => v.featured).slice(0, 4);
  const popular = [...dishes].sort((a, b) => b.popularity - a.popularity).filter((d, i, arr) => arr.findIndex((x) => x.img === d.img) === i).slice(0, 4);
  const upcoming = store.events().filter((e) => e.status === "Upcoming" || e.status === "Live").slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pt-10 md:grid-cols-[1fr_1.15fr] md:pt-16">
        <div className="flex flex-col justify-center">
          <h1 className="leading-none">
            <span className="sticker -rotate-3 bg-chili text-6xl text-sun md:text-8xl">Street</span>
            <br />
            <span className="sticker ml-10 mt-1 rotate-1 bg-sky text-6xl text-primary md:text-8xl">Bites</span>
          </h1>
          <p className="mt-8 font-display text-3xl text-primary md:text-4xl">One city. A thousand flavors.</p>
          <p className="mt-4 max-w-md text-lg text-ink/80">
            Three days of independent street food from 15 countries, takoyaki to brik, birria to bánh mì, with chefs, competitions and live music by the river.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-primary">
            <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-chili" />12–14 June 2027</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-chili" />Riverside Park, Old Harbour</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/vendors" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 font-extrabold uppercase text-primary-foreground shadow-[4px_4px_0_0_var(--chili)] transition hover:-translate-y-0.5">
              Explore the vendors <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/food" className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-4 font-extrabold uppercase text-primary transition hover:bg-secondary">
              Discover the food
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-6 grid-rows-6 gap-3 md:h-[600px]">
          <img src={IMG.bao} alt="Pork belly bao" className="col-span-4 row-span-4 h-full w-full rounded-[2rem] object-cover" width={1024} height={1024} />
          <img src={IMG.tacos} alt="Tacos al pastor" className="col-span-2 row-span-3 h-full w-full rounded-[2rem] object-cover" width={1024} height={1024} />
          <img src={IMG.corndog} alt="Korean corn dog" className="col-span-2 row-span-3 h-full w-full rounded-[2rem] object-cover" width={1024} height={1024} />
          <img src={IMG.takoyaki} alt="Takoyaki" className="col-span-2 row-span-2 h-full w-full rounded-[2rem] object-cover" width={1024} height={1024} />
          <img src={IMG.burger} alt="Smash burger" className="col-span-2 row-span-2 h-full w-full rounded-[2rem] object-cover" width={1024} height={1024} />
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto mt-16 max-w-7xl px-5">
        <div className="dotted-rule grid grid-cols-2 gap-6 pt-10 md:grid-cols-4">
          {[
            ["40+", "food vendors", "text-primary"],
            ["15+", "international cuisines", "text-chili"],
            ["200+", "dishes to try", "text-cobalt"],
            ["3", "days of food & music", "text-primary"],
          ].map(([n, l, t]) => (
            <div key={l} className="text-center">
              <div className={`font-display text-6xl md:text-7xl ${t}`} style={{ textShadow: "3px 3px 0 var(--lavender)" }}>{n}</div>
              <div className="mt-1 font-semibold text-ink/80">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured vendors */}
      <Section title="Featured" accent="vendors" link={{ to: "/vendors", label: "All vendors" }}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((v) => (
            <PhotoCard key={v.id} img={v.img} title={v.name} tags={[v.cuisine, v.signature]} badges={{ featured: true, isNew: v.isNew }}
              footer={<><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Stall {v.stall}</span><span className="flex items-center gap-1"><Star className="h-3 w-3 fill-sun text-sun" />{v.rating}</span></>} />
          ))}
        </div>
      </Section>

      {/* Popular dishes */}
      <Section title="Popular" accent="dishes" link={{ to: "/food", label: "Explore all food" }}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((d) => (
            <article key={d.id} className="overflow-hidden rounded-[1.75rem] bg-card shadow-[var(--shadow-card)]">
              <img src={IMG[d.img]} alt={d.name} loading="lazy" className="aspect-square w-full object-cover" width={1024} height={1024} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-xl text-primary">{d.name}</h3>
                  <span className="font-display text-xl text-chili">€{d.price}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{d.country}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className={`grid-badge ${cuisineTone(d.cuisine)}`}>{d.cuisine}</span>
                  <span className="grid-badge bg-mint text-ink">{d.diet}</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-ink">
                  <Flame className="h-4 w-4 text-chili" />
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><span className="block h-full bg-chili" style={{ width: `${d.popularity}%` }} /></span>
                  {d.popularity}% loved
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Highlights */}
      <section className="mx-auto mt-24 max-w-7xl px-5">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="relative overflow-hidden rounded-[2rem]">
            <img src={IMG.stage} alt="Chef cooking with fire on stage" loading="lazy" className="h-full min-h-80 w-full object-cover" width={1600} height={900} />
            <div className="info-panel absolute inset-x-4 bottom-0 p-6">
              <h2 className="font-display text-4xl text-primary">More than food</h2>
              <p className="mt-2 text-ink/80">Five stages, 72 events, zero boring moments.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {HIGHLIGHTS.map(({ icon: I, title, text, tone }) => (
              <div key={title} className="rounded-[1.75rem] border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <span className={`inline-flex rounded-2xl p-3 ${tone}`}><I className="h-6 w-6" /></span>
                <h3 className="mt-4 font-display text-xl text-primary">{title}</h3>
                <p className="mt-1 text-sm text-ink/75">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <Section title="Coming" accent="up" link={{ to: "/schedule", label: "Full schedule" }}>
        <div className="grid gap-4 md:grid-cols-2">
          {upcoming.map((e) => (
            <div key={e.id} className="flex items-center gap-5 rounded-[1.75rem] bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="rounded-2xl bg-secondary px-4 py-3 text-center">
                <div className="text-xs font-bold uppercase text-chili">{e.day}</div>
                <div className="font-display text-2xl text-primary">{e.start}</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`grid-badge ${STATUS_TONE[e.status]}`}>{e.status}</span>
                  <span className="grid-badge bg-lavender text-primary">{e.category}</span>
                </div>
                <h3 className="mt-2 truncate font-display text-xl text-primary">{e.name}</h3>
                <p className="flex items-center gap-3 text-sm text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.stage}</span><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />until {e.end}</span></p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <section className="mx-auto mt-24 max-w-7xl px-5">
        <div className="relative overflow-hidden rounded-[2rem]">
          <img src={IMG.crowd} alt="Festival crowd at golden hour" loading="lazy" className="h-80 w-full object-cover md:h-96" width={1600} height={912} />
          <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-ink/80 to-transparent p-8 md:p-12">
            <h2 className="font-display text-4xl text-primary-foreground md:text-6xl">Come hungry.</h2>
            <p className="mt-2 max-w-lg text-primary-foreground/90">Free entry · Pay per bite · Family friendly · Open 11:00–23:30 daily</p>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({ title, accent, link, children }: { title: string; accent: string; link: { to: "/vendors" | "/food" | "/schedule"; label: string }; children: React.ReactNode }) {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-5">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-5xl text-primary">{title} <span className="sticker rotate-1 bg-lavender text-chili">{accent}</span></h2>
        <Link to={link.to} className="inline-flex items-center gap-2 border-b-2 border-dashed border-primary/40 pb-1 text-sm font-extrabold uppercase text-primary hover:border-chili">{link.label} <ArrowRight className="h-4 w-4" /></Link>
      </div>
      {children}
    </section>
  );
}
