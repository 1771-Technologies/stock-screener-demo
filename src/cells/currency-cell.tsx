import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { memo } from "react";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function CurrencyCellImpl({
  grid,
  row,
  column,
}: CellRendererParams<(string | number | null)[]>) {
  const field = grid.api.columnField(column, row);

  const label = typeof field === "number" ? formatter.format(field) : "-";
  const currency = "USD";

  const aggregations = grid.state.aggModel.useValue();
  const isCount = aggregations[column.id]?.fn === "count";

  return (
    <div className="flex items-center w-full h-full justify-end px-3 text-nowrap tabular-nums">
      <div className="flex items-baseline gap-1">
        <span>{label}</span>
        {!isCount && <span className="text-[9px]">{currency}</span>}
      </div>
    </div>
  );
}

export const CurrencyCell = memo(CurrencyCellImpl);
