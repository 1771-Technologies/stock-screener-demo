import { Grid, measureText } from "lytenyte-pro";
import type { GridSpec } from "../types";
import { twoDecimalPlace } from "../formatters";

export function currencyAutosizer({
  api,
  row,
  column,
}: Grid.T.CellParams<GridSpec>) {
  const field = api.columnField(column, row);

  const label = typeof field === "number" ? twoDecimalPlace.format(field) : "-";
  const current = "USD";

  const text = measureText(
    `${label} ${label === "-" ? "" : current}`,
    api.viewport(),
  );

  return (text?.width ?? 0) + 8;
}
