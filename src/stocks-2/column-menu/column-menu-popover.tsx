import { GridSpec } from "../types";
import { Grid } from "lytenyte-pro";
import { SortEntry } from "../sort-manager/sort-types";
import {
  AggregateIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AutosizeIcon,
  Close2Icon,
  Columns2Icon,
  GroupByColIcon,
  HiddenIcon,
  SortIcon,
  SpacingHIcon,
  SpacingIcon,
} from "@1771technologies/lytenyte-core/icons";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronRightIcon,
  Cross2Icon,
  DrawingPinFilledIcon,
  MoveIcon,
  PinLeftIcon,
  PinRightIcon,
} from "@radix-ui/react-icons";
import { EyeShowIcon } from "@/components/icons/eye-icon";
import { tw } from "@/utils/tw";
import { Tooltip } from "@/components/tooltip/tooltip";
import { Menu } from "lytenyte-pro/components";

export function ColumnMenuPopover({
  api,
  column,
  inDialog,
  menuContainer,
}: {
  api: Grid.T.HeaderParams<GridSpec>["api"];
  column: Grid.Column<GridSpec>;
  inDialog?: boolean;
  menuContainer: HTMLElement | null;
}) {
  const columns = api.columns.useValue() ?? [];
  const sortEntries = api.sortModel.useValue() ?? [];
  const grouped = api.grouped.useValue() ?? [];

  const index = columns.findIndex((c) => c.id === column.id);
  const sortEntry = sortEntries.find((e) => e.columnId === column.id) ?? null;

  const aggsAllowed: string[] = (column as any).aggsAllowed ?? [];

  function setSortAsc() {
    api.sortModel.set([
      ...sortEntries.filter((e) => e.columnId !== column.id),
      {
        id: column.id,
        columnId: column.id,
        descending: false,
        sortOnId: "values",
      } satisfies SortEntry,
    ]);
  }

  function setSortDesc() {
    api.sortModel.set([
      ...sortEntries.filter((e) => e.columnId !== column.id),
      {
        id: column.id,
        columnId: column.id,
        descending: true,
        sortOnId: "values",
      } satisfies SortEntry,
    ]);
  }

  function clearSort() {
    api.sortModel.set(sortEntries.filter((e) => e.columnId !== column.id));
  }

  return (
    <>
      <Menu.Arrow />
      <Menu.Container>
        {/* Sort */}
        {(!sortEntry || sortEntry.descending) && (
          <Menu.Item onAction={setSortAsc} className="flex gap-2">
            <ArrowUpIcon /> Sort Ascending
          </Menu.Item>
        )}
        {(!sortEntry || !sortEntry.descending) && (
          <Menu.Item onAction={setSortDesc} className="flex gap-2">
            <ArrowDownIcon /> Sort Descending
          </Menu.Item>
        )}
        {sortEntry && (
          <Menu.Item onAction={clearSort} className="flex gap-2">
            <Close2Icon /> Clear Sort
          </Menu.Item>
        )}

        <Menu.Divider className="my-1 border-t border-ln-gray-40" />

        {/* Pin submenu */}
        <Menu.Submenu>
          <Menu.SubmenuTrigger className="flex justify-between">
            <span className="flex items-center gap-2">
              <DrawingPinFilledIcon /> Column Pin
            </span>
            <ChevronRightIcon />
          </Menu.SubmenuTrigger>
          <Menu.SubmenuContainer>
            <Menu.RadioGroup
              value={column.pin ?? "no-pin"}
              onChange={(val) => {
                api.columnUpdate({
                  [column.id]: {
                    pin: val === "no-pin" ? null : (val as Grid.T.ColumnPin),
                  },
                });
              }}
            >
              {(["start", "end", "no-pin"] as const).map((val) => (
                <Menu.RadioItem
                  key={val}
                  value={val}
                  className="flex gap-2 min-w-[130px]"
                >
                  {(checked) => (
                    <>
                      {val === "start" ? (
                        <PinLeftIcon />
                      ) : val === "end" ? (
                        <PinRightIcon />
                      ) : (
                        <Cross2Icon />
                      )}
                      <span className="flex-1">
                        {val === "start"
                          ? "Pin Left"
                          : val === "end"
                            ? "Pin Right"
                            : "No Pin"}
                      </span>
                      <span className="text-ln-primary-50">
                        {checked && <CheckIcon />}
                      </span>
                    </>
                  )}
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.SubmenuContainer>
        </Menu.Submenu>

        {/* Move submenu */}
        {columns.length > 1 && (
          <Menu.Submenu>
            <Menu.SubmenuTrigger className="flex justify-between">
              <span className="flex items-center gap-2">
                <MoveIcon /> Move
              </span>
              <ChevronRightIcon />
            </Menu.SubmenuTrigger>
            <Menu.SubmenuContainer>
              {index > 0 && (
                <Menu.Item
                  className="flex gap-2"
                  onAction={() =>
                    api.columnMove({
                      moveColumns: [column],
                      moveTarget: columns[index - 1],
                      before: true,
                    })
                  }
                >
                  <ArrowLeftIcon /> Move Left
                </Menu.Item>
              )}
              {index > 0 && (
                <Menu.Item
                  className="flex gap-2"
                  onAction={() =>
                    api.columnMove({
                      moveColumns: [column],
                      moveTarget: columns[0],
                      before: true,
                    })
                  }
                >
                  <PinLeftIcon /> Move To Start
                </Menu.Item>
              )}
              {index < columns.length - 1 && (
                <Menu.Item
                  className="flex gap-2"
                  onAction={() =>
                    api.columnMove({
                      moveColumns: [column],
                      moveTarget: columns[index + 1],
                      before: false,
                    })
                  }
                >
                  <ArrowRightIcon /> Move Right
                </Menu.Item>
              )}
              {index < columns.length - 1 && (
                <Menu.Item
                  className="flex gap-2"
                  onAction={() =>
                    api.columnMove({
                      moveColumns: [column],
                      moveTarget: columns[columns.length - 1],
                      before: false,
                    })
                  }
                >
                  <PinRightIcon /> Move To End
                </Menu.Item>
              )}
            </Menu.SubmenuContainer>
          </Menu.Submenu>
        )}

        <Menu.Divider className="my-1 border-t border-ln-gray-40" />

        {/* Autosize */}
        <Menu.Item
          onAction={() => api.columnAutosize({ columns: [column] })}
          className="flex gap-2"
        >
          <AutosizeIcon /> Autosize
        </Menu.Item>
        <Menu.Item onAction={() => api.columnAutosize()} className="flex gap-2">
          <SpacingIcon /> Autosize All Columns
        </Menu.Item>
        <Menu.Item
          onAction={() => api.columnAutosize({ includeHeader: true })}
          className="flex gap-2"
        >
          <SpacingHIcon /> Autosize All (Include Headers)
        </Menu.Item>

        <Menu.Divider className="my-1 border-t border-ln-gray-40" />

        {/* Hide / Show */}
        <Menu.Item
          className="flex gap-2"
          onAction={() =>
            api.columnUpdate({ [column.id]: { hide: !column.hide } })
          }
        >
          {column.hide ? <EyeShowIcon /> : <HiddenIcon />}
          {column.hide ? "Show Column" : "Hide Column"}
        </Menu.Item>

        {grouped.includes(column.id) ? (
          <Menu.Item
            className={tw("flex gap-2")}
            onAction={() => {
              api.grouped.set(grouped.filter((id) => id !== column.id));
              api.columnUpdate({ [column.id]: { hide: false } });
            }}
          >
            <GroupByColIcon />
            <span>Remove Group</span>
          </Menu.Item>
        ) : (
          <Tooltip
            content={`${column.name ?? column.id} cannot be used as a row group.`}
            container={menuContainer}
            disabled={column.groupable}
          >
            <div>
              <Menu.Item
                className={tw("flex gap-2")}
                disabled={!column.groupable}
                onAction={() => {
                  api.grouped.set([...grouped, column.id]);
                  api.columnUpdate({ [column.id]: { hide: true } });
                }}
              >
                <GroupByColIcon />
                <span>
                  Group By <strong>{column.name ?? column.id}</strong>
                </span>
              </Menu.Item>
            </div>
          </Tooltip>
        )}

        <Menu.Divider className="my-1 border-t border-ln-gray-40" />

        {!inDialog && (
          <>
            <Menu.Item
              className="flex gap-2"
              onAction={() => api.columnManagerOpen.set(true)}
            >
              <Columns2Icon />
              Manage Columns
            </Menu.Item>

            <Menu.Item
              className="flex gap-2"
              onAction={() => api.sortManagerOpen.set(true)}
            >
              <SortIcon />
              Manage Sorts
            </Menu.Item>

            <Menu.Divider className="my-1 border-t border-ln-gray-40" />
          </>
        )}

        {/* Aggregate submenu */}
        <Menu.Submenu>
          <Tooltip
            container={menuContainer}
            content={
              <div className="max-w-[150px] text-wrap">
                Aggregations are only used when grouping. Apply a column
                grouping to see the result.
              </div>
            }
            disabled={!!grouped.length}
            className="z-[100]"
            side="bottom"
          >
            <Menu.SubmenuTrigger className="flex justify-between">
              <span className="flex items-center gap-2">
                <AggregateIcon /> Aggregate
                {column.agg && (
                  <span className="text-ln-primary-50">({column.agg})</span>
                )}
              </span>
              <ChevronRightIcon />
            </Menu.SubmenuTrigger>
          </Tooltip>
          <Menu.SubmenuContainer className="w-[120px]">
            <Menu.RadioGroup
              value={column.agg ?? ""}
              onChange={(fn) =>
                api.columnUpdate({ [column.id]: { agg: fn || null } })
              }
            >
              {aggsAllowed.map((fn) => (
                <Menu.RadioItem key={fn} value={fn}>
                  {(checked) => (
                    <>
                      <span className="flex-1 capitalize">{fn}</span>
                      {checked && <CheckIcon className="text-ln-primary-50" />}
                    </>
                  )}
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.SubmenuContainer>
        </Menu.Submenu>
      </Menu.Container>
    </>
  );
}
