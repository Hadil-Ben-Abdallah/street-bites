import { CUISINES } from "./cuisines";
import type { ImgKey } from "@/lib/images";

/** Deterministic PRNG so every visitor sees the same festival. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ZONES = ["Market Hall", "Riverside", "Night Bazaar", "Garden Court", "Harbour Deck"] as const;
export const AVAILABILITY = ["Open", "Busy", "Sold Out", "Closed"] as const;
export type Availability = (typeof AVAILABILITY)[number];

export interface Vendor {
  id: number;
  name: string;
  img: ImgKey;
  cuisine: string;
  country: string;
  city: string;
  zone: string;
  stall: string;
  rating: number;
  reviews: number;
  dishCount: number;
  avgPrice: number;
  availability: Availability;
  featured: boolean;
  isNew: boolean;
  signature: string;
}

const SUFFIXES = ["", " Express", " Kitchen", " Social", " Collective", " & Sons", " Lab", " Corner", " Bar", " Club"];

export function generateVendors(count: number): Vendor[] {
  const r = rng(42);
  const out: Vendor[] = [];
  for (let i = 0; i < count; i++) {
    const c = CUISINES[i % CUISINES.length]!;
    const round = Math.floor(i / CUISINES.length);
    const baseName = c.vendorNames[round % c.vendorNames.length]!;
    const cycle = Math.floor(round / c.vendorNames.length);
    const name = cycle === 0 ? baseName : `${baseName}${SUFFIXES[cycle % SUFFIXES.length]! || ` No.${cycle + 1}`}${cycle >= SUFFIXES.length ? ` ${cycle}` : ""}`;
    const dish = c.dishes[Math.floor(r() * c.dishes.length)]!;
    const zoneIdx = Math.floor(r() * ZONES.length);
    const avRoll = r();
    out.push({
      id: i + 1,
      name,
      img: dish.img,
      cuisine: c.cuisine,
      country: c.country,
      city: c.cities[Math.floor(r() * c.cities.length)]!,
      zone: ZONES[zoneIdx]!,
      stall: `${ZONES[zoneIdx]![0]}${String(1 + Math.floor(r() * 60)).padStart(2, "0")}`,
      rating: Math.round((3.6 + r() * 1.4) * 10) / 10,
      reviews: 20 + Math.floor(r() * 1800),
      dishCount: 4 + Math.floor(r() * 14),
      avgPrice: Math.round((dish.price * (0.8 + r() * 0.5)) * 2) / 2,
      availability: avRoll < 0.62 ? "Open" : avRoll < 0.82 ? "Busy" : avRoll < 0.93 ? "Sold Out" : "Closed",
      featured: r() < 0.18,
      isNew: r() < 0.22,
      signature: dish.name,
    });
  }
  return out;
}

export interface Dish {
  id: number;
  name: string;
  img: ImgKey;
  country: string;
  cuisine: string;
  description: string;
  price: number;
  diet: string;
  allergens: string;
  spice: number;
  popularity: number;
  rating: number;
  vendor: string;
  availability: Availability;
  featured: boolean;
}

const VARIANTS = ["", "Classic ", "Spicy ", "Loaded ", "Mini ", "Midnight ", "Grandma's ", "Smoky ", "Crispy ", "Truffle "];

export function generateDishes(count: number, vendors: Vendor[]): Dish[] {
  const r = rng(7);
  const out: Dish[] = [];
  const allSeeds = CUISINES.flatMap((c) => c.dishes.map((d) => ({ c, d })));
  for (let i = 0; i < count; i++) {
    const { c, d } = allSeeds[i % allSeeds.length]!;
    const round = Math.floor(i / allSeeds.length);
    const variant = round === 0 ? "" : VARIANTS[round % VARIANTS.length]!;
    const vendorPool = vendors.filter((v) => v.cuisine === c.cuisine);
    const vendor = vendorPool[Math.floor(r() * vendorPool.length)] ?? vendors[0]!;
    const avRoll = r();
    const spice = variant === "Spicy " ? Math.min(4, d.spice + 2) : d.spice;
    out.push({
      id: i + 1,
      name: `${variant}${d.name}`.trim() + (round >= VARIANTS.length ? ` #${round}` : ""),
      img: d.img,
      country: c.country,
      cuisine: c.cuisine,
      description: d.description,
      price: Math.round(d.price * (0.9 + r() * 0.35) * 2) / 2,
      diet: d.diet,
      allergens: d.allergens,
      spice,
      popularity: 40 + Math.floor(r() * 61),
      rating: Math.round((3.5 + r() * 1.5) * 10) / 10,
      vendor: vendor.name,
      availability: avRoll < 0.7 ? "Open" : avRoll < 0.85 ? "Busy" : "Sold Out",
      featured: r() < 0.12,
    });
  }
  return out;
}
