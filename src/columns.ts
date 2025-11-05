import type { Column, ColumnBase } from "@1771technologies/lytenyte-pro/types";
import { AnalystRatingCell } from "./cells/analyst-rating-cell";
import { measureText } from "@1771technologies/lytenyte-pro";
import { SymbolCell } from "./cells/symbol-cell";
import { ExchangeCells } from "./cells/exchange-cell";
import { CurrencyCell } from "./cells/currency-cell";
import { PercentCell } from "./cells/percent-cell";
import { formatCompactNumber } from "./cells/format-compact-number";
import { CompactCurrencyCell } from "./cells/compact-currency-cell";
import { CompactNumberCell } from "./cells/compact-number-cell";
import { DecimalCell } from "./cells/decimal-cell";
import { BaseCell } from "./cells/base-cell";
import { HeaderRenderer } from "./header/header-renderer";
import { FloatingCellNumber, FloatingCellText } from "./floating-cell";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const base: ColumnBase<(string | number | null)[]> = {
  headerRenderer: HeaderRenderer,
  floatingCellRenderer: FloatingCellNumber,
  autosizeHeaderFn: (c) => {
    const hasGroups = c.grid.state.rowGroupModel.get().length > 0;
    const agg = (c.grid.state.aggModel.get()?.[c.column.id]?.fn ??
      "") as string;

    const name = c.column.name ?? c.column.id;
    const spacing = 16;

    return (
      measureText(
        hasGroups ? name + " " + agg : name,
        c.grid.state.viewport.get()!
      ).width + spacing
    );
  },
  cellRenderer: BaseCell,

  uiHints: {
    sortable: true,
    resizable: true,
    movable: true,
  },
};

