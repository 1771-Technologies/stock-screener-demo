"use client";
import { Grid } from "lytenyte-pro";
import { ColumnManager } from "lytenyte-pro/components";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Resizable } from "re-resizable";
import { GridSpec } from "../types";
import { PillManagerVertical } from "../pill-manager-controls/pill-manager-vertical";
import { ColumnMenu } from "../column-menu/column-menu";

interface Props {
  api: Grid.API<GridSpec>;
  columns: Grid.Column<GridSpec>[];
  setColumns: Dispatch<SetStateAction<Grid.Column<GridSpec>[]>>;
  grouped: string[];
  setGrouped: Dispatch<SetStateAction<string[]>>;
}

export function Panel({
  api,
  columns,
  setColumns,
  grouped,
  setGrouped,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredColumns = useMemo(() => {
    if (!searchQuery.trim()) return columns;
    const q = searchQuery.toLowerCase();
    return columns.filter((c) => (c.name ?? c.id).toLowerCase().includes(q));
  }, [columns, searchQuery]);

  const handleColumnsChange = (newFiltered: Grid.Column<GridSpec>[]) => {
    if (!searchQuery.trim()) {
      setColumns(newFiltered);
      return;
    }
    // Merge filtered changes back into the full column set, preserving
    // non-filtered columns in place and applying the new order/state
    // of the filtered subset into the slots they occupied.
    setColumns((prev) => {
      let i = 0;
      return prev.map((col) =>
        filteredColumns.some((fc) => fc.id === col.id) ? newFiltered[i++] : col,
      );
    });
  };

  const getTags = useCallback((column: Grid.Column<GridSpec>) => {
    return (column.groupable ? { groups: column.id } : {}) as Record<
      string,
      string
    >;
  }, []);

  return (
    <div className="hidden md:flex border-t border-ln-gray-30">
      {expanded && (
        <Resizable
          className="h-full"
          minWidth={300}
          maxWidth={500}
          handleStyles={{ left: { left: 0 } }}
          enable={{
            bottom: false,
            bottomLeft: false,
            bottomRight: false,
            right: false,
            top: false,
            topLeft: false,
            topRight: false,
            left: true,
          }}
        >
          <div className="flex flex-col h-full border-l border-ln-gray-30">
            <div className="h-1/2 flex flex-col border-b border-ln-gray-20">
              <div className="relative px-2 py-3.5 border-b border-ln-gray-20 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ln-gray-60 pointer-events-none"
                >
                  <path d="M229.66,218.34l-50.07-50.07a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.31ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
                <input
                  className="w-full bg-ln-gray-02 border-ln-gray-20 border rounded-md text-xs pl-7 pr-2 text-ln-gray-80 placeholder:text-ln-gray-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-ln-primary-50 h-[32px]"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Column list */}
              <div
                className="flex-1 overflow-auto"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "var(--ln-gray-50) transparent",
                }}
              >
                <ColumnManager
                  columns={filteredColumns}
                  onColumnsChange={handleColumnsChange}
                  getPillManagerTag={getTags}
                  rowHeight={32}
                  endElement={(params) => {
                    return (
                      <ColumnMenu
                        api={api}
                        column={params.columns[0]}
                        isNumber={params.columns[0].type === "number"}
                        className="opacity-100 relative top-0 left-1 bg-transparent hover:bg-ln-gray-30"
                      />
                    );
                  }}
                />
              </div>
            </div>

            {/* Placeholder — bottom half */}
            <div
              className="contain-strict flex-1 overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "var(--ln-gray-50) transparent",
              }}
            >
              <PillManagerVertical
                api={api}
                columns={columns}
                setColumns={setColumns}
                setGrouped={setGrouped}
                grouped={grouped}
              />
            </div>
          </div>
        </Resizable>
      )}

      <div className="border-l border-ln-gray-30">
        <button
          className="py-2 text-ln-gray-80 border-b border-b-ln-gray-30 bg-ln-gray-10 text-sm px-1 hover:bg-ln-gray-30 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ln-primary-50 min-w-[28px]"
          style={{
            textOrientation: "sideways",
            writingMode: "vertical-lr",
          }}
          onClick={() => setExpanded((prev) => !prev)}
        >
          Columns
        </button>
      </div>
    </div>
  );
}
