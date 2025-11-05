import type {
  FilterCombination,
  HeaderFloatingCellRendererParams,
} from "@1771technologies/lytenyte-pro/types";
import { useEffect, useRef, useState } from "react";
import equal from "react-fast-compare";
import {
  isIncompatibleTextFilter,
  parseTextFilter,
  unparseTextFilter,
} from "./floating/parse-text-filters";
import { Tooltip } from "./ui/tooltip";
import { GridInput } from "./ui/grid-input";
import { InFilterPopover } from "./floating/in-filter";
import {
  isIncompatibleNumberFilter,
  parseNumberFilter,
  unparseNumberFilter,
} from "./floating/parse-number-filters";
import { tw } from "./lib/tw";

const mark = "font-mono bg-gray-300 px-2";

const contentNumber = (
  <div>
    Number expression filter supports logical operations such as{" "}
    <span className={mark}>{">, <, <=, >=, !=, ="}</span>. Filters may be
    combined using <span className={mark}>{"&& or ||"}</span>. For example:{" "}
    <span className={mark}>{`> 23 && < 45`}</span>.
  </div>
);
const contentText = (
  <div>
    Text filter supports pattern matching and regex. Using{" "}
    <span className={mark}>{"||"}</span>
    characters to search for more matches. For example:{" "}
    <span className={mark}>{`NV || a.*`}</span>.
  </div>
);
const contentDisabled = (
  <div>
    This column has a manual filter applied. Click the funnel icon to see it.
  </div>
);

export function FloatingCellText({
  grid,
  column,
}: HeaderFloatingCellRendererParams<any>) {
  const filters = grid.state.filterModel.useValue();

  const filter = filters[column.id];

  const [value, setValue] = useState(() => {
    return unparseTextFilter(filter);
  });

  useEffect(() => {
    setValue(unparseTextFilter(filter));
  }, [filter]);

  const isIncompat = isIncompatibleTextFilter(filter);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (
    <div className="flex items-center h-full w-full">
      <Tooltip
        className="border border-gray-300 z-10"
        content={
          <div className="max-w-[500px]">
            {isIncompat ? contentDisabled : contentText}
          </div>
        }
        side="bottom"
      >
        <GridInput
          disabled={isIncompat}
          className="h-5 rounded-sm w-[calc(100%-32px)] mx-1 md:min-w-[unset] min-w-[unset] text-xs"
          onKeyDown={(e) => {
            if (value) {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft")
                e.stopPropagation();
            }

            if (e.key === "Tab") {
              if (e.shiftKey) grid.api.focusCell("prev");
              else grid.api.focusCell("next");

              e.stopPropagation();
              e.preventDefault();
            }
            if (e.key === "Escape") {
              grid.api.focusCell("prev");
            }
          }}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            const value = e.target.value;

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
              timeoutRef.current = null;

              const filter = parseTextFilter(value);

              grid.state.filterModel.set((prev) => {
                timeoutRef.current = null;
                const next = { ...prev };

                if (!filter) {
                  if (next[column.id]) {
                    delete next[column.id];
                    return next;
                  }
                  return prev;
                }
                return { ...prev, [column.id]: filter };
              });
            }, 300);
          }}
        />
      </Tooltip>
      <InFilterPopover grid={grid} column={column} />
    </div>
  );
}

export function FloatingCellNumber({
  grid,
  column,
}: HeaderFloatingCellRendererParams<any>) {
  const filters = grid.state.filterModel.useValue();

  const filter = filters[column.id];

  const [value, setValue] = useState(() => {
    return unparseNumberFilter(filter);
  });
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    setValue((prev) => {
      const current = parseNumberFilter(valueRef.current) ?? null;
      const next = filter ?? null;
      if (equal(current, next)) return prev;

      return unparseNumberFilter(filter);
    });
  }, [filter]);

  const isValid = !value || (value && parseNumberFilter(value) != null);

  const isIncompat = isIncompatibleNumberFilter(filter);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (
    <div className="flex items-center h-full w-full">
      <Tooltip
        className="border border-gray-300 z-10"
        content={
          <div className="max-w-[500px]">
            {isIncompat ? contentDisabled : contentNumber}
          </div>
        }
        side="bottom"
      >
        <GridInput
          disabled={isIncompat}
          className={tw(
            "h-5 rounded-sm w-[calc(100%-32px)] mx-1 md:min-w-[unset] min-w-[unset] text-xs",
            !isValid && "bg-red-500/50"
          )}
          value={isIncompat ? "-" : value}
          onKeyDown={(e) => {
            if (value) {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft")
                e.stopPropagation();
            }

            if (e.key === "Tab") {
              if (e.shiftKey) grid.api.focusCell("prev");
              else grid.api.focusCell("next");

              e.stopPropagation();
              e.preventDefault();
            }
            if (e.key === "Escape") {
              grid.api.focusCell("prev");
            }
          }}
          onChange={(e) => {
            setValue(e.target.value);
            const value = e.target.value;

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
              timeoutRef.current = null;

              const filter = parseNumberFilter(value);

              grid.state.filterModel.set((prev) => {
                timeoutRef.current = null;
                const next = { ...prev };

                if (!filter || !value.trim() || !isNumberFilterValid(filter)) {
                  if (next[column.id]) {
                    delete next[column.id];
                    return next;
                  }
                  return prev;
                }

                if (!filter) return prev;

                return { ...prev, [column.id]: filter };
              });
            }, 600);
          }}
        />
      </Tooltip>
      <InFilterPopover grid={grid} column={column} />
    </div>
  );
}

function isNumberFilterValid(filter: FilterCombination | null) {
  if (!filter) return true;

  if (filter.kind !== "combination") return true;

  const combo = filter?.filters?.some((c) => {
    if (c.kind !== "combination") return true;
    return c.filters.length > 0;
  });

  return combo;
}
