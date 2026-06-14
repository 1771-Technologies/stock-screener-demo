"use client";
import "lytenyte-pro/pill-manager.css";

import {
  Grid,
  computeField,
  useClientDataSource,
  usePiece,
  virtualFromXY,
} from "lytenyte-pro";
import { base, group, initialColumns, marker } from "./columns";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { stockData } from "./data.js";
import { PillManagerControls } from "./pill-manager-controls/pill-manager-controls";
import type { GridSpec } from "./types";
import { useGridFilters } from "./filters/use-grid-filters";
import { Panel } from "./panel/panel";
import { useColumnValues } from "./filters/use-column-values";
import { SortManager } from "./sort-manager/sort-manager";
import { ColumnManagerDialog } from "./column-manager-dialog/column-manager-dialog";
import type { SortEntry } from "./sort-manager/sort-types";
import { buildSortFn } from "./sort-manager/sort-fn";
import { aggFns } from "./agg-fns";
import { QuickSearchInput } from "./quick-search/quick-search-input";
import { DownloadMenu } from "./export-data/download-menu";
import { ContextMenu } from "./context-menu/context-menu";
import { twoDecimalPlace } from "./formatters";
import { useTheme } from "next-themes";
import RefreshIcon from "./icons/refresh-icon.js";
import { Button } from "./ui/button.js";
import { tw } from "./lib/tw.js";
import { Frame } from "./ui/frame.js";

export function Stocks() {
  const [reset, setReset] = useState(0);

  return (
    <StocksImpl key={reset} onReset={() => setReset((prev) => prev + 1)} />
  );
}

