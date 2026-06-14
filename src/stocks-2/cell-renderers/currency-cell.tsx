import { Grid } from "lytenyte-pro";
import { memo } from "react";
import { GridSpec } from "../types";
import { twoDecimalPlace } from "../formatters";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function CurrencyCellImpl({
  api,
  row,
  column,
}: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  const isCount = column.agg === "count";
  const label =
    typeof field === "number"
      ? isCount
        ? formatter.format(field)
        : twoDecimalPlace.format(field)
      : "-";
  const currency = "USD";

  return (
    <div className="flex items-center w-full h-full justify-end text-nowrap tabular-nums">
      <div className="flex items-baseline gap-1">
        <span>{label}</span>
        {!isCount && <span className="text-[9px]">{currency}</span>}
      </div>
    </div>
  );
}

export const CurrencyCell = memo(CurrencyCellImpl);
