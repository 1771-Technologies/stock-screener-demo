import { memo } from "react";
import { Grid } from "lytenyte-pro";
import type { GridSpec } from "../types";
import { tw } from "../lib/tw";

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

function PercentCellImpl({
  api,
  row,
  column,
}: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row) as number;

  const isGroup = api.rowIsGroup(row);
  const isCount = column.agg === "count";

  const label =
    typeof field === "number"
      ? isGroup && isCount
        ? Math.round(field)
        : formatter.format(field) + "%"
      : "-";

  return (
    <div
      className={tw(
        "flex items-center justify-end h-full w-full text-nowrap tabular-nums",
        isCount
          ? ""
          : field < 0
            ? "text-(--ln-red-50)"
            : "text-(--ln-green-50)",
      )}
    >
      {label}
    </div>
  );
}

export const PercentCell = memo(PercentCellImpl);
