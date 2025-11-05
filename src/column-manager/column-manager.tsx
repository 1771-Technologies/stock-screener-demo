import { ColumnManager as CM } from "@1771technologies/lytenyte-pro";
import { DragDotsIcon } from "@1771technologies/lytenyte-pro/icons";
import type { Grid } from "@1771technologies/lytenyte-pro/types";
import { GridCheckbox } from "../ui/grid-checkbox";
import { ColumnMenu } from "../column-menu";

type Item = ReturnType<
  typeof CM.useColumnManager<(string | number | null)[]>
>["items"][number];

export function ColumnManager({
  grid,
  queryState,
  omitDialogs,
}: {
  grid: Grid<(string | number | null)[]>;
  queryState: string;
  omitDialogs?: boolean;
}) {
  const { items, lookup } = CM.useColumnManager({
    grid,
    query: queryState,
  });

  return (
    <div className="w-full h-full bg-ln-gray-05 column-manager">
      <CM.Root grid={grid} lookup={lookup}>
        <CM.Panel className="focus-visible:ring-1 focus-visible:ring-ln-primary-50">
          {items.map((c) => {
            return (
              <RenderNode
                item={c}
                grid={grid}
                key={c.kind === "branch" ? c.id : c.data.id}
                omitDialogs={omitDialogs}
              />
            );
          })}
        </CM.Panel>
      </CM.Root>
    </div>
  );
}
function RenderNode({
  item,
  grid,
  omitDialogs,
}: {
  item: Item;
  grid: Grid<(string | number | null)[]>;
  omitDialogs?: boolean;
}) {
  if (item.kind === "leaf") {
    return (
      <CM.Leaf
        item={item}
        className="flex items-center gap-1 hover:bg-ln-gray-30 focus:bg-ln-primary-30 py-[3px] rounded-lg vertical-indicators focus:outline-none"
      >
        <CM.MoveHandle className="no-drag flex items-center justify-center hover:bg-ln-gray-30 focus-visible:ring-1 rounded-lg focus-visible:ring-ln-primary-50 size-6">
          <DragDotsIcon />
        </CM.MoveHandle>
        <CM.VisibilityCheckbox
          as={({ visible, toggle }) => {
            return <GridCheckbox checked={visible} onClick={() => toggle()} />;
          }}
        />
        <CM.Label className="flex items-center flex-1 text-sm text-ln-gray-90 pl-1" />
        <ColumnMenu
          column={item.data}
          grid={grid}
          className="static opacity-100 hover:opacity-100 top-[unset] left-[unset] bg-transparent"
          omitDialogs={omitDialogs}
        />
      </CM.Leaf>
    );
  }

  const values = [...item.children.values()];

  return (
    <CM.Branch
      item={item}
      label={
        <div style={{ display: "flex", gap: "2px" }}>
          <CM.VisibilityCheckbox />
          <CM.Label />
        </div>
      }
    >
      {values.map((c) => {
        return (
          <RenderNode
            item={c}
            grid={grid}
            key={c.kind === "branch" ? c.id : c.data.id}
          />
        );
      })}
    </CM.Branch>
  );
}
