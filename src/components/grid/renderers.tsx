import type { CellRendererParams, EditRendererParams } from "@gp-grid/react";
import { Flame, Star, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { IMG, type ImgKey } from "@/lib/images";
import { selection, useSelection } from "@/lib/store";

const row = <T,>(p: CellRendererParams) => p.rowData as T | undefined;

const CUISINE_TONE: Record<string, string> = {
  Japanese: "bg-blush text-primary", Korean: "bg-lavender text-primary", Thai: "bg-mint text-ink",
  Indian: "bg-sun text-ink", Mexican: "bg-chili/15 text-chili", Italian: "bg-sky text-cobalt",
  Turkish: "bg-blush text-chili", Lebanese: "bg-mint text-ink", Tunisian: "bg-chili/15 text-chili",
  Moroccan: "bg-sun text-ink", American: "bg-sky text-cobalt", Greek: "bg-sky text-primary",
  Vietnamese: "bg-mint text-ink", Chinese: "bg-chili/15 text-chili", Brazilian: "bg-sun text-ink",
};
export const cuisineTone = (c: string) => CUISINE_TONE[c] ?? "bg-lavender text-primary";

export const STATUS_TONE: Record<string, string> = {
  Open: "bg-mint text-ink", Busy: "bg-sun text-ink", "Sold Out": "bg-chili/15 text-chili", Closed: "bg-muted text-muted-foreground",
  Upcoming: "bg-sky text-cobalt", Live: "bg-chili text-primary-foreground", Completed: "bg-muted text-muted-foreground",
  Delayed: "bg-sun text-ink", Cancelled: "bg-muted text-muted-foreground line-through",
};

function SelectBox({ scope, id }: { scope: string; id: number }) {
  const sel = useSelection(scope);
  const on = sel.includes(id);
  return (
    <button
      type="button"
      aria-label={on ? "Remove from comparison" : "Add to comparison"}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        if (!selection.toggle(scope, id)) toast.error("You can compare up to 4 at a time");
      }}
      className={`mx-auto flex h-5 w-5 items-center justify-center rounded-md border-2 transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-primary/40 bg-card"}`}
    >
      {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
    </button>
  );
}

export const stars = (v: number) => (
  <span className="inline-flex items-center gap-1 font-bold text-ink">
    <Star className="h-3.5 w-3.5 fill-sun text-sun" />
    {Number(v).toFixed(1)}
  </span>
);

