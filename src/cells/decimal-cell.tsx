import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { memo } from "react";

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

function DecimalCellImpl({
  grid,
  row,
  column,
}: CellRendererParams<(string | number | null)[]>) {
  const field = grid.api.columnField(column, row);

  const isGroup = grid.api.rowIsGroup(row);
  const aggregations = grid.state.aggModel.useValue();
  const isCount = aggregations[column.id]?.fn === "count";

  const label =
    typeof field === "number"
      ? isGroup && isCount
        ? Math.round(field)
        : formatter.format(field)
      : "-";

  return (
    <div className="flex items-center h-full justify-end tabular-nums px-3 text-nowrap">
      {label}
    </div>
  );
}
export const DecimalCell = memo(DecimalCellImpl);
