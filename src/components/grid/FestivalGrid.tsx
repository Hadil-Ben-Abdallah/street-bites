import "@gp-grid/react/dist/styles.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Grid,
  PIVOT_LABEL_COLUMN_ID,
  buildPivotSchema,
  createClientDataSource,
  createMutableClientDataSource,
  createPivotSource,
  createRowGrouping,
  type ColumnDefinition,
  type EditRendererParams,
  type GridRef,
  type PivotConfig,
  type PivotSchema,
  type RowGroupMeasure,
} from "@gp-grid/react";
import { toast } from "sonner";
import { store } from "@/lib/store";
import { makeCellRenderers } from "./renderers";

type Kind = "vendors" | "dishes" | "events";
type Row = { id: number } & Record<string, unknown>;

export interface FestivalGridProps {
  kind: Kind;
  rows: Row[];
  columns: ColumnDefinition[];
  editRenderers?: Record<string, (p: EditRendererParams) => React.ReactNode>;
  organizer: boolean;
  dark: boolean;
  groupBy?: string | null;
  groupMeasures?: RowGroupMeasure[];
  height?: number;
  rowHeight?: number;
}

/** Flat or grouped gp-grid over a mutable client source kept in sync with the festival store. */
export function FestivalGrid({
  kind, rows, columns, editRenderers, organizer, dark, groupBy, groupMeasures, height = 620, rowHeight = 52,
}: FestivalGridProps) {
  const gridRef = useRef<GridRef<Row> | null>(null);
  const source = useMemo(() => createMutableClientDataSource<Row>(rows, { getRowId: (r) => r.id }), [rows]);
  const cellRenderers = useMemo(() => makeCellRenderers(kind), [kind]);

  // Push live/store changes (simulation, edits elsewhere) into the grid's data source.
  useEffect(() => {
    const off = store.subscribe(() => {
      const latest = kind === "events" ? store.events() : kind === "vendors" ? store.vendors(10000) : store.dishes(5000);
      const byId = new Map(latest.map((r) => [r.id, r as unknown as Row]));
      for (const r of rows) {
        const cur = source.getRowById(r.id);
        const next = byId.get(r.id);
        if (!cur || !next) continue;
        const patch: Record<string, unknown> = {};
        for (const k of Object.keys(next)) if (cur[k] !== next[k]) patch[k] = next[k];
        if (Object.keys(patch).length) source.updateRow(r.id, patch as Partial<Row>);
      }
    });
    return () => {
      off();
    };
  }, [source, rows, kind]);

  const grouping = useMemo(
    () =>
      groupBy
        ? createRowGrouping({ dimensions: [{ field: groupBy }], measures: groupMeasures ?? [], defaultExpandedDepth: 0, grandTotal: "bottom" })
        : null,
    [groupBy, groupMeasures, source],
  );

  const cols = useMemo(
    () => columns.map((c) => ({ ...c, editable: organizer && Boolean((c as { editable?: boolean }).editable) })),
    [columns, organizer],
  );

  return (
    <div className="festival-grid" style={{ height }}>
      <Grid<Row>
        gridRef={gridRef}
        columns={cols}
        dataSource={source}
        rowHeight={rowHeight}
        headerHeight={44}
        getRowId={(r) => r.id}
        darkMode={dark}
        cellRenderers={cellRenderers}
        editRenderers={editRenderers ?? {}}
        rowGrouping={grouping}
        {...(groupBy ? { groupLabelColumn: groupBy } : {})}
        history={{ maxEntries: 50 }}
        onCellValueChanged={(e) => {
          store.update(kind, Number(e.rowId), { [e.field]: e.newValue });
          toast.success(`Saved ${e.field}`, { description: `${String(e.oldValue)} → ${String(e.newValue)} · Ctrl+Z to undo` });
        }}
        onWriteRejected={(e) => toast.error("Change not saved", { description: e.reason.replace(/-/g, " ") })}
        onRowGroupingRejected={(r) => toast.error(`Grouping unavailable: ${r.reason}`)}
      />
    </div>
  );
}

/** Native gp-grid pivot over a flat client source. */
export function PivotGrid({ rows, config, dark, height = 560 }: { rows: Row[]; config: PivotConfig; dark: boolean; height?: number }) {
  const source = useMemo(() => createPivotSource(createClientDataSource(rows), config), [rows, config]);
  const [schema, setSchema] = useState<PivotSchema>(() => source.getSchema() ?? buildPivotSchema([], config));
  useEffect(() => {
    setSchema((shown) => source.getSchema() ?? shown);
    const off = source.subscribeSchema(setSchema);
    return () => {
      off();
      source.destroy();
    };
  }, [source]);
  return (
    <div className="festival-grid" style={{ height }}>
      <Grid
        columns={schema.columns}
        columnGroups={schema.columnGroups}
        dataSource={source}
        rowHeight={44}
        headerHeight={40}
        darkMode={dark}
        groupLabelColumn={PIVOT_LABEL_COLUMN_ID}
      />
    </div>
  );
}

export default FestivalGrid;
