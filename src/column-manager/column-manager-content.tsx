import type { Grid } from "@1771technologies/lytenyte-pro/types";
import { GridBox } from "@1771technologies/lytenyte-pro";
import {
  AggregateIcon,
  ChevronDownIcon,
  CloseIcon,
  DragDotsSmallIcon,
  DragIcon,
  GroupByColIcon,
  SearchIcon,
} from "@1771technologies/lytenyte-pro/icons";
import { ChevronUpIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { tw } from "../lib/tw";
import { ColumnManager } from "./column-manager";
import { GridIconButton } from "../ui/icon-button";
import { AggMenu } from "./agg-menu";

export function ColumnManagerContent({
  grid,
  panel,
  omitDialogs,
}: {
  grid: Grid<(string | number | null)[]>;
  panel?: boolean;
  omitDialogs?: boolean;
}) {
  const box = GridBox.useRowGroupBoxItems({
    grid,
    orientation: "vertical",
    placeholder: (el) => el.firstElementChild! as HTMLElement,
  });
  const aggBox = GridBox.useAggregationBoxItems({
    grid,
    orientation: "vertical",
  });

  const [queryState, setState] = useState("");

  const [groupsCollapsed, setGroupsCollapsed] = useState(false);
  const [aggsCollapsed, setAggsCollapsed] = useState(false);
  return (
    <div
      className={tw(
        "flex flex-col h-full",
        panel && "border-l border-ln-gray-30"
      )}
    >
      <div className="px-4 py-3 border-b border-ln-gray-30">
        <div className="flex items-center bg-ln-gray-00 border-y border-ln-gray-10 px-2 py-1 gap-1 rounded-lg focus-visible:focus-within:ring-1 focus-within:ring-ln-primary-50">
          <SearchIcon className="text-ln-gray-70 size-4" />
          <input
            className="w-full bg-ln-gray-00 placeholder:text-xs text-xs h-7 focus:outline-none"
            placeholder="Search..."
            value={queryState}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
      </div>

      <div
        className={tw(
          "flex w-full h-[450px] flex-col md:flex-row overflow-auto",
          panel && "h-[unset] flex-1 flex md:flex-col"
        )}
      >
        <div
          className={tw(
            "min-h-[200px] md:min-h-[300px] min-w-[280px] flex-1 py-2 px-2 md:max-h-[unset] overflow-auto",
            panel &&
              "lg:max-h-[300px] min-h-[300px] border-b border-ln-gray-30 "
          )}
          style={{ scrollbarWidth: "thin" }}
        >
          <ColumnManager
            grid={grid}
            queryState={queryState}
            omitDialogs={omitDialogs}
          />
        </div>

        <div
          className={tw(
            "border-l border-ln-gray-30 pl-3 pr-3 w-full flex-col gap-2 hidden lg:flex",
            panel && " border-l-transparent h-[100%-300px] overflow-auto"
          )}
        >
          <div className="min-w-[280px]">
            <div className="flex items-center gap-2 text-ln-gray-80 h-10 text-lg w-full">
              <GroupByColIcon />
              <div className="flex-1 text-sm font-medium">Row Groups</div>{" "}
              <GridIconButton
                onClick={() => setGroupsCollapsed((prev) => !prev)}
              >
                {groupsCollapsed ? (
                  <ChevronDownIcon className="size-5" />
                ) : (
                  <ChevronUpIcon className="size-5" />
                )}
              </GridIconButton>
            </div>
            {!groupsCollapsed && (
              <div className="w-full h-[calc(100%-40px)]">
                <GridBox.Root {...box.rootProps}>
                  <GridBox.Panel
                    className={tw(
                      "p-2 border border-ln-gray-20 rounded-lg bg-ln-gray-10 w-full flex flex-col min-h-32 data-[ln-can-drop=true]:bg-ln-primary-30 h-full overflow-auto",
                      "focus-visible:ring-1 focus-visible:ring-ln-primary-50 focus:outline-none"
                    )}
                  >
                    {!box.items.length && (
                      <div className="w-full flex flex-col items-center justify-center h-32">
                        <DragIcon className="size-8" />
                        <div className="text-ln-gray-60">
                          Select a column to group
                        </div>
                      </div>
                    )}
                    {box.items.map((c) => {
                      return (
                        <GridBox.Item
                          key={c.id}
                          item={c}
                          className="w-full vertical-indicators"
                          itemClassName={tw(
                            "px-2 py-1 h-full cursor-grab flex items-center group focus:outline-none"
                          )}
                        >
                          <div className="flex items-center w-full cursor-grab text-nowrap bg-ln-pill-group-fill border border-ln-pill-group-stroke rounded h-7 pl-1 group-focus-visible:ring-1 group-focus-visible:ring-ln-primary-50 focus:outline-none">
                            <DragDotsSmallIcon className="no-drag" />
                            <div className={tw("text-xs pr-3 pl-1 flex-1")}>
                              {c.label}
                            </div>

                            <GridIconButton
                              className="h-[26px] w-[26px] hover:bg-ln-gray-transparent"
                              onClick={(e) => c.onDelete(e.currentTarget)}
                            >
                              <CloseIcon />
                            </GridIconButton>
                          </div>
                        </GridBox.Item>
                      );
                    })}
                  </GridBox.Panel>
                </GridBox.Root>
              </div>
            )}
          </div>

          <div
            className={tw(
              "min-w-[280px]",
              groupsCollapsed && "max-h-[calc(100%-40px-16px)]",
              !panel && "max-h-[50%]"
            )}
          >
            <div className="flex items-center gap-2 text-ln-gray-80 h-10 text-lg w-full">
              <AggregateIcon />
              <div className="flex-1 font-medium text-sm">
                Aggregations
              </div>{" "}
              <GridIconButton onClick={() => setAggsCollapsed((prev) => !prev)}>
                {aggsCollapsed ? (
                  <ChevronDownIcon className="size-5" />
                ) : (
                  <ChevronUpIcon className="size-5" />
                )}
              </GridIconButton>
            </div>
            {!aggsCollapsed && (
              <div className="w-full h-[calc(100%-40px)]">
                <GridBox.Root {...box.rootProps}>
                  <GridBox.Panel
                    className={tw(
                      "p-2 border border-ln-gray-20 rounded-lg bg-ln-gray-10 w-full flex flex-col h-full overflow-auto",
                      "focus-visible:ring-1 focus-visible:ring-ln-primary-50 focus:outline-none"
                    )}
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {!aggBox.items.length && (
                      <div className="w-full flex flex-col items-center justify-center h-32">
                        <DragIcon className="size-8" />
                        <div className="text-ln-gray-60">
                          Select a column to aggregate
                        </div>
                      </div>
                    )}
                    {aggBox.items.map((c) => {
                      return (
                        <GridBox.Item
                          key={c.id}
                          item={c}
                          className="w-full"
                          itemClassName={tw(
                            "px-2 py-1 h-full flex items-center group focus:outline-none"
                          )}
                        >
                          <div className="w-full flex items-center text-nowrap bg-ln-pill-column-fill border border-ln-pill-column-stroke rounded h-7 pl-1 group-focus-visible:ring-1 group-focus-visible:ring-ln-primary-50 focus:outline-none">
                            <div className="text-xs pr-3 pl-1 flex-1">
                              {c.label}
                            </div>

                            <AggMenu
                              grid={grid}
                              column={grid.api.columnById(c.id)!}
                            />
                          </div>
                        </GridBox.Item>
                      );
                    })}
                  </GridBox.Panel>
                </GridBox.Root>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
