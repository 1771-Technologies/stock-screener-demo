"use client";
import { Grid } from "lytenyte-pro";
import { Dialog } from "lytenyte-pro/components";
import { GridSpec } from "../types";
import { SortEntry } from "./sort-types";
import { SortDialogContent } from "./sort-dialog-content";
import { Button } from "@/components/button/button";
import { tw } from "@/utils/tw";
import { SortIcon } from "@1771technologies/lytenyte-core/icons";

interface Props {
  columns: Grid.Column<GridSpec>[];
  sortModel: SortEntry[];
  onSortModelChange: (model: SortEntry[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: string;
}

export function SortManager({
  columns,
  sortModel,
  onSortModelChange,
  open,
  onOpenChange,
  theme,
}: Props) {
  const hasSort = sortModel.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal lightDismiss>
      <Dialog.Trigger
        render={
          <Button
            kind="tertiary"
            className={tw(
              "flex px-2 text-sm h-[32px] text-light",
              theme.includes("light") && "text-black",
            )}
            style={
              theme.includes("light")
                ? { border: "1px solid black" }
                : undefined
            }
          />
        }
      >
        <SortIcon />
        {hasSort && (
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-ln-primary-50" />
        )}
      </Dialog.Trigger>
      <Dialog.Container className="max-w-[90vw] w-[400px] md:min-w-[580px] px-0 top-1/3">
        <Dialog.Description className="sr-only">
          Sort multiple columns
        </Dialog.Description>
        <SortDialogContent
          columns={columns}
          sortModel={sortModel}
          onApply={(model) => {
            onSortModelChange(model);
            onOpenChange(false);
          }}
          onClear={() => {
            onSortModelChange([]);
            onOpenChange(false);
          }}
          onClose={() => onOpenChange(false)}
        />
      </Dialog.Container>
    </Dialog>
  );
}