export function makeCellRenderers(scope: string) {
  return {
    select: (p: CellRendererParams) => (p.rowKind && p.rowKind !== "record" ? null : <SelectBox scope={scope} id={Number(p.rowId)} />),
    vendorName: (p: CellRendererParams) => {
      const r = row<{ img: ImgKey; featured: boolean; isNew: boolean; city: string }>(p);
      if (!r) return <span className="font-bold">{String(p.value ?? "")}</span>;
      return (
        <span className="flex min-w-0 items-center gap-2.5">
          <img src={IMG[r.img]} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" loading="lazy" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-extrabold text-primary">{String(p.value)}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{r.city}</span>
          </span>
        </span>
      );
    },
    dishName: (p: CellRendererParams) => {
      const r = row<{ img: ImgKey; description: string }>(p);
      if (!r) return <span className="font-bold">{String(p.value ?? "")}</span>;
      return (
        <span className="flex min-w-0 items-center gap-2.5">
          <img src={IMG[r.img]} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" loading="lazy" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-extrabold text-primary">{String(p.value)}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{r.description}</span>
          </span>
        </span>
      );
    },
    cuisine: (p: CellRendererParams) =>
      p.value == null ? null : <span className={`grid-badge ${cuisineTone(String(p.value))}`}>{String(p.value)}</span>,
    status: (p: CellRendererParams) =>
      p.value == null ? null : (
        <span className={`grid-badge ${STATUS_TONE[String(p.value)] ?? "bg-muted"}`}>
          {p.value === "Live" && <span className="live-dot h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
          {String(p.value)}
        </span>
      ),
    rating: (p: CellRendererParams) => (p.value == null ? null : stars(Number(p.value))),
    price: (p: CellRendererParams) =>
      p.value == null ? null : <span className="font-bold tabular-nums text-ink">€{Number(p.value).toFixed(2)}</span>,
    number: (p: CellRendererParams) =>
      p.value == null ? null : <span className="tabular-nums">{Number(p.value).toLocaleString("en-US", { maximumFractionDigits: 1 })}</span>,
    featured: (p: CellRendererParams) => {
      const r = row<{ featured: boolean; isNew?: boolean }>(p);
      if (!r) return null;
      return (
        <span className="flex gap-1">
          {r.featured && <span className="grid-badge bg-cobalt text-primary-foreground"><Star className="h-3 w-3 fill-current" />Featured</span>}
          {r.isNew && <span className="grid-badge border border-cobalt/30 bg-card text-cobalt"><Sparkles className="h-3 w-3" />New</span>}
        </span>
      );
    },
    spice: (p: CellRendererParams) =>
      p.value == null ? null : (
        <span className="flex" aria-label={`Spice ${p.value} of 4`}>
          {[0, 1, 2, 3].map((i) => (
            <Flame key={i} className={`h-4 w-4 ${i < Number(p.value) ? "fill-chili text-chili" : "text-border"}`} />
          ))}
        </span>
      ),
    diet: (p: CellRendererParams) => {
      const v = String(p.value ?? "");
      const tone = v === "Vegan" ? "bg-mint text-ink" : v === "Vegetarian" ? "bg-mint/60 text-ink" : v === "Gluten-free" ? "bg-sun text-ink" : v === "Seafood" ? "bg-sky text-cobalt" : "bg-blush text-chili";
      return v ? <span className={`grid-badge ${tone}`}>{v}</span> : null;
    },
    popularity: (p: CellRendererParams) =>
      p.value == null ? null : (
        <span className="flex w-full items-center gap-2">
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <span className="block h-full rounded-full bg-chili" style={{ width: `${Math.min(100, Number(p.value))}%` }} />
          </span>
          <span className="w-7 text-right text-xs font-bold tabular-nums">{Math.round(Number(p.value))}</span>
        </span>
      ),
    category: (p: CellRendererParams) =>
      p.value == null ? null : <span className="grid-badge bg-lavender text-primary">{String(p.value)}</span>,
    time: (p: CellRendererParams) => {
      const r = row<{ start: string; end: string }>(p);
      return r ? <span className="font-bold tabular-nums">{r.start}<span className="text-muted-foreground"> – {r.end}</span></span> : <span>{String(p.value ?? "")}</span>;
    },
    host: (p: CellRendererParams) => {
      const v = String(p.value ?? "");
      if (!v) return null;
      const initials = v.replace(/^(Chef|DJ|The) /, "").split(" ").map((s) => s[0]).slice(0, 2).join("");
      return (
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blush text-[11px] font-extrabold text-primary">{initials}</span>
          <span className="truncate">{v}</span>
        </span>
      );
    },
  };
}

/** Dropdown editor for enumerated fields. */
export const selectEditor = (options: readonly (string | number)[]) =>
  function SelectEditor(p: EditRendererParams) {
    return (
      <select
        autoFocus
        defaultValue={String(p.initialValue ?? "")}
        onChange={(e) => {
          const raw = e.target.value;
          p.onValueChange(typeof options[0] === "number" ? Number(raw) : raw);
        }}
        onBlur={() => p.onCommit()}
        onKeyDown={(e) => {
          if (e.key === "Enter") p.onCommit();
          if (e.key === "Escape") p.onCancel();
        }}
        className="h-full w-full bg-card px-2 text-sm text-ink outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    );
  };
