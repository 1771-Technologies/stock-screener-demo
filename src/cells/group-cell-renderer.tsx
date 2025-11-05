import {
  ChevronDownIcon,
  ChevronRightIcon,
} from "@1771technologies/lytenyte-pro/icons";
import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { tw } from "../lib/tw";
import { GridIconButton } from "../ui/icon-button";
import type { CSSProperties } from "react";

export function GroupCellRenderer({ row, grid }: CellRendererParams<any>) {
  if (grid.api.rowIsLeaf(row)) return <div />;

  const isExpanded = grid.api.rowGroupIsExpanded(row);

  return (
    <div
      style={
        {
          paddingLeft: row.depth * 16,
          "--before-offset": `${row.depth * 16 - 5}px`,
        } as CSSProperties
      }
      className={tw(
        "flex gap-2 items-center w-full h-full relative text-nowrap overflow-hidden",
        row.depth > 0 &&
          "before:absolute before:top-0 before:left-(--before-offset) before:border-r before:border-dashed before:border-ln-gray-30 before:h-full"
      )}
    >
      <GridIconButton
        className="transition-colors"
        onClick={() => {
          grid.api.rowGroupToggle(row);
        }}
      >
        <span className="sr-only">Toggle the row group</span>
        {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </GridIconButton>
      <div className="w-full overflow-hidden text-ellipsis">{row.key}</div>
    </div>
  );
}
