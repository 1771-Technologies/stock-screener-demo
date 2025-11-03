import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { memo } from "react";

function SymbolCellImpl({
  grid,
  row,
  column,
}: CellRendererParams<(string | number | null)[]>) {
  if (grid.api.rowIsGroup(row)) {
    const data = row.data[column.id];

    const agg = grid.state.aggModel.get()[column.id];

    return (
      <div className="flex items-center h-full px-3 text-nowrap">
        {data as string}{" "}
        {agg.fn === "count" ? (data === 1 ? "Symbol" : "Symbols") : ""}
      </div>
    );
  }
  if (!grid.api.rowIsLeaf(row)) return null;

  const symbol = (row.data?.[0] as string) ?? "";
  const desc = row.data?.[1];

  return (
    <div className="grid grid-cols-[32px_60px_1fr] items-center h-full w-full overflow-hidden text-nowrap gap-3 px-3">
      <div className="h-8 w-8 min-w-8 min-h-8 rounded-full overflow-hidden items-center justify-center flex">
        <img
          src={`/symbols/${symbol}.png`}
          alt=""
          width={26}
          height={26}
          className="bg-black rounded-full p-1 min-h-[26px] min-w-[26] w-[26px] h-[26px] pointer-events-none"
        />
      </div>
      <div className="flex items-center justify-center bg-teal-600/20 px-1 py-0.5 rounded-2xl symbol-cell text-xs">
        {symbol}
      </div>
      <div className="text-ellipsis overflow-hidden">{desc}</div>
    </div>
  );
}
export const SymbolCell = memo(SymbolCellImpl);
