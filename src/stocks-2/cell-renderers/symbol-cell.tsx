import { Grid } from "lytenyte-pro";
import { memo } from "react";
import { GridSpec } from "../types";
import { symbolToLogo } from "../symbol-to-logo";

function SymbolCellImpl({
  api,
  row,
  column,
}: Grid.T.CellRendererParams<GridSpec>) {
  if (api.rowIsGroup(row)) {
    const data = row.data[column.id];

    return (
      <div className="flex items-center h-full text-nowrap">
        {data as string}{" "}
        {column.agg === "count" ? (data === 1 ? "Symbol" : "Symbols") : ""}
      </div>
    );
  }
  if (!api.rowIsLeaf(row)) return null;

  const symbol = (row.data?.[0] as string) ?? "";
  const desc = row.data?.[1];

  return (
    <div className="grid grid-cols-[32px_60px_1fr] items-center h-full w-full overflow-hidden text-nowrap gap-3">
      <div className="h-[32px] w-[32px] min-w-[32px] min-h-[32px] rounded-full overflow-hidden items-center justify-center flex">
        <img
          src={symbolToLogo[symbol]}
          alt=""
          width={26}
          height={26}
          className="bg-black rounded-full p-1 min-h-[26px] min-w-[26] w-[26px] h-[26px] pointer-events-none"
        />
      </div>
      <div className="flex items-center justify-center bg-teal-600/20 px-1 py-0.5 rounded-2xl text-xs">
        {symbol}
      </div>
      <div className="text-ellipsis overflow-hidden">{desc}</div>
    </div>
  );
}
export const SymbolCell = memo(SymbolCellImpl);
