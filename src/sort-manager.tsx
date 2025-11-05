import type { Grid } from "@1771technologies/lytenyte-pro/types";
import { SortManager as SM } from "@1771technologies/lytenyte-pro";
import { Dialog } from "radix-ui";
import { AddIcon, CloseIcon } from "@1771technologies/lytenyte-pro/icons";
import clsx from "clsx";
import { TrashIcon } from "@radix-ui/react-icons";
import { GridDialogContent } from "./ui/dialog";
import { GridIconButton } from "./ui/icon-button";
import { GridSelect } from "./ui/select-component";

export function SortManager({
  grid,
}: {
  grid: Grid<(string | number | null)[]>;
}) {
  const { rootProps, rows } = SM.useSortManager({ grid });

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
              Sort
            </Dialog.Title>
            <Dialog.Close asChild>
              <GridIconButton>
                <CloseIcon />
              </GridIconButton>
            </Dialog.Close>
          </div>
          <SM.Root {...rootProps}>
            <SM.Rows className="flex flex-col md:grid md:grid-cols-[auto_auto_auto_auto] max-h-[60vh] px-[18px] py-3 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ln-primary-50 rounded">
              <div className="hidden md:grid md:grid-cols-subgrid md:col-span-full pt-2 pb-1 text-xs text-ln-gray-70 font-semibold">
                <div className="pl-2">Column</div>
                <div className="pl-2">Sort On</div>
                <div className="pl-2">Order</div>
              </div>
              {rows.map((c) => {
                if (c.isCustom) return null;

                return (
                  <SM.Row
                    row={c}
                    key={c.index}
                    className="flex flex-col md:grid md:grid-cols-subgrid md:col-span-full  gap-2 items-center py-2 focus-visible:ring-1 focus-visible:ring-ln-primary-50 px-0.5 rounded"
                  >
                    <div className="w-full">
                      <SM.ColumnSelect
                        as={({ options, value, onSelect }) => {
                          return (
                            <GridSelect
                              value={value}
                              options={options}
                              onChange={onSelect}
                              placeholder="Select..."
                            />
                          );
                        }}
                      />
                    </div>

                    <div className="w-full">
                      <SM.ValueSelect
                        as={({ options, value, onSelect, disabled }) => {
                          return (
                            <GridSelect
                              className="w-full"
                              disabled={disabled}
                              options={options}
                              value={value}
                              onChange={onSelect}
                              placeholder="Sort on..."
                            />
                          );
                        }}
                      />
                    </div>

                    <div className="hidden md:block">
                      <SM.DirectionSelect
                        as={({ onSelect, options, value }) => {
                          return (
                            <GridSelect
                              onChange={onSelect}
                              value={value}
                              options={options}
                              className="min-w-20"
                            />
                          );
                        }}
                      />
                    </div>

                    <div className="flex md:hidden w-full gap-2">
                      <div className="flex-1">
                        <SM.DirectionSelect
                          as={({ onSelect, options, value }) => {
                            return (
                              <GridSelect
                                onChange={onSelect}
                                value={value}
                                options={options}
                              />
                            );
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-end">
                        <SM.Add
                          as={
                            <GridIconButton>
                              <AddIcon />
                            </GridIconButton>
                          }
                        />
                        <SM.Remove
                          as={
                            <GridIconButton>
                              <TrashIcon />
                            </GridIconButton>
                          }
                        />
                      </div>
                    </div>

                    <div className="hidden w-full justify-end md:flex items-center gap-1">
                      <SM.Add
                        as={
                          <GridIconButton>
                            <AddIcon />
                          </GridIconButton>
                        }
                      />
                      <SM.Remove
                        as={
                          <GridIconButton>
                            <TrashIcon />
                          </GridIconButton>
                        }
                      />
                    </div>
                  </SM.Row>
                );
              })}
            </SM.Rows>

            <div className="flex items-center pb-2 gap-2 px-[18px] border-t border-ln-gray-30 py-4">
              <div className="flex-1">
                <SM.Cancel
                  className={clsx(
                    "text-sm border border-ln-gray-30 px-3 rounded py-0.5 hover:bg-ln-gray-10 bg-ln-gray-00 text-ln-gray-70",
                    "focus-visible:ring-1 focus-visible:ring-ln-primary-50"
                  )}
                  onClick={() => grid.api.dialogFrameClose()}
                >
                  Cancel
                </SM.Cancel>
              </div>

              <SM.Clear
                className={clsx(
                  "text-sm border border-ln-gray-30 px-3 rounded py-0.5 hover:bg-ln-gray-10 bg-ln-gray-00 text-ln-gray-70",
                  "focus-visible:ring-1 focus-visible:ring-ln-primary-50"
                )}
                onClick={() => grid.api.dialogFrameClose()}
              >
                Clear
              </SM.Clear>
              <SM.Apply
                style={{ transform: "scale(0.95)" }}
                className={clsx(
                  "text-sm border border-ln-primary-30 px-3 rounded py-0.5 hover:bg-ln-primary-70 bg-ln-primary-50 text-ln-gray-02 font-semibold",
                  "focus-visible:ring-1 focus-visible:ring-ln-primary-50"
                )}
                onClick={() => grid.api.dialogFrameClose()}
              >
                Apply
              </SM.Apply>
            </div>
          </SM.Root>
        </GridDialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
