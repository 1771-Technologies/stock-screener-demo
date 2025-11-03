import NY from "./exchanges/nyse.svg";
import NAS from "./exchanges/nasdaq.svg";
import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { memo } from "react";
import { tw } from "../lib/tw";

function ExchangeCellImpl({
  grid,
  row,
  column,
}: CellRendererParams<(string | null | number)[]>) {
  const exchange = grid.api.columnField(column, row);
  if (grid.api.rowIsGroup(row)) {
    return (
      <div
        className={tw(
          "px-3 flex items-center h-full text-nowrap",
          typeof exchange === "number" && "justify-end"
        )}
      >
        {exchange as number}
      </div>
    );
  }

  if (!exchange) return null;

  const imgSrc = exchange === "NYSE" ? NY : NAS;

  return (
    <div className="flex items-center gap-2 h-full w-full px-3 text-nowrap">
      <img
        alt={`Financial exchange ${exchange}`}
        src={imgSrc}
        className="rounded-full pointer-events-none"
        width={20}
        height={20}
      />
      <div>{`${exchange}`}</div>
    </div>
  );
}

export const ExchangeCells = memo(ExchangeCellImpl);
