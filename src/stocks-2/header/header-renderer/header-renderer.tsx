import clsx from "clsx";
import { tw } from "@/utils/tw";
import { Grid } from "lytenyte-pro";
import { GridSpec } from "../../types";
import { SortButton } from "./sort-button";
import { ColumnMenu } from "../../column-menu/column-menu";
import { AggMenu } from "./agg-menu";

export function HeaderRenderer({ column, api }: Grid.T.HeaderParams<GridSpec>) {
  const name = column.name ?? column.id;
  const isNumber = column.type === "number";

  const isGrouped = (api.grouped.useValue()?.length ?? 0) > 0;
  const agg = column.agg ?? "";

  return (
    <div
      className={clsx(
        "flex w-full h-full items-center text-[13px]",
        "group relative gap-1 text-nowrap overflow-hidden text-ln-gray-60",
        isNumber && "justify-end",
      )}
    >
      <span className={tw(isNumber && "order-2")}>{name}</span>
      {isGrouped && agg && (
        <AggMenu column={column} api={api} isNumber={isNumber} />
      )}
      {isNumber ? (
        <>
          <ColumnMenu column={column} api={api} isNumber={isNumber} />
          <SortButton column={column} api={api} isNumber={isNumber} />
        </>
      ) : (
        <>
          <SortButton column={column} api={api} isNumber={isNumber} />
          <ColumnMenu column={column} api={api} isNumber={isNumber} />
        </>
      )}
    </div>
  );
}
