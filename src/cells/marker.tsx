import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import { GridCheckbox } from "../ui/grid-checkbox";

export function Marker({
  grid,
  rowSelected,
}: CellRendererParams<(string | number | null)[]>) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <GridCheckbox
        checked={rowSelected}
        onClick={(ev) => {
          grid.api.rowHandleSelect({
            target: ev.currentTarget as HTMLElement,
            shiftKey: ev.shiftKey,
          });
        }}
      />
    </div>
  );
}
