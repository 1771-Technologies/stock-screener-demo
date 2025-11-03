import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { memo } from "react";
import { tw } from "../lib/tw";

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

function PercentCellImpl({
  grid,
  row,
  column,
}: CellRendererParams<(string | number | null)[]>) {
  const field = grid.api.columnField(column, row) as number;

  const isGroup = grid.api.rowIsGroup(row);
  const aggregations = grid.state.aggModel.useValue();
  const isCount = aggregations[column.id]?.fn === "count";

  const label =
    typeof field === "number"
      ? isGroup && isCount
        ? Math.round(field)
        : formatter.format(field) + "%"
      : "-";

  return (
    <div
      className={tw(
        "flex items-center justify-end h-full w-full px-3 text-nowrap tabular-nums"
      )}
    >
      {label}
    </div>
  );
}

export const PercentCell = memo(PercentCellImpl);
