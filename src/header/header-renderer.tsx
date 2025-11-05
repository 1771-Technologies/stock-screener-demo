import type { HeaderCellRendererParams } from "@1771technologies/lytenyte-pro/types";
import clsx from "clsx";
import { SortSwitcher } from "./sort-switcher";
import { tw } from "../lib/tw";
import { ColumnMenu } from "../column-menu";

export function HeaderRenderer({
  column,
  grid,
}: HeaderCellRendererParams<(string | number | null)[]>) {
  const name = column.name ?? column.id;

  const isNumber = column.type === "number";

  const aggModel = grid.state.aggModel.useValue();
  const isGrouped = grid.state.rowGroupModel.useValue().length > 0;
  const agg = (aggModel[column.id]?.fn ?? "") as string;

  return (
    <div
      className={clsx(
        "flex w-full h-full items-center text-[14px] text-ln-gray-80 px-2 group relative gap-1 text-nowrap overflow-hidden",
        isNumber && "justify-end"
      )}
    >
      <span className={tw(isNumber && "order-2")}>{name}</span>
      {isGrouped && agg && (
        <div
          className={tw("text-xs text-ln-primary-50", isNumber && "order-1")}
        >
          ({agg})
        </div>
      )}
      <SortSwitcher grid={grid} column={column} />
      <ColumnMenu grid={grid} column={column} />
    </div>
  );
}
