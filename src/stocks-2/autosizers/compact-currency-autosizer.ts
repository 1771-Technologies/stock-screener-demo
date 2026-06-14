import { Grid, measureText } from "lytenyte-pro";
import type { GridSpec } from "../types";
import { formatCompactNumber } from "../formatters";

export function compactCurrencyAutosizer({
  api,
  row,
  column,
}: Grid.T.CellParams<GridSpec>) {
  const field = api.columnField(column, row) as number;

  const label = typeof field === "number" ? formatCompactNumber(field) : "-";

  const text = measureText(`${label} Musd`, api.viewport());

  return (text?.width ?? 0) + 16;
}
