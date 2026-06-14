import { Grid } from "lytenyte-pro";
import type { GridSpec } from "../types";
import { Checkbox } from "lytenyte-pro/components";

export function MarkerCell({
  api,
  selected,
  indeterminate,
}: Grid.T.CellRendererParams<GridSpec>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Checkbox
        checked={selected}
        indeterminate={indeterminate}
        onClick={(ev) => {
          ev.stopPropagation();
          api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target });
        }}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ")
            api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target });
        }}
      />
    </div>
  );
}
