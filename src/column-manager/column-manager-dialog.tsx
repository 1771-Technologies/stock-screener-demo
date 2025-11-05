import type { Grid } from "@1771technologies/lytenyte-pro/types";
import { CloseIcon } from "@1771technologies/lytenyte-pro/icons";
import { Dialog } from "radix-ui";
import { GridDialogContent } from "../ui/dialog";
import { GridIconButton } from "../ui/icon-button";
import { ColumnManagerContent } from "./column-manager-content";

export function ColumnManagerDialog({
  grid,
}: {
  grid: Grid<(string | number | null)[]>;
}) {
  return (
    <Dialog.Root
      defaultOpen
      modal
      onOpenChange={(c) => {
        if (!c) grid.api.dialogFrameClose();
      }}
    >
      <Dialog.Portal>
        <GridDialogContent>
          <div className="flex items-center justify-between border-b border-ln-gray-30 px-[18px] py-3">
            <Dialog.Title className="text-ln-gray-70 font-semibold">
              Columns
            </Dialog.Title>
            <Dialog.Close asChild>
              <GridIconButton>
                <CloseIcon />
              </GridIconButton>
            </Dialog.Close>
          </div>
          <ColumnManagerContent grid={grid} omitDialogs />
        </GridDialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
