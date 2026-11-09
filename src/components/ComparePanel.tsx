import { X, Scale } from "lucide-react";
import { IMG, type ImgKey } from "@/lib/images";
import { selection, useSelection } from "@/lib/store";

export interface CompareField<T> {
  label: string;
  render: (row: T) => React.ReactNode;
}

export function ComparePanel<T extends { id: number; name: string; img: ImgKey }>({
  scope, lookup, fields, noun,
}: { scope: string; lookup: (id: number) => T | undefined; fields: CompareField<T>[]; noun: string }) {
  const ids = useSelection(scope);
  const rows = ids.map(lookup).filter(Boolean) as T[];
  return (
    <section className="mt-6 rounded-[1.75rem] border-2 border-dashed border-primary/25 bg-card p-5" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-2xl text-primary"><Scale className="h-6 w-6 text-chili" />Compare {noun}</h3>
        {rows.length > 0 && (
          <button onClick={() => selection.clear(scope)} className="text-sm font-bold text-chili hover:underline">Clear all</button>
        )}
      </div>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Tick the box at the start of up to 4 rows in the grid to compare them side by side.</p>
      ) : (
        <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))` }}>
          {rows.map((r) => (
            <div key={r.id} className="relative overflow-hidden rounded-3xl bg-background">
              <button onClick={() => selection.toggle(scope, r.id)} aria-label={`Remove ${r.name}`} className="absolute right-2 top-2 rounded-full bg-card p-1 text-primary shadow"><X className="h-4 w-4" /></button>
              <img src={IMG[r.img]} alt={r.name} className="aspect-[16/9] w-full object-cover" loading="lazy" />
              <div className="p-4">
                <div className="font-display text-xl text-primary">{r.name}</div>
                <dl className="mt-3 space-y-2 text-sm">
                  {fields.map((f) => (
                    <div key={f.label} className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5">
                      <dt className="text-muted-foreground">{f.label}</dt>
                      <dd className="text-right font-semibold text-ink">{f.render(r)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
