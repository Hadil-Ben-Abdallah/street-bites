import { useSyncExternalStore } from "react";
import { generateDishes, generateVendors, type Dish, type Vendor } from "@/data/generate";
import { generateEvents, type FestivalEvent } from "@/data/events";

type Kind = "vendors" | "dishes" | "events";
type Overrides = Record<Kind, Record<number, Record<string, unknown>>>;

const KEY = "street-bites-edits-v1";
const MAX_VENDORS = 10000;

const baseVendors = generateVendors(MAX_VENDORS);
const baseDishes = generateDishes(5000, baseVendors.slice(0, 100));
const baseEvents = generateEvents();

let overrides: Overrides = { vendors: {}, dishes: {}, events: {} };
let version = 0;
const listeners = new Set<() => void>();
let loaded = false;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) overrides = { vendors: {}, dishes: {}, events: {}, ...JSON.parse(raw) };
  } catch {
    /* ignore corrupt storage */
  }
}

function emit(persist = true) {
  version++;
  cache.clear();
  if (persist && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(overrides));
    } catch {
      /* storage full */
    }
  }
  listeners.forEach((l) => l());
}

const cache = new Map<string, unknown[]>();
function apply<T extends { id: number }>(kind: Kind, base: T[], count: number): T[] {
  const key = `${kind}:${count}`;
  const hit = cache.get(key);
  if (hit) return hit as T[];
  const ov = overrides[kind];
  const rows = base.slice(0, count).map((r) => (ov[r.id] ? ({ ...r, ...ov[r.id] } as T) : r));
  cache.set(key, rows);
  return rows;
}

export const store = {
  subscribe(l: () => void) {
    load();
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getVersion: () => version,
  vendors: (count = 100): Vendor[] => (load(), apply("vendors", baseVendors, count)),
  dishes: (count = 160): Dish[] => (load(), apply("dishes", baseDishes, count)),
  events: (): FestivalEvent[] => (load(), apply("events", baseEvents, baseEvents.length)),
  update(kind: Kind, id: number, patch: Record<string, unknown>, persist = true) {
    overrides[kind][id] = { ...(overrides[kind][id] ?? {}), ...patch };
    emit(persist);
  },
  reset(kind: Kind) {
    overrides[kind] = {};
    emit();
  },
  editCount: (kind: Kind) => Object.keys(overrides[kind]).length,
};

export function useStoreVersion() {
  return useSyncExternalStore(store.subscribe, store.getVersion, () => 0);
}

/* ---- Row selection for comparisons (rendered inside gp-grid cells) ---- */
const selections: Record<string, Set<number>> = {};
const selListeners = new Set<() => void>();
let selVersion = 0;
export const selection = {
  get: (scope: string) => (selections[scope] ??= new Set()),
  toggle(scope: string, id: number, max = 4) {
    const s = selection.get(scope);
    if (s.has(id)) s.delete(id);
    else if (s.size < max) s.add(id);
    else return false;
    selVersion++;
    selListeners.forEach((l) => l());
    return true;
  },
  clear(scope: string) {
    selection.get(scope).clear();
    selVersion++;
    selListeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    selListeners.add(l);
    return () => selListeners.delete(l);
  },
};
export function useSelection(scope: string) {
  useSyncExternalStore(selection.subscribe, () => selVersion, () => 0);
  return [...selection.get(scope)];
}
