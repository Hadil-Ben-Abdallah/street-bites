import type { ReactNode } from "react";
import { Moon, Sun, PencilLine, Search, X, Star, Sparkles, MapPin } from "lucide-react";
import { IMG, type ImgKey } from "@/lib/images";
import { cuisineTone } from "@/components/grid/renderers";

export function PageHero({ eyebrow, title, accent, children, img }: { eyebrow: string; title: string; accent: string; children: ReactNode; img: string }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-10 pt-10 md:grid-cols-[1.1fr_1fr] md:items-center md:pt-16">
      <div>
        <p className="mb-4 text-sm font-extrabold uppercase tracking-widest text-chili">{eyebrow}</p>
        <h1 className="font-display text-5xl text-primary md:text-7xl">
          {title} <span className="sticker -rotate-2 bg-sun text-chili">{accent}</span>
        </h1>
        <div className="mt-6 max-w-xl text-lg text-ink/80">{children}</div>
      </div>
      <div className="relative">
        <img src={img} alt="" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-[var(--shadow-card)]" width={1600} height={1200} />
      </div>
    </section>
  );
}

export function StatTile({ value, label, tone = "text-primary" }: { value: ReactNode; label: string; tone?: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className={`font-display text-4xl ${tone}`}>{value}</div>
      <div className="mt-1 text-sm font-semibold text-muted-foreground">{label}</div>
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="flex h-12 items-center gap-2 rounded-full border-2 border-primary/15 bg-card px-4 focus-within:border-cobalt">
      <Search className="h-4 w-4 text-primary" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" aria-label={placeholder} />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search"><X className="h-4 w-4 text-muted-foreground" /></button>
      )}
    </label>
  );
}

export function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <label className="flex flex-col gap-1 text-[11px] font-extrabold uppercase tracking-wider text-primary">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 rounded-full border border-border bg-card px-3 text-sm font-medium normal-case tracking-normal text-ink outline-none focus:border-cobalt">
        <option value="">All</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="inline-flex rounded-full bg-secondary p-1" role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value} onClick={() => onChange(o.value)}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${value === o.value ? "bg-primary text-primary-foreground shadow" : "text-primary hover:bg-card"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function GridControls({ organizer, setOrganizer, dark, setDark, children }: { organizer: boolean; setOrganizer: (v: boolean) => void; dark: boolean; setDark: (v: boolean) => void; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      <button onClick={() => setOrganizer(!organizer)} aria-pressed={organizer}
        className={`inline-flex h-10 items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition ${organizer ? "border-chili bg-chili text-primary-foreground" : "border-primary/20 bg-card text-primary hover:border-primary"}`}>
        <PencilLine className="h-4 w-4" /> Organizer mode {organizer ? "on" : "off"}
      </button>
      <button onClick={() => setDark(!dark)} aria-label="Toggle grid theme" className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/20 bg-card text-primary hover:border-primary">
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function OrganizerBanner() {
  return (
    <div className="mb-3 rounded-2xl bg-chili/10 px-4 py-3 text-sm text-ink">
      <strong className="text-chili">Organizer mode.</strong> Double-click or press Enter on a highlighted field to edit · Enter saves · Esc cancels · Ctrl+Z undoes. Changes are kept on this device.
    </div>
  );
}

export function PhotoCard({ img, title, tags, badges, footer }: { img: ImgKey; title: string; tags: string[]; badges?: { featured?: boolean; isNew?: boolean }; footer?: ReactNode }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-card)]">
      <img src={IMG[img]} alt={title} loading="lazy" width={1024} height={1024} className="aspect-[4/3.4] w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute left-4 top-4 flex gap-2">
        {badges?.featured && <span className="grid-badge bg-cobalt py-1 text-primary-foreground"><Star className="h-3 w-3 fill-current" />FEATURED</span>}
        {badges?.isNew && <span className="grid-badge bg-card py-1 text-cobalt"><Sparkles className="h-3 w-3" />NEW</span>}
      </div>
      <div className="info-panel absolute inset-x-3 bottom-0 px-5 pb-4 pt-4">
        <h3 className="font-display text-2xl text-primary">{title}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t, i) => <span key={t + i} className={`grid-badge ${i === 0 ? cuisineTone(t) : "bg-blush text-primary"}`}>{t}</span>)}
        </div>
        {footer && <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-muted-foreground">{footer}</div>}
      </div>
    </article>
  );
}

export { MapPin };
