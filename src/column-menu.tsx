import {
  AggregateIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AutosizeIcon,
  Columns2Icon,
  GroupByColIcon,
  HiddenIcon,
  MoreVerticalIcon,
  SortIcon,
  SpacingHIcon,
  SpacingIcon,
} from "@1771technologies/lytenyte-pro/icons";
import type {
  ColumnPin,
  HeaderCellRendererParams,
} from "@1771technologies/lytenyte-pro/types";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Cross2Icon,
  DrawingPinFilledIcon,
  EyeOpenIcon,
  MoveIcon,
  PinLeftIcon,
  PinRightIcon,
} from "@radix-ui/react-icons";
import clsx from "clsx";
import { DropdownMenu as D } from "radix-ui";
import { Item, RadioItem, Separator, SubTrigger } from "./ui/menu/menu-item";
import { GridIconButton } from "./ui/icon-button";
import { tw } from "./lib/tw";
import { Tooltip } from "./ui/tooltip";
import { GridDropMenuContent } from "./ui/dialog";

export function ColumnMenu({
  column,
  grid,
  className,
  omitDialogs = false,
}: HeaderCellRendererParams<(string | number | null)[]> & {
  className?: string;
  omitDialogs?: boolean;
}) {
  const base = grid.state.columnBase.useValue();

  const columns = grid.state.columns.useValue();

  const index = columns.indexOf(column);

  const aggs = grid.state.aggModel.useValue();
  const agg = aggs[column.id];
  const aggName = typeof agg?.fn === "string" ? agg?.fn : "Fn(x)";

  const sort = grid.state.sortModel
    .useValue()
    .find((c) => c.columnId === column.id);

  const isGroupable =
    column.uiHints?.rowGroupable ?? base.uiHints?.rowGroupable ?? false;

  const isGrouping = grid.state.rowGroupModel.useValue().length > 0;

  const options =
    column.uiHints?.aggsAllowed ?? base.uiHints?.aggsAllowed ?? [];

  const disableReason = isGroupable
    ? null
    : `The ${column.name ?? column.id} cannot be used as a row group.`;

  const aggDisabled = options
    ? `${
        column.name ?? column.id
      } does not have any aggregations to select from.`
    : null;

  return (
    <D.Root>
      <D.Trigger
        className={tw(
          "p-1 rounded bg-ln-gray-05 hover:bg-ln-gray-20 absolute",
          "opacity-0 group-hover:opacity-80",
          "transition-opacity group-hover:focus:opacity-100 focus-visible:opacity-100",
          "data-[state=open]:opacity-100",
          column.type === "number" ? "left-9" : "right-9",
          className
        )}
        asChild
      >
        <GridIconButton>
          <MoreVerticalIcon className="size-4" />
        </GridIconButton>
      </D.Trigger>
      <D.Portal>
        <GridDropMenuContent>
          {(!sort || sort?.isDescending) && (
            <Item
              icon={<ArrowUpIcon />}
              label="Sort Ascending"
              onClick={() => {
                grid.state.sortModel.set([
                  {
                    columnId: column.id,
                    sort: {
                      kind: (column.type as "number") ?? "string",
                    },
                  },
                ]);
              }}
            />
          )}
          {(!sort || !sort?.isDescending) && (
            <Item
              icon={<ArrowDownIcon />}
              label="Sort Descending"
              onClick={() => {
                grid.state.sortModel.set([
                  {
                    columnId: column.id,
                    sort: {
                      kind: (column.type as "number") ?? "string",
                    },
                    isDescending: true,
                  },
                ]);
              }}
            />
          )}
          {sort && (
            <Item
              icon={<SortIcon />}
              label="Clear Sort"
              onClick={() => {
                grid.state.sortModel.set((prev) =>
                  prev.filter((c) => c.columnId !== column.id)
                );
              }}
            />
          )}
          <Separator />

          <D.DropdownMenuSub>
            <SubTrigger icon={<DrawingPinFilledIcon />} label="Column Pin" />
            <D.Portal>
              <D.DropdownMenuSubContent
                className="bg-ln-gray-05 border-ln-gray-30 border z-50 rounded p-1"
                sideOffset={1}
                alignOffset={-8}
              >
                <D.DropdownMenuRadioGroup
                  value={column.pin ?? "no-pin"}
                  className="group"
                  onValueChange={(c) => {
                    const next = c === "no-pin" ? null : (c as ColumnPin);
                    grid.api.columnUpdate({ [column.id]: { pin: next } });
                  }}
                >
                  <RadioItem
                    label="Pin Left"
                    value="start"
                    icon={<PinLeftIcon />}
                  />
                  <RadioItem
                    label="Pin Right"
                    value="end"
                    icon={<PinRightIcon />}
                  />
                  <RadioItem
                    label="No Pin"
                    value="no-pin"
                    icon={<Cross2Icon />}
                  />
                </D.DropdownMenuRadioGroup>
              </D.DropdownMenuSubContent>
            </D.Portal>
          </D.DropdownMenuSub>

          <D.DropdownMenuSub>
            <SubTrigger icon={<MoveIcon />} label="Move" />
            <D.Portal>
              <D.DropdownMenuSubContent
                className="bg-ln-gray-05 border-ln-gray-30 border z-50 rounded p-1"
                sideOffset={1}
                alignOffset={-8}
              >
                {index !== 0 && (
                  <Item
                    label="Move Left"
                    icon={<ArrowLeftIcon />}
                    onClick={() => {
                      grid.api.columnMove({
                        moveColumns: [column],
                        moveTarget: columns[index - 1],
                        before: true,
                      });
                    }}
                  />
                )}
                {index !== 0 && (
                  <Item
                    label="Move To Start"
                    icon={<PinLeftIcon />}
                    onClick={() => {
                      grid.api.columnMove({
                        moveColumns: [column],
                        moveTarget: columns[0],
                        before: true,
                      });
                    }}
                  />
                )}
                {index !== columns.length - 1 && (
                  <Item
                    label="Move Right"
                    onClick={() => {
                      grid.api.columnMove({
                        moveColumns: [column],
                        moveTarget: columns[index + 1],
                        before: false,
                      });
                    }}
                    icon={<ArrowRightIcon />}
                  />
                )}
                {index !== columns.length - 1 && (
                  <Item
                    label="Move To End"
                    icon={<PinRightIcon />}
                    onClick={() => {
                      grid.api.columnMove({
                        moveColumns: [column],
                        moveTarget: columns.at(-1)!,
                        before: false,
                      });
                    }}
                  />
                )}
              </D.DropdownMenuSubContent>
            </D.Portal>
          </D.DropdownMenuSub>

          <Separator />
          <Item
            icon={<AutosizeIcon className="size-4" />}
            onClick={() => grid.api.columnAutosize({ columns: [column] })}
            label="Autosize"
          />
          <Item
            onClick={() => grid.api.columnAutosize({})}
            icon={<SpacingIcon />}
            label="Autosize All Columns"
          />
          <Item
            onClick={() => grid.api.columnAutosize({ includeHeader: true })}
            icon={<SpacingHIcon />}
            label="Autosize All (Include Headers)"
          />

          <Separator />

          {column.hide && (
            <Item
              icon={<EyeOpenIcon />}
              label="Show Column"
              onClick={() =>
                grid.api.columnUpdate({ [column.id]: { hide: !column.hide } })
              }
            />
          )}
          {!column.hide && (
            <Item
              icon={<HiddenIcon />}
              label="Hide Column"
              onClick={() =>
                grid.api.columnUpdate({ [column.id]: { hide: !column.hide } })
              }
            />
          )}
          <Item
            disabled={!isGroupable}
            disableReason={disableReason}
            icon={<GroupByColIcon />}
            onClick={() => {
              grid.state.rowGroupModel.set((prev) => {
                if (prev.includes(column.id)) return prev;

                return [...prev, column.id];
              });
              grid.api.columnUpdate({ [column.id]: { hide: true } });
            }}
            label={
              <div>
                Group By{" "}
                <span
                  className={clsx(isGroupable && "text-ln-gray-90 font-bold")}
                >
                  {" "}
                  {column.name ?? column.id}
                </span>
              </div>
            }
          />

          {!omitDialogs && (
            <>
              <Separator />
              <Item
                label="Manage Columns"
                icon={<Columns2Icon />}
                onClick={() => grid.api.dialogFrameOpen("column-manager")}
              />
              <Item
                label="Manage Sorts"
                icon={<SortIcon />}
                onClick={() => grid.api.dialogFrameOpen("sort-manager")}
              />
              <Separator />
            </>
          )}
          <D.Arrow fill="var(--lng1771-gray-30)" />

          <D.DropdownMenuSub>
            <Tooltip
              content={
                <div className="max-w-[150px]">
                  Aggregations are only used when grouping. Apply a column
                  grouping to see the result.
                </div>
              }
              disabled={isGrouping}
              className="z-100"
              side="bottom"
            >
              <SubTrigger
                disabled={!options.length}
                disableReason={aggDisabled}
                icon={<AggregateIcon />}
                label="Aggregate Select"
              />
            </Tooltip>
            <D.Portal>
              <D.DropdownMenuSubContent
                className="bg-ln-gray-05 border-ln-gray-30 border z-50 rounded p-1"
                sideOffset={1}
                alignOffset={-8}
              >
                <D.DropdownMenuRadioGroup
                  value={aggName}
                  onValueChange={(c) => {
                    grid.state.aggModel.set((prev) => {
                      return { ...prev, [column.id]: { fn: c } };
                    });
                  }}
                >
                  {options.map((c) => {
                    return (
                      <RadioItem key={c} value={c} label={c} className="pl-2" />
                    );
                  })}
                </D.DropdownMenuRadioGroup>
              </D.DropdownMenuSubContent>
            </D.Portal>
          </D.DropdownMenuSub>
        </GridDropMenuContent>
      </D.Portal>
    </D.Root>
  );
}
