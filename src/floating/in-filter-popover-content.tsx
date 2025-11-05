import { FilterTree as T } from "@1771technologies/lytenyte-pro";
import type {
  FilterModelItem,
  HeaderFloatingCellRendererParams,
} from "@1771technologies/lytenyte-pro/types";
import { Popover as P } from "radix-ui";
import { SimpleFilterStringOrCombo } from "./components/simple-filter-string";
import { useTwoFlowState } from "./components/use-two-flow-state";
import { useMemo, useState } from "react";
import { SearchIcon } from "@1771technologies/lytenyte-pro/icons";
import { GridInput } from "../ui/grid-input";
import { tw } from "../lib/tw";
import { GridCheckbox } from "../ui/grid-checkbox";

type TreeItem = ReturnType<typeof T.useFilterTree>["tree"][number];

export function InFilterPopoverContent({
  column,
  grid,
}: HeaderFloatingCellRendererParams<any>) {
  const [query, setQuery] = useState("");
  const inFilter = T.useFilterTree({
    grid,
    column,
    treeItemHeight: 30,
    query: query,
  });

  const filterModel = grid.state.filterModel.useValue();

  const initialFilter = useMemo(() => {
    const filter = filterModel[column.id];

    if (!filter) return null;

    if (filter.kind === "combination") return filter;

    return {
      kind: "combination",
      filters: [filter],
      operator: "AND",
    };
  }, [filterModel, column]);

  const [tempFilter, setTempFilter] = useTwoFlowState<Partial<
    Partial<FilterModelItem<any>>
  > | null>((initialFilter as any) ?? null);

  const incompatibleQuickFilter =
    tempFilter?.kind === "combination" &&
    // @ts-expect-error its fine
    (tempFilter.filters?.length > 2 ||
      tempFilter.filters?.[0]?.kind === "combination" ||
      tempFilter.filters?.[0]?.operator === "matches" ||
      tempFilter.filters?.[1]?.operator === "matches");

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 py-4 px-2 gap-3 min-w-[300px]">
        <div className="text-sm text-ln-gray-60 hidden md:block">Operator</div>
        <div className="text-sm text-ln-gray-60 hidden md:block">Values</div>

        <SimpleFilterStringOrCombo
          column={column}
          hasIncompatibleQuickFilter={incompatibleQuickFilter}
          filter={tempFilter}
          setFilter={setTempFilter}
        />
      </div>
      <div className="px-2 ">
        <div className="bg-ln-gray-02 border-ln-gray-20 border z-50 rounded-lg w-full">
          <div className="relative">
            <GridInput
              className="rounded-b-none bg-ln-gray-02 shadow-none border-b border-b-ln-gray-20 w-full px-7 outline-none focus-visible::outline-none focus-visible:shadow-none text-xs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
            />
            <SearchIcon className="absolute top-1.5 left-1.5 text-ln-gray-70 size-4" />
          </div>
          <T.Root {...inFilter.rootProps}>
            <T.Panel
              className=""
              style={{
                height: 250,
                overflowY: "auto",
                overflowX: "hidden",
                position: "relative",
              }}
            >
              {inFilter.tree.map((c) => {
                return (
                  <RenderNode
                    item={c}
                    key={c.kind === "branch" ? c.branch.id : c.leaf.data.id}
                  />
                );
              })}
            </T.Panel>

            <div className="flex justify-end gap-2 py-2">
              <P.Close
                onClick={() => {
                  inFilter.reset();

                  grid.state.filterInModel.set((prev) => {
                    const next = { ...prev };
                    delete next[column.id];

                    return next;
                  });

                  grid.state.filterModel.set((prev) => {
                    const next = { ...prev };
                    delete next[column.id];

                    return next;
                  });
                }}
                className={tw(
                  "text-sm border border-ln-gray-30 px-3 rounded py-0.5 hover:bg-ln-gray-10 bg-ln-gray-00 text-ln-gray-70"
                )}
              >
                Clear
              </P.Close>
              <P.Close
                onClick={() => {
                  inFilter.apply();

                  if (!incompatibleQuickFilter) {
                    if (tempFilter) {
                      let validFilter;
                      if (
                        tempFilter.kind === "number" ||
                        tempFilter.kind === "string"
                      ) {
                        if (tempFilter.operator && tempFilter.value != null)
                          validFilter = tempFilter;
                      } else if (tempFilter.kind === "combination") {
                        const first = tempFilter.filters?.[0];
                        const second = tempFilter.filters?.[1];
                        const filters = [];
                        if (
                          (first?.kind === "string" ||
                            first?.kind === "number") &&
                          first.operator &&
                          first.value != null
                        )
                          filters.push(first);
                        if (
                          (second?.kind === "string" ||
                            second?.kind === "number") &&
                          second.operator &&
                          second.value != null
                        )
                          filters.push(second);

                        if (filters.length === 1) {
                          validFilter = filters[0];
                        } else if (filters.length === 2) {
                          validFilter = { ...tempFilter, filters };
                        }
                      }

                      if (validFilter) {
                        grid.state.filterModel.set((prev) => {
                          return {
                            ...prev,
                            [column.id]: validFilter,
                          };
                        });
                      }
                    }
                  }
                }}
                style={{ transform: "scale(0.92)" }}
                className={tw(
                  "text-sm  border border-ln-primary-30 px-3 rounded py-0.5 hover:bg-ln-primary-70 bg-ln-primary-50 text-ln-gray-02 font-semibold"
                )}
              >
                Apply
              </P.Close>
            </div>
          </T.Root>
        </div>
      </div>
      <P.Arrow fill="var(--lng1771-gray-30)" />
    </>
  );
}
function RenderNode({ item }: { item: TreeItem }) {
  if (item.kind === "leaf") {
    return (
      <T.Leaf
        item={item}
        className="hover:bg-ln-gray-20 cursor-pointer text-ln-gray-80 text-xs flex items-center gap-2 px-2 focus-visible:bg-ln-primary-30 rounded-lg"
      >
        <T.Checkbox
          as={
            (({ checked, toggle }: any) => {
              return <GridCheckbox checked={checked} onToggle={() => toggle} />;
            }) as any
          }
        />
        <T.Label />
      </T.Leaf>
    );
  }

  const values = [...item.children.values()];

  return (
    <T.Branch
      item={item}
      label={
        <div style={{ display: "flex", gap: "2px" }}>
          <T.Checkbox />
          <T.Label />
        </div>
      }
    >
      {values.map((c) => {
        return (
          <RenderNode
            item={c}
            key={c.kind === "branch" ? c.branch.id : c.leaf.data.id}
          />
        );
      })}
    </T.Branch>
  );
}