export const columns: Column<(string | number | null)[]>[] = [
  {
    id: "symbol",
    name: "Symbol",
    floatingCellRenderer: FloatingCellText,
    cellRenderer: SymbolCell,
    field: (c) => {
      if (c.data.kind === "branch") {
        return c.data.data[c.column.id];
      }
      const d = c.data?.data as string[];
      if (!d) return;
      const ticker = d[0];
      const desc = d[1];
      return ticker + " " + desc;
    },
    width: 280,
    uiHints: {
      aggsAllowed: ["first", "last", "count"],
    },
    autosizeCellFn: ({ grid, row, column }) => {
      if (grid.api.rowIsGroup(row)) {
        const data = row.data[column.id];
        const text = `${data as string} Symbols`;
        const metric = measureText(
          text,
          grid.state.viewport.get() ?? undefined
        );
        if (!metric) return 8;
        return metric.width + 8;
      }
      if (!grid.api.rowIsLeaf(row)) return 0;
      const symbol = (row.data?.[0] as string) ?? "";
      const desc = row?.data?.[1];
      const text = measureText(
        `${symbol} ${desc}`,
        grid.state.viewport.get() ?? undefined
      );
      if (!text) return 8;
      return text.width + 16 + 60;
    },
  },
  {
    id: "exchange",
    name: "Exchange",
    floatingCellRenderer: FloatingCellText,
    cellRenderer: ExchangeCells,
    field: 15,
    width: 150,
    uiHints: {
      aggsAllowed: ["first", "last", "count"],
      rowGroupable: true,
    },
    autosizeCellFn: ({ grid, row, column }) => {
      const field = grid.api.columnField(column, row);
      if (grid.api.rowIsGroup(row)) {
        return 0;
      }
      const text = measureText(
        String(field) as string,
        grid.state.viewport.get() ?? undefined
      );
      if (!text) return 0;
      return text.width + 16 + 36;
    },
  },
  {
    id: "price",
    name: "Price",
    field: 3,
    cellRenderer: CurrencyCell,
    width: 110,
    type: "number",
    uiHints: {
      aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
    },
    autosizeCellFn: ({ grid, row, column }) => {
      const field = grid.api.columnField(column, row);
      const label = typeof field === "number" ? formatter.format(field) : "-";
      const current = "USD";
      const text = measureText(
        `${label} ${label === "-" ? "" : current}`,
        grid.state.viewport.get() ?? undefined
      );
      return (text?.width ?? 0) + 8;
    },
  },
  {
    id: "price-change",
    name: "Change %",
    field: 5,
    width: 130,
    type: "number",
    cellRenderer: PercentCell,
    uiHints: {
      aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
    },
    autosizeCellFn: ({ grid, row, column }) => {
      const field = grid.api.columnField(column, row) as number;
      const label =
        typeof field === "number" ? formatter.format(field) + "%" : "-";
      const text = measureText(label, grid.state.viewport.get() ?? undefined);
      return (text?.width ?? 0) + 16;
    },
  },
  {
    id: "analyst rating",
    name: "Analyst Rating",
    floatingCellRenderer: FloatingCellText,
    cellRenderer: AnalystRatingCell,
    field: 2,
    uiHints: {
      aggsAllowed: ["count", "first", "last"],
      rowGroupable: true,
    },
    autosizeCellFn: ({ grid, row, column }) => {
      const field = grid.api.columnField(column, row);
      const text = measureText(
        field as string,
        grid.state.viewport.get() ?? undefined
      );
      return (text?.width ?? 0) + 16 + 80;
    },
  },
  {
    id: "eps-diluted",
    name: "EPS dil",
    field: 11,
    type: "number",
    cellRenderer: CurrencyCell,
    uiHints: {
      aggDefault: "avg",
      aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
    },
    autosizeCellFn: ({ grid, row, column }) => {
      const field = grid.api.columnField(column, row);
      const label = typeof field === "number" ? formatter.format(field) : "-";
      const current = "USD";
      const text = measureText(
        `${label} ${label === "-" ? "" : current}`,
        grid.state.viewport.get() ?? undefined
      );
      return (text?.width ?? 0) + 8;
    },
  },
  {
    id: "volume",
    name: "Volume",
    field: 6,
    type: "number",
    cellRenderer: CompactNumberCell,
    uiHints: {
      aggDefault: "avg",
      aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
    },
    autosizeCellFn: ({ grid, row, column }) => {
      const field = grid.api.columnField(column, row);
      const label =
        typeof field === "number" ? formatCompactNumber(field) : "-";
      const text = measureText(
        `${label} M`,
        grid.state.viewport.get() ?? undefined
      );
      return (text?.width ?? 0) + 8;
    },
  },
  {
    id: "market-capitalization",
    name: "Market Cap",
    field: 8,
    type: "number",
    cellRenderer: CompactCurrencyCell,
    uiHints: {
      aggDefault: "avg",
      aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
    },
    autosizeCellFn: ({ grid, row, column }) => {
      const field = grid.api.columnField(column, row) as number;
      const label =
        typeof field === "number" ? formatCompactNumber(field) : "-";
      const text = measureText(
        `${label} Musd`,
        grid.state.viewport.get() ?? undefined
      );
      return (text?.width ?? 0) + 16;
    },
  },
  {
    id: "price-earning",
    name: "P/E",
    field: 10,
    width: 80,
    type: "number",
    cellRenderer: DecimalCell,
    uiHints: {
      aggDefault: "avg",
      aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
    },
    autosizeCellFn: ({ grid, row, column }) => {
      const field = grid.api.columnField(column, row) as number;
      const label = typeof field === "number" ? formatter.format(field) : "";
      const text = measureText(label, grid.state.viewport.get() ?? undefined);
      return (text?.width ?? 0) + 16;
    },
  },
  {
    id: "eps-diluted-growth",
    name: "EPS dil growth",
    field: 13,
    type: "number",
    cellRenderer: PercentCell,
    uiHints: {
      aggDefault: "avg",
      aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
    },
    autosizeCellFn: ({ grid, row, column }) => {
      const field = grid.api.columnField(column, row) as number;
      const label =
        typeof field === "number" ? formatter.format(field) + "%" : "-";
      const text = measureText(label, grid.state.viewport.get() ?? undefined);
      return (text?.width ?? 0) + 16;
    },
  },
  {
    id: "dividend yield",
    name: "Div yield %",
    field: 14,
    type: "number",
    cellRenderer: PercentCell,
    uiHints: {
      aggDefault: "avg",
      aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
    },
    autosizeCellFn: ({ grid, row, column }) => {
      const field = grid.api.columnField(column, row) as number;
      const label =
        typeof field === "number" ? formatter.format(field) + "%" : "-";
      const text = measureText(label, grid.state.viewport.get() ?? undefined);
      return (text?.width ?? 0) + 16;
    },
  },
  {
    id: "rel-volume",
    name: "Rel Volume",
    field: 7,
    width: 130,
    type: "number",
    cellRenderer: DecimalCell,
    uiHints: {
      aggDefault: "avg",
      aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
    },
    autosizeCellFn: ({ grid, row, column }) => {
      const field = grid.api.columnField(column, row) as number;
      const label = typeof field === "number" ? formatter.format(field) : "";
      const text = measureText(label, grid.state.viewport.get() ?? undefined);
      return (text?.width ?? 0) + 16;
    },
  },
  {
    id: "industry",
    name: "Industry",
    floatingCellRenderer: FloatingCellText,
    cellRenderer: BaseCell,
    field: 17,
    width: 250,
    uiHints: {
      aggDefault: "count",
      aggsAllowed: ["first", "last", "count"],
      rowGroupable: true,
    },
  },
  {
    id: "sector",
    name: "Sector",
    floatingCellRenderer: FloatingCellText,
    cellRenderer: BaseCell,
    field: 16,
    width: 180,
    uiHints: {
      aggDefault: "count",
      aggsAllowed: ["first", "last", "count"],
      rowGroupable: true,
    },
  },
];
