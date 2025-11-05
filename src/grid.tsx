import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import { stockData } from "./data";
import { memo, useId } from "react";
import type { RowLayout } from "@1771technologies/lytenyte-pro/types";
import { base, columns } from "./columns";
import { ColumnManagerDialog } from "./column-manager/column-manager-dialog";
import { GridFrame } from "./grid-frame";
import { SortManager } from "./sort-manager";
import { GridCheckbox } from "./ui/grid-checkbox";
import { Marker } from "./cells/marker";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const data = stockData.map((c) => {
  return c.map((x) =>
    typeof x === "number" ? Number.parseFloat(x.toFixed(2)) : x
  );
});

export function StockGrid({ onReset }: { onReset: () => void }) {
  const ds = useClientRowDataSource({
    data: data,
    transformInFilterItem({ column, values }) {
      if (column.type === "number") {
        const fields = values
          .map((v) => {
            const label =
              typeof v === "number" ? formatter.format(v) : `${v ?? "-"}`;

            return { id: label, label, value: v };
          })
          .sort((l, r) => {
            const lv = typeof l === "number" ? l : 0;
            const rv = typeof r === "number" ? r : 0;

            return lv - rv;
          });

        return fields;
      }

      return values.map((c) => ({
        id: c as string,
        label: c as string,
        value: c,
      }));
    },
  });
  const grid = Grid.useLyteNyte({
    gridId: useId(),
    columnBase: base,
    columns: columns,
    rowDataSource: ds,

    rowSelectionMode: "multiple",
    rowSelectionActivator: "none",

    columnMarkerEnabled: true,
    columnMarker: {
      cellRenderer: Marker,
      headerRenderer: ({ grid }) => {
        const allSelected = ds.rowAreAllSelected();
        grid.state.rowSelectedIds.useValue();

        return (
          <div className="flex items-center justify-center w-full h-full">
            <GridCheckbox
              onClick={() =>
                grid.api.rowSelectAll({
                  deselect: allSelected,
                })
              }
              checked={allSelected}
            />
          </div>
        );
      },
    },

    cellSelectionMode: "range",
    quickSearchSensitivity: "case-insensitive",

    floatingRowEnabled: true,
    floatingRowHeight: 32,

    aggModel: {
      symbol: { fn: "count" },
      exchange: { fn: "count" },
      price: { fn: "avg" },
      "price-change": { fn: "avg" },
      "analyst rating": { fn: "count" },
      "eps-diluted": { fn: "avg" },
      volume: { fn: "avg" },
      "market-capitalization": { fn: "avg" },
      "price-earning": { fn: "avg" },
      "eps-diluted-growth": { fn: "avg" },
      "dividend yield": { fn: "avg" },
      "rel-volume": { fn: "avg" },
      industry: { fn: "count" },
      sector: { fn: "count" },
    },

    dialogFrames: {
      "column-manager": {
        component: ({ grid }) => {
          return <ColumnManagerDialog grid={grid} />;
        },
      },
      "sort-manager": {
        component: ({ grid }) => {
          return <SortManager grid={grid} />;
        },
      },
    },

    // rowGroupColumn: {
    //   pin: "start",
    //   cellRenderer: GroupCellRenderer,

    //   floatingCellRenderer: () => <div />,

    //   autosizeCellFn: ({ grid, row }) => {
    //     if (grid.api.rowIsLeaf(row)) return null;

    //     const padding = row.depth * 16;

    //     const text = measureText(
    //       row.key ?? "",
    //       grid.state.viewport.get() ?? undefined
    //     );

    //     return padding + text.width + 32 + 16;
    //   },
    // },
  });

  const view = grid.view.useValue();
  return (
    <GridFrame grid={grid} onReset={onReset}>
      <Grid.Root grid={grid}>
        <Grid.Viewport
          className="focus:outline-none focus-visible:border-ln-primary-50 border border-transparent"
          id="stocks-grid"
        >
          <Grid.Header>
            {view.header.layout.map((row, i) => {
              return (
                <Grid.HeaderRow headerRowIndex={i} key={i}>
                  {row.map((c) => {
                    if (c.kind === "group") {
                      return (
                        <Grid.HeaderGroupCell cell={c} key={c.idOccurrence} />
                      );
                    }
                    return (
                      <Grid.HeaderCell
                        resizerClassName="hidden md:flex"
                        resizerStyle={{ width: 4 }}
                        cell={c}
                        key={c.id}
                      />
                    );
                  })}
                </Grid.HeaderRow>
              );
            })}
          </Grid.Header>
          <Grid.RowsContainer>
            <Grid.RowsTop>
              <RowHandler rows={view.rows.top} />
            </Grid.RowsTop>
            <Grid.RowsCenter>
              <RowHandler rows={view.rows.center} />
            </Grid.RowsCenter>
            <Grid.RowsBottom>
              <RowHandler rows={view.rows.bottom} />
            </Grid.RowsBottom>
          </Grid.RowsContainer>
        </Grid.Viewport>
      </Grid.Root>
    </GridFrame>
  );
}
const RowHandler = memo(
  ({ rows }: { rows: RowLayout<(typeof stockData)[number]>[] }) => {
    return rows.map((row) => {
      if (row.kind === "full-width")
        return <Grid.RowFullWidth row={row} key={row.id} />;

      return (
        <Grid.Row key={row.id} row={row} accepted={["row"]}>
          {row.cells.map((cell) => {
            return <Grid.Cell cell={cell} key={cell.id} />;
          })}
        </Grid.Row>
      );
    });
  }
);

RowHandler.displayName = "RowHandler";
