import { computeField } from "lytenyte-pro";
import type { Grid } from "lytenyte-pro";
import type { GridSpec } from "./types";

type Agg = Grid.T.Aggregator<GridSpec["data"]>;

function numericValues(
  field: Grid.T.Field<GridSpec["data"]>,
  rows: Grid.T.RowLeaf<GridSpec["data"]>[],
): number[] {
  const result: number[] = [];
  for (const r of rows) {
    const v = computeField<unknown>(field, r);
    if (typeof v === "number" && Number.isFinite(v)) result.push(v);
  }
  return result;
}

export const aggFns: Record<string, Agg> = {
  count: (_, rows) => rows.length,

  first: (field, rows) => {
    for (const r of rows) {
      const v = computeField(field, r);
      if (v != null) return v;
    }
    return null;
  },

  last: (field, rows) => {
    for (let i = rows.length - 1; i >= 0; i--) {
      const v = computeField(field, rows[i]);
      if (v != null) return v;
    }
    return null;
  },

  same: (field, rows) => {
    if (!rows.length) return null;
    const first = computeField(field, rows[0]);
    return rows.every((r) => computeField(field, r) === first) ? first : null;
  },

  sum: (field, rows) => {
    const nums = numericValues(field, rows);
    return nums.length ? nums.reduce((a, b) => a + b, 0) : null;
  },

  avg: (field, rows) => {
    const nums = numericValues(field, rows);
    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
  },

  min: (field, rows) => {
    const nums = numericValues(field, rows);
    if (!nums.length) return null;
    return nums.reduce((a, b) => (b < a ? b : a));
  },

  max: (field, rows) => {
    const nums = numericValues(field, rows);
    if (!nums.length) return null;
    return nums.reduce((a, b) => (b > a ? b : a));
  },
};
