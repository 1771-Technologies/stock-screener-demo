import { GridBox } from "@1771technologies/lytenyte-pro";
import {
  AddSmallIcon,
  ColumnsIcon,
  DragDotsSmallIcon,
} from "@1771technologies/lytenyte-pro/icons";
import type { Grid } from "@1771technologies/lytenyte-pro/types";
import { Popover as P } from "radix-ui";
import { PillManagerRow } from "./pill-manager-row";
import { tw } from "../lib/tw";
import { ColumnMenu } from "../column-menu";
import { GridCheckbox } from "../ui/grid-checkbox";

export function ColumnPills({
  grid,
}: {
  grid: Grid<(string | number | null)[]>;
}) {
  const { rootProps, items } = GridBox.useColumnBoxItems({
    grid,
    draggable: true,
    orientation: "horizontal",

    placeholder: (el) => el.firstElementChild! as HTMLElement,
    onDrop: (p) => {
      if (p.src.id === p.target.id) return;

      grid.api.columnMove({
        moveColumns: [p.src],
        moveTarget: p.target,
        before: p.isBefore,
      });
    },
  });

  return (
    <GridBox.Root {...rootProps}>
      <PillManagerRow
        icon={<ColumnsIcon />}
        label="Columns"
        menu={<ColumnPicker grid={grid} />}
      >
        {items.map((c) => {
          return (
            <GridBox.Item
              key={c.id}
              item={c}
              className={tw(
                "h-[52px] flex items-center",
                "horizontal-indicators"
              )}
              onKeyDown={(e) => {
                if (
                  e.key === " " &&
                  ((e.target as HTMLElement).parentElement as HTMLElement) ===
                    e.currentTarget
                ) {
                  grid.api.columnUpdate({
                    [c.data.id]: { hide: !c.data.hide },
                  });
                }
              }}
              itemClassName={tw(
                "h-full flex items-center px-[6px] focus:outline-none group text-ln-gray-90 ",
                "opacity-60 hover:opacity-80 transition-opacity",
                !c.data.hide && "opacity-100 hover:opacity-100"
              )}
            >
              <div
                onClick={(e) => {
                  if (e.currentTarget.contains(e.target as HTMLElement))
                    grid.api.columnUpdate({
                      [c.data.id]: { hide: !c.data.hide },
                    });
                }}
                className="flex items-center text-nowrap bg-ln-pill-column-fill border border-ln-pill-column-stroke rounded h-7 pl-1 group-focus-visible:ring-1 group-focus-visible:ring-ln-primary-50 cursor-pointer"
              >
                <DragDotsSmallIcon className="cursor-grab no-drag" />
                <div className="text-xs pr-3 pl-1">{c.label}</div>
                <ColumnMenu
                  column={c.data}
                  grid={grid}
                  className="static opacity-100 hover:opacity-100 top-[unset] left-[unset] bg-transparent h-[26px] w-[26px] group-hover:opacity-100"
                />
              </div>
            </GridBox.Item>
          );
        })}
      </PillManagerRow>
    </GridBox.Root>
  );
}

function ColumnPicker({ grid }: { grid: Grid<(string | number | null)[]> }) {
  const { rootProps, items } = GridBox.useColumnBoxItems({
    grid,
    onAction: ({ column: c }) => {
      const next = !c.hide;

      grid.api.columnUpdate({ [c.id]: { hide: next } });
    },
    orientation: "vertical",
  });

  return (
    <P.Root>
      <P.Trigger className="" asChild onKeyDown={(e) => e.stopPropagation()}>
        <button className="px-1 md:pr-2 flex items-center text-sm bg-ln-gray-20 py-1 rounded-lg border-ln-gray-50 border hover:bg-ln-gray-30 cursor-pointer transition-colors">
          <AddSmallIcon width={20} height={20} />
          <span className="hidden md:inline-block">Add</span>
        </button>
      </P.Trigger>
      <P.Portal>
        <P.Content
          className="bg-ln-gray-05 border-ln-gray-30 border z-50 rounded-lg p-1"
          sideOffset={10}
        >
          <GridBox.Root {...rootProps}>
            <GridBox.Panel>
              {items.map((c) => {
                return (
                  <GridBox.Item key={c.id} item={c} itemClassName="group">
                    <div className="flex items-center px-2 text-sm text-ln-gray-70 gap-2 py-1 hover:bg-ln-gray-30 rounded-lg cursor-pointer group-focus-visible:bg-ln-primary-30">
                      <GridCheckbox checked={!c.data.hide} />
                      <div className="text-ln-gray-80 text-sm">{c.label}</div>
                    </div>
                  </GridBox.Item>
                );
              })}
            </GridBox.Panel>
          </GridBox.Root>
          <P.Arrow fill="var(--lng1771-gray-30)" />
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
