import { GridBox } from "@1771technologies/lytenyte-pro";
import {
  AddSmallIcon,
  DragDotsSmallIcon,
} from "@1771technologies/lytenyte-pro/icons";
import type { Grid } from "@1771technologies/lytenyte-pro/types";
import { Popover as P } from "radix-ui";
import { PillManagerRow } from "./pill-manager-row";
import { tw } from "../lib/tw";
import { GridCheckbox } from "../ui/grid-checkbox";

export function GroupPills({
  grid,
}: {
  grid: Grid<(string | number | null)[]>;
}) {
  const { rootProps, items } = GridBox.useRowGroupBoxItems({
    grid,
    orientation: "horizontal",
    hideColumnOnGroup: true,
    includeGroupables: true,
    placeholder: (el) => el.firstElementChild! as HTMLElement,
  });

  return (
    <GridBox.Root {...rootProps}>
      <PillManagerRow
        icon={<RowGroupIcon />}
        label="Row Groups"
        menu={<ColumnPicker grid={grid} />}
        className="data-[ln-can-drop=true]:bg-ln-primary-10 "
      >
        {items.map((c) => {
          const isActive = c.active ?? true;
          return (
            <GridBox.Item
              key={c.id}
              item={c}
              className="h-[52px] flex items-center horizontal-indicators"
              onKeyDown={(ev) => {
                if (ev.key === " ")
                  if (isActive) {
                    c.onDelete(ev.currentTarget);
                  } else {
                    grid.state.rowGroupModel.set((prev) => [...prev, c.id]);
                  }
              }}
              onClick={(e) => {
                if (isActive) {
                  c.onDelete(e.currentTarget);
                } else {
                  grid.state.rowGroupModel.set((prev) => [...prev, c.id]);
                  grid.api.columnUpdate({ [c.id]: { hide: true } });
                }
              }}
              itemClassName={tw(
                "h-full flex items-center px-[6px] focus:outline-none group text-ln-gray-90 ",
                "opacity-60 hover:opacity-80 transition-opacity cursor-pointer",
                isActive && "opacity-100 hover:opacity-100"
              )}
            >
              <div className="flex items-center text-nowrap bg-ln-pill-group-fill border border-ln-pill-group-stroke rounded h-[28px] pl-1 group-focus-visible:ring-1 group-focus-visible:ring-ln-primary-50 cursor-pointer">
                {isActive && <DragDotsSmallIcon className="no-drag" />}
                <div className={tw("text-xs pr-3 pl-1", !isActive && "pr-2")}>
                  {c.label}
                </div>
              </div>
            </GridBox.Item>
          );
        })}
      </PillManagerRow>
    </GridBox.Root>
  );
}

export function ColumnPicker({
  grid,
}: {
  grid: Grid<(string | number | null)[]>;
}) {
  const { rootProps, items } = GridBox.useColumnBoxItems({
    grid,
    onAction: ({ column: c }) => {
      const isGrouped = !!model.find((x) => x === c.id);

      if (!isGrouped) {
        grid.state.rowGroupModel.set((prev) => {
          return [...prev, c.id];
        });
      } else {
        grid.state.rowGroupModel.set((prev) => {
          return prev.filter((x) => x !== c.id);
        });
      }
    },
    itemFilter: (c) => {
      return !!c.uiHints?.rowGroupable;
    },
    orientation: "vertical",
  });

  const model = grid.state.rowGroupModel.useValue();

  return (
    <P.Root>
      <P.Trigger className="" asChild onKeyDown={(e) => e.stopPropagation()}>
        <button className="px-1 md:pr-2 flex items-center text-sm bg-ln-gray-20 py-1 rounded-lg border-ln-gray-50 border hover:bg-ln-gray-30 cursor-pointer transition-colors">
          <AddSmallIcon width={20} height={20} />
          <span className="hidden md:inline-block">Add</span>
        </button>
      </P.Trigger>
      <P.Portal>
        <P.Content className="bg-ln-gray-05 border-ln-gray-30 border z-50 rounded-lg p-1">
          <GridBox.Root {...rootProps}>
            <GridBox.Panel>
              {items.map((c) => {
                return (
                  <GridBox.Item key={c.id} item={c} itemClassName="group">
                    <div className="flex items-center px-2 text-sm text-ln-gray-70 gap-2 py-1 hover:bg-ln-gray-30 rounded-lg cursor-pointer group-focus-visible:bg-ln-primary-30">
                      <GridCheckbox checked={!!model.find((x) => x === c.id)} />
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

export function RowGroupIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 3.75H17.203"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 9.56055H9.07178"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 15.4688H9"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.8281L14.8284 12.8281L14.8284 9.9997"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.8286 15.6572L14.8286 12.8288L17.657 12.8288"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
