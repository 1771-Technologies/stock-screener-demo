"use client";
import { SearchIcon } from "@1771technologies/lytenyte-pro/icons";
import type { Grid } from "@1771technologies/lytenyte-pro/types";
import { tw } from "./lib/tw";
import { Input } from "./ui/input";

export function QuickSearchInput({
  grid,
}: {
  grid: Grid<(string | number | null)[]>;
}) {
  const quickFilter = grid.state.quickSearch.useValue() ?? "";
  return (
    <Input
      small
      placeholder="quick search..."
      startElement={<SearchIcon />}
      className={tw("placeholder:text-ultraLight px-2")}
      containerClassName="hidden sm:flex"
      value={quickFilter}
      onChange={(ev) => {
        const v = ev.target.value;
        if (!v) grid.state.quickSearch.set(null);
        else grid.state.quickSearch.set(v);
      }}
    />
  );
}
