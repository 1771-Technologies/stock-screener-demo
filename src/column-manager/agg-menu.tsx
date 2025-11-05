import type { HeaderCellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { DropdownMenu as D } from "radix-ui";
import { GridDropMenuContent } from "../ui/dialog";
import { RadioItem } from "../ui/menu/menu-item";
import { tw } from "../lib/tw";

export function AggMenu({
  column,
  grid,
  className,
}: HeaderCellRendererParams<(string | null | number)[]> & {
  className?: string;
}) {
  const base = grid.state.columnBase.useValue();

  const aggs = grid.state.aggModel.useValue();
  const agg = aggs[column.id];
  const aggName = typeof agg?.fn === "string" ? agg?.fn : "Fn(x)";

  const options =
    column.uiHints?.aggsAllowed ?? base.uiHints?.aggsAllowed ?? [];

  return (
    <D.Root>
      <D.Trigger className={tw(className)} asChild>
        <button className="text-ln-primary-50 text-xs px-1 hover:bg-ln-primary-30 rounded py-1 focus-visible:ring-1 focus-visible:ring-ln-primary-50 focus:outline-none">
          ({aggName as string})
        </button>
      </D.Trigger>
      <D.Portal>
        <GridDropMenuContent>
          <D.Arrow fill="var(--lng1771-gray-30)" />
          <D.DropdownMenuRadioGroup
            value={aggName}
            onValueChange={(c) => {
              grid.state.aggModel.set((prev) => {
                return { ...prev, [column.id]: { fn: c } };
              });
            }}
          >
            {options.map((c) => {
              return <RadioItem key={c} value={c} label={c} className="pl-1" />;
            })}
          </D.DropdownMenuRadioGroup>
        </GridDropMenuContent>
      </D.Portal>
    </D.Root>
  );
}
