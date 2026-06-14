import { Grid, measureText } from "lytenyte-pro";
import type { GridSpec } from "../types";

export function analystRatingAutosizer({
  api,
  row,
  column,
}: Grid.T.CellParams<GridSpec>) {
  const field = api.columnField(column, row);

  const text = measureText(field as string, api.viewport());

  return (text?.width ?? 0) + 16 + 80;
}
