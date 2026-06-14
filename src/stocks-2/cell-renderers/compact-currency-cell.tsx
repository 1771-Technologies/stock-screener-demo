import { memo } from "react";
import { Grid } from "lytenyte-pro";
import { GridSpec } from "../types";
import { formatCompactNumber, twoDecimalPlace } from "../formatters";

function CompactCurrencyCellImpl({
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
        : [twoDecimalPlace.format(field), "B"]
      : ["-", ""];

  return (
    <div className="flex items-center h-full justify-end gap-1 text-nowrap tabular-nums">
      <span>
        {label}
        <span className="font-semibold">{suffix}</span>
        {(!isGroup || (isGroup && !isCount)) && (
          <span className="ps-0.5 text-[9px] font-semibold">USD</span>
        )}
      </span>
    </div>
  );
}

export const CompactCurrencyCell = memo(CompactCurrencyCellImpl);
