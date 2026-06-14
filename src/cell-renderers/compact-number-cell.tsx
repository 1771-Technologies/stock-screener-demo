import { Grid } from "lytenyte-pro";
import { memo } from "react";
import type { GridSpec } from "../types";
import { twoDecimalPlace } from "../formatters";

function CompactNumberCellImpl({
  row,
  api,
  column,
}: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  const isGroup = api.rowIsGroup(row);
  const isCount = column.agg === "count";

  const [label, suffix] =
    typeof field === "number"
      ? isGroup && isCount
        ? [Math.round(field), ""]
        : [twoDecimalPlace.format(field), "M"]
      : ["-", ""];

  return (
    <div className="flex items-center h-full justify-end gap-1 text-nowrap tabular-nums">
      <span>{label}</span>
      <span className="font-semibold">{suffix}</span>
    </div>
  );
}

export const CompactNumberCell = memo(CompactNumberCellImpl);
