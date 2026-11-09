import { rng } from "./generate";

export const EVENT_CATEGORIES = [
  "Cooking Demo",
  "Competition",
  "Live Music",
  "Chef Talk",
  "Workshop",
  "Tasting",
  "Special Experience",
] as const;

export const STAGES = ["Main Stage", "Fire Pit", "Chef's Theatre", "Garden Stage", "Tasting Tent", "Harbour Deck"] as const;
export const EVENT_STATUS = ["Upcoming", "Live", "Completed", "Delayed", "Cancelled"] as const;
export type EventStatus = (typeof EVENT_STATUS)[number];

export const FESTIVAL_DAYS = [
  { day: 1, label: "Day 1", date: "Fri 12 June" },
  { day: 2, label: "Day 2", date: "Sat 13 June" },
  { day: 3, label: "Day 3", date: "Sun 14 June" },
] as const;

export interface FestivalEvent {
  id: number;
  name: string;
  category: string;
  day: string; // "Day 1"
  start: string; // "HH:MM"
  end: string;
  stage: string;
  host: string;
  description: string;
  status: EventStatus;
  featured: boolean;
}

const TEMPLATES: Record<string, [string, string][]> = {
  "Cooking Demo": [
    ["Wok Hei: Fire & Flavour", "Master the smoky breath of the wok with high-heat stir-fry techniques."],
    ["Taco Masterclass", "Nixtamal, masa and the perfect al pastor trompo, live on stage."],
    ["Dumpling Pleating 101", "Twelve folds, one perfect soup dumpling."],
    ["The Art of Brik", "Crisp Tunisian pastry with a runny egg heart, step by step."],
    ["Smash Burger Science", "Why pressure, fat and a ripping-hot griddle make the crust."],
    ["Fresh Pasta in 20 Minutes", "Flour, eggs, hands. Nothing else."],
  ],
  Competition: [
    ["Hot Chili Showdown", "Ten challengers. One Carolina Reaper. No milk allowed."],
    ["Golden Spatula Final", "Vendors battle for the festival's top street food prize."],
    ["Dumpling Eating Contest", "Most dumplings in five minutes wins a year of free bao."],
    ["Best Bite Public Vote", "Taste five finalists and crown the people's champion."],
    ["Junior Chef Cook-Off", "Young cooks aged 10–16 take on a mystery basket."],
  ],
  "Live Music": [
    ["Cumbia Sunset Session", "Accordion-driven cumbia to start the evening."],
    ["Afrobeat Block Party", "A ten-piece band brings the brass."],
    ["Seoul City Lights DJ Set", "K-pop remixes and city pop until late."],
    ["Mezwed & Malouf Night", "Tunisian folk sounds under the string lights."],
    ["Bossa by the River", "Laid-back Brazilian classics on the Harbour Deck."],
  ],
  "Chef Talk": [
    ["From Cart to Cult", "How a single food cart grew into a citywide obsession."],
    ["Spice Routes", "Tracing harissa, ras el hanout and za'atar across the Mediterranean."],
    ["Zero-Waste Street Food", "Stocks, pickles and the art of using everything."],
    ["Women Who Run the Grill", "A panel of chefs reshaping street food culture."],
  ],
  Workshop: [
    ["Kimchi Making Workshop", "Leave with your own jar of fermented napa cabbage."],
    ["Knife Skills Bootcamp", "Julienne, brunoise and chiffonade with a pro."],
    ["Latte Art Basics", "Hearts, tulips and rosettas in an hour."],
    ["Hot Sauce Lab", "Blend, bottle and label your own house sauce."],
  ],
  Tasting: [
    ["Olive Oil Flight", "Six single-estate oils from Tunisia, Greece and Italy."],
    ["Street Sweets Crawl", "Churros, baklava, brigadeiros and mango sticky rice."],
    ["Natural Wine & Bao", "Skin-contact wines paired with steamed buns."],
    ["Tea Ceremony Tasting", "Matcha, oolong and mint tea traditions side by side."],
  ],
  "Special Experience": [
    ["Midnight Night Market", "Lanterns, late-night snacks and secret menu items."],
    ["Chef's Table Under the Stars", "A 7-course street food tasting menu for 20 guests."],
    ["Market Tour with a Chef", "Walk the stalls with a chef and taste the best bites."],
    ["Lantern Parade", "A glowing procession through every festival zone."],
  ],
};

const HOSTS = [
  "Chef Amira Ben Salah", "Chef Kenji Morita", "Chef Lucía Ramírez", "Chef Priya Natarajan", "Chef Marco Ferri",
  "Chef Ji-woo Park", "Chef Somchai Kittisak", "Chef Leila Haddad", "DJ Neon Mango", "Los Comales Band",
  "Chef Tomás Oliveira", "Chef Hana Nguyen", "Chef Youssef Alami", "Chef Dana Brooks", "The Brass Cartel",
  "Chef Eleni Papadakis", "Chef Wei Zhang", "Chef Mehmet Yılmaz",
];

const pad = (n: number) => String(n).padStart(2, "0");
export const toTime = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
export const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m || 0);
};

export function generateEvents(): FestivalEvent[] {
  const r = rng(99);
  const out: FestivalEvent[] = [];
  const cats = Object.keys(TEMPLATES);
  let id = 1;
  for (const d of FESTIVAL_DAYS) {
    for (let i = 0; i < 24; i++) {
      const cat = cats[(i + d.day) % cats.length]!;
      const list = TEMPLATES[cat]!;
      const [name, description] = list[(i + d.day * 2) % list.length]!;
      const startMins = 11 * 60 + Math.floor((i * 30 + r() * 20) / 15) * 15;
      const duration = cat === "Live Music" ? 60 : cat === "Special Experience" ? 90 : 45;
      // Day 1 is "today": events before ~15:00 already ran, then a few are live.
      const status: EventStatus =
        d.day === 1 ? (startMins < 14 * 60 ? "Completed" : startMins < 15 * 60 + 30 ? "Live" : "Upcoming") : "Upcoming";
      out.push({
        id: id++,
        name,
        category: cat,
        day: d.label,
        start: toTime(startMins),
        end: toTime(Math.min(startMins + duration, 23 * 60 + 45)),
        stage: STAGES[Math.floor(r() * STAGES.length)]!,
        host: HOSTS[Math.floor(r() * HOSTS.length)]!,
        description,
        status,
        featured: r() < 0.2,
      });
    }
  }
  return out;
}

/** Live simulation step: the next live event finishes, the next upcoming one goes live. */
export function advanceSchedule(events: FestivalEvent[]): { id: number; status: EventStatus }[] {
  const changes: { id: number; status: EventStatus }[] = [];
  const order = [...events].sort((a, b) => a.day.localeCompare(b.day) || toMinutes(a.start) - toMinutes(b.start));
  const live = order.find((e) => e.status === "Live");
  if (live) changes.push({ id: live.id, status: "Completed" });
  const next = order.find((e) => e.status === "Upcoming" || e.status === "Delayed");
  if (next) changes.push({ id: next.id, status: "Live" });
  return changes;
}
