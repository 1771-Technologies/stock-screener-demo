import { FilterIcon } from "@1771technologies/lytenyte-pro/icons";
import type { HeaderFloatingCellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { Popover as P } from "radix-ui";
import { useState } from "react";
import { InFilterPopoverContent } from "./in-filter-popover-content";
import { GridIconButton } from "../ui/icon-button";
import { tw } from "../lib/tw";

export function InFilterPopover({
  column,
  grid,
}: HeaderFloatingCellRendererParams<any>) {
  const [open, setOpen] = useState(false);

  const filterIn = grid.state.filterInModel.useValue()[column.id];
  const filterITem = grid.state.filterModel.useValue()[column.id];

  const hasFilter = filterIn?.value.size > 0 || filterITem;

  return (
    <P.Root onOpenChange={setOpen} open={open}>
      <P.Trigger asChild>
        <GridIconButton className="relative">
          <FilterIcon />
          {hasFilter && (
            <div className="w-2 h-2 absolute top-1 right-1 bg-ln-primary-50 rounded-full" />
          )}
        </GridIconButton>
      </P.Trigger>
      <P.Portal>
        <P.Content
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          className={tw(
            "bg-ln-gray-05 border-ln-gray-30 border z-50 rounded-lg p-2"
          )}
        >
          {open && <InFilterPopoverContent grid={grid} column={column} />}
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
