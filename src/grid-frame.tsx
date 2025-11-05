import type { PropsWithChildren } from "react";
import { ThemePicker } from "./theme-picker";
import type { Grid } from "@1771technologies/lytenyte-pro/types";
import {
  ColumnsIcon,
  RefreshIcon,
  SortIcon,
} from "@1771technologies/lytenyte-pro/icons";
import { tw } from "./lib/tw";
import { GridIconButton } from "./ui/icon-button";
import { QuickSearchInput } from "./quck-search-input";
import { Panel } from "./panel";
import { ExportMenu } from "./export-menu";
import { ColumnPills } from "./pill-manger/column-pills";
import { GroupPills } from "./pill-manger/group-pills";

export function GridFrame({
  grid,
  children,
  onReset,
}: PropsWithChildren<{
  grid: Grid<(string | number | null)[]>;
  onReset: () => void;
}>) {
  return (
    <div className="w-[95%] max-w-8xl h-[80%] max-h-[1200px] border border-ln-gray-30 rounded-lg lng-grid">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 py-4 px-4">
          <h2 className="flex-1 text-ln-gray-80 font-medium">Stock Screener</h2>
          <div className="flex-1" />
          <GridIconButton
            className={tw(
              "sm:flex text-sm h-8 text-light w-8 border border-ln-gray-30 rounded-lg cursor-pointer"
            )}
            onClick={() => grid.api.dialogFrameOpen("column-manager")}
          >
            <ColumnsIcon />
          </GridIconButton>
          <GridIconButton
            className={tw(
              "sm:flex text-sm h-8 text-light w-8 border border-ln-gray-30 rounded-lg cursor-pointer"
            )}
            onClick={() => grid.api.dialogFrameOpen("sort-manager")}
          >
            <SortIcon />
          </GridIconButton>

          <button
            className="flex items-center gap-2 border border-ln-gray-30 h-8 px-2 rounded-lg text-sm cursor-pointer hover:bg-ln-gray-20 transition-colors"
            onClick={() => {
              onReset();
            }}
          >
            Reset Demo
            <RefreshIcon />
          </button>

          <QuickSearchInput grid={grid} />

          <ExportMenu grid={grid} />
        </div>
        <ColumnPills grid={grid} />
        <GroupPills grid={grid} />
        <div
          id="stocks-grid"
          className="flex flex-1 border-t border-ln-gray-20"
        >
          <div className="flex-1 relative">
            <div className="absolute w-full h-full border-t border-t-ln-gray-10">
              {children}
            </div>
          </div>
          <Panel grid={grid} />
        </div>
        <div className="border-t border-ln-gray-30">
          <ThemePicker />
        </div>
      </div>
    </div>
  );
}
