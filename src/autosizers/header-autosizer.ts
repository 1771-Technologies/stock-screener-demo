import { Grid, measureText } from "lytenyte-pro";
import type { GridSpec } from "../types";

export function headerAutosizer({
  api,
  column,
}: Grid.T.HeaderParams<GridSpec>) {
  const hasGroups = !!api.grouped.get().length;
  const text = hasGroups
    ? `${column.name ?? column.id} ` + (column.agg ?? "")
    : `${column.name ?? column.id}`;

  const width = measureText(text, api.viewport())?.width;
  if (!width) return 120;

  return width + 40;
}
