import { Grid, measureText } from "lytenyte-pro";
import type { GridSpec } from "../types";
import { twoDecimalPlace } from "../formatters";

export function decimalAutosizer({
  api,
  row,
  column,
}: Grid.T.CellParams<GridSpec>) {
  const field = api.columnField(column, row) as number;

  const label = typeof field === "number" ? twoDecimalPlace.format(field) : "";

  const text = measureText(label, api.viewport());

  return (text?.width ?? 0) + 16;
}
