import type { HeaderCellRendererParams } from "@1771technologies/lytenyte-pro/types";
import {
  ArrowDownIcon,
  ArrowUpIcon,
} from "@1771technologies/lytenyte-pro/icons";
import { tw } from "../lib/tw";

export function SortSwitcher({
  grid: g,
  column,
}: HeaderCellRendererParams<(string | number | null)[]>) {
  const sortModel = g.state.sortModel.useValue();
  // Rerender when the sort model changes
  const sortIndex = sortModel.findIndex((c) => c.columnId === column.id);
  const sort = sortIndex != -1 ? sortModel[sortIndex] : null;

  const isDescending = sort?.isDescending ?? false;

  const visibleIndex = sortModel.length > 1 ? sortIndex + 1 : 0;

  return (
    <button
      style={{ opacity: sort ? "1" : undefined }}
      className={tw(
        "p-1 rounded bg-ln-gray-05 hover:bg-ln-gray-20 absolute",
        "opacity-0 group-hover:opacity-70",
        "transition-opacity group-hover:focus:opacity-80 focus-visible:opacity-80",
        column.type === "number" ? "left-1.5" : "right-1.5",
        sort &&
          "group-hover:opacity-100 opacity-100 hover:opacity-100 text-ln-primary-50"
      )}
      onClick={() => {
        const current = g.api.sortForColumn(column.id);

        if (current == null) {
          g.state.sortModel.set([
            {
              columnId: column.id,
              sort: {
                kind:
                  column.type === "datetime"
                    ? "date"
                    : (column.type as "string") ?? "string",
              },
              isDescending: false,
            },
          ]);
          return;
        }
        if (!current.sort.isDescending) {
          g.state.sortModel.set([{ ...current.sort, isDescending: true }]);
        } else {
          g.state.sortModel.set([]);
        }
      }}
    >
      {!isDescending ? (
        <ArrowUpIcon className="size-4" />
      ) : (
        <ArrowDownIcon className="size-4" />
      )}
      {visibleIndex != 0 && (
        <div className="absolute top-0 right-0">{visibleIndex}</div>
      )}
    </button>
  );
}
