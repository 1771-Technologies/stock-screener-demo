import { Grid, measureText } from "lytenyte-pro";
import type { GridSpec } from "../types";

export function exchangeAutosizer({
  api,
  row,
  column,
}: Grid.T.CellParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (api.rowIsGroup(row)) {
    return 0;
  }
  const text = measureText(String(field) as string, api.viewport());
  if (!text) return 0;

  return text.width + 16 + 36;
}
