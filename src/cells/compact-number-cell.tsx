import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { memo } from "react";
import { formatCompactNumber } from "./format-compact-number";

function CompactNumberCellImpl({
  row,
  grid,
  column,
}: CellRendererParams<(string | number | null)[]>) {
  const field = grid.api.columnField(column, row);

  const isGroup = grid.api.rowIsGroup(row);
  const aggregations = grid.state.aggModel.useValue();
  const isCount = aggregations[column.id]?.fn === "count";

  const [label, suffix] =
    typeof field === "number"
      ? isGroup && isCount
        ? [Math.round(field), ""]
        : formatCompactNumber(field)
      : ["-", ""];

  return (
    <div className="flex items-center h-full justify-end gap-1 px-3 text-nowrap tabular-nums">
      <span>{label}</span>
      <span className="font-semibold">{suffix}</span>
    </div>
  );
}

export const CompactNumberCell = memo(CompactNumberCellImpl);
