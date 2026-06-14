import { Grid } from "lytenyte-pro";
import type { GridSpec } from "../types";
import { Checkbox, SelectAll } from "lytenyte-pro/components";

export function MarkerHeader(params: Grid.T.HeaderParams<GridSpec>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SelectAll
        {...params}
        slot={({ indeterminate, selected, toggle }) => {
          return (
            <Checkbox
              checked={selected}
              indeterminate={indeterminate}
              onClick={(ev) => {
                ev.preventDefault();
                toggle();
              }}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") toggle();
              }}
            />
          );
        }}
      />
    </div>
  );
}
