import { Grid, measureText } from "lytenyte-pro";
import type { GridSpec } from "../types";

export function symbolAutosizer({
  api,
  column,
  row,
}: Grid.T.CellParams<GridSpec>) {
  if (api.rowIsGroup(row)) {
    const data = row.data[column.id];
    const text =
      column.agg === "count" ? `${data as string} Symbols` : `${data}`;

    const metric = measureText(text, api.viewport());
    if (!metric) return 8;

    return metric.width + 20;
  }
  if (!api.rowIsLeaf(row)) return 0;

  const symbol = (row.data?.[0] as string) ?? "";
  const desc = row?.data?.[1];

  const text = measureText(`${symbol} ${desc}`, api.viewport());

  if (!text) return 8;

  return text.width + 16 + 90;
}