function StocksImpl({ onReset }: { onReset: () => void }) {
  const [columns, setColumns] = useState(initialColumns);
  const columnsPiece = usePiece(columns, setColumns);
  const [grouped, setGrouped] = useState<string[]>([]);
  const groupedPiece = usePiece(grouped, setGrouped);
  const theme = useTheme().theme ?? "";

  const [groupColumn, setGroupColumn] = useState<
    false | Grid.RowGroupColumn<GridSpec>
  >(group);

  const getColumnValues = useColumnValues(columns);
  const { filter, extension: filterExtension } = useGridFilters(
    columns,
    getColumnValues,
  );

  const [quickSearch, setQuickSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(quickSearch), 100);
    return () => clearTimeout(t);
  }, [quickSearch]);

  const quickSearchFilter = useMemo(() => {
    if (!debouncedSearch.trim()) return null;
    const q = debouncedSearch.toLowerCase();

    return (row: Grid.T.RowLeaf<GridSpec["data"]>) => {
      const values = columns.map((x) => {
        const res = computeField(
          row.kind === "leaf" ? (x.field ?? x.id) : x.id,
          row,
        );
        return typeof res === "number" ? twoDecimalPlace.format(res) : res;
      });

      const result = JSON.stringify(values)
        .toLocaleLowerCase()
        .includes(q.toLowerCase());

      if (result) console.log(result, row, JSON.stringify(values));
      return result;
    };
  }, [debouncedSearch, columns]);

  const [sortModel, setSortModel] = useState<SortEntry[]>([]);
  const sortModelPiece = usePiece(sortModel, setSortModel);
  const [sortManagerOpen, setSortManagerOpen] = useState(false);
  const sortManagerOpenPiece = usePiece(sortManagerOpen, setSortManagerOpen);
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);
  const columnManagerOpenPiece = usePiece(
    columnManagerOpen,
    setColumnManagerOpen,
  );
  const sort = useMemo(() => {
    const entries = sortModel
      .filter((e) => e.columnId !== null)
      .flatMap((e) => {
        if (e.id === "__ln_group__")
          return {
            dim: { id: "__ln_group__" },
            descending: e.descending,
          } satisfies Grid.T.DimensionSort<GridSpec["data"]>;

        const col = columns.find((c) => c.id === e.columnId!);
        if (!col) return [] as Grid.T.DimensionSort<GridSpec["data"]>[];

        const sortFn = buildSortFn(col, e.sortOnId);
        return [{ dim: sortFn ?? col, descending: e.descending }];
      });

    return entries.length > 0 ? entries : null;
  }, [sortModel, columns]);

  const groupModel = useMemo(() => {
    return grouped.map<Grid.T.Dimension<GridSpec["data"]>>((x) => {
      const column = columns.find((c) => c.id === x)!;
      return { id: column.id, field: column.field };
    });
  }, [columns, grouped]);

  const aggregate = useMemo(
    () =>
      columns.filter((c) => c.agg != null).map((c) => ({ dim: c, fn: c.agg! })),
    [columns],
  );

  const extension = useMemo(
    () => ({
      ...filterExtension,
      grouped: groupedPiece,
      sortModel: sortModelPiece,
      columns: columnsPiece,
      sortManagerOpen: sortManagerOpenPiece,
      columnManagerOpen: columnManagerOpenPiece,
    }),
    [
      filterExtension,
      groupedPiece,
      sortModelPiece,
      columnsPiece,
      sortManagerOpenPiece,
      columnManagerOpenPiece,
    ],
  );

  const combinedFilter = useMemo(() => {
    const parts = [
      ...(Array.isArray(filter) ? filter : filter ? [filter] : []),
      ...(quickSearchFilter ? [quickSearchFilter] : []),
    ];
    return parts.length > 0 ? parts : null;
  }, [filter, quickSearchFilter]);

  const [api, setApi] = useState<Grid.API<GridSpec> | null>(null);

  const rs = useClientDataSource<GridSpec>({
    data: stockData,
    group: groupModel,
    rowsIsolatedSelection: false,
    filter: combinedFilter,
    sort,
    aggregate,
    aggregateFns: aggFns,
  });

  useLayoutEffect(() => {
    if (!grouped.length) return;

    setTimeout(() => {
      api?.columnAutosize({ columns: ["__ln_group__"] });
    });
  }, [api, grouped]);

  const [anchor, setAnchor] = useState<Grid.T.VirtualTarget | null>(null);
  const [menu, setMenu] = useState<null | {
    row: Grid.T.RowNode<GridSpec["data"]> | null;
    column: Grid.Column<GridSpec>;
  }>(null);

  return (
    <Frame
      frameControls={
        <>
          <ColumnManagerDialog
            api={api!}
            open={columnManagerOpen}
            onOpenChange={setColumnManagerOpen}
            columns={columns}
            setColumns={setColumns}
            grouped={grouped}
            setGrouped={setGrouped}
            theme={theme!}
          />
          <SortManager
            columns={columns}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            open={sortManagerOpen}
            onOpenChange={setSortManagerOpen}
            theme={theme!}
          />

          <Button
            kind="tertiary"
            className={tw(
              "hidden sm:flex px-2 text-sm h-8 text-light",
              theme?.includes("light") && "text-black",
            )}
            style={
              theme?.includes("light")
                ? { border: "1px solid black" }
                : undefined
            }
            onClick={() => {
              onReset();
            }}
          >
            Reset Demo
            <RefreshIcon />
          </Button>
          <QuickSearchInput
            theme={theme!}
            value={quickSearch}
            onChange={setQuickSearch}
          />
          <DownloadMenu api={api} theme={theme!} />
        </>
      }
      id="stocks-grid"
      isLight={theme.includes("light")}
      title="Stock Screener"
    >
      <div className="w-full h-full flex flex-col">
        <div
          className={tw(
            theme.includes("cotton-candy") &&
              "border-t border-(--ln-primary-50)",
          )}
        >
          <PillManagerControls
            api={api!}
            columns={columns}
            grouped={grouped}
            setColumns={setColumns}
            setGrouped={setGrouped}
          />
        </div>
        <ContextMenu
          api={api!}
          menu={menu}
          anchor={anchor}
          setAnchor={setAnchor}
          setMenu={setMenu}
        />
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 relative">
            <div className="absolute w-full h-full">
              <Grid
                ref={setApi}
                styles={useMemo(() => {
                  return {
                    viewport: {
                      style: {
                        scrollbarWidth: "thin",
                        scrollbarColor: "var(--ln-gray-50) transparent",
                      },
                    },
                  };
                }, [])}
                z_internal_viewportInitialWidth={1400}
                z_internal_viewportInitialHeight={800}
                rowSource={rs}
                columnBase={base}
                columns={columns}
                rowGroupColumn={groupColumn}
                onRowGroupColumnChange={setGroupColumn}
                columnMarker={marker}
                onColumnsChange={setColumns}
                rowSelectionMode="multiple"
                rowSelectionActivator="none"
                floatingRowEnabled
                apiExtension={extension}
                cellSelectionMode="multi-range"
                events={useMemo<Grid.Events<GridSpec>>(() => {
                  return {
                    viewport: {
                      keyDown: async ({ event, api, viewport }) => {
                        if (
                          (event.ctrlKey || event.metaKey) &&
                          event.key === "c"
                        ) {
                          const [sel] = api.cellSelections();
                          if (!sel) return;
                          event.preventDefault();
                          const data = await api.exportData({ rect: sel });
                          const rows = data.data.map((row) =>
                            row
                              .map((c) => (c == null ? "" : String(c)))
                              .join("\t"),
                          );
                          viewport.classList.add("copy-flash");
                          setTimeout(
                            () => viewport.classList.remove("copy-flash"),
                            500,
                          );
                          await navigator.clipboard.writeText(rows.join("\n"));
                        }
                      },
                    },
                    cell: {
                      contextMenu: ({ event, row, column }) => {
                        event.preventDefault();
                        setAnchor(virtualFromXY(event.clientX, event.clientY));

                        setMenu({ row, column });
                      },
                    },
                  };
                }, [])}
              />
            </div>
          </div>
          <Panel
            api={api!}
            columns={columns}
            setColumns={setColumns}
            grouped={grouped}
            setGrouped={setGrouped}
          />
        </div>
      </div>
    </Frame>
  );
}
