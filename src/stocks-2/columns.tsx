import { type Grid, measureText } from "lytenyte-pro";
import { GridSpec } from "./types";
import { SymbolCell } from "./cell-renderers/symbol-cell";
import { ExchangeCells } from "./cell-renderers/exchange-cell";
import { CurrencyCell } from "./cell-renderers/currency-cell";
import { PercentCell } from "./cell-renderers/percent-cell";
import { AnalystRatingCell } from "./cell-renderers/analyst-rating-cell";
import { CompactNumberCell } from "./cell-renderers/compact-number-cell";
import { CompactCurrencyCell } from "./cell-renderers/compact-currency-cell";
import { DecimalCell } from "./cell-renderers/decimal-cell";
import { BaseCell } from "./cell-renderers/base-cell";
import { symbolAutosizer } from "./autosizers/symbol-autosizer";
import { exchangeAutosizer } from "./autosizers/exchange-autosizer";
import { currencyAutosizer } from "./autosizers/currency-autosizer";
import { percentAutosizer } from "./autosizers/percent-autosizer";
import { analystRatingAutosizer } from "./autosizers/analyst-rating-autosizer";
import { compactNumberAutosizer } from "./autosizers/compact-number-autosizer";
import { compactCurrencyAutosizer } from "./autosizers/compact-currency-autosizer";
import { decimalAutosizer } from "./autosizers/decimal-autosizer";
import { HeaderRenderer } from "./header/header-renderer/header-renderer";
import { RowGroupCell } from "lytenyte-pro/components";
import { MarkerCell } from "./cell-renderers/marker-cell";
import { MarkerHeader } from "./header/marker-header";
import { StringFloatingRenderer } from "./header/string-floating-renderer.tsx";
import { NumberFloatingRenderer } from "./header/number-floating-renderer";
import { headerAutosizer } from "./autosizers/header-autosizer";
import { rowGroupAutosizer } from "./autosizers/row-group-autosizer";

export const marker: Grid.ColumnMarker<GridSpec> = {
  on: true,
  cellRenderer: MarkerCell,
  headerRenderer: MarkerHeader,
};

export const base: Grid.ColumnBase<GridSpec> = {
  resizable: true,
  movable: true,
  headerRenderer: HeaderRenderer,
  autosizeHeaderFn: headerAutosizer,
};

export const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  autosizeCellFn: rowGroupAutosizer,
  floatingCellRenderer: () => <></>,
  width: 200,
  pin: "start",
  agg: null,
  aggsAllowed: [],
};

export const initialColumns: Grid.Column<GridSpec>[] = [
  {
    id: "symbol",
    name: "Symbol",
    width: 280,

    agg: "count",
    aggsAllowed: ["first", "last", "count"],

    floatingCellRenderer: StringFloatingRenderer,
    cellRenderer: SymbolCell,
    field: (c) => {
      if (c.row.kind === "branch") {
        return c.row.data["symbol"];
      }
      const d = c.row?.data as string[];
      if (!d) return;

      const ticker = d[0];
      const desc = d[1];

      return ticker + " " + desc;
    },
    autosizeCellFn: symbolAutosizer,
  },
  {
    id: "exchange",
    name: "Exchange",
    field: 14,
    width: 150,
    cellRenderer: ExchangeCells,
    floatingCellRenderer: StringFloatingRenderer,
    autosizeCellFn: exchangeAutosizer,
    groupable: true,

    agg: "count",
    aggsAllowed: ["first", "last", "count"],
  },
  {
    id: "price",
    name: "Price",
    field: 3,
    width: 110,
    type: "number",
    cellRenderer: CurrencyCell,
    autosizeCellFn: currencyAutosizer,
    floatingCellRenderer: NumberFloatingRenderer,

    agg: "avg",
    aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
  },
  {
    id: "price-change",
    name: "Change %",
    field: 5,
    width: 130,
    type: "number",
    cellRenderer: PercentCell,
    autosizeCellFn: percentAutosizer,
    floatingCellRenderer: NumberFloatingRenderer,

    agg: "avg",
    aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
  },

  {
    id: "analyst rating",
    name: "Analyst Rating",
    field: 2,
    cellRenderer: AnalystRatingCell,
    autosizeCellFn: analystRatingAutosizer,
    floatingCellRenderer: StringFloatingRenderer,
    groupable: true,

    agg: "count",
    aggsAllowed: ["count", "first", "last"],
  },
  {
    id: "eps-diluted",
    name: "EPS dil",
    field: 11,
    type: "number",
    cellRenderer: CurrencyCell,
    autosizeCellFn: currencyAutosizer,
    floatingCellRenderer: NumberFloatingRenderer,

    agg: "avg",
    aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
  },
  {
    id: "volume",
    name: "Volume",
    field: 6,
    type: "number",
    cellRenderer: CompactNumberCell,
    autosizeCellFn: compactNumberAutosizer,
    floatingCellRenderer: NumberFloatingRenderer,

    agg: "avg",
    aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
  },
  {
    id: "market-capitalization",
    name: "Market Cap",
    field: 8,
    type: "number",
    cellRenderer: CompactCurrencyCell,
    autosizeCellFn: compactCurrencyAutosizer,
    floatingCellRenderer: NumberFloatingRenderer,

    agg: "avg",
    aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
  },
  {
    id: "price-earning",
    name: "P/E",
    field: 10,
    width: 80,
    type: "number",
    cellRenderer: DecimalCell,
    autosizeCellFn: decimalAutosizer,
    floatingCellRenderer: NumberFloatingRenderer,

    agg: "avg",
    aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
  },
  {
    id: "eps-diluted-growth",
    name: "EPS dil growth",
    field: 12,
    type: "number",
    cellRenderer: PercentCell,
    autosizeCellFn: percentAutosizer,
    floatingCellRenderer: NumberFloatingRenderer,

    agg: "avg",
    aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
  },
  {
    id: "dividend yield",
    name: "Div yield %",
    field: 13,
    type: "number",
    cellRenderer: PercentCell,
    autosizeCellFn: percentAutosizer,
    floatingCellRenderer: NumberFloatingRenderer,

    agg: "avg",
    aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
  },

  {
    id: "rel-volume",
    name: "Rel Volume",
    field: 7,
    width: 130,
    type: "number",
    cellRenderer: DecimalCell,
    autosizeCellFn: decimalAutosizer,
    floatingCellRenderer: NumberFloatingRenderer,

    agg: "avg",
    aggsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
  },
  {
    id: "industry",
    name: "Industry",
    field: 16,
    width: 250,
    cellRenderer: BaseCell,
    floatingCellRenderer: StringFloatingRenderer,
    groupable: true,

    agg: "count",
    aggsAllowed: ["first", "last", "count"],
  },
  {
    id: "sector",
    name: "Sector",
    field: 15,
    width: 180,
    cellRenderer: BaseCell,
    floatingCellRenderer: StringFloatingRenderer,
    groupable: true,

    agg: "count",
    aggsAllowed: ["first", "last", "count"],
  },
];
