import { Grid, measureText } from "lytenyte-pro";
import type { GridSpec } from "../types";

export function rowGroupAutosizer({
  row,
  column,
  api,
}: Grid.T.CellParams<GridSpec>) {
  if (row.kind === "leaf") return null;

  const field = api.columnField(column, row);
  const depthOffset = row.depth * 24;

  const textWidth = measureText(`${field}`, api.viewport())?.width;
  if (!textWidth) return 160;

  return depthOffset + textWidth + 24 + 60;
}
