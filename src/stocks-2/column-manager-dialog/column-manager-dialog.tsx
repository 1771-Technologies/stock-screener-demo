"use client";
import { Grid } from "lytenyte-pro";
import { ColumnManager, Dialog } from "lytenyte-pro/components";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { GridSpec } from "../types";
import { PillManagerVertical } from "../pill-manager-controls/pill-manager-vertical";
import { Button } from "@/components/button/button";
import { tw } from "@/utils/tw";
import { Columns2Icon } from "@1771technologies/lytenyte-core/icons";
import { ColumnMenu } from "../column-menu/column-menu";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: Grid.Column<GridSpec>[];
  setColumns: Dispatch<SetStateAction<Grid.Column<GridSpec>[]>>;
  grouped: string[];
  setGrouped: Dispatch<SetStateAction<string[]>>;
  api: Grid.API<GridSpec>;
  theme: string;
}

export function ColumnManagerDialog({
  open,
  onOpenChange,
  columns,
  setColumns,
  grouped,
  setGrouped,
  api,
  theme,
}: Props) {
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
    setColumns((prev) => {
      let i = 0;
      return prev.map((col) =>
        filteredColumns.some((fc) => fc.id === col.id) ? newFiltered[i++] : col,
      );
    });
  };

  const getTags = useCallback(
    (column: Grid.Column<GridSpec>) =>
      (column.groupable ? { groups: column.id } : {}) as Record<string, string>,
    [],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal lightDismiss>
      <Dialog.Trigger
        render={
          <Button
            kind="tertiary"
            className={tw(
              "flex px-2 text-sm h-[32px] text-light",
              theme.includes("light") && "text-black",
            )}
            style={
              theme.includes("light")
                ? { border: "1px solid black" }
                : undefined
            }
          />
        }
      >
        <Columns2Icon />
      </Dialog.Trigger>

      <Dialog.Container className="w-full max-w-[80vw] md:max-w-[700px] h-[520px] px-0 flex flex-col top-1/3">
        <Dialog.Description className="sr-only">
          Manage column visibility, order, grouping and aggregations
        </Dialog.Description>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-ln-gray-30 px-4 pb-3 shrink-0">
          <Dialog.Title className="text-base font-semibold">
            Columns
          </Dialog.Title>
          <Dialog.Close data-ln-button="secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
            </svg>
          </Dialog.Close>
        </div>

        {/* Search */}
        <div className="relative px-3 py-3.5 border-b border-ln-gray-30 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="absolute left-5 top-1/2 -translate-y-1/2 text-ln-gray-60 pointer-events-none"
          >
            <path d="M229.66,218.34l-50.07-50.07a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.31ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
          </svg>
          <input
            className="w-full bg-ln-gray-02 border border-ln-gray-20 rounded-md text-xs py-2 pl-7 pr-2 text-ln-gray-80 placeholder:text-ln-gray-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-ln-primary-50 h-[32px]"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Left: ColumnManager */}
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
                    inDialog
                    column={params.columns[0]}
                    isNumber={params.columns[0].type === "number"}
                    className="opacity-100 relative top-0 left-1 bg-transparent hover:bg-ln-gray-30"
                  />
                );
              }}
            />
          </div>

          {/* Right: PillManagerVertical — desktop only */}
          <div
            className="hidden md:flex flex-col w-[280px] border-l border-ln-gray-30 overflow-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--ln-gray-50) transparent",
            }}
          >
            <PillManagerVertical
              api={api}
              columns={columns}
              setColumns={setColumns}
              grouped={grouped}
              setGrouped={setGrouped}
            />
          </div>
        </div>
      </Dialog.Container>
    </Dialog>
  );
}
