import { Grid } from "lytenyte-pro";
import { memo } from "react";
import { GridSpec } from "../types";

function BaseCellImpl({
  api,
  column,
  row,
}: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return (
    <div className="flex items-center w-full h-full text-ln-gray-80">
      {`${field}`}
    </div>
  );
}

export const BaseCell = memo(BaseCellImpl);
