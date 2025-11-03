import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { memo } from "react";

function BaseCellImpl({
  grid,
  column,
  row,
}: CellRendererParams<(string | number | null)[]>) {
  const field = grid.api.columnField(column, row);

  return (
    <div className="flex items-center w-full h-full px-2 text-ln-gray-80">
      {`${field}`}
    </div>
  );
}

export const BaseCell = memo(BaseCellImpl);
