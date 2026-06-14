import { Grid } from "lytenyte-pro";
import { memo } from "react";
import { GridSpec } from "../types";

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

function DecimalCellImpl({
  api,
  row,
  column,
}: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  const isGroup = api.rowIsGroup(row);
  const isCount = column.agg === "count";

  const label =
    typeof field === "number"
      ? isGroup && isCount
        ? Math.round(field)
        : formatter.format(field)
      : "-";

  return (
    <div className="flex items-center h-full justify-end tabular-nums text-nowrap">
      {label}
    </div>
  );
}
export const DecimalCell = memo(DecimalCellImpl);
